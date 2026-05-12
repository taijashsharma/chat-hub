import { Sparkles } from "lucide-react";

export function AISuggestions({ suggestions, onPick }) {
    if (!suggestions) return null;

    const list = Array.isArray(suggestions)
        ? suggestions
        : Object.values(suggestions || {});

    return (
        <div className="flex items-center gap-2 px-1">
            <div className="flex shrink-0 items-center gap-1.5 text-[11px] font-medium text-muted-foreground">
                <Sparkles className="h-3.5 w-3.5 text-foreground" />
                <span className="hidden sm:inline">Smart Assist</span>
            </div>

            <div className="flex flex-1 items-center gap-2 overflow-x-auto pb-1">
                {list.map((s, i) => (
                    <button
                        key={i}
                        onClick={() => onPick(s)}
                        className="rounded-full border px-3 py-1 text-xs"
                    >
                        {s}
                    </button>
                ))}
            </div>
        </div>
    );
}
