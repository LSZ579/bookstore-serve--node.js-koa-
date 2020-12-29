const router = require('koa-router')(), 
    Sql = require('../service/operations_sql'),
    check = require('../controllers/check');   

    // 接口前缀
router.prefix('/login')

router.post('/', check.postlogin)

router.post('/registered', async (ctx, next) => {
    let data;
    let parms = ctx.request.body,
    user=await Sql.checkUser(parms);
    if(user){
        data="此邮箱已存在"
    }else{
        data = await Sql.registered(parms);
        console.log(parms)
    
    if (data) {
        data.dataValues['statu'] = '200'
    } else {
        data = {
            statu: '404'
        }
    }
    }
   
    ctx.body = data
})

module.exports = router;