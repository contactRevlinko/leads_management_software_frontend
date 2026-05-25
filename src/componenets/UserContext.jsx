import { createContext, useContext, useState } from "react";


export const UserContext = createContext();

export const UserProvider = ({ children }) => {
    const [user, setUser] = useState(() => {
        try {
            const stored = localStorage.getItem("user");
            return stored ? JSON.parse(stored) : null;
        } catch (err) {
            localStorage.removeItem("user");
            return null;
        }
    });

    const handleSetUser = (userData) => {
        if (userData) {
            localStorage.setItem("user", JSON.stringify(userData));
        } else {
            localStorage.removeItem("user");
        }
        setUser(userData);
    };

    return (
        <UserContext.Provider value={{ user, setUser: handleSetUser }}>
            {children}
        </UserContext.Provider>
    );
};


export const useUser = () => useContext(UserContext);