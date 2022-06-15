import {contextPrototype} from "../../services/usersContext.service";
import {Link} from "react-router-dom";

export default function NavBar() {
    return(


        <nav className="navbar navbar-expand-lg navbar-dark bg-primary">
            <div className="container-fluid">
                <a className="navbar-brand" href="/">SubMyZine</a>
                <div className="collapse navbar-collapse" id="navbarColor01">
                    <ul className="navbar-nav me-auto">
                        <li className="nav-item">
                            <a className="nav-link active" href="/">Home
                                <span className="visually-hidden">(current)</span>
                            </a>
                        </li>
                    </ul>
                    {
                        contextPrototype.user ? <Link to="/logout" className="btn btn-danger ms-2">Se deconnecter</Link>
                            : null
                    }
                </div>
            </div>
        </nav>
)
}
