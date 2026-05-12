export const getAISuggestions = async ({ message, draft, tone }) => {
    try {
        const res = await fetch("http://127.0.0.1:8000/suggest", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                message,
                draft,
                tone,
            }),
        });

        return await res.json();
    } catch (err) {
        console.log("AI error:", err);
        return null;
    }
};