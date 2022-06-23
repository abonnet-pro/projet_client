import {useEffect, useState} from "react";
import {Link} from "react-router-dom";
import axios from "axios";
import {API} from "../../../services/url.service";
import {headerToken} from "../../../services/http.service";
import {toast} from "react-toastify";
import {handleError} from "../../../services/error.service";
import {useLocation} from "react-router";

export default function ClientAbonnements({ abonnements }) {

    let compteur = 0

    const [abonnementSelected, setAbonnementSelected] = useState()
    const [loadingMail, setLoadingMail] = useState(false)

    const { state } = useLocation()

    const getClass = () => {
        compteur = compteur + 1
        if (compteur % 2 === 0) {
            return "table-light"
        }
        return "table-secondary"
    }

    const handleClickRow = (abonnement) => {
        setAbonnementSelected(abonnement)
    }

    const handleClickRelanceMail = () => {
        setLoadingMail(true)

        axios.post(`${API}/abonnement/${abonnementSelected.id}/relancer/mail`, {}, headerToken)
            .then(res => {
                setLoadingMail(false)
                toast.success(`Email envoyé avec succès`)
            })
            .catch(err => {
                setLoadingMail(false)
                handleError(err)
            })
    }

    const checkAbonnementSelected = () => {
        if(state) {
            setAbonnementSelected(state)
        }
    }

    useEffect(checkAbonnementSelected, [])

    return(
        <div>
            {
                abonnementSelected ?
                    <>
                        <button className="btn btn-outline-primary" onClick={ () => setAbonnementSelected(null)}><i className="bi bi-arrow-left"/></button>
                        <div className="card p-3 mt-3">
                            <div className="d-inline-flex">
                                <i className="bi bi-terminal logo text-primary"/>
                                <label className="text-4 align-self-center ms-2">Etat :</label>
                            </div>
                            <label className="mb-3 infos">{ abonnementSelected?.actif ? 'En cours' : 'Arrêté' }</label>

                            <div className="d-inline-flex">
                                <i className="bi bi-credit-card logo text-primary"/>
                                <label className="text-4 align-self-center ms-2">Paiement :</label>
                            </div>
                            <div className="d-flex justify-content-between">
                                <label className="mb-3 infos">{ abonnementSelected?.paye ? 'Payé' : 'Non payé' }</label>
                                {
                                    abonnementSelected.paye ?
                                        <Link to={ `/client/${abonnementSelected.clientid}/paiements` } state={ abonnementSelected.paiement } className="btn btn-primary" data-bs-toggle="tooltip" data-bs-placement="top" title="Voir le paiement">
                                            <i className="bi bi-box-arrow-right"/>
                                        </Link>
                                        :
                                        <button className={"btn btn-primary " + (loadingMail ? 'disabled' : '')} data-bs-toggle="tooltip" data-bs-placement="top" title="Envoyer un mail de relance" onClick={ handleClickRelanceMail }>
                                            {
                                                loadingMail ? <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"/> : <i className="bi bi-envelope-exclamation"/>
                                            }
                                        </button>
                                }
                            </div>

                            <div className="d-inline-flex">
                                <i className="bi bi-calendar-event logo text-primary"/>
                                <label className="text-4 align-self-center ms-2">Date de début :</label>
                            </div>
                            <label className="mb-3 infos">{ new Date(abonnementSelected?.datedebut).toLocaleDateString() }</label>

                            <div className="d-inline-flex">
                                <i className="bi bi-calendar-event logo text-primary"/>
                                <label className="text-4 align-self-center ms-2">Date de fin :</label>
                            </div>
                            <label className="mb-3 infos">{ new Date(abonnementSelected?.datefin).toLocaleDateString() }</label>

                            <div className="d-inline-flex">
                                <i className="bi bi-calendar-event logo text-primary"/>
                                <label className="text-4 align-self-center ms-2">Date de résiliation :</label>
                            </div>
                            <label className="mb-3 infos">{ abonnementSelected?.dateresiliation ? new Date(abonnementSelected?.dateresiliation).toLocaleDateString() : 'Pas de résiliation' }</label>

                            <div className="d-inline-flex">
                                <i className="bi bi-postcard logo text-primary"/>
                                <label className="text-4 align-self-center ms-2">Publication :</label>
                            </div>
                            <Link to={ `/publication/${abonnementSelected?.publication.id}` } className="mb-3 infos w-fit text-decoration-none text-black">{ abonnementSelected?.publication.titre }</Link>
                        </div>
                    </>
                    :
                    <>
                        <table className="table table-bordered mt-5">
                            <thead className="bg-primary text-center">
                            <tr id="head">
                                <th className="text-4 text-white" scope="col">En cours</th>
                                <th className="text-4 text-white" scope="col">Publication</th>
                                <th className="text-4 text-white" scope="col">Payé</th>
                                <th className="text-4 text-white" scope="col">Résilié</th>
                                <th className="text-4 text-white" scope="col">Remboursé</th>
                            </tr>
                            </thead>
                            <tbody>
                            {
                                abonnements?.length === 0 ?
                                    <tr className="text-center table-secondary">
                                        <td colSpan="5">Aucun abonnements</td>
                                    </tr>
                                    :
                                    abonnements?.map(abonnement => {
                                        return (
                                            <>
                                                <tr className={"pointer text-center " + getClass()} onClick={ () => handleClickRow(abonnement) }>
                                                    <th scope="row">{abonnement.actif ?
                                                        <i className="bi bi-check-circle-fill green"/> :
                                                        <i className="bi bi-x-circle-fill red"/>}</th>
                                                    <td className="text-5">{abonnement?.publication.titre}</td>
                                                    <th scope="row">{abonnement.paye ?
                                                        <i className="bi bi-check-circle-fill green"/> :
                                                        <i className="bi bi-x-circle-fill red"/>}</th>
                                                    <th scope="row">{abonnement.dateresiliation ?
                                                        <i className="bi bi-check-circle-fill green"/> :
                                                        <i className="bi bi-x-circle-fill red"/>}</th>
                                                    <th scope="row">{abonnement.rembourse ?
                                                        <i className="bi bi-check-circle-fill green"/> :
                                                        <i className="bi bi-x-circle-fill red"/>}</th>
                                                </tr>
                                            </>
                                        )
                                    })
                            }
                            </tbody>
                        </table>
                    </>
            }
        </div>
    )
}
