import axios from "axios";
import {handleError} from "../../../services/error.service";
import {setLocaleStorage, USER_KEY} from "../../../services/localStorage.service";
import {contextPrototype} from "../../../services/usersContext.service";
import {API} from "../../../services/url.service";

export function connect(user, navigate) {

    axios.post(`${API}/employe/authenticate`, user)
        .then((result) => {
            localStorage.clear();
            setLocaleStorage(USER_KEY, result.data)
            // setLocaleStorage("token", result.data.token)
            contextPrototype.setUser(result.data);
            if(result.data.premiereConnexion) {
                navigate('/login/password');
            } else {
                navigate('/');
            }
        })
        .catch(error => handleError(error));
}
