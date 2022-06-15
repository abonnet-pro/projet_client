export default function FilterPublication({ recherche, setRecherche, handleSubmitRecherche }) {

    const handleChange = (event) => {
        setRecherche(event.target.value)
    }

    return(
        <form onSubmit={ handleSubmitRecherche } className="d-flex">
            <input className="form-control me-sm-2" type="text" placeholder="Rechercher un titre" name="recherche" value={ recherche } onChange={ handleChange } />
            <button className="btn btn-dark my-2 my-sm-0" type="submit">Rechercher</button>
        </form>
    )
}
