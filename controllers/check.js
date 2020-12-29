const userDao = require('../service/operations_sql')
const md5 = require('../middlewares/md5')
const uuid = require('../middlewares/uuid')
const jwt = require('jsonwebtoken')

module.exports = {
    //个人所有订单
    mainOrder: async(ctx, next) => {
        let user = ctx.query
        const result = await userDao.order(user.user_id, user.page)

        // let sum = Math.ceil(result.totalCount / 6)
        ctx.body = {
            data: result,
            code: 1,
            solt: true
                // sum: sum
        }
    },
    // 所有订单
    allOrder: async(ctx, next) => {
        // let user = ctx.query
        const result = await userDao.AllOrder()

        // let sum = Math.ceil(result.totalCount / 6)

        ctx.body = {
            data: result,
            code: 1,
            solt: true
                // sum: sum
        }
    },

    //前端用户登录
    postlogin: async(ctx) => {
        // console.log(1, ctx.request.body)
        const {account, password} = ctx.request.body
        // console.log()
            // 查询用户
        const user = await userDao.postLogins(account)

            // 判断用户是否存在
        if (!user) {
            // 表示不存在该用户
            ctx.body = {
                code: -1,
                message: '该用户不存在'
            };
            return;
        }
        const payload = {
            user_id: user.id,
            user_name: user.account
        };
        if(!user.dataValues.solt){
            let solt = uuid.Uuid();
            let md5pass = await md5.MD5(user.dataValues.password, solt);
            const token = jwt.sign(payload, "gamercode", {
                expiresIn: 3600
            });
            await userDao.setSoltpass(user.dataValues.id, md5pass, solt);
            if(user !== null && password == user.dataValues.password){
                ctx.body = {
                    user,
                    code: 0,
                    token
                }
            }else{
                ctx.body = {
                    code: 1,
                    message: '登陆失败'
                }
            }
        }else{
            let pass = await md5.MD5(password, user.dataValues.solt);
            const token = jwt.sign(payload, "gamercode", {
                expiresIn: 3600
            });
            if(user !== null && pass == user.dataValues.password){
                ctx.body = {
                    user,
                    code: 0,
                    token
                }
            }else{
                ctx.body = {
                    code: 1,
                    message: '登陆失败'
                }
            }
        }
        
    },
    //  学生获取不同状态的订单
    getStuOrder: async(ctx, next) => {
        let user = ctx.query
        let order_state = user.order_state
        let page = user.page
        const result = await userDao.getStuOrder(user.user_id, order_state, page)

        const data = result.dataCount;
        const sum = Math.ceil(result.totalCount / 11)

        ctx.body = {
            data: data,
            sum: sum
        }
    },

    // 管理员获取不同状态订单
    getStateOrder: async(ctx, next) => {
        let config = ctx.query,
            order_state = config.order_state;

        const result = await userDao.stateOrder(order_state)

        ctx.body = {
            data: result,
            code: 1,
            solt: true
        }
    },
    // 获取个人不同状态订单
    getMainStateOrder: async(ctx, next) => {
        let config = ctx.query,
            order_state = config.order_state,
            user_id = config.user_id;

        const result = await userDao.mainStateOrder(user_id, order_state)

        ctx.body = {
            data: result,
            code: 1,
            solt: true
        }
    },


    //将配送中修改为已送达------送水工人
    setOrder: async(ctx, next) => {
        let id = ctx.query.id
        const data = await userDao.putOrder(id, 1)

        if (data[0] == 0) {
            ctx.body = {
                code: 0,
                message: '确认收货失败'
            }
        } else {
            ctx.body = {
                code: 1,
                message: '确认收货成功'
            }
        }
    },
    //将未配送修改为配送中------送水工人
    handleWater: async(ctx, next) => {
        const data = ctx.query;

        const result = await userDao.putOrder(data.id, 0);
        if (result == 1) {
            ctx.body = {
                code: 1,
                message: '已经开始为您配送!'
            }
        } else {
            ctx.body = {
                code: 0,
                message: '未知原因，配送失败!'
            }
        }

    },
    //生成水订单
    postWater: async(ctx, next) => {
        const user = ctx.query;
        const data = await userDao.getDeposit(user.user_id);
        console.log('用户id' + user.user_id)
        console.log('押金' + data[0].deposit.conditions)
        console.log('宿舍' + data[0].dorm)
        if (data[0].deposit.conditions == 0) {
            ctx.body = {
                code: 0
            }
        } else {
            await userDao.newOrder(user.user_id, data[0].dorm, 12)
            ctx.body = {
                code: 1
            }
        }
    },
    //生成押金订单
    orderDeposit: async(ctx, next) => {
        const data = ctx.query;
        // console.log('UserData:'+data.user_id)
        // console.log('UserData:'+data.dorm)
        const user = await userDao.getDeposit(data.user_id);

        if (user[0].deposit.conditions == 1) {
            ctx.body = {
                code: 0,
                message: '已支付过押金'
            }
        } else {
            await userDao.addDeposit(data.user_id, data.dorm);
            await userDao.changeDeposit(data.dorm, 1)
            ctx.body = {
                code: 1,
                message: '支付成功'
            }
        }
    }
}