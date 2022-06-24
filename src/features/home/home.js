import {useEffect} from "react";
import {contextPrototype} from "../../services/usersContext.service";
import {useNavigate} from "react-router";
import './home.css'
import {Link} from "react-router-dom";
import {superadmin} from "../../services/role.service";

export default function Home() {

    const navigate = useNavigate();

    const checkAuth = () => {
        if(!contextPrototype.user) {
            navigate('/login')
        }
    }

    useEffect(checkAuth, []);

    return(
        <div className="row justify-content-center">
            <Link to='/publications' className="w-fit home-card pointer text-decoration-none">
                <i className="bi bi-postcard text-primary"/>
                <p className="text-center text-1 text-primary">Publications</p>
            </Link>

            <Link to='/clients' className="w-fit home-card pointer text-decoration-none">
                <i className="bi bi-people text-primary"/>
                <p className="text-center text-1 text-primary">Clients</p>
            </Link>

            {
                superadmin() ?
                    <Link to='/employes' className="w-fit home-card pointer text-decoration-none">
                        <i className="bi bi-person-workspace text-primary"/>
                        <p className="text-center text-1 text-primary">Employés</p>
                    </Link> : null
            }
        </div>
    )
}
