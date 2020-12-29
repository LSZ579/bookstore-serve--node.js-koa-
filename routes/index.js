const router = require('koa-router')()
const homeController = require('../controllers/home')
const userController = require('../controllers/user')
const orderController = require('../controllers/order')

router.prefix('/users')

router.get('/login', async(ctx, next) => {
    await ctx.render('login', {})
})
router.get('/post', async(ctx, next) => {
    await ctx.render('users/push', {
        warn: ''
    })
})

//添加
router.post('/addUser', userController.addUser)

router.get('/logout', homeController.logout)

router.post('/checkLogin', homeController.checklogin)

router.get('/administration/:id', userController.administration)

router.get('/search/:value', userController.search)

router.get('/popUser/:id', userController.popUser)

router.get('/details/:id', userController.getDetails)



module.exports = router

