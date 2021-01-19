import React, {useEffect} from 'react';
import Navbar from './navbar/Navbar';
import "./app.scss"
import {BrowserRouter as Router, Switch, Route, Redirect} from 'react-router-dom'
import Registration from './autorization/Registration';
import Login from './autorization/Login';
import { useDispatch, useSelector } from 'react-redux';
import { auth } from '../actions/user';
import Disk from './disk/Disk';
import Profile from './profile/Profile';

function App() {
    const isAuth = useSelector(state => state.user.isAuth)
    const dispatch = useDispatch()

    useEffect(() => {
      dispatch(auth())
    }, [])

    return (
      <Router>
        <div className="app">
          <Navbar />
          <div className="wrap">
            {
            !isAuth ? 
              <Switch>
                <Route path="/registration" component={Registration}/>
                <Route path="/login" component={Login}/>
                <Redirect to="/"/>
              </Switch>
            : 
              <Switch>
                <Route exact path="/" component={Disk}/>
                <Route exact path="/profile" component={Profile}/>
                <Redirect to="/"/>
              </Switch>
            }
            
          </div>
        </div>
      </Router>
    );
}

export default App;
