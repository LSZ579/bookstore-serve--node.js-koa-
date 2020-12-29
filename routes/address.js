const router = require('koa-router')(), 
    Sql = require('../service/operations_sql');   

router.prefix('/address')

// 根据用户ID查找用户的所有地址
router.get('/getUserAddress', async (ctx, next) => {
    let parms = ctx.query,
        data = await Sql.getUserAddress(parms.userID);
    ctx.body = data
})

// 根据地址ID查找地址信息
router.get('/getAddress', async (ctx, next) => {
    let parms = ctx.query,
        data = await Sql.getAddress(parms.id);
    
    ctx.body = data
})

// 删除地址
router.get('/deleteAddress', async (ctx, next) => {
    let parms = ctx.query,
        data = await Sql.deleteAddress( parms.id );

    ctx.body = data
})

// 修改地址
router.post('/setAddress', async (ctx, next) => {
    let parms = ctx.request.body,
        data = await Sql.setAddress( parms.id, parms.data );
    
    ctx.body = data
})

// 添加地址
router.post('/addAddress', async (ctx, next) => {
    let parms = ctx.request.body,
        data = await Sql.addAddress( parms.userID, parms.data );
   
    ctx.body = data
})



module.exports = router;