import {useState} from "react";
import axios from "axios";
import {API} from "../../../services/url.service";
import {setLocaleStorage, USER_KEY} from "../../../services/localStorage.service";
import {contextPrototype} from "../../../services/usersContext.service";
import {handleError} from "../../../services/error.service";
import {headerToken} from "../../../services/http.service";
import {toast} from "react-toastify";
import {useNavigate} from "react-router";

export default function LoginPassword() {

    const navigate = useNavigate()

    const [password, setPassword] = useState()
    const [confirm, setConirm] = useState()

    const handleChange = (event) => {
        setPassword(event.target.value)
    }

    const handleChangeConfirm = (event) => {
        setConirm(event.target.value)
    }

    const handleSubmit = (event) => {
        event.preventDefault()

        if(password !== confirm) {
            toast.error("Les mots de passe ne sont pas identiques");
            return
        }

        axios.post(`${API}/employe/${contextPrototype.user.id}/init`, { password : password }, headerToken)
            .then((result) => {
                localStorage.clear();
                setLocaleStorage(USER_KEY, result.data)
                contextPrototype.setUser(result.data);
                toast.success("Mot de passe modifié")
                navigate('/');
            })
            .catch(error => handleError(error));
    }

    return(
        <>
            <div className="form-body m-auto mt-5">
                <h2 className="text-1 text-center mb-4">Première connexion : </h2>
                <div className="form">
                    <form onSubmit={ handleSubmit }>
                        <div className="form-group">
                            <div className="text-2 mb-2">
                                <label htmlFor="titre">Nouveau mot de passe :</label>
                            </div>
                            <input name="password" type="password" className="form-control" id="password" placeholder="Entrer le mot de passe" value={ password } onChange={ handleChange } required/>
                        </div>

                        <div className="form-group">
                            <div className="text-2 mb-2">
                                <label htmlFor="confirm">Confirmation du mot de passe :</label>
                            </div>
                            <input name="confirm" type="password" className="form-control" id="confirm" placeholder="Confirmer le mot de passe" value={ confirm } onChange={ handleChangeConfirm } required/>
                        </div>

                        <button type="submit" className="mt-4 btn btn-primary w-100">Valider</button>
                    </form>
                </div>
            </div>
        </>
    )
}
