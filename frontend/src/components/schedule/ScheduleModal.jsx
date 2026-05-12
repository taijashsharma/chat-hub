import { X, Calendar, Clock } from "lucide-react";
import { useState } from "react";

export function ScheduleModal({ open, preview, onClose, onConfirm }) {
    const [date, setDate] = useState("");
    const [time, setTime] = useState("");

    if (!open) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div
                className="absolute inset-0 bg-foreground/20 backdrop-blur-sm animate-[fade-in_0.2s_ease-out]"
                onClick={onClose}
            />

            <div className="relative w-full max-w-md animate-[scale-in_0.22s_cubic-bezier(0.22,1,0.36,1)] overflow-hidden rounded-2xl border border-border bg-card shadow-floating">
                {/* header */}

                <div className="flex items-center justify-between border-b border-divider px-5 py-4">
                    <div>
                        <h3 className="text-[15px] font-semibold tracking-tight text-foreground">
                            Schedule message
                        </h3>

                        <p className="text-[11.5px] text-muted-foreground">
                            Send this message at a later time
                        </p>
                    </div>

                    <button
                        onClick={onClose}
                        className="flex h-7 w-7 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-hover-bg hover:text-foreground"
                    >
                        <X className="h-4 w-4" />
                    </button>
                </div>

                {/* body */}

                <div className="space-y-4 p-5">
                    {/* preview */}

                    <div>
                        <label className="mb-1.5 block text-[11px] font-medium uppercase tracking-wider text-muted-foreground">
                            Message preview
                        </label>

                        <div className="rounded-xl border border-dashed border-border bg-secondary px-3.5 py-2.5 text-[13px] text-foreground">
                            {preview || (
                                <span className="text-muted-2">
                                    Empty message
                                </span>
                            )}
                        </div>
                    </div>

                    {/* date time */}

                    <div className="grid grid-cols-2 gap-3">
                        <div>
                            <label className="mb-1.5 block text-[11px] font-medium uppercase tracking-wider text-muted-foreground">
                                Date
                            </label>

                            <div className="flex items-center gap-2 rounded-xl border border-border bg-card px-3 py-2 transition-colors focus-within:border-foreground/30">
                                <Calendar className="h-3.5 w-3.5 text-muted-2" />

                                <input
                                    type="date"
                                    value={date}
                                    onChange={(e) => setDate(e.target.value)}
                                    className="w-full bg-transparent text-[13px] text-foreground focus:outline-none"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="mb-1.5 block text-[11px] font-medium uppercase tracking-wider text-muted-foreground">
                                Time
                            </label>

                            <div className="flex items-center gap-2 rounded-xl border border-border bg-card px-3 py-2 transition-colors focus-within:border-foreground/30">
                                <Clock className="h-3.5 w-3.5 text-muted-2" />

                                <input
                                    type="time"
                                    value={time}
                                    onChange={(e) => setTime(e.target.value)}
                                    className="w-full bg-transparent text-[13px] text-foreground focus:outline-none"
                                />
                            </div>
                        </div>
                    </div>
                </div>

                {/* footer */}

                <div className="flex items-center justify-end gap-2 border-t border-divider bg-secondary/50 px-5 py-3">
                    <button
                        onClick={onClose}
                        className="rounded-lg border border-border bg-card px-3.5 py-1.5 text-[12.5px] font-medium text-foreground transition-colors hover:bg-hover-bg"
                    >
                        Cancel
                    </button>

                    <button
                        onClick={() => onConfirm(date, time)}
                        disabled={!date || !time || !preview}
                        className="rounded-lg bg-foreground px-3.5 py-1.5 text-[12.5px] font-medium text-background shadow-card transition-colors hover:bg-foreground/90 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                        Schedule
                    </button>
                </div>
            </div>
        </div>
    );
}
