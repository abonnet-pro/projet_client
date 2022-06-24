import {useLocation, useNavigate} from "react-router";
import {useState} from "react";
import axios from "axios";
import {API} from "../../../services/url.service";
import {headerToken} from "../../../services/http.service";
import {toast} from "react-toastify";
import {handleError} from "../../../services/error.service";
import {Button, Modal} from "react-bootstrap";

export default function EmployeForm() {

    const { state }  = useLocation();

    const initForm = { nom: '', prenom: '', login: '', password: '', role: 'EMPLOYE' };
    const [form, setForm] = useState(initForm);
    const [passwordProvisoire, setPasswordProvisoire] = useState()

    const [showModal, setShowModal] = useState(false);

    const handleCloseModal = () => setShowModal(false);

    const handleSubmit = (event) => {
        event.preventDefault()

        axios.post(`${API}/employe`, form, headerToken)
            .then(res => {
                console.log(res)
                if(res.data) {
                    toast.success("Employé créé avec succès");
                    setShowModal(true);
                    setPasswordProvisoire(res.data.password)
                }
            })
            .catch((error) => {
                handleError(error)
            })
    }

    const handleChange = (event) => {
        const key = event.target.name
        const value = event.target.value
        setForm({ ...form, [key]: value })
    }

    const handleChangeRole = (event) => {
        setForm({ ...form, role: event.target.value })
    }

    return(
        <>
            <Modal show={showModal} onHide={handleCloseModal}>
                <Modal.Header closeButton>
                    <Modal.Title>Inscription</Modal.Title>
                </Modal.Header>
                <Modal.Body>Mot de passe provisoire : { passwordProvisoire }</Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleCloseModal}>
                        Ok
                    </Button>
                </Modal.Footer>
            </Modal>

            <div className="row justify-content-center">
                <div className="form-body">
                    <h2 className="text-1 text-center mb-4">{ state ? 'Modifier l\'employé' : 'Ajouter un employé' }</h2>
                    <div className="form">
                        <form onSubmit={ handleSubmit }>

                            <div className="form-group">
                                <div className="text-2 mb-2">
                                    <label htmlFor="titre">Nom</label>
                                </div>
                                <input name="nom" type="text" className="form-control" id="nom" placeholder="Entrer nom" value={ form.nom } onChange={ handleChange } required/>
                            </div>

                            <div className="form-group">
                                <div className="text-2 mb-2">
                                    <label htmlFor="prenom">Prénom</label>
                                </div>
                                <input name="prenom" type="text" className="form-control" id="prenom" placeholder="Entrer prénom" value={ form.prenom } onChange={ handleChange } required/>
                            </div>

                            <div className="form-group">
                                <div className="text-2 mb-2">
                                    <label htmlFor="login">Login</label>
                                </div>
                                <input name="login" type="text" className="form-control" id="login" placeholder="Entrer le login" value={ form.login} onChange={ handleChange } required/>
                            </div>

                            <div className="form-group">
                                <div className="text-2 mb-2">
                                    <label htmlFor="titre">Role</label>
                                </div>
                                <select className="form-select form-control" id="exampleSelect1" onChange={ handleChangeRole }>
                                    <option value={'EMPLOYE'}>Employe</option>
                                    <option value={'ADMIN'}>Admin</option>
                                </select>
                            </div>
                            <button type="submit" className="mt-4 btn btn-primary w-100">Enregistrer</button>
                        </form>
                    </div>
                </div>
            </div>
        </>
    )
}
