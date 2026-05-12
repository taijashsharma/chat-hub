import { LogOut, User, Bell } from "lucide-react";
import { updateUserStatus } from "@/api/userApi";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { getUnreadCount } from "../../api/notificationApi";

export function SettingsPanel({ onOpenProfile, onOpenNotifications }) {
    const navigate = useNavigate();
    const user = JSON.parse(localStorage.getItem("user"));
    const [count, setCount] = useState(0);

    useEffect(() => {
        const load = async () => {
            try {
                const res = await getUnreadCount();
                setCount(res.data);
            } catch (e) {
                console.log("notif error", e);
            }
        };
        load();
    }, []);

    const handleLogout = async () => {
        try {
            if (user) {
                await updateUserStatus(user.userId, false);
            }

            localStorage.clear();
            navigate("/login");
        } catch (e) {
            console.log("logout error:", e);
        }
    };

    return (
        <div className="flex h-full flex-col p-5">
            <h2 className="text-lg font-semibold mb-4">Settings</h2>

            <div className="space-y-2">
                {/* PROFILE */}
                <div
                    onClick={onOpenProfile}
                    className="flex items-center gap-3 p-3 rounded-lg hover:bg-hover-bg cursor-pointer"
                >
                    <User className="h-4 w-4" />
                    <span>Profile</span>
                </div>

                {/* NOTIFICATIONS */}
                <div
                    onClick={onOpenNotifications}
                    className="flex items-center justify-between p-3 rounded-lg hover:bg-hover-bg cursor-pointer"
                >
                    <div className="flex items-center gap-3 mr-2">
                        <Bell className="h-4 w-4" />
                        <span>Notifications</span>
                    </div>

                    {/* 🔥 UNREAD BADGE */}
                    {count > 0 && (
                        <span className="text-[10px] px-2 py-0.5 rounded-full bg-red-500 text-white">
                            {count}
                        </span>
                    )}
                </div>

                {/* LOGOUT */}
                <div
                    onClick={handleLogout}
                    className="flex items-center gap-3 p-3 rounded-lg hover:bg-red-500/10 cursor-pointer text-red-500"
                >
                    <LogOut className="h-4 w-4" />
                    <span>Logout</span>
                </div>
            </div>
        </div>
    );
}
