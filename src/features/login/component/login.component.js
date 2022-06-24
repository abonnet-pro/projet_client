import '../login.css'
import {useState} from "react";
import {connect} from "../service/login.service";
import {useNavigate} from "react-router";

export default function Login() {

    const [form, setForm] = useState({ login: 'admin@submyzine.fr', password: 'admin' });
    const navigate = useNavigate();

    const handleChange = (event) => {
        const key = event.target.name
        const value = event.target.value
        setForm({ ...form, [key]: value })
    }

    const handleSubmit = (event) => {
        event.preventDefault();

        const user = {
            login: form.login,
            password: form.password
        }

        connect(user, navigate);
    }

    return(
        <div className='form-login'>
            <div className="account-wall">
                <h1 className="text-center login-title">Connexion</h1>
                <img className="profile-img"
                     src="https://lh5.googleusercontent.com/-b0-k99FZlyE/AAAAAAAAAAI/AAAAAAAAAAA/eu7opA4byxI/photo.jpg?sz=120"
                     alt=""/>
                    <form className="form-signin" onSubmit={ handleSubmit }>
                        <input name="login" type="email" className="form-control" placeholder="Login" autoFocus value={ form.login } onChange={ handleChange } required/>
                        <input name="password" type="password" className="form-control" placeholder="Password" value={ form.password } onChange={ handleChange } required/>
                        <button className="btn btn-lg btn-primary btn-block connexion" type="submit">Connexion</button>
                    </form>
            </div>
        </div>
    )
}
