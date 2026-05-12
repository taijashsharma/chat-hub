import { FileText, Download, Video, File } from "lucide-react";
import { cn } from "@/lib/utils";

const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:8080";

export function FilePreview({ kind, name, size, onMe, url, createdAt }) {
    const fileUrl = `${BASE_URL}${url}`;
    const formatTime = (date) => {
        if (!date) return "";

        return new Date(date).toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
        });
    };

    const containerStyle = onMe
        ? "bg-foreground text-background border-foreground/10"
        : "bg-secondary text-foreground border-border";

    const overlayStyle = onMe
        ? "bg-black/30 text-white"
        : "bg-black/40 text-white";

    // ================= IMAGE =================
    if (kind === "image") {
        return (
            <div
                className={cn(
                    "overflow-hidden rounded-xl border w-72",
                    containerStyle
                )}
            >
                <img
                    src={fileUrl}
                    alt={name}
                    className="h-48 w-full object-cover"
                    onError={(e) => (e.target.src = "/fallback.png")}
                />

                <div
                    className={cn(
                        "flex justify-between px-3 py-2 text-xs",
                        overlayStyle
                    )}
                >
                    <span className="truncate">{name}</span>

                    <div className="flex items-center gap-2">
                        <span>{formatTime(createdAt)}</span>

                        <a href={fileUrl} download target="_blank">
                            <Download className="h-4 w-4" />
                        </a>
                    </div>
                </div>
            </div>
        );
    }

    // ================= VIDEO =================
    if (kind === "video") {
        return (
            <div
                className={cn(
                    "w-72 rounded-xl border overflow-hidden",
                    containerStyle
                )}
            >
                <video
                    src={fileUrl}
                    controls
                    className="w-full h-48 object-cover"
                />

                <div
                    className={cn(
                        "flex justify-between px-3 py-2 text-xs",
                        overlayStyle
                    )}
                >
                    <span className="truncate">{name}</span>

                    <div className="flex items-center gap-2">
                        <span>{formatTime(createdAt)}</span>

                        <a href={fileUrl} download target="_blank">
                            <Download className="h-4 w-4" />
                        </a>
                    </div>
                </div>
            </div>
        );
    }

    // ================= PDF =================
    if (kind === "pdf") {
        return (
            <div
                className={cn(
                    "w-72 border rounded-xl overflow-hidden",
                    containerStyle
                )}
            >
                <iframe src={fileUrl} className="h-48 w-full" loading="lazy" />

                <div className="flex justify-between px-3 py-2 text-xs">
                    <span className="truncate">{name}</span>

                    <div className="flex items-center gap-2">
                        <span>{formatTime(createdAt)}</span>

                        <a href={fileUrl} target="_blank">
                            Open
                        </a>
                    </div>
                </div>
            </div>
        );
    }

    // ================= OTHER FILE =================
    const Icon = kind === "doc" || kind === "docx" ? FileText : File;

    return (
        <div
            className={cn(
                "flex w-72 items-center gap-3 rounded-xl border p-3",
                containerStyle
            )}
        >
            <div
                className={cn(
                    "flex h-10 w-10 items-center justify-center rounded-lg",
                    onMe
                        ? "bg-background/10 text-background"
                        : "bg-secondary text-foreground"
                )}
            >
                <Icon className="h-4 w-4" />
            </div>

            <div className="min-w-0 flex-1">
                <div className="truncate text-[13px] font-medium">{name}</div>

                <div className="text-[11px] opacity-70">
                    {kind.toUpperCase()}
                    {size ? ` · ${size}` : ""}
                    {createdAt ? ` · ${formatTime(createdAt)}` : ""}
                </div>
            </div>

            <a
                href={fileUrl}
                download
                target="_blank"
                className={cn(
                    "flex h-8 w-8 items-center justify-center rounded-lg transition",
                    onMe ? "hover:bg-background/20" : "hover:bg-hover-bg"
                )}
            >
                <Download className="h-4 w-4" />
            </a>
        </div>
    );
}
