import axios from "axios";
import {handleError} from "../../../services/error.service";
import {setLocaleStorage, USER_KEY} from "../../../services/localStorage.service";
import {contextPrototype} from "../../../services/usersContext.service";

export function connect(user, navigate) {

    axios.post(`http://localhost:3332/api/employe/authenticate`, user)
        .then((result) => {
            localStorage.clear();
            setLocaleStorage(USER_KEY, result.data)
            contextPrototype.setUser(result.data);
            navigate('/');
        })
        .catch(error => handleError(error));
}
