const router = require('koa-router')(),
    Sql = require('../service/operations_sql');
const fs = require('fs');
router.prefix('/upload')
router.post('/img', (ctx) => {
    var status;
    let o=ctx.request.body
    
    var path=`./public/images/${new Date().getTime()}.png`
    var imgBuffer=new Buffer(o.content,'base64');
    fs.writeFileSync(path, imgBuffer, (err)=> {
       if (err) 
       {
        status=0
        return;
       }
      })
      ctx.body = {
        path:path
    }
})


module.exports = router;