import { useContext,useEffect } from "react";
import { AuthContext } from "../auth.context";
import { registerUser,loginUser,logoutUser,getme } from "../services/auth.api";

export const useAuth = () => {
        const context = useContext(AuthContext);
        const {user,setUser,loading,setLoading} = context;

        const handleRegister = async (email, password, username) => {
            setLoading(true);
            try {
                const data = await registerUser(email, password, username);
                setUser(data.user);
            } catch (error) {
                console.error(error);
            } finally {
                setLoading(false);
            }
        }
        const handleLogin = async (email, password) => {
            setLoading(true);
            try {
                const data = await loginUser(email, password);
                setUser(data.user);
                return true;
            } catch (error) {
                console.error(error);
                return false;
            } finally {
                setLoading(false);
            }
        }

         const handleLogout = async () => {
            setLoading(true);
            try {
                await logoutUser();
                setUser(null);
            } catch (error) {
                console.error(error);
            } finally {
                setLoading(false);
            }
        }


        return {user,loading,handleLogin,handleRegister,handleLogout};
}