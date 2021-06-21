import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { useHistory } from 'react-router';
import { setLoading, setToken, setUserData } from '../../store/actions/auth';
import './signup.sass';

const Signup = () => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');
    const history = useHistory();

    const handleName = (event) => setName(event.target.value);
    const handleEmail = (event) => setEmail(event.target.value);
    const handlePassword = (event) => setPassword(event.target.value);
    const dispatch = useDispatch();

    const handleForm = (event) => {
        event.preventDefault();
        const data = {name, email, password};

        const submit = async (url) => {
            const response = await fetch(url, {
                method: 'POST',
                body: JSON.stringify(data),
                headers: {'Content-Type': 'application/json', 'Accept': 'application/json'}
            });
            
            return await response.json();
        }

        submit('/api/users/signup').then(result => {
            if (result.status === 'success') {
                localStorage.setItem('jwt', result.token);
                const {name, email, favoritePosts, myPosts} = result.data;
                dispatch(setUserData({name, email, favoritePosts, myPosts}));
                dispatch(setToken({token: result.token, bool: true}));
                dispatch(setLoading(true));
                history.push('/');
            } else if (result.status === 'fail') {
                setError(true);
                setErrorMessage(result.data.message);
            }
        });
    }

    return (
        <div className="signup">
            <div className="center">
                <h2 className="signup__title">Sign up</h2>
                <form className="signup__form">
                    <label htmlFor="name" className="signup__form-item">Name</label>
                    <input type="text" id="name" name="name" onChange={(e) => handleName(e)} />
                    <label htmlFor="email" className="signup__form-item">Email</label>
                    <input type="text" id="email" name="email" onChange={(e) => handleEmail(e)} />
                    <label htmlFor="password" className="signup__form-item">Password</label>
                    <input type="password" id="password" name="password" onChange={(e) => handlePassword(e)} />
                    {
                        error ? (
                            <p className="signup__form-error">{errorMessage}</p>
                        ) : ""
                    }
                    <button className="signup__form-btn" onClick={(e) => handleForm(e)}>Submit</button>
                </form>
            </div>
        </div>
    )
}

export default Signup;  