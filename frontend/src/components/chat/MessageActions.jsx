import { Copy, Sparkles, Clock, Trash2, Pencil } from "lucide-react";

export function MessageActions({ onMe, message, onDelete, onEdit }) {
    return (
        <div
            className={`pointer-events-none absolute -top-3 ${
                onMe ? "right-2" : "left-2"
            } flex items-center gap-0.5 rounded-lg border bg-card p-0.5 opacity-0 shadow-card transition-opacity group-hover:pointer-events-auto group-hover:opacity-100`}
        >
            {/* COPY */}
            <button
                onClick={() => navigator.clipboard.writeText(message.content)}
                title="Copy"
                className="h-6 w-6 flex items-center justify-center hover:bg-gray-200 rounded-sm"
            >
                <Copy className="h-3 w-3" />
            </button>

            {/* EDIT */}
            {onMe && (
                <button
                    onClick={() => onEdit(message)}
                    title="Edit"
                    className="h-6 w-6 flex items-center justify-center hover:bg-gray-200 rounded-sm"
                >
                    <Pencil className="h-3 w-3" />
                </button>
            )}

            {/* DELETE */}
            {onMe && (
                <button
                    onClick={() => onDelete(message.id)}
                    title="Delete"
                    className="h-6 w-6 flex items-center justify-center hover:bg-red-200 rounded-sm"
                >
                    <Trash2 className="h-3 w-3" />
                </button>
            )}
        </div>
    );
}
