import React from 'react';
import "./input.scss"

const Input = (props) => {
    return (
        <input className={props.className} value={props.value} onChange={(event) => props.setValue(event.target.value)} type={props.type} placeholder={props.placeholder}/>
    );
};

export default Input;