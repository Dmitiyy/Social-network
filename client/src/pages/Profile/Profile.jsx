import { useEffect } from 'react';
import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import Card from '../../components/Card';
import Loading from '../Loading';
import { addToFavorite, getAllPosts } from '../../store/actions/user';
import { setLoading, setUserData } from '../../store/actions/auth';
import './profile.sass';
import './media-profile.sass';

const Profile = () => {
    const name = useSelector(state => state.name);
    const email = useSelector(state => state.email);
    const loggedIn = useSelector(state => state.loggedIn);
    const token = useSelector(state => state.token);
    const dispatch = useDispatch();
    const loading = useSelector(state => state.loading);
    const myPosts = useSelector(state => state.myPosts);
    let favoritePosts = useSelector(state => state.favoritePosts);
    const [rendera, setRedera] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            dispatch(setLoading(true));

            const getData = async (url) => {
                const response = await fetch(url, {
                    headers: {'Content-Type': 'application/json', 'Accept': 'application/json'}
                });
                return await response.json();
            }
            await getData('/api/posts/').then(result => {
                dispatch(getAllPosts(result.data));
            });
    
            const getUser = async (url) => {
                const response = await fetch(url, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`,
                        'Accept': 'application/json'
                    }
                });
                return await response.json();
            }
            await getUser('/api/users/getUser').then(result => {
                const {name, email, favoritePosts, myPosts} = result.data;
                dispatch(setUserData({name, email, favoritePosts, myPosts}));
                setRedera(favoritePosts);
            });
    
            dispatch(setLoading(false));
        } 
        fetchData();
    }, [dispatch, token]);

    const handleSelect = (id) => {
        dispatch(addToFavorite(id));
        setRedera([...favoritePosts]);
    }

    return !loggedIn ? (<h1>You didn't log in</h1>) : !loading ? (
        <div className="profile">
            <div className="profile__user">
                <h2 className="profile__user-name">{name}</h2>
                <p className="profile__user-email">{email}</p>
            </div>
            <h2 className="profile__title-posts">My posts</h2>
            {
                myPosts && myPosts.length !== 0 ?
                myPosts.map((item, index) => {
                    return (
                        <Card 
                            key={item._id + index}
                            id={item._id}
                            title={item.title} 
                            description={item.description}
                            select={true}
                            url={item.image}
                            click={handleSelect}
                        />
                    )
                }) : (<h2 style={{marginTop: '15px'}}>You don't have any own post</h2>)
            }
            <Link to="/create">
                <button className="profile__btn-create">Create post</button>
            </Link>
            <h2 className="profile__title-posts">Favorite posts</h2>
            {
                favoritePosts && favoritePosts.length !== 0 ?
                rendera.map((item) => {
                    return (
                        <Card 
                            key={item._id}
                            id={item._id}
                            title={item.title} 
                            description={item.description}
                            select={true}
                            url={item.image}
                            click={handleSelect}
                        />
                    )
                }) : (<h2 style={{marginTop: '15px'}}>You don't have any favorite post</h2>)
            }
        </div>
    ) : (<Loading />)
}

export default Profile;