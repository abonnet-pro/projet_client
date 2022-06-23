import axios from "axios";
import {API} from "../../../services/url.service";
import {headerToken} from "../../../services/http.service";
import {toast} from "react-toastify";
import {handleError} from "../../../services/error.service";
import {useState} from "react";

export default function ClientProfile({ client }) {

    const [loadingMail, setLoadingMail] = useState(false)

    const abonnementEnCours = (client) => {
        if(!client) return false

        for(let abonnement of client.abonnements) {
            if(abonnement.actif) {
                return true
            }
        }
        return false
    }

    const handleClickRelanceAucunAbonnement = () => {
        setLoadingMail(true)

        axios.post(`${API}/client/${client.id}/mail_aucun_abonnement`, {}, headerToken)
            .then(res => {
                setLoadingMail(false)
                toast.success(`Email envoyé avec succès`)
            })
            .catch(err => {
                setLoadingMail(false)
                handleError(err)
            })
    }

    return(
        <div className="card p-3 mt-3">
            <div className="row">
                <div className="col-6">
                    <div className="d-inline-flex">
                        <i className="bi bi-person-badge logo text-primary"/>
                        <label className="text-4 align-self-center ms-2">Nom Prénom :</label>
                    </div>
                    <label className="mb-3 infos d-block">{ client?.nom } { client?.prenom }</label>
                </div>

                <div className="col-6">
                    <div className="d-inline-flex">
                        <i className="bi bi-telephone logo text-primary"/>
                        <label className="text-4 align-self-center ms-2">Téléphone :</label>
                    </div>
                    <label className="mb-3 infos d-block">{ client?.telephone.replace(/(\d{2})(\d{2})(\d{2})(\d{2})(\d{2})/, "$1-$2-$3-$4-$5") }</label>
                </div>
            </div>


            <div className="row">
                <div className="col-6">
                    <div className="d-inline-flex">
                        <i className="bi bi-display logo text-primary"/>
                        <label className="text-4 align-self-center ms-2">Nom d'utilisateur :</label>
                    </div>
                    <label className="mb-3 infos d-block">{ client?.displayname }</label>
                </div>

                <div className="col-6">
                    <div className="d-inline-flex">
                        <i className="bi bi-clipboard logo text-primary"/>
                        <label className="text-4 align-self-center ms-2">Abonnement en cours :</label>
                    </div>
                    <div className="d-flex justify-content-between">
                        <label className="infos d-block">{ abonnementEnCours(client) ? 'Oui' : 'Non' }</label>
                        {
                            abonnementEnCours(client) ?
                                null :
                                <button className={"btn btn-primary " + (loadingMail ? 'disabled' : '')} data-bs-toggle="tooltip" data-bs-placement="top" title="Envoyer mail relance" onClick={() => handleClickRelanceAucunAbonnement()}>
                                    {
                                        loadingMail ? <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"/> : <i className="bi bi-envelope-exclamation"/>
                                    }
                                </button>
                        }
                    </div>
                </div>
            </div>

            <div className="row">
                <div className="col-6">
                    <div className="d-inline-flex">
                        <i className="bi bi-envelope logo text-primary"/>
                        <label className="text-4 align-self-center ms-2">Login :</label>
                    </div>
                    <label className="mb-3 infos d-block">{ client?.login }</label>
                </div>

                <div className="col-6">
                    <div className="d-inline-flex">
                        <i className="bi bi-calendar logo text-primary"/>
                        <label className="text-4 align-self-center ms-2">Inscrit depuit :</label>
                    </div>
                    <label className="mb-3 infos d-block">{ new Date(client?.datecreation).toLocaleDateString() }</label>
                </div>
            </div>

            <div className="d-inline-flex">
                <i className="bi bi-calendar logo text-primary"/>
                <label className="text-4 align-self-center ms-2">Date de naissance :</label>
            </div>
            <label className="mb-3 infos">{ new Date(client?.datenaissance).toLocaleDateString() }</label>

            <div className="d-inline-flex">
                <i className="bi bi-pin-map logo text-primary"/>
                <label className="text-4 align-self-center ms-2">Lieu de naissance :</label>
            </div>
            <label className="mb-3 infos">{ client?.lieunaissance }</label>

            <div className="d-inline-flex">
                <i className="bi bi-filter-square logo text-primary"/>
                <label className="text-4 align-self-center ms-2">Adresse :</label>
            </div>
            <label className="infos">{ client?.cp } { client?.ville }</label>
            <label className="mb-3 infos">{ client?.rue }</label>
        </div>
    )
}
