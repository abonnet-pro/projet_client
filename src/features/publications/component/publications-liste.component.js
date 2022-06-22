import {API_IMAGES} from "../../../services/url.service";
import {Link} from "react-router-dom";

export default function ListePublications({ publications }) {
    return(
        <div className="row justify-content-center m-3">
            {
                publications.length > 0 ?
                publications.map(publication => {
                    return (
                        <div key={ publication.id } className="card content border-primary m-3 mw p-0">
                            <div className="card-header text-2">
                                { publication.titre }
                                { publication.promotion && publication.active ? <span className="badge rounded-pill bg-info ms-2">Promo</span> : null}
                                { !publication.active ? <i className="ms-3 bi bi-x-circle-fill red float-end"/> : null}
                            </div>
                            <div className="card-body align-self-center">
                                <img className="p-0 photo-couverture" src={ `${API_IMAGES}/${publication.photocouverture}` } alt="Not found"/>
                                <Link to={`/publication/${publication.id}`} className="btn btn-outline-primary w-100 mt-2">Voir le produit</Link>
                            </div>
                        </div>
                    )
                }) :
                    <p className="text-center mt-5 text-1">Aucun résulat</p>
            }
        </div>
    )
}
