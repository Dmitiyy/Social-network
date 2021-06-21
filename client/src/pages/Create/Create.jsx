import { useState } from 'react';
import {useDispatch, useSelector} from 'react-redux';
import FileBase64 from 'react-file-base64';
import { setLoading } from '../../store/actions/auth';
import { useHistory } from 'react-router';
import './create.sass';
import './media-create.sass';

const Create = () => {
    const [pTitle, setPTitle] = useState('');
    const [pDescription, setPDescription] = useState('');
    const [pPhoto, setPPhoto] = useState('');
    const token = useSelector(state => state.token);
    const dispatch = useDispatch();
    const [err, setErr] = useState(false);
    const [errMes, setErrMes] = useState(false);
    const history = useHistory()

    const getTitle = (event) => setPTitle(event.target.value);
    const getDescription = (event) => setPDescription(event.target.value);
    const getPhoto = (event) => setPPhoto(event[0].base64);
    const loading = useSelector(state => state.loading);

    const submit = (event) => {
        event.preventDefault();
        
        const data = {title: pTitle, description: pDescription, image: pPhoto};
        
        const fetchData = async (url) => {
            dispatch(setLoading(true));
            
            const response = await fetch(url, {
                method: 'POST',
                headers: {
                    'Content-type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                    'Accept': 'application/json'
                },
                body: JSON.stringify(data)
            });

            dispatch(setLoading(false));
            return await response.json();
        };
        fetchData('/api/posts').then(result => {
            if (result.status === 'success') {
                history.push('/');
            } else if (result.status === 'fail') {
                setErr(true);
                setErrMes(result.data.message);
            }
        });
    }

    return (
        <div className="create">
            <h2 className="create__title">Create post</h2>
            <form className="create__form">
                <label htmlFor="title">Post title <span>*</span></label>
                <input type="text" name="title" onChange={(e) => getTitle(e)} />
                <label htmlFor="description">Post description <span>*</span></label>
                <textarea className="create__form-description" 
                name="description" onChange={(e) => getDescription(e)} />
                <label htmlFor="image">Post image</label>
                <FileBase64 multiple={true} name="image" onDone={(e) => getPhoto(e)} />
                {
                    err ? (<p style={{
                        color: 'red', 
                        fontSize: '15px', 
                        marginTop: '15px'
                    }}>{errMes}</p>) : ""
                }
                <p></p>
                <button className="create__btn" 
                onClick={(e) => submit(e)}
                style={{
                    opacity: loading ? '0.5' : '1'
                }}
                >Create post</button>
            </form>
        </div>
    )
}

export default Create;