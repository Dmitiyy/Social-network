import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { useHistory } from 'react-router';
import { setLoading, setToken } from '../../store/actions/auth';
import './login.sass';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');
    const history = useHistory();

    const handleEmail = (event) => setEmail(event.target.value);
    const handlePassword = (event) => setPassword(event.target.value);
    const dispatch = useDispatch();

    const handleForm = (event) => {
        event.preventDefault();
        const data = {email, password};

        const submit = async (url) => {
            const response = await fetch(url, {
                method: 'POST',
                body: JSON.stringify(data),
                headers: {'Content-Type': 'application/json'}
            });
            
            return await response.json();
        }

        submit('/api/users/login').then(result => {
            if (result.status === 'success') {
                localStorage.setItem('jwt', result.token);
                dispatch(setToken({token: result.token, bool: true}));
                dispatch(setLoading(true));
                history.push('/');
            } else if (result.status === 'fail') {
                setError(true);
                setErrorMessage(result.data);
            }
        });
    }
    return (
        <div className="login">
            <div className="center">
                <h2 className="login__title">Log in</h2>
                <form className="login__form">
                    <label htmlFor="email" className="login__form-item">Email</label>
                    <input type="text" id="email" name="email" onChange={(e) => handleEmail(e)} />
                    <label htmlFor="password" className="login__form-item">Password</label>
                    <input type="password" id="password" name="password" onChange={(e) => handlePassword(e)} />
                    {
                        error ? (
                            <p className="signup__form-error">{errorMessage}</p>
                        ): ""
                    }
                    <button className="login__form-btn" onClick={(e) => handleForm(e)}>Submit</button>
                </form>
            </div>
        </div>
    )
}

export default Login;