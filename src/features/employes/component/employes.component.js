import {useNavigate} from "react-router";
import {useEffect, useState} from "react";
import axios from "axios";
import {API} from "../../../services/url.service";
import {headerToken} from "../../../services/http.service";
import {handleError} from "../../../services/error.service";
import ReactPaginate from "react-paginate";
import {Link} from "react-router-dom";

export default function Employes() {

    const navigate = useNavigate()
    const employesByPage = 25
    let compteur = 0

    const [employes, setEmployes] = useState([])
    const [page, setPage] = useState(0)
    const [recherche, setRecherche] = useState()
    const [filterActif, setFilterActif] = useState()
    const [filterRole, setFilterRole] = useState()
    const [pageNumber, setPageNumber] = useState(0)

    const callApi = () => {
        axios.get(`${API}/employe`, headerToken)
            .then(res => {
                setEmployes(res.data)
                setPageNumber(res.data.length / employesByPage)
            })
            .catch(err => handleError(err))
    }

    const getClass = () => {
        compteur = compteur + 1
        if (compteur % 2 === 0) {
            return "table-light"
        }
        return "table-secondary"
    }

    const getEmploye = (page, recherche, filterActif, filterRole) => {
        let employesCopy = [...employes]

        if(filterActif && filterActif === '1') {
            employesCopy = employesCopy.filter(employe => employe.active)
        }

        if(filterActif && filterActif === '2') {
            employesCopy = employesCopy.filter(employe => !employe.active)
        }

        if(filterRole && filterRole === '1') {
            employesCopy = employesCopy.filter(employe => employe.role === 'ADMIN' || employe.role === 'SUPERADMIN')
        }

        if(filterRole && filterRole === '2') {
            employesCopy = employesCopy.filter(employe => employe.role === 'EMPLOYE')
        }

        if(recherche && recherche !== '') {
            employesCopy = employesCopy.filter(employe => employe.login.includes(recherche) || employe.nom.includes(recherche) || employe.prenom.includes(recherche))
        }

        if(pageNumber !== employesCopy.length / employesByPage) {
            setPage(0)
            setPageNumber(employesCopy.length / employesByPage)
        }

        employesCopy = employesCopy.slice(page * employesByPage, page * employesByPage + employesByPage)

        return employesCopy
    }

    const handlePageClick = (event) => {
        setPage(event.selected)
    }

    const handleChange = (event) => {
        setRecherche(event.target.value)
    }

    const handleChangeActif = (event) => {
        setFilterActif(event.target.value)
    }

    const handleChangeRole = (event) => {
        setFilterRole(event.target.value)
    }

    const handleClickRow = (employeId) => {
        navigate(`/employe/${employeId}`)
    }

    useEffect(callApi, [])

    return (
        <>
            <Link to="/employe/form" className="btn btn-primary mt-5 ms-5">Ajouter un employe</Link>

            <div className="d-inline-flex filtre">
                <div className="select me-4">
                    <label htmlFor="exampleSelect1" className="form-label mt-4 text-4">Compte</label>
                    <select className="form-select" id="exampleSelect1" onChange={handleChangeActif}>
                        <option value={0}>Tous</option>
                        <option value={1}>Actif</option>
                        <option value={2}>Desactif</option>
                    </select>
                </div>

                <div className="select me-4">
                    <label htmlFor="exampleSelect1" className="form-label mt-4 text-4">Role</label>
                    <select className="form-select" id="exampleSelect1" onChange={handleChangeRole}>
                        <option value={0}>Tous</option>
                        <option value={1}>Admin</option>
                        <option value={2}>Employe</option>
                    </select>
                </div>
            </div>

            <form className="d-flex recherche">
                <input className="form-control me-sm-2" type="text" placeholder="Recherche par Nom, Prénom ou Login" name="Recherche" value={ recherche } onChange={ handleChange } />
            </form>

            <table className="table table-bordered clients ">
                <thead className="bg-primary text-center">
                <tr id="head">
                    <th className="text-4 text-white" scope="col">Compte actif</th>
                    <th className="text-4 text-white" scope="col">Nom</th>
                    <th className="text-4 text-white" scope="col">Prénom</th>
                    <th className="text-4 text-white" scope="col">Login</th>
                    <th className="text-4 text-white" scope="col">Role</th>
                </tr>
                </thead>
                <tbody>
                {
                    getEmploye(page, recherche, filterActif, filterRole).length === 0 ?
                        <tr className="text-center table-secondary">
                            <td colSpan="6">Aucun résultat</td>
                        </tr>
                        :
                        getEmploye(page, recherche, filterActif, filterRole).map(employe => {
                            return (
                                <>
                                    <tr className={"pointer text-center " + getClass()} onClick={ () => handleClickRow(employe.id) }>
                                        <td scope="row">{employe.active ?
                                            <i className="bi bi-check-circle-fill green"/> :
                                            <i className="bi bi-x-circle-fill red"/>}
                                        </td>
                                        <td className="text-5">{employe.nom}</td>
                                        <td className="text-5">{employe.prenom}</td>
                                        <td className="text-5">{employe.login}</td>
                                        <td className="text-5">{employe.role}</td>
                                    </tr>
                                </>
                            )
                        })
                }
                </tbody>
            </table>

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
        </>
    )
}
