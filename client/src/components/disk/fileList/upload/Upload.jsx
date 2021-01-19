import React from 'react';
import './Upload.scss'
import UploadFile from './UploadFile';
import {useDispatch, useSelector} from 'react-redux'
import { hideUploader } from '../../../../reducers/uploadReducer';

const Upload = () => {
    const files = useSelector(state => state.upload.files)
    const isVisible = useSelector(state => state.upload.isVisible)
    const dispatch = useDispatch()
    return ( isVisible &&
        <div className="upload">
            <div className="upload__header">
                <div className="upload__title">Загрузки</div>
                <button className="upload__close" onClick={() => dispatch(hideUploader())}>X</button>
            </div>
            {files.map(file => <UploadFile key={file.id} file={file}/>)}
        </div>
    );
};

export default Upload;