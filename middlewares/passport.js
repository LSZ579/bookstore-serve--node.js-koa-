const passport = require('koa-passport')
var LocalStrategy = require('passport-local').Strategy
const userDao = require('../service/operations_sql')
const uuid = require('../middlewares/uuid')
const md5 = require('../middlewares/md5')
const JwtStrategy = require('passport-jwt').Strategy
const ExtractJwt = require('passport-jwt').ExtractJwt 
var opts = {}

// 得到token 
opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();

// 设置token时使用的加密名字
opts.secretOrKey = 'gamercode';

passport.use(new LocalStrategy({
        usernameField:'user_id',
        passwordField:'password'
    },
    async function (username, password, done) {
        let result = await userDao.postLogins(username);
        if(result == null){
            return done(null,false,'账户密码错误')
        }
        if(!result.dataValues.solt){
            let solt = uuid.Uuid();
            let md5pass = await md5.MD5(result.dataValues.password, solt);
            await userDao.setSoltpass(result.dataValues.id, md5pass, solt);
            if(result !== null && password == result.dataValues.password){
                return done(null,result,'登录成功')
            }else{
                return done(null,false,'账户密码错误')
            }
        }else{
            let pass = await md5.MD5(password, result.dataValues.solt);
            if(result !== null && pass == result.dataValues.password){
                return done(null, result.dataValues, '登录成功')
            }else{
                return done(null,false,'账户密码错误')
            }
        }
    }
))

passport.use(new JwtStrategy(opts,async (jwt_payload,done)=>{
    // jwt_payload 返回的是登陆时返回的数据 即payload
    const user = await userDao.getUserInfo(jwt_payload.user_id);
    if(user){
        done(null,user);
    }else{ 
        done(null,false);
    }
}))

// serializeUser 在用户登录验证成功以后会把用户的数据存储到session中
passport.serializeUser(function(user,done){
    user.password = ''
    console.log('user:'+user);
    done(null,user)
})

// deserializeUser 在每次请求的时候将从session中读取用户对象
passport.deserializeUser(function(user,done){
    done(null,user)
})
module.exports = passport