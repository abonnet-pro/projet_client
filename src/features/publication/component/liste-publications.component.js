import {API} from "../../../services/url.service";

export default function ListePublications({ publications, display }) {
    return(
        <div className="row justify-content-center m-3">
            {
                display ?
                    publications.map(publication => {
                        return (
                            <div key={ publication.id } className="card content border-primary m-3 mw p-0">
                                <div className="card-header text-2">
                                    { publication.titre }
                                    { publication.promotion ? <span className="badge rounded-pill bg-info ms-2">Promo</span> : null}
                                </div>
                                <div className="card-body align-self-center">
                                    <img className="p-0 photo-couverture" src={ `${API}/${publication.photocouverture}` } alt="Not found"/>
                                    <button className="btn btn-outline-primary w-100 mt-2">Voir le produit</button>
                                </div>
                            </div>
                        )
                    }) : null
            }
            {
                display && publications.length === 0 ? <p className="text-err">Aucun résultat</p> : null
            }
        </div>
    )
}
