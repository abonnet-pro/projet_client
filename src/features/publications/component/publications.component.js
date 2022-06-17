import '../../publication/publication.css';
import {useEffect, useState} from "react";
import axios from "axios";
import {handleError} from "../../../services/error.service";
import {API} from "../../../services/url.service";
import ListePublications from "./publications-liste.component";
import FilterPublication from "./publications-filter.component";
import {Link} from "react-router-dom";

export default function Publications() {

    const [publicationsActives, setPublicationsActive] = useState([])
    const [publicationsDesactives, setPublicationsDesactive] = useState([])
    const [publicationsPromos, setPublicationsPromo] = useState([])

    const [recherche, setRecherche] = useState('')
    const [filter, setFilter] = useState('')

    const [showActives, setShowActives] = useState(true)
    const [showDesactives, setShowDesactives] = useState(true)
    const [showPromos, setShowPromos] = useState(true)

    const [loadingActive, setLoadingActive] = useState(false)
    const [loadingPromo, setLoadingPromo] = useState(false)
    const [loadingDesactive, setLoadingDesactive] = useState(false)

    const callApi = () => {
        setLoadingActive(true)
        setLoadingPromo(true)
        setLoadingDesactive(true)

        axios.get(`${API}/publication?active=true&promotion=false${filter}`)
            .then(result => {
                setLoadingActive(false)
                setPublicationsActive(result.data)
            })
            .catch(error => {
                setLoadingActive(false)
                handleError(error)
            });

        axios.get(`${API}/publication?active=false${filter}`)
            .then(result => {
                setLoadingDesactive(false)
                setPublicationsDesactive(result.data)
            })
            .catch(error => {
                setLoadingDesactive(false)
                handleError(error)
            });

        axios.get(`${API}/publication?promotion=true&active=true${filter}`)
            .then(result => {
                setLoadingPromo(false)
                setPublicationsPromo(result.data)
            })
            .catch(error => {
                setLoadingPromo(false)
                handleError(error)
            });
    }

    const onShowActive = () => {
        setShowActives(!showActives)
    }

    const onShowDesactive = () => {
        setShowDesactives(!showDesactives)
    }

    const onShowPromo = () => {
        setShowPromos(!showPromos)
    }

    const getIconActives = () => {
        return showActives ? "bi-caret-down-fill" : "bi-caret-up-fill"
    }

    const getIconDesactives = () => {
        return showDesactives ? "bi-caret-down-fill" : "bi-caret-up-fill"
    }

    const getIconPromos = () => {
        return showPromos ? "bi-caret-down-fill" : "bi-caret-up-fill"
    }

    const handleSubmitRecherche = (event) => {
        event.preventDefault();

        let filter = `&titre=${recherche}`
        setFilter(filter);
    }

    useEffect(callApi, [filter])

    return(
        <div className="m-5">

            <Link to="/publication/form" className="btn btn-primary mb-5">Ajouter une publication</Link>

            <div className="mb-3">
                <FilterPublication recherche={ recherche } setRecherche={ setRecherche } handleSubmitRecherche={ handleSubmitRecherche }/>
            </div>

            <p className="text-1 pointer w-fit" onClick={ onShowActive }>Publications Actives<i className={ "bi ms-2 dropdown " +  getIconActives() }/></p>
            {
                loadingActive ? <div className="spinner-border text-primary ms-5" role="status"/> : <ListePublications display={ showActives } publications={ publicationsActives }/>
            }

            <p className="text-1 pointer w-fit" onClick={ onShowPromo }>Publications Promotions<i className={ "bi ms-2 dropdown " +  getIconPromos() }/></p>
            {
                loadingPromo ? <div className="spinner-border text-primary ms-5" role="status"/> : <ListePublications display={ showPromos } publications={ publicationsPromos}/>
            }

            <p className="text-1 pointer w-fit" onClick={ onShowDesactive }>Publications Desactives<i className={ "bi ms-2 dropdown " +  getIconDesactives() }/></p>
            {
                loadingDesactive ? <div className="spinner-border text-primary ms-5" role="status"/> : <ListePublications display={ showDesactives } publications={ publicationsDesactives }/>
            }
        </div>
    )
}
