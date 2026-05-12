import { useState } from "react";
import { createGroup } from "@/api/groupApi";
import { X, Users, CheckCircle2, UserPlus } from "lucide-react"; // Icons add kiye hain

export default function GroupModal({ users, close, onGroupCreated }) {
    const [name, setName] = useState("");
    const [selected, setSelected] = useState([]);
    const [loading, setLoading] = useState(false);

    const toggleUser = (userId) => {
        setSelected((prev) =>
            prev.includes(userId)
                ? prev.filter((x) => x !== userId)
                : [...prev, userId]
        );
    };

    const handleCreate = async () => {
        if (!name || selected.length === 0) return;

        try {
            setLoading(true);

            const res = await createGroup({
                name,
                description: "Premium Group Chat",
                members: selected,
            });

            onGroupCreated(res.data);

            close();
        } catch (err) {
            console.error("Group create error:", err);
            alert("Failed to create group. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm animate-in fade-in duration-200">
            {/* Modal Card */}
            <div className="bg-card border border-border shadow-floating w-full max-w-md rounded-3xl overflow-hidden animate-in zoom-in-95 duration-200 relative">
                {/* Header */}
                <div className="p-6 border-b border-divider flex items-center justify-between bg-muted/30">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-primary/10 rounded-xl">
                            <Users className="w-5 h-5 text-primary" />
                        </div>
                        <div>
                            <h2 className="text-xl font-bold tracking-tight text-foreground">
                                Create New Group
                            </h2>
                            <p className="text-xs text-muted-foreground">
                                Set up a space for your team
                            </p>
                        </div>
                    </div>
                    <button
                        onClick={close}
                        className="p-2 hover:bg-muted rounded-full transition-colors text-muted-foreground"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                <div className="p-6 space-y-6">
                    {/* Group Name Input */}
                    <div className="space-y-2">
                        <label className="text-[11px] font-bold text-muted-foreground uppercase tracking-widest ml-1">
                            Group Identity
                        </label>
                        <input
                            placeholder="Enter group name..."
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            className="w-full bg-background border border-input p-3 rounded-xl focus:ring-4 focus:ring-primary/10 focus:border-primary outline-none transition-all font-medium"
                        />
                    </div>

                    {/* User Selection List */}
                    <div className="space-y-2">
                        <div className="flex justify-between items-center px-1">
                            <label className="text-[11px] font-bold text-muted-foreground uppercase tracking-widest">
                                Add Members
                            </label>
                            <span className="text-[10px] font-bold bg-primary/10 text-primary px-2 py-0.5 rounded-full">
                                {selected.length} Selected
                            </span>
                        </div>

                        <div className="max-h-52 overflow-y-auto pr-2 custom-scrollbar space-y-1">
                            {users.length > 0 ? (
                                users.map((u) => (
                                    <div
                                        key={u.userId}
                                        onClick={() => toggleUser(u.userId)}
                                        className={`flex items-center justify-between p-3 rounded-xl cursor-pointer transition-all border ${
                                            selected.includes(u.userId)
                                                ? "bg-primary/5 border-primary/20 shadow-sm"
                                                : "hover:bg-muted/50 border-transparent"
                                        }`}
                                    >
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center font-bold text-muted-foreground border border-border">
                                                {u.name.charAt(0)}
                                            </div>
                                            <span className="font-medium text-sm text-foreground">
                                                {u.name}
                                            </span>
                                        </div>
                                        {selected.includes(u.userId) ? (
                                            <CheckCircle2 className="w-5 h-5 text-primary fill-primary/10" />
                                        ) : (
                                            <div className="w-5 h-5 border-2 border-muted rounded-full" />
                                        )}
                                    </div>
                                ))
                            ) : (
                                <p className="text-center text-sm text-muted-foreground py-4">
                                    No users found
                                </p>
                            )}
                        </div>
                    </div>
                </div>

                {/* Footer Actions */}
                <div className="p-6 bg-muted/20 border-t border-divider flex gap-3">
                    <button
                        onClick={close}
                        className="flex-1 px-4 py-3 rounded-xl font-bold text-sm text-muted-foreground hover:bg-muted transition-colors"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={handleCreate}
                        disabled={!name || selected.length === 0 || loading}
                        className="flex-[2] bg-primary text-primary-foreground px-4 py-3 rounded-xl font-bold text-sm shadow-lg shadow-primary/20 hover:opacity-90 active:scale-[0.98] disabled:opacity-50 disabled:active:scale-100 transition-all flex items-center justify-center gap-2"
                    >
                        {loading ? (
                            <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        ) : (
                            <>
                                <UserPlus className="w-4 h-4" />
                                Create Group
                            </>
                        )}
                    </button>
                </div>
            </div>
        </div>
    );
}
