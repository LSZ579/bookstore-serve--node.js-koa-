const router = require('koa-router')(), 
    Sql = require('../service/operations_sql');
    const NXlSX = require("node-xlsx");
    const Mock = require("mockjs");
router.prefix('/book')

// 获取首页图书列表
router.post('/bookList', async (ctx, next) => {
    let parms = ctx.request.body
        data = await Sql.getBookList(parms);
    ctx.body = data;
})
router.get('/api/exportexcel',async (ctx) => {
    //表头
    const _headers = ['书名', 'ISBN', '图书作者', '上传人'];
     //表格数据
     let arr= await Sql.getAllBook();
    let data = [];
//    for (let i =0 ; i < _data.length; i++){
//       let arr = [];
//       for(let key in _data[i]){
//        arr.push(_data[i][key])
//      }
//      data.push(arr);
//   }
for(var i=0,len=arr.length;i<len;i++){
    let n=[]
    console.log(arr[i]['dataValues'])
    n[0]=arr[i]['dataValues']['book_name']
    n[1]=arr[i]['dataValues']['ISBN']
    n[2]=arr[i]['dataValues']['author']
    n[3]=arr[i]['dataValues']['user']['dataValues']['name']
    data.push(n)
}
//  data=[["hello","223"],["22","23"]]
 data.unshift(_headers);  
  let buffer = NXlSX.build([{name: "sheetName", data: data}]);
 // 返回buffer流到前端
  ctx.body = buffer
});
// 模糊搜索图书
router.post('/searchBook', async (ctx, next) => {
    let parms = ctx.request.body
        data = await Sql.searchBook(parms.search);
    ctx.body = data;
})
router.post('/isbn', async (ctx, next) => {

})
//添加图书
router.post('/addBook', async (ctx, next) => {
    let parms = ctx.request.body
        data = await Sql.addBook(parms);
    ctx.body = data;
})
// getBookDetail
router.post('/getBookDetail', async (ctx, next) => {
    let parms = ctx.request.body
        data = await Sql.getBookDetail(parms.id);
    ctx.body = data;
})
// 获取用户自己的图书
router.post('/getMyBook', async (ctx, next) => {
    let parms = ctx.request.body
        data = await Sql.getMyBook(parms.id);
    ctx.body = data;
})
// 编辑图书
router.post('/editBook', async (ctx, next) => {
    let parms = ctx.request.body
        data = await Sql.editBook(parms);
        ctx.body = data;
})
// 删除图书
router.post('/deleteBook', async (ctx, next) => {
    let parms = ctx.request.body
        data = await Sql.deleteBook(parms);
        ctx.body = data;
})
// changBookStatus
router.post('/changBookStatus', async (ctx, next) => {
    let parms = ctx.request.body
        data = await Sql.changBookStatus(parms);
        ctx.body = data;
})
// 标记所有图书不可借
router.post('/allBookStatus', async (ctx, next) => {
    let parms = ctx.request.body
        data = await Sql.allBookStatus(parms);
        ctx.body = data;
})
module.exports = router;