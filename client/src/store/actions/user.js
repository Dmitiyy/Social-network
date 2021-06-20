const addToFavorite = (post) => {
    return {
        type: 'ADD_TO_FAVORITE',
        payload: post
    }
};

const getAllPosts = (data) => {
    return {
        type: 'GET_ALL_POSTS',
        payload: data
    }
};

const changeAllPosts = () => {
    return {type: 'CHANGE_ALL_POSTS'}
}

export {addToFavorite, getAllPosts, changeAllPosts};