import { Info, Search, X } from "lucide-react";
import { Avatar } from "@/components/ui/UserAvatar";
import { useState } from "react";

export function ChatHeader({ chat, onSearch, onOpenProfile }) {
    const [open, setOpen] = useState(false);
    const [query, setQuery] = useState("");

    if (!chat) return null;

    const handleSearch = (value) => {
        setQuery(value);
        onSearch(value);
    };

    return (
        <div className="flex items-center justify-between px-6 py-4 border-b">
            {/* LEFT */}
            <div className="flex items-center gap-3">
                <Avatar
                    initials={chat?.name?.slice(0, 2) || "?"}
                    online={chat?.online}
                    size="md"
                />

                <div>
                    <div className="text-[14px] font-semibold">
                        {chat?.name}
                    </div>

                    <div className="text-[11px] text-muted-foreground">
                        {chat?.online ? "Active now" : "Offline"}
                    </div>
                </div>
            </div>

            {/* RIGHT */}
            <div className="flex items-center gap-2">
                {open && (
                    <input
                        value={query}
                        onChange={(e) => handleSearch(e.target.value)}
                        placeholder="Search messages..."
                        className="px-3 py-1.5 text-sm border rounded-lg outline-none"
                    />
                )}

                <button
                    onClick={() => {
                        setOpen((v) => !v);
                        if (open) {
                            setQuery("");
                            onSearch(""); // reset
                        }
                    }}
                    className="flex h-9 w-9 items-center justify-center rounded-lg hover:bg-hover-bg"
                >
                    {open ? <X size={16} /> : <Search size={16} />}
                </button>

                <button
                    onClick={onOpenProfile}
                    className="flex h-9 w-9 items-center justify-center rounded-lg hover:bg-hover-bg"
                >
                    <Info size={16} />
                </button>
            </div>
        </div>
    );
}
