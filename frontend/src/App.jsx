import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";
import { FloatingLayout } from "./components/layout/FloatingLayout";

export default function App() {
    return (
        <Routes>
            {/* DEFAULT → LOGIN */}
            <Route path="/" element={<Navigate to="/login" />} />

            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />

            {/* PROTECTED CHAT */}
            <Route path="/chat" element={<FloatingLayout />} />
        </Routes>
    );
}
