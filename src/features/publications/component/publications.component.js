import '../../publication/publication.css';
import {useEffect, useState} from "react";
import axios from "axios";
import {handleError} from "../../../services/error.service";
import {API} from "../../../services/url.service";
import ListePublications from "./publications-liste.component";
import {Link} from "react-router-dom";
import ReactPaginate from "react-paginate";
import FilterPublications from "./publications-filter.component";

export default function Publications() {

    const publicationsByPage = 25

    const [publications, setPublications] = useState([])
    const [loading, setLoading] = useState(false)

    const [recherche, setRecherche] = useState('')

    const [filterPromo, setFilterPromo] = useState()
    const [filterActive, setFilterActive] = useState()

    const [page, setPage] = useState(0)
    const [pageNumber, setPageNumber] = useState(0)

    const callApi = () => {
        setLoading(true)

        axios.get(`${API}/publication`)
            .then(result => {
                setLoading(false)
                setPublications(result.data)
            })
            .catch(error => {
                setLoading(false)
                handleError(error)
            });
    }

    const handleChangeActive = (event) => {
        setFilterActive(event.target.value)
    }

    const handleChangePromo = (event) => {
        setFilterPromo(event.target.value)
    }

    const handlePageClick = (event) => {
        setPage(event.selected)
    }

    const handleChange = (event) => {
        setRecherche(event.target.value)
    }

    const getPublications = (page, recherche, filterPromo, filterActive) => {
        let publicationCopy = [...publications]

        if(filterActive && filterActive === '1') {
            publicationCopy = publicationCopy.filter(publication => publication.active)
        }

        if(filterActive && filterActive === '2') {
            publicationCopy = publicationCopy.filter(publication => !publication.active)
        }

        if(filterPromo && filterPromo === '1') {
            publicationCopy = publicationCopy.filter(publication => publication.promotion)
        }

        if(recherche && recherche !== '') {
            publicationCopy = publicationCopy.filter(publication => publication.titre.toLowerCase().includes(recherche.toLowerCase()))
        }

        if(pageNumber !== publicationCopy.length / publicationsByPage) {
            setPageNumber(publicationCopy.length / publicationsByPage)
        }

        publicationCopy = publicationCopy.slice(page * publicationsByPage, page * publicationsByPage + publicationsByPage)

        return publicationCopy
    }

    useEffect(callApi, [])

    return(
        <div>
            <Link to="/publication/form" className="btn btn-primary mt-5 ms-5">Ajouter une publication</Link>

            <FilterPublications handleChangeActive={ handleChangeActive } handleChangePromo={ handleChangePromo } recherche={recherche} handleChange={ handleChange }/>

            <ListePublications loading={loading} publications={getPublications(page, recherche, filterPromo, filterActive)}/>

            <ReactPaginate
                breakClassName={'page-item'}
                breakLinkClassName={'page-link'}
                containerClassName={'pagination justify-content-center'}
                pageClassName={'page-item'}
                pageLinkClassName={'page-link'}
                previousClassName={'page-item'}
                previousLinkClassName={'page-link'}
                nextClassName={'page-item'}
                nextLinkClassName={'page-link'}
                activeClassName={'active'}
                breakLabel="..."
                nextLabel="&raquo;"
                onPageChange={handlePageClick}
                pageRangeDisplayed={20}
                pageCount={pageNumber}
                previousLabel="&laquo;"
                renderOnZeroPageCount={null}
            />

        </div>
    )
}
