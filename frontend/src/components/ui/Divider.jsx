import { cn } from "@/lib/utils";

export function Divider({ className, vertical }) {
    return (
        <div
            className={cn(
                "bg-divider",

                vertical ? "w-px h-full" : "h-px w-full",

                className
            )}
        />
    );
}
