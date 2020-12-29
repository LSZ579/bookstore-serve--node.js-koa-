const router = require('koa-router')(), 
    Sql = require('../service/operations_sql'),
    sd = require('silly-datetime');

router.prefix('/orders')

// 新增借书申请
router.post('/addOrders', async (ctx, next) => {
    let parms = ctx.request.body, 
        data = await Sql.addOrders(parms);
        ctx.body = data
})

// 根据用户账号查订单
router.get('/getOrders', async (ctx, next) => {
    let parms = ctx.query, 
        data = await Sql.getOrders(parms);
    ctx.body = data
})

// 获取消息
router.get('/message', async (ctx, next) => {
    let parms = ctx.query, 
        data = await Sql.getMessage(parms);
    ctx.body = data
})

// 根据订单ID删除
router.get('/deleteOrders', async (ctx, next) => {
    let parms = ctx.query, 
        data = await Sql.deleteOrders(parms.id);
    ctx.body = data
})

// 根据订单ID改变订单状态
router.post('/setOrders', async (ctx, next) => {
    
    let parms = ctx.request.body,
        data = await Sql.setOrders(parms.id, parms.statu, parms.sure);
        
    ctx.body = data
})

// resloveLend
router.post('/resloveLend', async (ctx, next) => {
    let parms = ctx.request.body,
     data = await Sql.resloveLend(parms);
    ctx.body = data
})

//getlendBook 
router.post('/getlendBook', async (ctx, next) => {
    let parms = ctx.request.body,
     data = await Sql.getlendBook(parms);
    ctx.body = data
})
// 还书操作
router.post('/backBook', async (ctx, next) => {
    let parms = ctx.request.body,
     data = await Sql.backBook(parms);
    ctx.body = data
})
module.exports = router;