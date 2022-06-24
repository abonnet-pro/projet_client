import {useParams} from "react-router";
import axios from "axios";
import {API} from "../../../services/url.service";
import {headerToken} from "../../../services/http.service";
import {handleError} from "../../../services/error.service";
import {useEffect, useState} from "react";
import {toast} from "react-toastify";
import '../employe.css'

export default function EmployeProfile() {

    const params = useParams();

    const [employe, setEmploye] = useState();

    const callApi = () => {
        axios.get(`${API}/employe/${params.id}`, headerToken)
            .then(res => {
                setEmploye(res.data)
            })
            .catch(err => {
                handleError(err)
            })
    }

    const handleChangeSwitch = (event) => {
        let action = event.target.checked ? "activer" : "desactiver"

        axios.post(`${API}/client/${params.id}/${action}`, {}, headerToken)
            .then(res => {
                callApi()
                toast.success(`Client ${ action === "activer" ? 'activé' : 'désactivé'} avec succès`)
            })
            .catch(err => {
                handleError(err)
            })
    }

    useEffect(callApi, [])

    return(
        <div className="d-inline-flex">
            <div>
                <i className="bi bi-person-circle user-img text-primary"/>
                <p className="text-center text-2">{ employe?.nom } { employe?.prenom }</p>

                <div className="text-center form-switch">
                    <input className="form-check-input pointer" type="checkbox" id="promotion" onChange={ handleChangeSwitch } defaultChecked={ employe && employe.active } checked={ employe && employe.active }/>
                    <label className="form-check-label ms-2" htmlFor="flexSwitchCheckDefault">{ employe && employe.active ? "Compte activé" : "Compte desactivé"  }</label>
                </div>
            </div>

            <div className="card p-3 mt-3 w-fit employe">
                <div className="d-inline-flex">
                    <i className="bi bi-calendar logo text-primary"/>
                    <label className="text-4 align-self-center ms-2">Nom Prénom :</label>
                </div>
                <label className="mb-3 infos">{ employe?.nom } { employe?.prenom }</label>

                <div className="d-inline-flex">
                    <i className="bi bi-pin-map logo text-primary"/>
                    <label className="text-4 align-self-center ms-2">Login :</label>
                </div>
                <label className="mb-3 infos">{ employe?.login }</label>

                <div className="d-inline-flex">
                    <i className="bi bi-filter-square logo text-primary"/>
                    <label className="text-4 align-self-center ms-2">Role :</label>
                </div>
                <label className="mb-3 infos">{ employe?.role }</label>
            </div>
        </div>
    )
}
