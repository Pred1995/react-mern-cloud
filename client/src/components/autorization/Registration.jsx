import React, {useState} from 'react';
import { registration } from '../../actions/user';
import Input from '../../utils/input/Input';
import "./autorization.scss"
import {useDispatch} from "react-redux"

const Registration = () => {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const dispatch = useDispatch()
    return (
        <div className="autorization">
            <div className="autorization__header">Регистрация</div>
            <div className="autorization__inputs">
                <Input value={email} setValue={setEmail} type="text" placeholder="Введите email"/>
                <Input value={password} setValue={setPassword} type="password" placeholder="Введите пароль"/>
            </div>
            <div className="autorization__btn" onClick={() => dispatch(registration(email,password))}>Зарегистрироваться</div>
        </div>
    );
};

export default Registration;