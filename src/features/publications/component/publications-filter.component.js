export default function FilterPublications({ handleChangeActive, handleChangePromo, handleChange, recherche }) {
    return <>
        <div className="d-inline-flex filtre">
            <div className="select me-4">
                <label htmlFor="exampleSelect1" className="form-label mt-4 text-4">Etat</label>
                <select className="form-select" id="exampleSelect1" onChange={ handleChangeActive }>
                    <option value={0}>Tous</option>
                    <option value={1}>Active</option>
                    <option value={2}>Desactive</option>
                </select>
            </div>

            <div className="select me-4">
                <label htmlFor="exampleSelect2" className="form-label mt-4 text-4">Promo</label>
                <select className="form-select" id="exampleSelect2" onChange={ handleChangePromo }>
                    <option value={0}>Tous</option>
                    <option value={1}>Promo</option>
                </select>
            </div>
        </div>

        <form className="d-flex recherche">
            <input className="form-control me-sm-2" type="text" placeholder="Recherche par Nom d'utilisateur ou Login"
                   name="Recherche" value={ recherche } onChange={ handleChange }/>
        </form>
    </>
}
