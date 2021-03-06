const Koa = require('koa')
const app = new Koa()
const views = require('koa-views')
const json = require('koa-json')
const onerror = require('koa-onerror')
const bodyparser = require('koa-bodyparser')
const logger = require('koa-logger')
const session = require('koa-session')
const passport = require('./middlewares/passport')
const jwt = require('jsonwebtoken')

const koajwt = require('koa-jwt')
const addToken = require('./middlewares/token')

const cors = require('koa2-cors') // 处理跨域
const uuid = require('./middlewares/uuid')
const md5 = require('./middlewares/md5')
const koaBody = require('koa-body');

const log4js = require('./util/log4j')

// app.use(koaBody({
//     multipart: true,
//     formidable: {
//         maxFileSize: 2000*1024*1024    // 设置上传文件大小最大限制，默认2M
//     }
// }));
// error handler
onerror(app)

app.keys = ['this is my secret set'];

app.use(session({
    key: 'koa:sess',
    /** cookie的名称，可以不管 */
    maxAge: 7200000000,
    /** (number) maxAge in ms (default is 1 days)，cookie的过期时间，这里表示2个小时 */
    overwrite: true,
    /** (boolean) can overwrite or not (default true) */
    httpOnly: true,
    /** (boolean) httpOnly or not (default true) */
    signed: true,
    /** (boolean) signed or not (default true) */
}, app));

app.use(koaBody({
    multipart: true,
    formLimit:"10mb",
    jsonLimit:"10mb"
}));

// middlewares
app.use(bodyparser({
    enableTypes: ['json', 'form', 'text']
}))
app.use(json())
app.use(logger())
app.use(require('koa-static')(__dirname + '/public'))

// 中间件  views(选择需要解析的html文件夹, {map: {html: 'ejs'}) 通过 ejs语法来解析这些html的页面
app.use(views(__dirname + '/views', {
    // extension: 'ejs'
    map: { html: 'ejs' }
}))

// logger
app.use(async(ctx, next) => {
    const start = new Date()
    await next()
    const ms = new Date() - start
        // console.log(`${ctx.method} ${ctx.url} - ${ms}ms`)
    log4js.resLogger(ctx, ms);
})

app.use(passport.initialize())
app.use(passport.session())

//跨域处理
app.use(cors({
    origin: function(ctx) {
        if (ctx.url === '/test') {
            return '*';
        }
        return 'http://localhost:3001';
    },
    maxAge: 5,
    credentials: true,
    allowMethods: ['GET', 'POST', 'DELETE', 'OPTION'],
    allowHeaders: ['Content-Type', 'Authorization', 'Accept'],
    exposeHeaders: ['WWW-Authenticate', 'Server-Authorization']
}))


// app.use(login.routes(), login.allowedMethods())
// routes
const user = require('./routes/user'),
    orders = require('./routes/orders'),
    login = require('./routes/login'),
    address = require('./routes/address'),
    upload = require('./routes/upload'),
    book = require('./routes/book');
const indexHome = require('./routes/index'),
    index = require('./routes/users');
    app.use(index.routes(), index.allowedMethods())  
app.use(indexHome.routes(), indexHome.allowedMethods())
app.use(login.routes(), login.allowedMethods())
app.use(address.routes(), address.allowedMethods())
app.use(orders.routes(), orders.allowedMethods())
app.use(user.routes(), user.allowedMethods())

app.use(upload.routes(), upload.allowedMethods())
app.use(book.routes(), book.allowedMethods())

const path = require('path');
const static = require('koa-static');
app.use(static(
    path.join(__dirname, '/public'),{    //静态文件所在目录
        maxage: 30*24*60*60*1000        //指定静态资源在浏览器中的缓存时间
    }
));
// // error-handling
// app.on('error', (err, ctx) => {
//   console.error('server error', err, ctx)
// });

// error-handling
app.on('error', (err, ctx) => {
    log4js.errLogger(ctx, err)
    console.error('server error', err, ctx)
});

module.exports = app