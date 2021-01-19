import React from 'react';
import { useDispatch } from 'react-redux';
import { deleteAvatar, uploadAvatar } from '../../actions/user';
import './profile.scss'

const Profile = () => {
    const dispatch = useDispatch()

    function changeHandler(e) {
        const file = e.target.files[0]
        dispatch(uploadAvatar(file))
    }

    return (
        <div className="profile">
            <button onClick={() => dispatch(deleteAvatar())}>Удалить аватар</button>
            <div className="profile__upload">
                <input id="profile__upload-input" className="profile__upload-input" accept="image/*" onChange={e => changeHandler(e)} type="file" placeholder="Загрузить аватар"/>
                <label className="profile__upload-label" htmlFor="profile__upload-input"><span>Загрузить аватар</span></label>
            </div>
        </div>
    );
};

export default Profile;