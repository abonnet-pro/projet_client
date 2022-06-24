import {useNavigate, useParams} from "react-router";
import axios from "axios";
import {API, API_IMAGES} from "../../../services/url.service";
import {handleError} from "../../../services/error.service";
import {useEffect, useState} from "react";
import {toast} from "react-toastify";
import {headerToken} from "../../../services/http.service";
import {Link} from "react-router-dom";
import {admin, superadmin} from "../../../services/role.service";
import {Button, Modal} from 'react-bootstrap'

export default function PublicationDetail() {

    const navigate = useNavigate()
    const params = useParams();
    const [publication, setPublication] = useState()
    const [loading, setLoading] = useState()

    const [showModal, setShowModal] = useState(false);

    const handleCloseModal = () => setShowModal(false);
    const handleShowModal = () => setShowModal(true);

    const callApi = () => {
        setLoading(true)
        axios.get(`${API}/publication/${params.id}`)
            .then(res => {
                setLoading(false)
                setPublication(res.data)
            })
            .catch(err => {
                setLoading(false)
                handleError(err)
            })
    }

    useEffect(callApi, [])

    const handleChangeSwitch = (event) => {
        let body = { active: event.target.checked }
        setLoading(true)

        axios.patch(`${API}/publication/${params.id}`, body, headerToken)
            .then(res => {
                setLoading(false)
                setPublication(res.data)
                toast.success('Publication ' + (res.data.active ? 'activé' : 'désactivé'));
            })
            .catch(err => {
                setLoading(false)
                handleError(err)
            })
    }

    const handleDelete = () => {
        axios.delete(`${API}/publication/${params.id}`, headerToken)
            .then(res => {
                navigate('/publications')
                toast.success("Publication supprimée");
            })
            .catch(err => {
                handleCloseModal()
                handleError(err)
            })
    }

    return(
        <>
            <Modal show={showModal} onHide={handleCloseModal}>
                <Modal.Header closeButton>
                    <Modal.Title>Suppression</Modal.Title>
                </Modal.Header>
                <Modal.Body>Etes vous sur de vouloir supprimer la publication ?</Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleCloseModal}>
                        Annuler
                    </Button>
                    <Button variant="primary" onClick={handleDelete}>
                        Valider
                    </Button>
                </Modal.Footer>
            </Modal>

            {
                loading ?
                <div className="d-flex justify-content-center text-primary mt-5">
                    <div className="spinner-border" role="status">
                    </div>
                </div>
                    :
                <div className="d-flex justify-content-center">
                    <div>
                        <img className="img m-4" src={ `${API_IMAGES}/${publication?.photocouverture}` } alt="not found"/>
                    </div>
                    <div className="box m-4">
                        {
                            admin() || superadmin() ? <button className="btn btn-outline-danger float-end ms-2" onClick={ handleShowModal }><i className="bi bi-trash-fill"/></button> : null
                        }
                        <Link to="/publication/form" state={ publication } className="btn btn-primary float-end"><i className="bi bi-pencil-fill text-white"/></Link>
                        <div className="text-3">
                            <p>{"\u2022"} Titre : <label className="detail">{ publication && publication.titre }</label></p>
                            <p>{"\u2022"} Description : <label className="detail">{ publication && publication.description }</label></p>
                            <p>{"\u2022"} Nombre de numéro à l'année : <label className="detail">{ publication && publication.nbrnumeroannee }</label></p>
                            <p>{"\u2022"} Prix annuel : <label className="detail">{ publication && publication.prixannuel }€</label></p>
                            <p>{"\u2022"} Promotion : <label className="detail">{ publication && publication.promotion ? 'Oui' : 'Non' }</label></p>
                            {
                                publication && publication.promotion ? <p>{"\u2022"} Pourcentage de promotion : <label className="detail">{ publication && publication.pourcentagepromo }%</label></p> : null
                            }
                            <div className="actif form-check form-switch">
                                <input className="form-check-input pointer" type="checkbox" id="promotion" onChange={ handleChangeSwitch } defaultChecked={ publication && publication.active }/>
                                <label className="form-check-label" htmlFor="flexSwitchCheckDefault">{ publication && publication.active ? "Active" : "Desactive"  }</label>
                            </div>
                        </div>
                    </div>
                </div>
            }
        </>

    )
}
