const setToken = ({token, bool}) => {
    return {
        type: 'SET_TOKEN',
        payload: {token, bool}
    }
}

const setUserData = ({name, email, favoritePosts, myPosts}) => {
    return {
        type: 'SET_USER_DATA',
        payload: {name, email, favoritePosts, myPosts}
    }
}

const setLoading = (bool) => {
    return {type: 'LOADING', payload: bool}
}

export {setToken, setUserData, setLoading};