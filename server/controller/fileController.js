const fileService = require('../services/fileService')
const config = require('config');
const fs = require('fs')
const User = require('../models/User')
const File = require('../models/File');
const Uuid = require('uuid')

class FileController {
    async createDir(req, res) {
        try {
            const {name, type, parent} = req.body
            const file = new File({name, type, parent, user: req.user.id})
            const parentFile = await File.findOne({_id: parent})
            if(!parentFile) {
                file.path = name
                await fileService.createDir(req, file)
            } else {
                file.path = `${parentFile.path}\\${file.name}`
                await fileService.createDir(req, file)
                parentFile.childs.push(file._id)
                await parentFile.save()
            }
            await file.save()
            return res.json(file)
        } catch (e) {
            return res.status(400).json(e)
        }
    }

    async getFiles(req, res) {
        try {
            const {sort} = req.query
            let files;
            switch (sort) {
                case 'name':
                    files = await File.find({user: req.user.id, parent: req.query.parent}).sort({name: 1})
                    break;
                case 'type':
                    files = await File.find({user: req.user.id, parent: req.query.parent}).sort({type: 1})
                    break;
                case 'date':
                    files = await File.find({user: req.user.id, parent: req.query.parent}).sort({date: 1})
                    break;
                default:
                    files = await File.find({user: req.user.id, parent: req.query.parent})
                    break; 
            }
            return res.json(files)
        } catch (e) {
            return res.status(500).json({message: "Файл не был найден"})
        }
    }
    async uploadFile(req, res) {
        try {
            const file = req.files.file

            const parent = await File.findOne({user: req.user.id, _id: req.body.parent})
            const user = await User.findOne({_id: req.user.id})

            if (user.usedSpace + file.size > user.diskSpace) {
                return res.status(400).json({message: 'Не хватает места на диске'})
            }

            user.usedSpace = user.usedSpace + file.size

            let path;
            if (parent) {
                path = `${req.filePath}\\${user._id}\\${parent.path}\\${file.name}`
            } else {
                path = `${req.filePath}\\${user._id}\\${file.name}`
            }

            if (fs.existsSync(path)) {
                return res.status(400).json({message: 'Файл уже существует'})
            }
            file.mv(path)

            const type = file.name.split('.').pop()
            let filePath = file.name
            if (parent) {
                filePath = parent.path + '\\' + file.name
            }
            const dbFile = new File({
                name: file.name,
                type,
                size: file.size,
                path: filePath,
                parent: parent ? parent._id : null,
                user: user._id
            })

            await dbFile.save()
            await user.save()

            res.json(dbFile)
        } catch (e) {
            return res.status(500).json({message: "Ошибка загрузки"})
        }
    }
    async downloadFile(req, res) {
        try {
            const file = await File.findOne({_id: req.query.id, user: req.user.id})
            const path = fileService.getPath(req, file)
            if (fs.existsSync(path)) {
                return res.download(path, file.name)
            }
            return res.status(400).json({message: "Ошибка при скачивании "})
        } catch (e) {
            return res.status(500).json({message: "Ошибка при скачивании файла "})
        }
    }

    async deleteFile (req, res) {
        try {
            const file = await File.findOne({_id: req.query.id, user: req.user.id})
            if (!file) {
                return res.status(400).json({message: 'Файл не найден'})
            }
            fileService.deleteFile(req, file)
            await file.remove()
            return res.json({message: 'Файл удален'})

        } catch (e) {
            return res.status(400).json({message: "Директория не пустая"})
        }
    }
    async searchFiles (req, res) {
        try {
            const searchName = req.query.search
            let files = await File.find({user: req.user.id})
            files = files.filter(file => file.name.includes(searchName))
            return res.json(files)

        } catch (e) {
            return res.status(400).json({message: "Ошибка при поиске"})
        }
    }
    async uploadAvatar (req, res) {
        try {
            const file = req.files.file
            const user = await User.findById(req.user.id)
            const avatarName = Uuid.v4() + ".jpg"
            file.mv(config.get('staticPath') + "\\" + avatarName)
            user.avatar = avatarName
            await user.save()
            return res.json(user)

        } catch (e) {
            return res.status(400).json({message: "Ошибка при загрузке аватара"})
        }
    }
    async deleteAvatar (req, res) {
        try {
            const user = await User.findById(req.user.id)
            fs.unlinkSync(config.get('staticPath') + '\\' + user.avatar)
            user.avatar = null
            await user.save()
            return res.json(user)

        } catch (e) {
            return res.status(400).json({message: "Ошибка при удалении аватара"})
        }
    }

}

module.exports = new FileController()