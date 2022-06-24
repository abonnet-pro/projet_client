import {useNavigate, useParams} from "react-router";
import axios from "axios";
import {API} from "../../../services/url.service";
import {headerToken} from "../../../services/http.service";
import {handleError} from "../../../services/error.service";
import {useEffect, useState} from "react";
import {toast} from "react-toastify";
import '../employe.css'
import {Link} from "react-router-dom";
import {Button, Modal} from "react-bootstrap";
import {superadmin} from "../../../services/role.service";

export default function EmployeProfile() {

    const params = useParams();
    const navigate = useNavigate()

    const [employe, setEmploye] = useState();
    const [showModalReset, setShowModalReset] = useState(false);
    const [showModalDelete, setShowModalDelete] = useState(false);
    const [passwordProvisoire, setPasswordProvisoire] = useState()

    const handleCloseModalReset = () => setShowModalReset(false);

    const handleShowModalDelete = () => setShowModalDelete(true);
    const handleCloseModalDelete = () => setShowModalDelete(false);

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

        axios.post(`${API}/employe/${params.id}/${action}`, {}, headerToken)
            .then(res => {
                callApi()
                toast.success(`Employe ${ action === "activer" ? 'activé' : 'désactivé'} avec succès`)
            })
            .catch(err => {
                handleError(err)
            })
    }

    const handleClickReset = () => {
        axios.post(`${API}/employe/${params.id}/reset`, {}, headerToken)
            .then(res => {
                setShowModalReset(true);
                setPasswordProvisoire(res.data.password)
            })
            .catch(err => {
                handleError(err)
            })
    }

    const handleClickDelete = () => {
        axios.delete(`${API}/employe/${params.id}`, headerToken)
            .then(_ => {
                setShowModalDelete(false);
                toast.success("Employé supprimé avec succès")
                navigate('/employes')
            })
            .catch(err => {
                handleError(err)
            })
    }

    useEffect(callApi, [])

    return(
        <>
            <Modal show={showModalReset} onHide={handleCloseModalReset}>
                <Modal.Header closeButton>
                    <Modal.Title>Inscription</Modal.Title>
                </Modal.Header>
                <Modal.Body>Mot de passe provisoire : { passwordProvisoire }</Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleCloseModalReset}>
                        Ok
                    </Button>
                </Modal.Footer>
            </Modal>

            <Modal show={showModalDelete} onHide={handleCloseModalDelete}>
                <Modal.Header closeButton>
                    <Modal.Title>Suppression</Modal.Title>
                </Modal.Header>
                <Modal.Body>Etes vous sûr de vouloir supprimer l'employé :</Modal.Body>
                <Modal.Body>{ employe?.nom } { employe?.prenom }</Modal.Body>
                <Modal.Footer>
                    <Button variant="primary" onClick={handleClickDelete}>
                        Valider
                    </Button>
                    <Button variant="secondary" onClick={handleCloseModalDelete}>
                        Annuler
                    </Button>
                </Modal.Footer>
            </Modal>

            <div className="d-inline-flex">
                <div>
                    <i className="bi bi-person-circle user-img text-primary"/>
                    <p className="text-center text-2">{ employe?.nom } { employe?.prenom }</p>

                    {
                        employe?.role === 'SUPERADMIN' ? null :
                            <div className="text-center form-switch">
                                <input className="form-check-input pointer" type="checkbox" id="promotion" onChange={ handleChangeSwitch } defaultChecked={ employe && employe.active } checked={ employe && employe.active }/>
                                <label className="form-check-label ms-2" htmlFor="flexSwitchCheckDefault">{ employe && employe.active ? "Compte activé" : "Compte desactivé"  }</label>
                            </div>
                    }
                </div>

                <div>
                    {
                        employe?.role === 'SUPERADMIN' ? null :
                            <>
                                <button className="btn btn-outline-danger actions" onClick={ handleShowModalDelete }><i className="bi bi-trash-fill"/></button>
                                <Link to="/employe/form" state={ employe } className="btn btn-primary actions-2"><i className="bi bi-pencil-fill text-white"/></Link>
                            </>
                    }

                    <div className="card p-4 w-fit employe">
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

                        {
                            employe?.role === 'SUPERADMIN' ? null :
                                <button className="btn btn-primary" onClick={ handleClickReset } data-bs-toggle="tooltip" data-bs-placement="top" title="Générer mot de passe provisoire"><i className="bi bi-file-lock"/></button>
                        }
                    </div>
                </div>
            </div>
        </>

    )
}
