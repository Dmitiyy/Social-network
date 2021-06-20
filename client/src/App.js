import {BrowserRouter as Router, Switch, Route} from "react-router-dom";
import { useDispatch } from "react-redux";
import Main from './pages/Main';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Profile from "./pages/Profile";
import Create from "./pages/Create";
import { setToken } from "./store/actions/auth";
import './app.sass';

function App() {
  const dispatch = useDispatch();
  const token = localStorage.getItem('jwt');

  if (token) {
    dispatch(setToken({token, bool: true}));
  } else {
    dispatch(setToken({token, bool: false}));
  }

  return (
    <Router>
      <Switch>
        <Route path="/" exact component={Main} />
        <Route path="/signup" exact component={Signup} />
        <Route path="/login" exact component={Login} />
        <Route path="/profile" exact component={Profile} />
        <Route path="/create" exact component={Create} />
      </Switch>
    </Router>
  );
}

export default App;
