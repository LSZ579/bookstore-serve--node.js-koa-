//连接数据库
var mongoose=require('mongoose');
mongoose.connect('mongodb://localhost/koa',
    { useNewUrlParser: true,useUnifiedTopology: true },function(err){
        if(err){
            console.log(err);
            return;
        }
        console.log('数据库连接成功')
});
module.exports=mongoose;

