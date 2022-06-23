import '../client.css'
import {Route, Routes, useLocation, useParams} from "react-router";
import {useEffect, useState} from "react";
import axios from "axios";
import {API} from "../../../services/url.service";
import {handleError} from "../../../services/error.service";
import {headerToken} from "../../../services/http.service";
import ClientProfile from "./client-profile.component";
import ClientAbonnements from "./client-abonnements.component";
import ClientPaiement from "./client-paiement.component";
import {Link} from "react-router-dom";
import {toast} from "react-toastify";
import ClientCommunications from "./client-communications.component";

export default function Client() {

    const params = useParams();
    const location = useLocation();
    const { pathname } = location;
    const splitLocation = pathname.split("/");

    const  [client, setClient] = useState();

    const callApi = () => {
        axios.get(`${API}/client/${params.id}`, headerToken)
            .then(res => {
                setClient(res.data)
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
                <p className="text-center text-2">{ client?.nom } { client?.prenom }</p>

                <div className="text-center form-switch">
                    <input className="form-check-input pointer" type="checkbox" id="promotion" onChange={ handleChangeSwitch } defaultChecked={ client && client.active } checked={ client && client.active }/>
                    <label className="form-check-label ms-2" htmlFor="flexSwitchCheckDefault">{ client && client.active ? "Compte activé" : "Compte desactivé"  }</label>
                </div>
            </div>

            <div>
                <ul className="nav nav-pills ms-5 mt-2">
                    <li className="nav-item m-2">
                        <Link to={`/client/${client?.id}/profile`} className={"nav-link " + (splitLocation[3] === 'profile' ? 'active' : '')}>Profile</Link>
                    </li>
                    <li className="nav-item m-2">
                        <Link to={`/client/${client?.id}/abonnements`} className={"nav-link " + (splitLocation[3] === 'abonnements' ? 'active' : '')}>Abonnements</Link>
                    </li>
                    <li className="nav-item m-2">
                        <Link to={`/client/${client?.id}/paiements`} className={"nav-link " + (splitLocation[3] === 'paiements' ? 'active' : '')}>Paiements</Link>
                    </li>
                    <li className="nav-item m-2">
                        <Link to={`/client/${client?.id}/communications`} className={"nav-link " + (splitLocation[3] === 'communications' ? 'active' : '')}>Communications</Link>
                    </li>
                </ul>
                <div id="myTabContent" className="tab-content ms-5">
                    <Routes>
                        <Route path="profile" element={ <ClientProfile client={ client }/> }/>
                        <Route path="abonnements" element={ <ClientAbonnements abonnements={ client?.abonnements }/> }/>
                        <Route path="paiements" element={ <ClientPaiement abonnements={ client?.abonnements } refresh={ callApi }/> }/>
                        <Route path="communications" element={ <ClientCommunications communications={ client?.communications } abonnements={ client?.abonnements }/> }/>
                    </Routes>
                </div>
            </div>
        </div>
    )
}
