import {useEffect, useState} from "react";
import axios from "axios";
import {API} from "../../../services/url.service";
import {handleError} from "../../../services/error.service";
import {headerToken} from "../../../services/http.service";
import '../clients.css'
import ReactPaginate from "react-paginate";
import {useNavigate} from "react-router";

export default function Clients() {

    const navigate = useNavigate()
    const clientsByPage = 25
    let compteur = 0

    const [clients, setClients] = useState([])
    const [page, setPage] = useState(0)
    const [recherche, setRecherche] = useState()
    const [filterImpaye, setFilterImpaye] = useState()
    const [filterRemboursement, setFilterRemboursement] = useState()
    const [filterActif, setFilterActif] = useState()
    const [pageNumber, setPageNumber] = useState(0)

    const callApi = () => {
        axios.get(`${API}/client`, headerToken)
            .then(res => {
                setClients(res.data)
                setPageNumber(res.data.length / clientsByPage)
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

    const impaye = (client) => {
        if (client.abonnements.length === 0) {
            return false
        }

        for (let abonnement of client.abonnements) {
            if (!abonnement.paye) {
                return true
            }
        }
        return false
    }

    const resilieARembourse = (client) => {
        if (client.abonnements.length === 0) {
            return false
        }

        for (let abonnement of client.abonnements) {
            if (abonnement.dateresiliation && !abonnement.rembourse && abonnement.paye) {
                return true
            }
        }
        return false
    }

    const getClients = (page, recherche, filterImpaye, filterRemboursement, filterActif) => {
        let clientsCopy = [...clients]

        if(filterActif && filterActif === '1') {
            clientsCopy = clientsCopy.filter(client => client.active)
        }

        if(filterActif && filterActif === '2') {
            clientsCopy = clientsCopy.filter(client => !client.active)
        }

        if(filterImpaye && filterImpaye === '1') {
            clientsCopy = clientsCopy.filter(client => impaye(client))
        }

        if(filterRemboursement && filterRemboursement === '1') {
            clientsCopy = clientsCopy.filter(client => resilieARembourse(client))
        }

        if(recherche && recherche !== '') {
            clientsCopy = clientsCopy.filter(client => client.login.includes(recherche))
        }

        if(pageNumber !== clientsCopy.length / clientsByPage) {
            setPageNumber(clientsCopy.length / clientsByPage)
        }

        clientsCopy = clientsCopy.slice(page * clientsByPage, page * clientsByPage + clientsByPage)

        return clientsCopy
    }

    const handlePageClick = (event) => {
        setPage(event.selected)
    }

    const handleChange = (event) => {
        setRecherche(event.target.value)
    }

    const handleChangeImpaye = (event) => {
        setFilterImpaye(event.target.value)
    }

    const handleChangeRemboursement = (event) => {
        setFilterRemboursement(event.target.value)
    }

    const handleChangeActif = (event) => {
        setFilterActif(event.target.value)
    }

    const handleClickRow = (cliendId) => {
        navigate(`/client/${cliendId}/profile`)
    }

    useEffect(callApi, [])

    return (
        <>
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
                    <label htmlFor="exampleSelect2" className="form-label mt-4 text-4">Abonnements</label>
                    <select className="form-select" id="exampleSelect2" onChange={handleChangeImpaye}>
                        <option value={0}>Tous</option>
                        <option value={1}>Impayé</option>
                    </select>
                </div>

                <div className="select">
                    <label htmlFor="exampleSelect3" className="form-label mt-4 text-4">Remboursement</label>
                    <select className="form-select" id="exampleSelect3" onChange={handleChangeRemboursement}>
                        <option value={0}>Tous</option>
                        <option value={1}>A rembourser</option>
                    </select>
                </div>
            </div>

            <form className="d-flex recherche">
                <input className="form-control me-sm-2" type="text" placeholder="Recherche par Nom d'utilisateur ou Login" name="Recherche" value={ recherche } onChange={ handleChange } />
            </form>

            <table className="table table-bordered clients ">
                <thead className="bg-primary text-center">
                <tr id="head">
                    <th className="text-4 text-white" scope="col">Compte actif</th>
                    <th className="text-4 text-white" scope="col">Nom d'utilisateur</th>
                    <th className="text-4 text-white" scope="col">Login</th>
                    <th className="text-4 text-white" scope="col">Abonnements impayés</th>
                    <th className="text-4 text-white" scope="col">Abonnements à rembourser</th>
                </tr>
                </thead>
                <tbody>
                {
                    getClients(page, recherche, filterImpaye, filterRemboursement, filterActif).length === 0 ?
                        <tr className="text-center table-secondary">
                            <td colSpan="5">Aucun résultat</td>
                        </tr>
                        :
                    getClients(page, recherche, filterImpaye, filterRemboursement, filterActif).map(client => {
                        return (
                            <>
                                <tr className={"pointer text-center " + getClass()} onClick={ () => handleClickRow(client.id) }>
                                    <th scope="row">{client.active ?
                                        <i className="bi bi-check-circle-fill green"/> :
                                        <i className="bi bi-x-circle-fill red"/>}</th>
                                    <td className="text-5">{client.displayname}</td>
                                    <td className="text-5">{client.login}</td>
                                    <td>{impaye(client) ?
                                        <i className="bi bi-exclamation-octagon-fill"/> : null}</td>
                                    <td>{resilieARembourse(client) ?
                                        <i className="bi bi-exclamation-octagon-fill"/> : null}</td>
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
