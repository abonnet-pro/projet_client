import {useEffect, useState} from "react";
import {useLocation} from "react-router";
import {Button, Modal} from "react-bootstrap";
import axios from "axios";
import {API} from "../../../services/url.service";
import {headerToken} from "../../../services/http.service";
import {handleError} from "../../../services/error.service";
import {toast} from "react-toastify";

export default function ClientPaiement({ abonnements, refresh }) {

    let compteur = 0

    const { state } = useLocation()

    const [paiementSelected, setPaiementSelected] = useState()
    const [showModal, setShowModal] = useState(false);

    const handleCloseModal = () => setShowModal(false);
    const handleShowModal = () => setShowModal(true);

    const getClass = () => {
        compteur = compteur + 1
        if (compteur % 2 === 0) {
            return "table-light"
        }
        return "table-secondary"
    }

    const handleClickRow = (paiement) => {
        setPaiementSelected(paiement)
    }

    const getPaiement = (abonnements) => {
        if(!abonnements) return false

        for(let abonnement of abonnements) {
            if(abonnement.paiement && abonnement.paiement.id) {
                return true
            }
        }
        return false
    }

    const checkPaiementSelected = () => {
        if(state) {
            setPaiementSelected(state)
        }
    }

    const handleRemboursement = () => {

        axios.post(`${API}/paiement/${paiementSelected.id}/rembourser`, {}, headerToken)
            .then(res => {
                refresh()
                toast.success('Le paiement a été remboursé avec succès')
                handleCloseModal()
                setPaiementSelected(null)
            })
            .catch(err => {
                handleCloseModal()
                handleError(err)
            })
    }

    useEffect(checkPaiementSelected, [])

    return(
        <div>

            <Modal show={showModal} onHide={handleCloseModal}>
                <Modal.Header closeButton>
                    <Modal.Title>Remboursement</Modal.Title>
                </Modal.Header>
                <Modal.Body>Etes vous sur de vouloir rembourser le paiement ? Si l'abonnement était en cours celui-ci ne sera plus actif</Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleCloseModal}>
                        Annuler
                    </Button>
                    <Button variant="primary" onClick={handleRemboursement}>
                        Valider
                    </Button>
                </Modal.Footer>
            </Modal>

            {
                paiementSelected ?
                    <>
                        <button className="btn btn-outline-primary" onClick={ () => setPaiementSelected(null)}><i className="bi bi-arrow-left"/></button>
                        <div className="card p-3 mt-3">
                            <div className="d-inline-flex">
                                <i className="bi bi-credit-card-2-front logo text-primary"/>
                                <label className="text-4 align-self-center ms-2">Type :</label>
                            </div>
                            <label className="mb-3 infos">{ paiementSelected?.type }</label>

                            <div className="d-inline-flex">
                                <i className="bi bi-calendar-event logo text-primary"/>
                                <label className="text-4 align-self-center ms-2">Payé le :</label>
                            </div>
                            <label className="mb-3 infos">{ new Date(paiementSelected?.datepaiement).toLocaleDateString() }</label>

                            <div className="d-inline-flex">
                                <i className="bi bi-currency-euro logo text-primary"/>
                                <label className="text-4 align-self-center ms-2">Montant payé :</label>
                            </div>
                            <div className="d-flex justify-content-between">
                                <label className="mb-3 infos">{ paiementSelected?.montantpaye } €</label>
                                {
                                    paiementSelected.montantrembourse ?
                                        null
                                        :
                                        <button className="btn btn-primary" data-bs-toggle="tooltip" data-bs-placement="top" title="Rembourser le paiement" onClick={ handleShowModal }><i className="bi bi-unlock"/></button>
                                }
                            </div>

                            <div className="d-inline-flex">
                                <i className="bi bi-currency-euro logo text-primary"/>
                                <label className="text-4 align-self-center ms-2">Montant remboursé :</label>
                            </div>
                            <label className="mb-3 infos">{ paiementSelected?.montantrembourse ? paiementSelected?.montantrembourse + ' €' : 'Aucun remboursement' }</label>
                        </div>
                    </>
                    :
                    <table className="table table-bordered mt-5">
                        <thead className="bg-primary text-center">
                        <tr id="head">
                            <th className="text-4 text-white" scope="col">Type</th>
                            <th className="text-4 text-white" scope="col">Abonnement</th>
                            <th className="text-4 text-white" scope="col">Date de paiement</th>
                            <th className="text-4 text-white" scope="col">Montant payé</th>
                            <th className="text-4 text-white" scope="col">Montant remboursé</th>
                        </tr>
                        </thead>
                        <tbody>
                        {
                            getPaiement(abonnements) === false ?
                                <tr className="text-center table-secondary">
                                    <td colSpan="5">Aucun paiements</td>
                                </tr>
                                :
                                abonnements?.map(abonnement => {
                                    if(abonnement.paiement) {
                                        return (
                                            <>
                                                <tr className={"pointer text-center " + getClass()} onClick={ () => handleClickRow(abonnement.paiement) }>
                                                    <td className="text-5">{abonnement?.paiement?.type}</td>
                                                    <td className="text-5">{abonnement?.publication.titre}</td>
                                                    <td className="text-5">{abonnement?.paiement?.datepaiement ? new Date(abonnement?.paiement?.datepaiement).toLocaleDateString() : '-'}</td>
                                                    <td className="text-5">{abonnement?.paiement?.montantpaye} €</td>
                                                    <td className="text-5">{abonnement?.paiement?.montantrembourse ? abonnement?.paiement?.montantrembourse + ' €' : '-'}</td>
                                                </tr>
                                            </>
                                        )
                                    }
                                    return(<></>)
                                })
                        }
                        </tbody>
                    </table>
            }
        </div>
    )
}
