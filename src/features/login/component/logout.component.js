import {contextPrototype} from "../../../services/usersContext.service";
import {useEffect} from "react";
import {useNavigate} from "react-router-dom";

export default function Logout({ setUser }) {

    const navigate = useNavigate();

    const logout = () => {
        localStorage.clear();
        setUser('');
        contextPrototype.user = '';
        contextPrototype.setUser = '';
        navigate('/');
    }

    useEffect(logout, []);
}
