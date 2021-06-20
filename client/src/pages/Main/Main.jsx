import { useEffect } from 'react';
import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import Card from '../../components/Card';
import { setLoading, setToken, setUserData } from '../../store/actions/auth';
import { addToFavorite, changeAllPosts, getAllPosts } from '../../store/actions/user';
import Loading from '../Loading/';
import './main.sass';
import './media-main.sass';

const Main = () => {
    const [data, setData] = useState([]);
    const [news, setNews] = useState([]);
    const loggedIn = useSelector(state => state.loggedIn);
    const token = useSelector(state => state.token);
    const dispatch = useDispatch();
    const name = useSelector(state => state.name);
    const loading = useSelector(state => state.loading);

    useEffect(() => {
        const fetchData = async () => {
            dispatch(setLoading(true));

            const getData = async (url) => {
                const response = await fetch(url, {
                    headers: {'Content-Type': 'application/json'}
                });
                return await response.json();
            }
            await getData('/api/posts/').then(result => {
                const data = result.data.reverse(); 
                setData([...data]);
                setNews(data.slice(0, 5));
                dispatch(getAllPosts(result.data));
            });
            
            if (loggedIn) {
                const getUser = async (url) => {
                    const response = await fetch(url, {
                        method: 'GET',
                        headers: {
                            'Content-Type': 'application/json',
                            'Authorization': `Bearer ${token}`
                        }
                    });
                    return await response.json();
                }
                await getUser('/api/users/getUser').then(result => {
                    const {name, email, favoritePosts, myPosts} = result.data;
                    dispatch(setUserData({name, email, favoritePosts, myPosts}));
                });
                dispatch(changeAllPosts());
            }

            dispatch(setLoading(false));
        }
        fetchData();
    }, [token, dispatch, loggedIn]);

    const logout = () => {
        localStorage.removeItem('jwt');
        dispatch(setToken({token: null, bool: false}));
        dispatch(setUserData({name: '', email: '', favoritePosts: [], myPosts: []}));
    }    

    const handleSelect = (id) => {
        dispatch(addToFavorite(id));
        setData([...data]);
    }

    return loading ? (<Loading />) : (
        <div className="main">
            <nav className="nav">
                <h1>Falet</h1>
                <div className="nav__data">
                    {
                        loggedIn ? (
                            <>
                                <button className="nav__data-logout" onClick={logout}>Log out</button>
                                <Link to="/profile"><p className="nav__data-name">{name}</p></Link>
                            </>
                        ) : (
                           <>
                                <Link to="/signup">
                                    <p className="nav__data-reg">Sign up</p>
                                </Link>
                                <Link to="/login">
                                    <p className="nav__data-reg">Log in</p>
                                </Link>
                           </> 
                        )
                    }
                </div>
            </nav>
            <section className="content">
                <div className="list">
                    {data.map(item => {
                        return (
                            <Card 
                                key={item._id}
                                id={item._id}
                                title={item.title} 
                                description={item.description}
                                select={item.like}
                                url={item.image}
                                click={handleSelect}
                            />
                        )
                    })}
                </div>
                <div className="news">
                    <h2 className="news__title">News:</h2>
                    <ul className="news__wrap">
                        {
                            news.map(item => {
                                return (
                                    <li className="news__item" key={item._id}>
                                        <a href={`#${item._id}`}>{item.title}</a>
                                    </li>
                                )
                            })
                        }
                    </ul>
                </div>
            </section>
            <footer className="footer">
                <a 
                    href="https://www.instagram.com/daptellum.dev/" 
                    rel="noreferrer" 
                    target="_blank"
                >
                    <h2 className="footer__title">daptellum.dev</h2>
                </a>
            </footer>
        </div>
    )
}

export default Main;