import { useState, useRef, useEffect } from "react";
import {
    Paperclip,
    Send,
    Smile,
    Calendar,
    ChevronDown,
    Sparkles,
} from "lucide-react";

import { cn } from "@/lib/utils";
import { uploadFile } from "@/api/fileApi";
import EmojiPicker from "emoji-picker-react";

const tones = ["Professional", "Friendly", "Short", "Detailed"];

export function MessageInput({
    value,
    onChange,
    onSend,
    onOpenSchedule,
    chat,
    tone,
    setTone,
    refreshChat,
}) {
    const [toneOpen, setToneOpen] = useState(false);
    const [showEmoji, setShowEmoji] = useState(false);

    const ref = useRef(null);
    const inputRef = useRef(null);

    // ✅ OUTSIDE CLICK FIX
    useEffect(() => {
        function onClick(e) {
            if (ref.current && !ref.current.contains(e.target)) {
                setToneOpen(false);
                setShowEmoji(false);
            }
        }

        document.addEventListener("mousedown", onClick);
        return () => document.removeEventListener("mousedown", onClick);
    }, []);

    // ✅ EMOJI FIX
    const handleEmojiClick = (emojiData) => {
        onChange((prev) => (prev || "") + emojiData.emoji);
        inputRef.current?.focus(); // smooth UX
    };

    return (
        <div ref={ref} className="space-y-2">
            {/* ================= TONE ================= */}
            <div className="flex items-center gap-2 px-1">
                <span className="text-[11px] font-medium text-muted-foreground">
                    Tone
                </span>
                <div className="relative">
                    <button
                        onClick={() => setToneOpen((o) => !o)}
                        className="inline-flex items-center gap-1.5 rounded-full border border-border bg-card px-2.5 py-1 text-[11.5px] font-medium text-foreground shadow-card transition-colors hover:bg-hover-bg"
                    >
                        <Sparkles className="h-3 w-3" />
                        {tone}
                        <ChevronDown className="h-3 w-3 text-muted-2" />
                    </button>

                    {toneOpen && (
                        <div className="absolute bottom-full left-0 mb-1 w-40 animate-[scale-in_0.18s_ease-out] overflow-hidden rounded-xl border border-border bg-card p-1 shadow-floating">
                            {tones.map((t) => (
                                <button
                                    key={t}
                                    onClick={() => {
                                        setTone(t);
                                        setToneOpen(false);
                                    }}
                                    className={cn(
                                        "flex w-full items-center justify-between rounded-lg px-2.5 py-1.5 text-left text-[12px] transition-colors",
                                        t === tone
                                            ? "bg-active-bg text-foreground"
                                            : "text-muted-foreground hover:bg-hover-bg hover:text-foreground"
                                    )}
                                >
                                    {t}
                                    {t === tone && (
                                        <span className="h-1.5 w-1.5 rounded-full bg-foreground" />
                                    )}
                                </button>
                            ))}
                        </div>
                    )}
                </div>
            </div>

            {/* ================= INPUT ================= */}
            <div className="flex items-center gap-2 rounded-2xl border border-border bg-card px-2 py-2 shadow-card transition-all focus-within:border-foreground/30 focus-within:shadow-floating">
                {/* FILE */}
                <button className="flex h-9 w-9 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-hover-bg hover:text-foreground">
                    <input
                        type="file"
                        hidden
                        id="fileUpload"
                        onChange={async (e) => {
                            const file = e.target.files[0];
                            if (!file || !chat?.chatId) return;

                            try {
                                await uploadFile(file, chat.chatId);
                                refreshChat();
                            } catch (err) {
                                console.log(err);
                            }
                        }}
                    />
                    <label htmlFor="fileUpload">
                        <Paperclip className="cursor-pointer w-4 h-4" />
                    </label>
                </button>

                {/* INPUT */}
                <input
                    ref={inputRef}
                    value={value || ""}
                    onChange={(e) => onChange(e.target.value)}
                    onKeyDown={(e) => {
                        if (e.key === "Enter" && !e.shiftKey) {
                            e.preventDefault();

                            if (value && value.trim()) {
                                onSend();
                            }
                        }
                    }}
                    placeholder="Type a message…"
                    className="flex-1 bg-transparent px-1 text-[13.5px] text-foreground placeholder:text-muted-2 focus:outline-none"
                />

                {/* EMOJI */}
                <div className="relative">
                    <button
                        onMouseDown={(e) => e.preventDefault()} // 🔥 FIX
                        onClick={() => setShowEmoji((prev) => !prev)}
                        className="flex h-9 w-9 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-hover-bg hover:text-foreground"
                    >
                        <Smile className="h-4 w-4" />
                    </button>

                    {showEmoji && (
                        <div className="absolute bottom-12 right-0 z-[9999]">
                            <EmojiPicker onEmojiClick={handleEmojiClick} />
                        </div>
                    )}
                </div>

                {/* SCHEDULE */}
                <button
                    onClick={onOpenSchedule}
                    title="Schedule"
                    className="flex h-9 w-9 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-hover-bg hover:text-foreground"
                >
                    <Calendar className="h-4 w-4" />
                </button>

                {/* SEND */}
                <button
                    onClick={() => {
                        if (value && value.trim()) {
                            onSend();
                        }
                    }}
                    disabled={!value || !value.trim()}
                    className={cn(
                        "flex h-9 items-center gap-1.5 rounded-lg px-3 text-[12.5px] font-medium transition-all",
                        value && value.trim()
                            ? "bg-foreground text-background hover:bg-foreground/90 shadow-card"
                            : "bg-secondary text-muted-2 cursor-not-allowed"
                    )}
                >
                    <Send className="h-3.5 w-3.5" />
                    Send
                </button>
            </div>
        </div>
    );
}
