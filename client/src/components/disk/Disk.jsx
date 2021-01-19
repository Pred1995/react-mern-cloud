import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { createDir, getFiles, uploadFile } from '../../actions/file';
import FileList from './fileList/FileList'
import './disk.scss'
import Popup from './Popup';
import { setCurrentDir, setFileView, setPopupDisplay } from '../../reducers/fileReducer';
import Upload from './fileList/upload/Upload';
import backIcon from '../../assets/img/back.svg'

const Disk = () => {
    const dispatch = useDispatch()
    const currentDir = useSelector(state => state.files.currentDir)
    const loader = useSelector(state => state.app.loader)
    const dirStack = useSelector(state => state.files.dirStack)
    const [dragEnter, setDragEnter] = useState(false)
    const [sort, setSort] = useState('type')

    useEffect(() => {
        dispatch(getFiles(currentDir, sort))
    }, [currentDir, sort])

    function showPopupHandler() {
        dispatch(setPopupDisplay('flex'))
    }
    function backClickHandler() {
        const backDirId = dirStack.pop()
        dispatch(setCurrentDir(backDirId))
    }
    function fileUploadHandler(event) {
        const files = [...event.target.files]
        files.forEach(files => dispatch(uploadFile(files, currentDir)))
    }

    function dragEnterHandler(e) {
        e.preventDefault()
        e.stopPropagation()
        setDragEnter(true)
    }
    function dragLeaveHandler(e) {
        e.preventDefault()
        e.stopPropagation()
        setDragEnter(false)
    }

    function dropHandler(e) {
        e.preventDefault()
        e.stopPropagation()
        let files = [...e.dataTransfer.files]
        files.forEach(files => dispatch(uploadFile(files, currentDir)))
        setDragEnter(false)
    }

    if (loader) {
        return (
            <div className="loader">
                <div className="lds-spinner"><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div></div>
            </div>
        )
    } 


    return ( !dragEnter ?
        <div className="disk" onDragEnter={dragEnterHandler} onDragLeave={dragLeaveHandler} onDragOver={dragEnterHandler}>
            <div className="disk__btns">
                <button className="disk__back" onClick={() => backClickHandler()}><img src={backIcon}/></button>    
                <button className="disk__create" onClick={() => showPopupHandler()}>Создать новую папку</button>   
                <div className="disk__upload">
                    <label htmlFor="disk__upload-input" className="disk__upload-label">Загрузить файл</label>
                    <input multiple={true} onChange={(e) => fileUploadHandler(e)} type="file" id='disk__upload-input' className="disk__upload-input"/>
                </div>
                <select value={sort} onChange={(e) => setSort(e.target.value)} className="disk__select">
                    <option value="name">По имени</option>
                    <option value="type">По типу</option>
                    <option value="date">По дате</option>
                </select>
                <button className="disk__plate" onClick={() => dispatch(setFileView('plate'))}/>
                <button className="disk__list" onClick={() => dispatch(setFileView('list'))}/>
            </div>  
            <FileList/>
            <Popup/>
            <Upload/>
        </div>
        : 
        <div className="drop-area" onDrop={dropHandler} onDragEnter={dragEnterHandler} onDragLeave={dragLeaveHandler} onDragOver={dragEnterHandler}>
            Перетащите файлы сюда
        </div>
    );  
};

export default Disk;