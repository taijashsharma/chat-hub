import { cn } from "@/lib/utils";

const sizeMap = {
    sm: "h-8 w-8 text-xs",
    md: "h-10 w-10 text-sm",
    lg: "h-12 w-12 text-base",
};

export function Avatar({ initials, online = false, size = "md", className }) {
    return (
        <div className={cn("relative shrink-0", className)}>
            <div
                className={cn(
                    "flex items-center justify-center rounded-full font-medium text-foreground select-none",
                    "bg-gradient-to-br from-white to-secondary border border-border shadow-card",
                    sizeMap[size]
                )}
            >
                {initials}
            </div>

            {online && (
                <span className="absolute -bottom-0.5 -right-0.5 h-2.5 w-2.5 rounded-full bg-emerald-500 ring-2 ring-card" />
            )}
        </div>
    );
}
