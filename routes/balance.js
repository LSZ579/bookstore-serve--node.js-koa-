const router =require('koa-router')(), 
        Sql = require('../service/operations_sql'); 
        
router.prefix('/balance')

// 获取余额
router.get('/getBalance', async (ctx, next) => {
    
    let parms = ctx.query, 
        data = await Sql.getBalance(parms.userID);

        ctx.body = data
})


// 改变余额
router.post('/addBalance', async (ctx, next) => {
 
    let parms = ctx.request.body,
        balance = await Sql.getBalance(parms.userID),
        data,
        runPirce = balance ? balance.runPirce + parms.runPirce : parms.runPirce;

    if (!balance) {
        data =  await Sql.addBalance(parms);
    } else {
        data = await Sql.setBalance({userID:parms.userID,runPirce});
    }

    ctx.body = {
        data,code:0
    }
})

module.exports = router;