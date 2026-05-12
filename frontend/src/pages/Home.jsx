import { useState } from "react";

import Register from "./Register";

// import Chat from "./Chat";

import Login from "./Login";
import { FloatingLayout } from "../components/layout/FloatingLayout";

const Home = () => {
    const [page, setPage] = useState("login");

    if (page === "register") {
        return <Register setPage={setPage} />;
    }

    const token = localStorage.getItem("token");

    if (!token) {
        return <Login />;
    }

    return (
        <main className="min-h-screen w-full">
            <h1 className="sr-only">
                ChatHub — premium AI-powered chat application
            </h1>
            <FloatingLayout />
        </main>
    );
};

export default Home;
