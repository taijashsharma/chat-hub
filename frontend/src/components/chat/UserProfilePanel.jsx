import { useState } from "react";
import { X, MapPin, Mail, Calendar, Edit2 } from "lucide-react";
import { Avatar } from "@/components/ui/UserAvatar";
import { EditProfileModal } from "./EditProfileModal";

export function UserProfilePanel({ open, user, onClose, isMe }) {
    const [editOpen, setEditOpen] = useState(false);
    const formatLastSeen = (time) => {
        if (!time) return "Unknown";

        const date = new Date(time);

        return date.toLocaleString("en-IN", {
            day: "numeric",
            month: "short",
            hour: "2-digit",
            minute: "2-digit",
        });
    };
    if (!open) return null;

    return (
        <>
            {/* Smooth Overlay */}
            <div
                onClick={onClose}
                className="fixed inset-0 bg-black/20 backdrop-blur-[2px] z-40 transition-opacity"
            />

            {/* Floating Profile Card */}
            <div className="fixed right-6 top-20 w-[300px] rounded-3xl border border-border/50 bg-card/95 backdrop-blur-md shadow-2xl z-50 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
                {/* Decorative Header Background */}
                <div className="h-20 bg-gradient-to-r from-blue-500/10 via-purple-500/10 to-pink-500/10 w-full absolute top-0" />

                {/* Header Actions */}
                <div className="relative flex items-center justify-between px-4 py-3 z-10">
                    <span className="text-[10px] uppercase tracking-widest font-bold text-muted-foreground">
                        User Profile
                    </span>
                    <button
                        onClick={onClose}
                        className="p-1.5 rounded-full hover:bg-background/80 transition-colors shadow-sm"
                    >
                        <X size={16} />
                    </button>
                </div>

                {/* Content */}
                <div className="relative flex flex-col items-center px-6 pb-6 pt-2">
                    {/* Avatar with Ring */}
                    <div className="relative p-1 rounded-full bg-gradient-to-tr from-blue-500 to-purple-500 shadow-lg">
                        <div className="bg-card rounded-full">
                            <Avatar
                                initials={user?.name?.slice(0, 2)}
                                size="lg"
                                online={
                                    user?.status === "ONLINE" || user?.online
                                }
                                className="h-20 w-20 text-xl font-medium flex items-center justify-center"
                            />
                        </div>
                    </div>

                    <h3 className="mt-4 text-lg font-bold tracking-tight">
                        {user?.name || "User Name"}
                    </h3>

                    <p className="text-xs text-muted-foreground text-center line-clamp-3 mt-1 leading-relaxed">
                        {user?.about || "Digital creator & tech enthusiast."}
                    </p>

                    {/* Status Badge */}
                    <div className="mt-4 flex items-center gap-1.5 px-3 py-1 rounded-full bg-secondary/50 border border-border/40">
                        <div
                            className={`h-1.5 w-1.5 rounded-full ${
                                user?.status === "ONLINE"
                                    ? "bg-green-500 animate-pulse"
                                    : "bg-zinc-400"
                            }`}
                        />
                        <span className="text-[10px] font-medium uppercase tracking-wider">
                            {user?.status === "ONLINE"
                                ? "Active now"
                                : `Seen: ${formatLastSeen(user?.lastSeen)}`}
                        </span>
                    </div>

                    <div className="w-full h-[1px] bg-border/50 my-5" />

                    {/* Quick Stats/Info */}
                    <div className="w-full space-y-3">
                        <div className="flex items-center gap-3 text-muted-foreground">
                            <Mail size={14} className="shrink-0" />
                            <span className="text-xs truncate">
                                {user?.email || "No email provided"}
                            </span>
                        </div>
                    </div>

                    {/* Action Button */}
                    {isMe && (
                        <button
                            onClick={() => setEditOpen(true)}
                            className="mt-6 w-full flex items-center justify-center gap-2 py-2.5 rounded-xl bg-foreground text-background text-xs font-semibold hover:opacity-90 transition-all active:scale-[0.98] shadow-md"
                        >
                            <Edit2 size={12} />
                            Edit Profile
                        </button>
                    )}
                </div>
            </div>

            {editOpen && (
                <EditProfileModal
                    user={user}
                    onClose={() => setEditOpen(false)}
                />
            )}
        </>
    );
}
