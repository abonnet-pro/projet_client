import {toast} from "react-toastify";

export const handleError = (error) => {
    if(error.response.status === 401) {
        toast.error("Accès non autorisé");
    } else if (error.response.status === 400)  {
        toast.error(error.response.data);
    } else {
        toast.error("Erreur inconnue");
    }
}
