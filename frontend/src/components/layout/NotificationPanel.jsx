import { useEffect, useState } from "react";
import { getUserNotifications, markAsSeen } from "@/api/notificationApi";

export function NotificationPanel({ open, onClose }) {
    const [list, setList] = useState([]);

    useEffect(() => {
        if (!open) return;

        const load = async () => {
            const res = await getUserNotifications();
            setList(res.data);
        };

        load();
    }, [open]);

    useEffect(() => {
        const handleEsc = (e) => {
            if (e.key === "Escape") onClose();
        };

        window.addEventListener("keydown", handleEsc);
        return () => window.removeEventListener("keydown", handleEsc);
    }, [onClose]);

    const handleClick = async (n) => {
        if (!n.seen) {
            await markAsSeen(n.id);
        }
        setList((prev) => prev.filter((item) => item.id !== n.id));
    };

    if (!open) return null;

    return (
        <>
            {/* overlay */}
            <div onClick={onClose} className="fixed inset-0 bg-black/10 z-40" />

            {/* panel */}
            <div className="fixed right-6 top-20 w-[320px] bg-card border rounded-xl shadow-xl z-50">
                <div className="p-3 border-b text-sm font-semibold">
                    Notifications
                </div>

                <div className="max-h-[400px] overflow-y-auto p-1">
                    {list.map((n) => (
                        <div
                            key={n.id}
                            onClick={() => handleClick(n)}
                            className={`p-3 my-2 border-b cursor-pointer rounded-xl ${
                                !n.seen ? "bg-blue-50" : ""
                            }`}
                        >
                            <p className="text-xs">{n.message}</p>
                            <span className="text-[10px] text-muted-foreground">
                                {new Date(n.timestamp).toLocaleString()}
                            </span>
                        </div>
                    ))}

                    {list.length === 0 && (
                        <p className="text-center text-xs p-4">
                            No notifications
                        </p>
                    )}
                </div>
            </div>
        </>
    );
}
