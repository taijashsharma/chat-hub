import { MoreHorizontal, Sparkles, Bell } from "lucide-react";
import { Avatar } from "@/components/ui/UserAvatar";
import { useEffect, useState } from "react";
import { getUnreadCount } from "../../api/notificationApi";
export function TopBar({ onOpenProfile, onOpenNotifications }) {
    const [count, setCount] = useState(0);
    const user = JSON.parse(localStorage.getItem("user"));
    useEffect(() => {
        getUnreadCount().then((res) => setCount(res.data));
    }, []);
    return (
        <div className="flex items-center justify-between px-5 py-3.5">
            {/* LEFT */}
            <div className="flex items-center gap-3">
                {/* Icon Container */}
                <img src="/logo.png" alt="" className="h-10 w-10" />
                {/* Text Container */}
                <div className="flex flex-col justify-center leading-tight">
                    <div className="flex items-baseline gap-1">
                        <span className="text-lg font-black tracking-tight text-foreground">
                            Clever
                            <span className="text-muted-foreground font-medium">
                                Talk
                            </span>
                        </span>
                    </div>
                    <span className="text-[8px] font-bold uppercase tracking-[0.1em] text-muted-foreground/70 -mt-0.5">
                        Powered by Kavya, Sneha & Taijash
                    </span>
                </div>
            </div>
            {/* RIGHT */}
            <div className="flex items-center gap-2">
                {/*  NOTIFICATION BUTTON */}
                <button
                    onClick={onOpenNotifications}
                    className="flex h-9 w-9 items-center justify-center rounded-lg hover:bg-hover-bg"
                >
                    <Bell className="h-4 w-4" />
                    {count > 0 && (
                        <span className="absolute -top-1 -right-1 text-[9px] bg-red-500 text-white px-1 rounded-full">
                            {count}
                        </span>
                    )}
                </button>
                {/* PROFILE */}
                <div onClick={onOpenProfile} className="cursor-pointer">
                    <Avatar
                        initials={user?.name?.slice(0, 2)}
                        size="sm"
                        online={user?.status === "ONLINE"}
                    />
                </div>
            </div>
        </div>
    );
}
