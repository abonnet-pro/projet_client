import {useEffect} from "react";
import {contextPrototype} from "../../services/usersContext.service";
import {useNavigate} from "react-router";

export default function Home() {

    const navigate = useNavigate();

    const checkAuth = () => {
        if(!contextPrototype.user) {
            navigate('/login')
        }
    }

    useEffect(checkAuth, []);

    return(
        <>HOME</>
    )
}
