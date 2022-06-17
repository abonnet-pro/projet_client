import './App.css';
import {UserContext} from "./services/usersContext.service";
import NavBar from "./features/common/navbar";
import {useEffect, useState} from "react";
import {getLocalStorage, USER_KEY} from "./services/localStorage.service";
import {contextPrototype} from "./services/usersContext.service";
import {Route, Routes, useNavigate} from "react-router";
import Home from "./features/home/home";
import Login from "./features/login/component/login.component";
import Logout from "./features/login/component/logout.component";
import {ToastContainer} from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import Publications from "./features/publications/component/publications.component";
import PublicationForm from "./features/publication/component/publication-form.component";
import PublicationDetail from "./features/publication/component/publication-detail.component";
import Clients from "./features/clients/component/clients.component";
import Client from "./features/client/component/client.component";

function App() {

    const [user, setUser] = useState(getLocalStorage(USER_KEY));

    contextPrototype.user = user;
    contextPrototype.setUser = setUser;

    const navigate = useNavigate();

    const checkAuth = () => {
        if(!contextPrototype.user) {
            navigate('/login')
        }
    }

    useEffect(checkAuth, []);

    return (
        <UserContext.Provider value={ contextPrototype }>
            <NavBar/>
            <main>
                <ToastContainer hideProgressBar/>

                <Routes>
                    <Route path='/' element={ <Home/> }/>
                    <Route path='/login' element={ <Login/> }/>
                    <Route path="/logout" element={ <Logout setUser={ setUser }/> }/>
                    <Route path="/publications" element={ <Publications/>}/>
                    <Route path="/publication/form" element={ <PublicationForm/>}/>
                    <Route path="/publication/:id" element={ <PublicationDetail/>}/>
                    <Route path="/clients" element={ <Clients/>}/>
                    <Route path="/client/:id" element={ <Client/>}/>
                </Routes>

            </main>
        </UserContext.Provider>
    );
}

export default App;
