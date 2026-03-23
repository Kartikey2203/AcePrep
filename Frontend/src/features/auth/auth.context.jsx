import { createContext,useState,useEffect } from "react";
import {getme} from "./services/auth.api";
export const AuthContext = createContext();

export const AuthProvider = ({children}) => {
    const [user,setUser] = useState(null);
    const [loading,setLoading] = useState(true);

    useEffect(() => {
        const fetchUser = async () => {
            const res = await getme();
            if (res && res.user) {
                setUser(res.user);
            } else if (res && res.data) {
                setUser(res.data);
            } else if (res) {
                setUser(res);
            } else {
                setUser(null);
            }
            setLoading(false);
        }
        fetchUser();
    }, []);

    return (
        <AuthContext.Provider value={{user,setUser,loading,setLoading}}>
            {children}
        </AuthContext.Provider>
    )
}