import menusDessertsRouter from './menus_desserts.js'
import express from 'express'
var router = express.Router()

router.get('/', (req, res) => {
    res.send("This is the menu!")
})

router.use('/desserts', menusDessertsRouter)

export default router