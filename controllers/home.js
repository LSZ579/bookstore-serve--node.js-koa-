const user = require('../service/user')
const userDao = require('../service/operations_sql')
const passport = require('../middlewares/passport')

module.exports = {
    login: async(ctx, next) => {
        await ctx.render('login', { error: '' })
    },
    index: async(ctx, next) => {
        if (!ctx.isAuthenticated()) { 
            await ctx.render('login', { error: '请重新登陆' })
        } else {
            let userInfo = ctx.state.user

            await ctx.render('index', {
                userInfo: userInfo,
                power: userInfo.type
            })
        }
    },
    checklogin: async(ctx, next) => {
        // let {user_id,password} = ctx.request.body;
        //squlize封装形式
        // const data = await userDao.postLogin(user_id, password);
        // if(data.password === password){
        //   ctx.session.userId = user_id;
        //   ctx.session.userName = data.user_name;
        //   ctx.response.redirect('/');
        // }else{
        //   ctx.body = { success: false, msg: '账号或密码错误！' };
        // }

        //原生sql语句方式
        // let statedata = await user.checkUser(user_id,password);
        // if(statedata.code == '200'){
        //   ctx.session.userId = user_id;
        //   ctx.session.userName = statedata.userName;
        //   ctx.response.redirect('/');
        // } else{
        //   ctx.body = { success: false, msg: '账号或密码错误！' };
        // }  
        return passport.authenticate('local', async(err, user, info) => {
            console.log(user, 1)
            if (err) {
                await ctx.render('error', { message: '权限验证错误', error, err });
            }
            if (!user) {
                await ctx.render('login', { error: info })
            } else {
                ctx.login(user)
                await ctx.response.redirect('/')
            }
        })(ctx);
    },
    logout: async(ctx, next) => {
        ctx.logout()
        await ctx.render('login', { error: '' })
    },
    getUserRoles: async(ctx, next) => {
        let user_id = ctx.state.user.user_id;
        //squlize封装形式
        const data = await userDao.getUserRoleInfo(user_id);
        // console.log('-------');
        // console.log(+data[0].role);
        let roles = data[0].role.role_name;
        let power = data[0].role_id;
        await ctx.render('index', {
            title: '用户详情',
            user_id: user_id,
            user_roles: roles,
            power: power
        })
    }
}