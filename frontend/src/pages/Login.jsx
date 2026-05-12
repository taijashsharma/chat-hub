import { useState } from "react";
import { loginUser } from "../api/authApi";
import { useNavigate, Link } from "react-router-dom";

export default function Login() {
    const navigate = useNavigate();
    const [form, setForm] = useState({ phoneNumber: "", password: "" });
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        const { name, value } = e.target;

        if (name === "phoneNumber") {
            // Sirf digits (0-9) allow karega aur max 10 characters
            const onlyNums = value.replace(/[^0-9]/g, "");
            if (onlyNums.length <= 10) {
                setForm({ ...form, [name]: onlyNums });
            }
        } else {
            setForm({ ...form, [name]: value });
        }

        // Typing ke waqt error clear karna
        if (error) setError("");
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Login se pehle basic length check
        if (form.phoneNumber.length !== 10) {
            setError("Please enter a valid 10-digit phone number.");
            return;
        }

        try {
            setLoading(true);
            const data = await loginUser(form);
            if (!data?.token) throw new Error("Token not found");

            localStorage.setItem("token", data.token);
            localStorage.setItem("user", JSON.stringify(data));
            navigate("/chat");
        } catch (err) {
            setError(
                err.response?.data?.message ||
                    "Invalid credentials. Please try again."
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center p-4 animate-fade-in relative overflow-hidden">
            {/* Background Glows (UI matching for consistency) */}
            <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary/5 rounded-full blur-[120px]" />
            <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-primary/10 rounded-full blur-[120px]" />

            <div className="bg-card/80 shadow-floating border border-border rounded-3xl p-8 w-full max-w-md backdrop-blur-xl animate-scale-in relative z-10">
                <div className="text-center mb-8">
                    <h2 className="text-3xl font-extrabold tracking-tight text-foreground">
                        Chat Login
                    </h2>
                    <p className="text-muted-foreground text-sm mt-2">
                        Welcome back! Please enter your details.
                    </p>
                </div>

                {error && (
                    <div className="bg-red-500/10 text-red-500 text-xs font-semibold p-3 rounded-xl mb-4 border border-red-500/20 animate-slide-in-left flex items-center gap-2">
                        <span className="w-1 h-1 bg-red-500 rounded-full animate-pulse" />
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-5">
                    <div className="space-y-1 group">
                        <label className="text-[11px] font-bold text-muted-foreground uppercase tracking-widest ml-1 group-focus-within:text-primary transition-colors">
                            Phone Number
                        </label>
                        <input
                            type="text"
                            inputMode="numeric"
                            name="phoneNumber"
                            value={form.phoneNumber} // State se bind kiya taaki alphabets block ho sakein
                            placeholder="e.g. 1234567890"
                            className="w-full bg-background/50 border border-input p-3 rounded-xl focus:ring-4 focus:ring-primary/10 focus:border-primary outline-none transition-all placeholder:text-muted-foreground/30 font-medium"
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <div className="space-y-1 group">
                        <label className="text-[11px] font-bold text-muted-foreground uppercase tracking-widest ml-1 group-focus-within:text-primary transition-colors">
                            Password
                        </label>
                        <input
                            type="password"
                            name="password"
                            value={form.password}
                            placeholder="••••••••"
                            className="w-full bg-background/50 border border-input p-3 rounded-xl focus:ring-4 focus:ring-primary/10 focus:border-primary outline-none transition-all font-medium"
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <button
                        disabled={loading}
                        className="w-full bg-primary text-primary-foreground p-4 rounded-xl font-bold text-sm tracking-wide mt-2 hover:opacity-95 active:scale-[0.98] disabled:opacity-50 shadow-lg shadow-primary/20 transition-all"
                    >
                        {loading ? (
                            <span className="flex items-center justify-center gap-2">
                                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                                Authenticating...
                            </span>
                        ) : (
                            "Sign In"
                        )}
                    </button>
                </form>

                <div className="text-center mt-8 pt-6 border-t border-divider">
                    <p className="text-muted-foreground text-sm font-medium">
                        Don't have an account?
                        <Link
                            to="/register"
                            className="text-primary ml-2 font-bold hover:underline underline-offset-4"
                        >
                            Create Account
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
}
