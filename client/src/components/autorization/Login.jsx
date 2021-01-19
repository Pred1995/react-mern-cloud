import React, {useState} from 'react';
import { login } from '../../actions/user';
import Input from '../../utils/input/Input';
import "./autorization.scss"
import {useDispatch} from "react-redux"

const Login = () => {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const dispatch = useDispatch()
    return (
        <div className="autorization">
            <div className="autorization__header">Авторизация</div>
            <div className="autorization__inputs">
                <Input value={email} setValue={setEmail} type="text" placeholder="Введите email"/>
                <Input value={password} setValue={setPassword} type="password" placeholder="Введите пароль"/>
            </div>
            <div className="autorization__btn" onClick={() => dispatch(login(email,password))}>Войти</div>
        </div>
    );
};

export default Login;