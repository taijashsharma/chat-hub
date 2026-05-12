import { MessageSquare, Users, Calendar, Star, Settings } from "lucide-react";
import { cn } from "@/lib/utils";
const items = [{ key: "chat", icon: MessageSquare, label: "Chats" }];
export function IconSidebar({ active, onSelect }) {
    return (
        <div className="flex h-full w-[60px] flex-col items-center justify-between border-r border-divider bg-sidebar-bg py-4">
            <div className="flex flex-col items-center gap-1">
                {items.map((item) => {
                    const Icon = item.icon;
                    const isActive = active === item.key;
                    return (
                        <button
                            key={item.key}
                            onClick={() => onSelect(item.key)}
                            title={item.label}
                            className={cn(
                                "group relative flex h-10 w-10 items-center justify-center rounded-xl transition-all",
                                isActive
                                    ? "bg-active-bg text-foreground"
                                    : "text-muted-foreground hover:bg-hover-bg hover:text-foreground"
                            )}
                        >
                            <Icon
                                className="h-[18px] w-[18px]"
                                strokeWidth={isActive ? 2.25 : 1.75}
                            />
                            {isActive && (
                                <span className="absolute -left-[7px] top-1/2 h-5 w-[2px] -translate-y-1/2 rounded-full bg-foreground" />
                            )}
                        </button>
                    );
                })}
            </div>
            <button
                onClick={() => onSelect("settings")}
                title="Settings"
                className={cn(
                    "flex h-10 w-10 items-center justify-center rounded-xl transition-all",
                    active === "settings"
                        ? "bg-active-bg text-foreground"
                        : "text-muted-foreground hover:bg-hover-bg hover:text-foreground"
                )}
            >
                <Settings
                    className="h-[18px] w-[18px]"
                    strokeWidth={active === "settings" ? 2.25 : 1.75}
                />
            </button>
        </div>
    );
}
