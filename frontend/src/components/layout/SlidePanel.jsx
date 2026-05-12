import { Search, X, Plus } from "lucide-react";
import { Avatar } from "@/components/ui/UserAvatar";
import { cn } from "@/lib/utils";
import { useState, useMemo } from "react";

export function SlidePanel({
    open,
    chats,
    activeChatId,
    onSelect,
    onClose,
    onCreateGroup,
}) {
    const [search, setSearch] = useState("");

    const searchText = search.toLowerCase();

    // ✅ optimized filtering (important)
    const filteredChats = useMemo(() => {
        if (!searchText) return chats;

        return chats.filter(
            (c) =>
                (c.name || "").toLowerCase().includes(searchText) ||
                (c.lastMessage || "").toLowerCase().includes(searchText)
        );
    }, [searchText, chats]);
    if (!open) return null;

    return (
        <div className="flex h-full w-[300px] flex-col border-r border-divider bg-panel-bg animate-[slide-in-left_0.28s_cubic-bezier(0.22,1,0.36,1)]">
            {/* Header */}
            <div className="flex items-center justify-between px-4 pt-4 pb-3">
                <div>
                    <h2 className="text-[15px] font-semibold tracking-tight text-foreground">
                        Messages
                    </h2>

                    <p className="text-[11px] text-muted-foreground">
                        {chats.length} conversations
                    </p>
                </div>

                <div className="flex items-center gap-1">
                    <button
                        onClick={onCreateGroup}
                        className="flex h-7 w-7 items-center justify-center rounded-lg text-muted-foreground hover:bg-hover-bg hover:text-foreground"
                    >
                        <Plus className="h-4 w-4" />
                    </button>

                    <button
                        onClick={onClose}
                        className="flex h-7 w-7 items-center justify-center rounded-lg text-muted-foreground hover:bg-hover-bg hover:text-foreground"
                    >
                        <X className="h-4 w-4" />
                    </button>
                </div>
            </div>

            {/* Search */}
            <div className="px-4 pb-3">
                <div className="flex items-center gap-2 rounded-xl border border-border bg-card px-3 py-2 shadow-card">
                    <Search className="h-3.5 w-3.5 text-muted-2" />

                    <input
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        placeholder="Search conversations"
                        className="w-full bg-transparent text-[13px] text-foreground placeholder:text-muted-2 focus:outline-none"
                    />

                    <span className="hidden sm:inline-flex items-center rounded-md border border-border bg-secondary px-1 text-[10px] text-muted-foreground">
                        ⌘K
                    </span>
                </div>
            </div>

            {/* Chat List */}
            <div className="flex-1 overflow-y-auto px-2 pb-3">
                {filteredChats.map((c) => {
                    const isActive = String(c.chatId) === String(activeChatId);

                    return (
                        <button
                            key={c.id}
                            onClick={() => onSelect(c)}
                            className={cn(
                                "flex w-full items-center gap-3 rounded-xl px-2.5 py-2.5 text-left transition-colors",
                                isActive ? "bg-active-bg" : "hover:bg-hover-bg"
                            )}
                        >
                            <Avatar
                                initials={c.initials}
                                online={c.online}
                                size="md"
                            />

                            <div className="min-w-0 flex-1">
                                <div className="flex items-center justify-between gap-2">
                                    <span className="truncate text-[13px] font-medium text-foreground">
                                        {c.name}
                                    </span>

                                    <span className="shrink-0 text-[11px] text-muted-2">
                                        {c.time || ""}
                                    </span>
                                </div>

                                <div className="flex items-center justify-between gap-2">
                                    <span className="truncate text-[12px] text-muted-foreground">
                                        {c.lastMessage || "No messages yet"}
                                    </span>

                                    {c.unread ? (
                                        <span className="ml-2 inline-flex h-[18px] min-w-[18px] items-center justify-center rounded-full bg-foreground px-1.5 text-[10px] font-medium text-background">
                                            {c.unread}
                                        </span>
                                    ) : null}
                                </div>
                            </div>
                        </button>
                    );
                })}

                {filteredChats.length === 0 && (
                    <div className="text-center text-sm text-muted-foreground mt-4">
                        No chats found
                    </div>
                )}
            </div>
        </div>
    );
}
