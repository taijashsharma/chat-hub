import { createContext, useState, useEffect } from "react";

import { getCurrentUser } from "../api/userApi";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);

    useEffect(() => {
        const token = localStorage.getItem("token");

        if (token) {
            getCurrentUser().then((res) => setUser(res.data));
        }
    }, []);

    return (
        <AuthContext.Provider
            value={{
                user,

                setUser,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
};
