import React from 'react';
import './navbar.scss'
import Logo from "../../assets/img/navbar-icon.svg"
import { NavLink, Route } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { logout } from '../../reducers/userReducer';
import { useState } from 'react';
import { getFiles, searchFiles } from '../../actions/file';
import { showLoader } from '../../reducers/appReducers';
import avatarLogo from '../../assets/img/avatar.svg'
import { API_URL } from '../../config';

const Navbar = () => {
    const isAuth = useSelector(state => state.user.isAuth)
    const currentDir = useSelector(state => state.files.currentDir)
    const currentUser = useSelector(state => state.user.currentUser)
    const dispatch = useDispatch()
    const [searchName, setSearchName] = useState('')
    const [searchTimeout, setSearchTimeout] = useState(false)
    const avatar = currentUser.avatar ? `${API_URL + currentUser.avatar}` : avatarLogo
    function setSearchHandler(e) {
        setSearchName(e.target.value)
        if (searchTimeout != false) {
            clearTimeout(searchTimeout)
        }
        dispatch(showLoader())
        if (e.target.value !== '') {
            setSearchTimeout(setTimeout((value) => {
                dispatch(searchFiles(value))
            }, 500, e.target.value))
        } else {
            dispatch(getFiles(currentDir))
        }

    }
    return (
        <div className="navbar">
            <div className="container">
                <NavLink to="/">
                    <div className="navbar__header">TIKHON CLOUD</div> 
                </NavLink>
                {
                    <Route exact path='/' render={() => isAuth && <input value={searchName} onChange={e => setSearchHandler(e)} className="navbar__search" type="text" placeholder="Поиск файла"/> }/>
               
                }
                {!isAuth && <div className="navbar__login"><NavLink to="/login">Войти</NavLink></div>}
                {!isAuth && <div className="navbar__registration"><NavLink to="/registration">Регистрация</NavLink></div>} 
                {
                    <Route exact path='/' render={() => isAuth && <div className={`navbar__logout`} onClick={() => dispatch(logout())}>Выход</div> }/>
               
                }
                {
                    <Route exact path='/profile' render={() => isAuth && <div className={`navbar__logout ml`} onClick={() => dispatch(logout())}>Выход</div> }/>
               
                }
                {isAuth && 
                <NavLink to="/profile">
                    <img className="navbar__avatar" src={avatar} alt='Аватар'/>
                </NavLink>
                }
            </div>
        </div>
    );
};

export default Navbar;