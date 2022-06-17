import {useEffect, useState} from "react";
import {API, API_IMAGES, NO_IMAGE} from "../../../services/url.service";
import '../publication.css';
import axios from "axios";
import {headerToken} from "../../../services/http.service";
import {handleError} from "../../../services/error.service";
import {toast} from "react-toastify";
import {useLocation} from "react-router";

export default function PublicationForm() {

    const initForm = { titre: '', description: '', nbrNumeroAnnee: null, photoCouverture: '', prixAnnuel: null, promotion: false, pourcentagePromo: null };
    const { state }  = useLocation();
    const [form, setForm] = useState(initForm);
    const [file, setFile] = useState()
    const [imgUpload, setImgUpload] = useState()
    const [loadingUpload, setLoadingUpload] = useState(false)

    const checkEdit = () => {
        if(state) {
            setForm({ titre: state.titre, description: state.description, nbrNumeroAnnee: state.nbrnumeroannee, photoCouverture: state.photocouverture, prixAnnuel: state.prixannuel, promotion: state.promotion, pourcentagePromo: state.pourcentagepromo })
            setImgUpload(state.photocouverture)
        } else {
            setForm(initForm)
        }
    }

    const handleChange = (event) => {
        const key = event.target.name
        const value = event.target.value
        setForm({ ...form, [key]: value })
    }

    const handleChangeFile = (event) => {
        setFile(event.target.files)
    }

    const handleChangeSwitch = (event) => {
        setForm({ ...form, promotion: event.target.checked })
    }

    const uploadImg = () => {
        if(!file) {
            return;
        }

        const formData = new FormData()
        formData.append('image', file[0])

        axios.post(`${API}/upload`, formData, headerToken)
            .then(res => {
                if(res.data) {
                    setLoadingUpload(false)
                    setImgUpload(res.data.imgUpload)
                    toast.success("Image chargé avec succès");
                }
            })
            .catch((error) => {
                setLoadingUpload(false)
                handleError(error)
            })
    }

    const handleSubmit = (event) => {
        event.preventDefault()

        if(state) {
            handleSubmitEditPublication(state.id);
        } else {
            handleSubmitAddPublication();
        }
    }

    const handleSubmitEditPublication = (publicationId) => {
        const body = {
            titre: form.titre,
            description: form.description,
            nbrNumeroAnnee: form.nbrNumeroAnnee,
            photoCouverture: imgUpload,
            prixAnnuel: form.prixAnnuel,
            promotion: form.promotion,
            pourcentagePromo: form.pourcentagePromo
        }

        axios.patch(`${API}/publication/${publicationId}`, body, headerToken)
            .then(_ => {
                toast.success("Publication modifié avec succès");
            })
            .catch((error) => handleError(error))
    }

    const handleSubmitAddPublication = () => {
        const body = {
            titre: form.titre,
            description: form.description,
            nbrNumeroAnnee: form.nbrNumeroAnnee,
            photoCouverture: imgUpload,
            prixAnnuel: form.prixAnnuel,
            promotion: form.promotion,
            pourcentagePromo: form.pourcentagePromo
        }

        axios.post(`${API}/publication`, body, headerToken)
            .then(_ => {
                toast.success("Publication créée avec succès");
                setForm(initForm)
                setFile(null)
                setImgUpload(null)
            })
            .catch((error) => handleError(error))
    }

    useEffect(checkEdit, [])

    return(
        <div className="row justify-content-center">
            <div className="load">
                <img className="img-load" src={ imgUpload ? `${API_IMAGES}/${imgUpload}` : NO_IMAGE } alt="Image not found"/>
                <div className="mt-5 d-flex justify-content-center">
                    <div className="file-btn btn btn-primary m-1">Choisir une image
                        <input className="file-input pointer" type="file" name="image" id="image" onChange={ handleChangeFile }/>
                    </div>
                    <button className={ "m-1 btn btn-outline-primary " } type="button" onClick={ () => {
                        setLoadingUpload(true)
                        uploadImg()
                    } }>
                        {
                            loadingUpload ? <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"/> : 'Upload'
                        }
                    </button>
                </div>
                <p className="text-center mt-3 file-name">{ file && file[0].name }</p>
            </div>
            <div className="form-body">
                <h2 className="text-1 text-center mb-4">{ state ? 'Modifier la publication' : 'Ajouter une publication' }</h2>
                <div className="form">
                    <form onSubmit={ handleSubmit }>

                        <div className="form-group">
                            <div className="text-2 mb-2">
                                <label htmlFor="titre">Titre</label>
                            </div>
                            <input name="titre" type="text" className="form-control" id="titre" placeholder="Entrer titre" value={ form.titre } onChange={ handleChange } required/>
                        </div>

                        <div className="form-group">
                            <div className="text-2 mb-2">
                                <label htmlFor="description">Description</label>
                            </div>
                            <textarea name="description" className="form-control" id="description" placeholder="Entrer description" value={ form.description } onChange={ handleChange } required/>
                        </div>

                        <div className="form-group">
                            <div className="text-2 mb-2">
                                <label htmlFor="titre">Nombre numéro à l'année</label>
                            </div>
                            <input name="nbrNumeroAnnee" type="number" min={0} className="form-control" id="nbrNumeroAnnee" placeholder="Entrer le nombre" value={ form.nbrNumeroAnnee} onChange={ handleChange } required/>
                        </div>

                        <div className="form-group">
                            <div className="text-2 mb-2">
                                <label htmlFor="titre">Prix annuel</label>
                            </div>
                            <input name="prixAnnuel" type="number" step="any" min={0} className="form-control" id="prixAnnuel" placeholder="Entrer le nombre" value={ form.prixAnnuel} onChange={ handleChange } required/>
                        </div>

                        <div className="d-inline-flex">
                            <div className="form-group">
                                <div className="text-2 mb-2">
                                    <label htmlFor="titre">Promotion</label>
                                </div>
                                <div className="form-check form-switch">
                                    <input className="form-check-input pointer" type="checkbox" id="promotion" onChange={ handleChangeSwitch } defaultChecked={ form.promotion }/>
                                    <label className="form-check-label" htmlFor="flexSwitchCheckDefault">{ form.promotion ? "Oui" : "Non" }</label>
                                </div>
                            </div>

                            {
                                form.promotion ?
                                    <div className="form-group mb-0 ms-5 wrap">
                                        <div className="text-2 mb-2">
                                            <label htmlFor="titre">Pourcentage promotion</label>
                                        </div>
                                        <input name="pourcentagePromo" type="number" min={0} className="form-control" id="pourcentagePromo" placeholder="Entrer le nombre" value={ form.pourcentagePromo} onChange={ handleChange } required/>
                                    </div> : null
                            }
                        </div>
                        <button type="submit" className={ "mt-4 btn btn-primary w-100" + (loadingUpload ? "disabled" : '')}>
                            {
                                loadingUpload ? <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"/> : 'Enregistrer'
                            }
                        </button>
                    </form>
                </div>
            </div>
        </div>
    )

}
