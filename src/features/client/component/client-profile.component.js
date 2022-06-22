export default function ClientProfile({ client }) {

    return(
        <div className="card p-3 mt-3">
            <div className="d-inline-flex">
                <i className="bi bi-person-badge logo text-primary"/>
                <label className="text-4 align-self-center ms-2">Nom Prénom :</label>
            </div>
            <label className="mb-3 infos">{ client?.nom } { client?.prenom }</label>

            <div className="d-inline-flex">
                <i className="bi bi-display logo text-primary"/>
                <label className="text-4 align-self-center ms-2">Nom d'utilisateur :</label>
            </div>
            <label className="mb-3 infos">{ client?.displayname }</label>

            <div className="d-inline-flex">
                <i className="bi bi-envelope logo text-primary"/>
                <label className="text-4 align-self-center ms-2">Login :</label>
            </div>
            <label className="mb-3 infos">{ client?.login }</label>

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
            <label className="infos">{ client?.rue }</label>
        </div>
    )
}
