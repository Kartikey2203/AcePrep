import { createContext,useState,useEffect } from "react";
import {getme} from "./services/auth.api";
export const AuthContext = createContext();

export const AuthProvider = ({children}) => {
    const [user,setUser] = useState(null);
    const [loading,setLoading] = useState(true);

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const res = await getme();
                console.log("Auth fetch result:", res);
                if (res && res.user) {
                    setUser(res.user);
                } else if (res && res.data) {
                    setUser(res.data);
                } else if (res) {
                    setUser(res);
                } else {
                    setUser(null);
                }
            } catch (error) {
                console.error("Failed to fetch user:", error);
                setUser(null);
            } finally {
                setLoading(false);
            }
        }
        fetchUser();
    }, []);

    return (
        <AuthContext.Provider value={{user,setUser,loading,setLoading}}>
            {children}
        </AuthContext.Provider>
    )
}