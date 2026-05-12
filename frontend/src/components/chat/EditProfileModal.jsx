import { useState } from "react";
import { updateUser } from "@/api/userApi";
import { X, User, Info, Save, Loader2 } from "lucide-react";

export function EditProfileModal({ user, onClose }) {
    const [name, setName] = useState(user?.name || "");
    const [about, setAbout] = useState(user?.about || "");
    const [loading, setLoading] = useState(false);

    const handleSave = async () => {
        if (!name.trim()) return;

        try {
            setLoading(true);
            await updateUser(user.userId, {
                name,
                about,
            });

            // Update localStorage
            const updatedUser = { ...user, name, about };
            localStorage.setItem("user", JSON.stringify(updatedUser));

            onClose();
            // Window reload ki jagah agar aap state lift up karein toh behtar hai,
            // par filhal refresh kaam karega.
            window.location.reload();
        } catch (e) {
            console.error("Profile update error:", e);
            alert("Failed to update profile");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm animate-in fade-in duration-200">
            {/* Modal Card */}
            <div className="bg-card border border-border shadow-floating w-full max-w-[380px] rounded-3xl overflow-hidden animate-in zoom-in-95 duration-200">
                {/* Header */}
                <div className="p-5 border-b border-divider flex items-center justify-between bg-muted/30">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-primary/10 rounded-lg">
                            <User className="w-5 h-5 text-primary" />
                        </div>
                        <h2 className="text-lg font-bold tracking-tight text-foreground">
                            Edit Profile
                        </h2>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-2 hover:bg-muted rounded-full transition-colors text-muted-foreground"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {/* Form Body */}
                <div className="p-6 space-y-5">
                    {/* Name Field */}
                    <div className="space-y-1.5 group">
                        <label className="text-[11px] font-bold text-muted-foreground uppercase tracking-widest ml-1 group-focus-within:text-primary transition-colors flex items-center gap-1.5">
                            <User className="w-3 h-3" /> Display Name
                        </label>
                        <input
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            placeholder="Your name"
                            className="w-full bg-background/50 border border-input p-3 rounded-xl focus:ring-4 focus:ring-primary/10 focus:border-primary outline-none transition-all font-medium"
                        />
                    </div>

                    {/* About Field */}
                    <div className="space-y-1.5 group">
                        <label className="text-[11px] font-bold text-muted-foreground uppercase tracking-widest ml-1 group-focus-within:text-primary transition-colors flex items-center gap-1.5">
                            <Info className="w-3 h-3" /> About / Bio
                        </label>
                        <textarea
                            rows="3"
                            value={about}
                            onChange={(e) => setAbout(e.target.value)}
                            placeholder="Tell us about yourself..."
                            className="w-full bg-background/50 border border-input p-3 rounded-xl focus:ring-4 focus:ring-primary/10 focus:border-primary outline-none transition-all font-medium resize-none"
                        />
                    </div>
                </div>

                {/* Footer Actions */}
                <div className="p-5 bg-muted/20 border-t border-divider flex gap-3">
                    <button
                        onClick={onClose}
                        className="flex-1 px-4 py-2.5 rounded-xl font-bold text-sm text-muted-foreground hover:bg-muted transition-colors"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={handleSave}
                        disabled={loading || !name.trim()}
                        className="flex-[1.5] bg-primary text-primary-foreground px-4 py-2.5 rounded-xl font-bold text-sm shadow-lg shadow-primary/20 hover:opacity-90 active:scale-[0.98] disabled:opacity-50 transition-all flex items-center justify-center gap-2"
                    >
                        {loading ? (
                            <Loader2 className="w-4 h-4 animate-spin" />
                        ) : (
                            <>
                                <Save className="w-4 h-4" />
                                Save Changes
                            </>
                        )}
                    </button>
                </div>
            </div>
        </div>
    );
}
