import { useState, useEffect, useCallback } from "react";
import { TopBar } from "./TopBar";
import { IconSidebar } from "./IconSidebar";
import { SlidePanel } from "./SlidePanel";
import { ChatContainer } from "@/components/chat/ChatContainer";
import { Divider } from "@/components/ui/Divider";
import { searchUsers } from "@/api/userApi";
import { getMyGroups } from "@/api/groupApi";
import { createChatRoom } from "@/api/chatApi";
import GroupModal from "./GroupModal";
import { subscribeStatus } from "../service/socketService";
import { SettingsPanel } from "./SettingPannel";
import { UserProfilePanel } from "../chat/UserProfilePanel";
import { NotificationPanel } from "./NotificationPanel";

export function FloatingLayout() {
    const [profileOpen, setProfileOpen] = useState(false);
    const [active, setActive] = useState("chat");
    const [panelOpen, setPanelOpen] = useState(true);
    const [chats, setChats] = useState([]);
    const [activeChat, setActiveChat] = useState(null);
    const [showGroupModal, setShowGroupModal] = useState(false);
    const [notifOpen, setNotifOpen] = useState(false);

    const currentUser = JSON.parse(localStorage.getItem("user") || "{}");

    // ================= LOAD CHATS =================
    const loadChats = useCallback(async () => {
        try {
            const userRes = await searchUsers("");
            const userData = userRes.data.content || userRes.data;

            const users = userData
                .filter((u) => u.id !== currentUser.userId)
                .map((u) => ({
                    id: "u_" + u.id,
                    chatId: null,
                    name: u.name,
                    initials: u.name.slice(0, 2),
                    online: u.status === "ONLINE",
                    type: "USER",
                    userId: u.id,
                    lastSeen: u.lastSeen,
                    about: u.about,
                    email: u.email,
                    unread: 0,
                    lastMessage: "",
                }));

            const groupRes = await getMyGroups();
            const groups = groupRes.data.map((g) => ({
                id: "g_" + g.groupId,
                chatId: g.chatId,
                name: g.name,
                initials: "GR",
                online: false,
                type: "GROUP",
                groupId: g.groupId,
                unread: 0,
                lastMessage: "",
            }));

            setChats([...groups, ...users]);
        } catch (err) {
            console.log(err);
        }
    }, [currentUser.userId]);

    // ================= SOCKET + INITIAL LOAD =================
    useEffect(() => {
        const unsubscribe = subscribeStatus((msg) => {
            console.log("STATUS EVENT:", msg);

            const [userId, status] = msg?.split(":") || [];

            setChats((prev) =>
                prev.map((c) =>
                    String(c.userId) === String(userId)
                        ? { ...c, online: status === "ONLINE" }
                        : c
                )
            );

            setActiveChat((prev) => {
                if (prev && String(prev.receiverId) === String(userId)) {
                    return { ...prev, online: status === "ONLINE" };
                }
                return prev;
            });
        });

        loadChats();

        return () => unsubscribe();
    }, [loadChats]);

    // ================= SIDEBAR =================
    function handleSelect(key) {
        if (key === "chat") {
            setPanelOpen((o) => (active === "chat" ? !o : true));
        } else {
            setPanelOpen(false);
        }
        setActive(key);
    }

    // ================= ADD NEW GROUP =================
    const addNewGroup = (group) => {
        setChats((prev) => [
            {
                id: "g_" + group.groupId,
                chatId: group.chatId,
                name: group.name,
                initials: "GR",
                online: false,
                type: "GROUP",
                groupId: group.groupId,
                unread: 0,
                lastMessage: "",
            },
            ...prev, // 🔥 top pe show hoga
        ]);
    };

    // ================= UPDATE LAST MESSAGE =================
    const updateLastMessage = (chatId, content) => {
        setChats((prev) =>
            prev.map((c) => {
                if (String(c.chatId) === String(chatId)) {
                    return {
                        ...c,
                        lastMessage: content,
                        updatedAt: Date.now(), // force re-render
                    };
                }
                return c;
            })
        );
    };

    // ================= SELECT CHAT =================
    const handleSelectChat = async (chat) => {
        if (chat.type === "USER") {
            let chatId = chat.chatId;

            if (!chatId) {
                const res = await createChatRoom({
                    senderId: currentUser.userId,
                    receiverId: chat.userId,
                });

                chatId = res.data.chatId;

                setChats((prev) =>
                    prev.map((c) =>
                        c.userId === chat.userId ? { ...c, chatId } : c
                    )
                );
            }

            setActiveChat({
                chatId,
                receiverId: chat.userId,
                name: chat.name,
                online: chat.online,
                about: chat.about,
                email: chat.email,
                lastSeen: chat.lastSeen,
                isGroup: false,
            });
        }

        if (chat.type === "GROUP") {
            setActiveChat({
                chatId: chat.chatId,
                name: chat.name,
                online: false,
                isGroup: true,
            });
        }

        setChats((prev) =>
            prev.map((c) => (c.id === chat.id ? { ...c, unread: 0 } : c))
        );
    };
    return (
        <div className="relative z-10 flex min-h-screen w-full items-center justify-center">
            <div className="flex w-full max-w-full flex-col overflow-hidden rounded-3xl border border-border bg-card/80 shadow-floating backdrop-blur-xl h-screen">
                <TopBar
                    onOpenProfile={() => setProfileOpen(true)}
                    onOpenNotifications={() => setNotifOpen(true)}
                />
                <Divider />

                <div className="flex flex-1 overflow-hidden">
                    <IconSidebar active={active} onSelect={handleSelect} />

                    <SlidePanel
                        open={panelOpen}
                        chats={chats}
                        activeChatId={activeChat?.chatId}
                        onSelect={handleSelectChat}
                        onClose={() => setPanelOpen(false)}
                        onCreateGroup={() => setShowGroupModal(true)}
                    />

                    {active === "chat" && (
                        <ChatContainer
                            chat={activeChat}
                            updateLastMessage={updateLastMessage}
                        />
                    )}

                    {active === "settings" && (
                        <SettingsPanel
                            onOpenProfile={() => setProfileOpen(true)}
                            onOpenNotifications={() => setNotifOpen(true)}
                        />
                    )}
                    {showGroupModal && (
                        <GroupModal
                            users={chats.filter((c) => c.type === "USER")}
                            close={() => setShowGroupModal(false)}
                            onGroupCreated={addNewGroup} // 🔥 ADD THIS
                        />
                    )}
                </div>
            </div>
            <UserProfilePanel
                open={profileOpen}
                user={currentUser}
                isMe={true}
                onClose={() => setProfileOpen(false)}
            />
            <NotificationPanel
                open={notifOpen}
                onClose={() => setNotifOpen(false)}
            />
        </div>
    );
}
