import { useAuth } from "../hooks/useAuth";
import { Navigate } from "react-router";

const Protected = ({children}) => {
    const {user,loading} = useAuth();
    console.log("Protected component - loading:", loading, "user:", user);
    
    if(loading){
        return (<main><h1>Loading.......</h1></main>);
    }
    if(!user){
        console.log("No user - redirecting to login");
        return <Navigate to="/login" />;
    }
    return children;
}

export default Protected;