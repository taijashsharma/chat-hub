import { useEffect, useRef, useState } from "react";
import { ChatHeader } from "./ChatHeader";
import { MessageBubble } from "./MessageBubble";
import { MessageInput } from "./MessageInput";
import { AISuggestions } from "./AISuggestions";
import { Divider } from "@/components/ui/Divider";
import { ScheduleModal } from "@/components/schedule/ScheduleModal";
import {
    getMessages,
    sendMessage,
    markSeen,
    markDelivered,
} from "@/api/messageApi";
import { createNotification } from "@/api/notificationApi";
import { getFiles } from "@/api/fileApi";
import { FilePreview } from "../file/FilePreview";
import { getAISuggestions } from "@/api/aiApi";
import { subscribeChat } from "@/components/service/socketService";
import { getScheduledMessages } from "@/api/messageApi";
import { UserProfilePanel } from "./UserProfilePanel";

export function ChatContainer({ chat, updateLastMessage }) {
    const [tone, setTone] = useState("Professional");
    const [aiSuggestions, setAiSuggestions] = useState(null);
    const [chatItems, setChatItems] = useState([]);
    const [draft, setDraft] = useState("");
    const [scheduleOpen, setScheduleOpen] = useState(false);
    const [lastMessage, setLastMessage] = useState("");
    const [allItems, setAllItems] = useState([]);

    const deliveredRef = useRef(null);
    const scrollRef = useRef(null);
    const lastNotificationTime = useRef(0);
    const lastSeenRef = useRef(null);
    const [profileOpen, setProfileOpen] = useState(false);
    const currentUser = JSON.parse(localStorage.getItem("user") || "{}");
    //============ai====================
    useEffect(() => {
        if (!chat?.chatId) return;
        const delay = setTimeout(async () => {
            try {
                if (draft && draft.trim()) {
                    // typing mode
                } else if (lastMessage && lastMessage.trim().length > 0) {
                    // reply mode
                } else {
                    setAiSuggestions(null);
                    return;
                }
                if (draft && draft.length < 3) return;

                const res = await getAISuggestions({
                    message: draft ? "" : lastMessage || "",
                    draft: draft || "",
                    tone,
                });
                if (JSON.stringify(res) !== JSON.stringify(aiSuggestions)) {
                    setAiSuggestions(res);
                }
            } catch (e) {
                console.log("AI error", e);
            }
        }, 600); // 🔥 600ms debounce (better)
        return () => clearTimeout(delay);
    }, [draft, tone, lastMessage, chatItems]);

    const refreshChat = async () => {
        if (!chat?.chatId) return;

        try {
            const [msgRes, fileRes, schedRes] = await Promise.all([
                getMessages(chat.chatId),
                getFiles(chat.chatId),
                getScheduledMessages(chat.chatId),
            ]);

            const messages = msgRes.data || [];

            const files = (fileRes.data || []).map((f) => ({
                id: "file-" + f.id,
                chatId: f.chatId,
                senderId: f.senderId,
                type: "FILE",
                fileName: f.fileName,
                fileType: f.fileType,
                fileUrl: f.fileUrl,
                timestamp: f.createdAt,
            }));

            const scheduled = schedRes.data || [];

            const getTime = (m) =>
                m.scheduled ? new Date(m.scheduledTime) : new Date(m.timestamp);

            const merged = [...messages, ...files, ...scheduled].sort(
                (a, b) => getTime(a) - getTime(b)
            );

            setChatItems(merged);
        } catch (err) {
            console.log(err);
        }
    };

    // ================= LOAD =================
    useEffect(() => {
        if (!chat?.chatId) return;

        const loadData = async () => {
            try {
                const [msgRes, fileRes, schedRes] = await Promise.all([
                    getMessages(chat.chatId),
                    getFiles(chat.chatId),
                    getScheduledMessages(chat.chatId),
                ]);

                const messages = msgRes.data || [];

                const lastIncoming = [...messages]
                    .reverse()
                    .find((m) => m.senderId !== currentUser.userId);

                if (lastIncoming) {
                    setLastMessage(lastIncoming.content);
                }

                const files = (fileRes.data || []).map((f) => ({
                    id: "file-" + f.id,
                    chatId: f.chatId,
                    senderId: f.senderId,
                    type: "FILE",
                    fileName: f.fileName,
                    fileType: f.fileType,
                    fileUrl: f.fileUrl,
                    timestamp: f.createdAt,
                }));

                const scheduled = schedRes.data || [];

                const getTime = (m) =>
                    m.scheduled
                        ? new Date(m.scheduledTime)
                        : new Date(m.timestamp);

                const merged = [...messages, ...files, ...scheduled].sort(
                    (a, b) => getTime(a) - getTime(b)
                );
                setChatItems(merged);
                setAllItems(merged);
            } catch (err) {
                console.log("load error:", err);
            }
        };

        loadData();
    }, [chat?.chatId]);

    // ================= SEARCH =================
    const handleSearch = (query) => {
        if (!query.trim()) {
            setChatItems(allItems); // reset
            return;
        }

        const filtered = allItems.filter((item) => {
            if (item.type === "FILE") return false;

            return item.content?.toLowerCase().includes(query.toLowerCase());
        });

        setChatItems(filtered);
    };

    // ================= AUTO SCROLL =================
    useEffect(() => {
        if (!scrollRef.current) return;
        scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }, [chatItems]);

    // ================= DELIVERED =================
    useEffect(() => {
        if (!chat?.chatId || chat?.isGroup) return;

        if (deliveredRef.current === chat.chatId) return;

        deliveredRef.current = chat.chatId;
        markDelivered(chat.chatId);
    }, [chat?.chatId]);

    // ================= SEEN =================
    useEffect(() => {
        if (!chat?.chatId || chat?.isGroup) return;

        const lastMsg = chatItems[chatItems.length - 1];

        if (
            lastMsg &&
            lastMsg.senderId !== currentUser.userId &&
            lastMsg.status !== "SEEN" &&
            lastSeenRef.current !== lastMsg.id
        ) {
            lastSeenRef.current = lastMsg.id;

            const timer = setTimeout(() => {
                markSeen(chat.chatId);
            }, 300);

            return () => clearTimeout(timer);
        }
    }, [chatItems, chat?.chatId]);

    useEffect(() => {
        if (!chat?.chatId) return;
        const unsubscribe = subscribeChat(chat.chatId, (msg) => {
            if (typeof msg === "string" && msg.startsWith("DELETE:")) {
                const id = msg.split(":")[1];

                setChatItems((prev) =>
                    prev.filter((m) => String(m.id) !== String(id))
                );
                return;
            }
            if (String(msg.chatId) !== String(chat.chatId)) return;

            if (msg.content && !msg.scheduled) {
                updateLastMessage(chat.chatId, msg.content);

                if (msg.senderId !== currentUser.userId) {
                    setLastMessage(msg.content);
                }
            }
            setChatItems((prev) => {
                let updated = prev.filter(
                    (m) =>
                        !(
                            m.isTemp &&
                            m.content === msg.content &&
                            m.senderId === msg.senderId
                        )
                );
                if (updated.find((m) => m.id === msg.id)) return updated;
                updated.push(msg);
                return updated.sort(
                    (a, b) => new Date(a.timestamp) - new Date(b.timestamp)
                );
            });
        });

        return () => unsubscribe();
    }, [chat?.chatId]);

    // ================= SEND =================
    const handleSend = async () => {
        if (!draft.trim() || !chat?.chatId) return;

        const tempMsg = {
            id: "temp-" + Date.now(),
            isTemp: true,
            chatId: chat.chatId,
            senderId: currentUser.userId,
            content: draft,
            type: "TEXT",
            timestamp: new Date().toISOString(),
        };

        setChatItems((prev) =>
            [...prev, tempMsg].sort(
                (a, b) => new Date(a.timestamp) - new Date(b.timestamp)
            )
        );

        const currentDraft = draft;
        setDraft("");

        try {
            await sendMessage({
                chatId: chat.chatId,
                receiverId: chat.isGroup ? null : chat.receiverId,
                content: currentDraft,
                messageType: "TEXT",
                scheduled: false,
            });

            const now = Date.now();

            if (!chat.isGroup && now - lastNotificationTime.current > 800) {
                lastNotificationTime.current = now;

                await createNotification({
                    receiverId: chat.receiverId,
                    message: currentDraft,
                });
            }
        } catch (err) {
            console.log("send error:", err);

            setChatItems((prev) => prev.filter((m) => m.id !== tempMsg.id));

            setDraft(currentDraft);
        }
    };

    // ================= SCHEDULE =================
    const handleScheduledSend = async (scheduledTime) => {
        if (!draft.trim() || !chat?.chatId) return;

        try {
            await sendMessage({
                chatId: chat.chatId,
                receiverId: chat.isGroup ? null : chat.receiverId,
                content: draft,
                messageType: "TEXT",
                scheduled: true,
                scheduledTime: scheduledTime
                    .toLocaleString("sv-SE")
                    .replace(" ", "T"), // ✅ FIXED
            });

            // ✅ temp scheduled UI
            const tempScheduled = {
                id: "temp-schedule-" + Date.now(),
                chatId: chat.chatId,
                senderId: currentUser.userId,
                content: draft,
                type: "TEXT",
                scheduled: true,
                timestamp: scheduledTime.toISOString(),
            };

            setChatItems((prev) =>
                [...prev, tempScheduled].sort(
                    (a, b) => new Date(a.timestamp) - new Date(b.timestamp)
                )
            );

            setDraft("");
            setScheduleOpen(false);
        } catch (err) {
            console.log("❌ schedule error:", err);
        }
    };

    // ================= UI =================
    return (
        <div className="flex h-full flex-1 flex-col bg-card">
            <ChatHeader
                chat={chat}
                onSearch={handleSearch}
                onOpenProfile={() => setProfileOpen(true)}
            />

            <Divider />

            <div ref={scrollRef} className="flex-1 overflow-y-auto p-6">
                {chatItems.map((item) => {
                    if (
                        item.scheduled &&
                        item.senderId !== currentUser.userId
                    ) {
                        return null;
                    }
                    // 🔥 FILE
                    if (item.type === "FILE") {
                        const isMe = item.senderId === currentUser.userId;

                        return (
                            <div
                                key={item.id}
                                className={`flex w-full mb-2 ${
                                    isMe ? "justify-end" : "justify-start"
                                }`}
                            >
                                <FilePreview
                                    kind={
                                        item.fileType === "IMAGE"
                                            ? "image"
                                            : item.fileType === "VIDEO"
                                            ? "video"
                                            : item.fileType === "PDF"
                                            ? "pdf"
                                            : "file"
                                    }
                                    name={item.fileName}
                                    url={item.fileUrl}
                                    onMe={isMe}
                                    createdAt={item.timestamp}
                                />
                            </div>
                        );
                    }

                    // 🔥 TEXT MESSAGE
                    return <MessageBubble key={item.id} message={item} />;
                })}
            </div>

            <div className="border-t p-3">
                <AISuggestions
                    suggestions={aiSuggestions}
                    onPick={(text) => setDraft(text)}
                />

                <MessageInput
                    value={draft}
                    onChange={setDraft}
                    onSend={handleSend}
                    onOpenSchedule={() => setScheduleOpen(true)}
                    chat={chat}
                    currentUser={currentUser}
                    tone={tone}
                    setTone={setTone}
                    refreshChat={refreshChat}
                />
            </div>

            <ScheduleModal
                open={scheduleOpen}
                preview={draft}
                onClose={() => setScheduleOpen(false)}
                onConfirm={(date, time) => {
                    if (!date || !time) return;

                    const [hours, minutes] = time.split(":");

                    const scheduledTime = new Date(date);
                    scheduledTime.setHours(parseInt(hours));
                    scheduledTime.setMinutes(parseInt(minutes));
                    scheduledTime.setSeconds(0);
                    scheduledTime.setMilliseconds(0);

                    handleScheduledSend(scheduledTime);
                }}
            />
            <UserProfilePanel
                open={profileOpen}
                user={{
                    name: chat?.name,
                    online: chat?.online,
                    lastSeen: chat?.lastSeen,
                    about: chat?.about || "",
                }}
                isMe={false}
                onClose={() => setProfileOpen(false)}
            />
        </div>
    );
}
