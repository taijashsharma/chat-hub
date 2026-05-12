import { Clock, Check, CheckCheck } from "lucide-react";
import { cn } from "@/lib/utils";
import { FilePreview } from "@/components/file/FilePreview";
import { MessageActions } from "./MessageActions";
import { deleteMessage, editMessage } from "@/api/messageApi";

export function MessageBubble({ message }) {
    const currentUser = JSON.parse(localStorage.getItem("user") || "{}");

    const onMe = message.senderId === currentUser.userId;

    const isScheduled = message.scheduled;

    const time = message.timestamp
        ? new Date(message.timestamp).toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
          })
        : "";
    const onDelete = async (id) => {
        try {
            await deleteMessage(id);
        } catch (e) {
            console.log(e);
        }
    };

    const onEdit = async (msg) => {
        const updated = prompt("Edit message", msg.content);
        if (!updated) return;

        try {
            await editMessage(msg.id, {
                ...msg,
                content: updated,
            });
        } catch (e) {
            console.log(e);
        }
    };

    return (
        <div
            className={cn(
                "group relative flex w-full animate-[fade-in_0.35s_ease-out]",
                onMe ? "justify-end" : "justify-start"
            )}
        >
            <div
                className={cn(
                    "relative max-w-[78%]",
                    onMe ? "items-end" : "items-start"
                )}
            >
                <MessageActions
                    onMe={onMe}
                    message={message}
                    onDelete={onDelete}
                    onEdit={onEdit}
                />

                <div
                    className={cn(
                        "rounded-2xl border text-[13.5px] leading-relaxed shadow-card transition-shadow",
                        onMe
                            ? "bg-foreground text-background border-foreground/10"
                            : "bg-secondary text-foreground border-border",
                        isScheduled &&
                            "border-dashed border-muted-2 bg-card text-foreground",
                        message.file ? "p-2" : "px-3.5 py-2.5"
                    )}
                >
                    {isScheduled && (
                        <div className="mb-1 flex items-center gap-1.5 px-1 pt-0.5 text-[10px] font-medium uppercase tracking-wider text-muted-foreground">
                            <Clock className="h-3 w-3" />
                            Scheduled message
                        </div>
                    )}

                    {message.file ? (
                        <FilePreview
                            kind={message.file.kind}
                            name={message.file.name}
                            size={message.file.size}
                            onMe={onMe}
                        />
                    ) : (
                        <p className={cn(isScheduled && "px-1 pb-1")}>
                            {message.content}
                        </p>
                    )}
                </div>

                <div
                    className={cn(
                        "mt-1 flex items-center gap-1 px-1 text-[10.5px] text-muted-2",
                        onMe ? "justify-end" : "justify-start"
                    )}
                >
                    {" "}
                    <span>{time}</span>
                    {onMe &&
                        !isScheduled &&
                        (message.status === "SEEN" ? (
                            <CheckCheck className="h-3 w-3 text-blue-500" />
                        ) : message.status === "DELIVERED" ? (
                            <CheckCheck className="h-3 w-3" />
                        ) : (
                            <Check className="h-3 w-3" />
                        ))}
                </div>
            </div>
        </div>
    );
}
