import {contextPrototype} from "../../services/usersContext.service";
import {Link} from "react-router-dom";
import MyNavItem from "./navItem";
import {admin} from "../../services/role.service";

export default function NavBar() {
    return(
        <nav className="navbar navbar-expand-lg navbar-dark bg-primary">
            <div className="container-fluid">
                <a className="navbar-brand text-nav-1" href="/">SubMyZine</a>
                <div className="collapse navbar-collapse" id="navbarColor01">
                    <ul className="navbar-nav me-auto">
                        {
                            contextPrototype.user && !contextPrototype.user.premiereConnexion ?
                                <>
                                    <MyNavItem itemName="Publications" path="/publications"/>
                                    <MyNavItem itemName="clients" path="/clients"/>
                                    {
                                        admin() ? <MyNavItem itemName="employes" path="/employes"/> : null
                                    }
                                </>
                                : null
                        }
                    </ul>
                    {
                        contextPrototype.user ? <Link to="/logout" className="btn btn-light ms-2">Se deconnecter</Link>
                            : null
                    }
                </div>
            </div>
        </nav>
)
}
