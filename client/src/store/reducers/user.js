const initailState = {
    loggedIn: false,
    token: null,
    name: '',
    email: '', 
    favoritePosts: [], 
    myPosts: [],
    loading: false,
    allPosts: [],
};

const reducer = (state = initailState, action) => {
    switch (action.type) {
        case 'SET_TOKEN':
            const {token, bool} = action.payload;
            return {
                ...state, 
                loggedIn: bool,
                token: token
            }
        
        case 'SET_USER_DATA':
            const {name, email, favoritePosts, myPosts} = action.payload;
            return {
                ...state,
                name, 
                email, 
                favoritePosts, 
                myPosts
            }
        
        case 'LOADING':
            return {...state, loading: action.payload}

        case 'ADD_TO_FAVORITE':
            const postId = action.payload;
            let myFavoritePosts = state.favoritePosts;

            const currentPost = state.allPosts.filter(item => {
                return item._id === postId;
            });

            const isExistMy = state.myPosts.some(item => item._id === postId);

            if (isExistMy) {
                const indexMyPosts = state.myPosts.findIndex(item => item._id === postId);
                state.myPosts.splice(indexMyPosts, 1);   
                const indexAllPosts = state.allPosts.findIndex(item => item._id === postId);
                state.allPosts.splice(indexAllPosts, 1);   
                currentPost[0].like = false;
                return {...state, myPosts: state.myPosts, allPosts: state.allPosts}
            } else {
                const isExistFavorite = myFavoritePosts.some(item => item._id === postId);
    
                if (isExistFavorite) {
                    const index = myFavoritePosts.findIndex(item => item._id === postId);
                    myFavoritePosts.splice(index, 1);
                    currentPost[0].like = false;
                } else {
                    myFavoritePosts.push(currentPost[0]);
                    currentPost[0].like = true;
                };

                return {...state, favoritePosts: myFavoritePosts}
            }

        case 'GET_ALL_POSTS':
            return {...state, allPosts: action.payload}

        case 'CHANGE_ALL_POSTS':
            const indexs = [];

            state.allPosts.forEach((item, index) => {
                state.favoritePosts.forEach(elem => {
                    if (item._id === elem._id) {
                        indexs.push(index);
                    }
                });
                state.myPosts.forEach(elem => {
                    if (item._id === elem._id) {
                        indexs.push(index);
                    }
                });
            });

            if (indexs.length !== 0) {
                indexs.forEach(index => {
                    let item = state.allPosts[index];
                    item.like = true;
                });
            }

            const allPosts = state.allPosts; 

            return {...state, allPosts}

        default:
            return state;
    }
}

export default reducer;