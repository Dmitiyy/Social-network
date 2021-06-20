import { useSelector } from 'react-redux';
import './card.sass';
import './media-card.sass';

const Card = ({title, url, description, select, id, click}) => {
    const favoritePosts = useSelector(state => state.favoritePosts);
    const myOwnPosts = useSelector(state => state.myPosts);
    const token = useSelector(state => state.token);
    const selectedPostId = useSelector(state => state.selectedPostId);
    
    const handleSelect = (id) => {
        if (token) {
            click(id);

            const fetchData = async (url) => {
                const response = await fetch(url, {
                    method: 'PATCH',
                    headers: {
                        'Content-type': 'application/json',
                        'Authorization': `Bearer ${token}`
                    },
                    body: JSON.stringify({favoritePosts, myPosts: myOwnPosts, postId: selectedPostId})
                });
    
                return await response.json();
            }
    
            fetchData('/api/posts/addToFavorite');    
        }
    }

    return (
        <div className="list__card" id={id}>
            <div className="list__card-center">
                {
                    url.length !== 0 ? (
                        <div style={{
                            backgroundImage: `url(${url})`
                        }} className="list__card-photo" />
                    ) : ""
                }
                <h2 className="list__card-title" style={{
                    marginTop: url.length !== 0 ? "15px" : "0"
                }}>{title}</h2>
                <div className="list__card-wrap">
                    <p className="list__card-description">{description}</p>
                    <div className={select ? "list__card-select" : "list__card-selectn"} 
                    onClick={() => handleSelect(id)}/>
                </div>
            </div>
        </div>
    )
}

export default Card;