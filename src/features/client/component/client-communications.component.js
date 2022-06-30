import {useNavigate} from "react-router";

export default function ClientCommunications({ communications, abonnements }) {

    let navigate = useNavigate()

    let compteur = 0

    const getClass = () => {
        compteur = compteur + 1
        if (compteur % 2 === 0) {
            return "table-light"
        }
        return "table-secondary"
    }

    const handleClickRow = (communication) => {
        let paiement = communication.objet.includes('PAIEMENT') || communication.objet.includes('REMBOURSEMENT')
        let abonnement = communication.objet.includes('ABONNEMENT')
        if(!paiement && !abonnement) return
        let array = communication.objet.split('_')
        let id = array[array.length - 1]

        if(paiement) {
            for(let abonnement of abonnements) {
                if(abonnement?.paiement?.id.toString() === id) {
                    navigate(`/client/${abonnement.clientid}/paiements`, { state: abonnement.paiement })
                }
            }
        }

        if(abonnement) {
            for(let abonnement of abonnements) {
                if(abonnement?.id.toString() === id) {
                    navigate(`/client/${abonnement.clientid}/abonnements`, { state: abonnement })
                }
            }
        }
    }

    return(
        <>
            <table className="table table-bordered mt-5">
                <thead className="bg-primary text-center">
                <tr id="head">
                    <th className="text-4 text-white" scope="col">Type</th>
                    <th className="text-4 text-white" scope="col">Date</th>
                    <th className="text-4 text-white" scope="col">Objet</th>
                </tr>
                </thead>
                <tbody>
                {
                    communications?.length === 0 ?
                        <tr className="text-center table-secondary">
                            <td colSpan="5">Aucun paiements</td>
                        </tr>
                        :
                        communications?.map(communication => {
                            return (
                                    <>
                                        <tr className={"text-center pointer " + getClass()} onClick={ () => handleClickRow(communication) }>
                                            <td className="text-5">{ communication?.type }</td>
                                            <td className="text-5">{ new Date(communication?.date).toLocaleDateString() }</td>
                                            <td className="text-5">{ communication?.objet }</td>
                                        </tr>

                                    </>
                                )
                            }
                        )
                }
                </tbody>
            </table>
        </>
    )
}
