const userDao = require('../service/operations_sql')
const md5 = require('../middlewares/md5')
const uuid = require('../middlewares/uuid')
const sd = require('silly-datetime');

const fs = require('fs');
const xlsx = require('node-xlsx');
//太坑了！居然要安装两个！不然没办法readFile
const XLSX = require('xlsx');
const path = require('path');

const utils = require('./formatData')

function getFile(reader, upStream) {
    return new Promise(function(result) {
        let stream = reader.pipe(upStream);
        stream.on('finish', function(err) {
            result(err)
        })
    })
}




module.exports = {
   
    //分页
    userOrderAdministration: async(ctx, next) => {
        // 每页多少条数据
        const count = 5;
        
        // 第几页
        let page = ctx.params.page;

        // 获取第几页的五条数据
        const result = await userDao.countOrderInfo(count, page);

        // 获取用户所有订单数据
        const totalCount = await userDao.orderTotalPage();

        // 数据总条数
        let totalCounts = totalCount.length

        // 多少页
        const totalPage = Math.ceil(totalCounts / count)
        
        // 处理数据返回给前端
        let renderData = utils.formatData(totalCounts, totalPage, page, result)
    
        await ctx.render('orders/userOrder', renderData)
    },
    userOrderSearch: async(ctx, next) => {

        // value是搜索值， page是页数
        let { value, page } = ctx.params;

        // 每页多少条
        const count = 5;

        // 获取第几页的数据
        const result = await userDao.orderSearch(value, count, page);

        // 获取搜索的全部数据
        const totalCount = await userDao.orderAllSearch(value);

        // 当前所有数据一共几条
        let totalCounts = totalCount.rows.length
        
        // 当前所有数据有多少页
        const totalPage = Math.ceil(totalCounts / count)
        
        let renderData = utils.formatData(totalCounts, totalPage, page, result.rows)

        await ctx.render('orders/userOrder', renderData)
    },
    deleteOrder: async(ctx, next) => {
        let { id, page } = ctx.params,
            data = await userDao.deleteOrders(id)
        
        ctx.response.redirect('/users/userOrder/' + page);
       
    },
    deleteOrderSearch: async(ctx, next) => {
        let { id, value, page} = ctx.params,
            data = await userDao.deleteOrders(id)
            
        ctx.response.redirect('/users/userOrderSearch/'+ value + '/' + page);
            
            
    },
    userOrderDetail: async(ctx, next) => {
        let params = ctx.params,
            data = await userDao.getOrders(params)

        data[0].dataValues.createTime = sd.format(new Date(data[0].dataValues.createTime),  "YYYY-MM-DD HH:mm:ss")

        let renderData = data[0].dataValues
        
       

        await ctx.render('orders/userOrderDetail',  renderData)
    },
    setOrderDetail: async (ctx, next) => {
        let body = ctx.request.body,
            params = ctx.params,
            data = await userDao.setOrderDetail(params.id, body);

        ctx.response.redirect('/users/userOrder/1');
    },

    // 商家
    merchantList: async (ctx, next) => {
        // 每页多少条数据
        const count = 5;
        
        // 第几页
        let page = ctx.params.page;

        // 获取第几页的商家五条数据
        const result = await userDao.countMerchantInfo(count, page);
        
        // 获取所有商家数据
        const totalCount = await userDao.getAllMerchant();

        // 数据总条数
        let totalCounts = totalCount.length

        // 多少页
        const totalPage = Math.ceil(totalCounts / count)
        
        // 处理数据返回给前端
        let renderData = utils.formatData(totalCounts, totalPage, page, result)
    
        await ctx.render('merchant/merchantList', renderData)
    },
    merchantSearch: async (ctx, next) => {

        // value是搜索值， page是页数
        let { value, page } = ctx.params;

        // 每页多少条
        const count = 5;

        // 获取第几页的数据
        const result = await userDao.merchantSearch(value, count, page);

        // 获取搜索的全部数据
        const totalCount = await userDao.merchantAllSearch(value);

        // 当前所有数据一共几条
        let totalCounts = totalCount.rows.length
        
        // 当前所有数据有多少页
        const totalPage = Math.ceil(totalCounts / count)
        
        let renderData = utils.formatData(totalCounts, totalPage, page, result.rows)
    
        await ctx.render('merchant/merchantList', renderData)
    },
    deleteMerchant: async(ctx, next) => {
        let { id, page } = ctx.params,
            data = await userDao.deleteMerchant(id)
        
        ctx.response.redirect('/users/merchant/merchantList/' + page);
       
    },
    deleteMerchantSearch: async(ctx, next) => {
        let { id, value, page} = ctx.params,
            data = await userDao.deleteMerchant(id)
        
        ctx.response.redirect('/users/merchant/merchantSearch/'+ value + '/' + page);
            
    },
    addMerchant: async(ctx, next) => {
        let body = ctx.request.body,
            data = await userDao.addMerchant(body)
        
        ctx.response.redirect('/users/merchant/merchantList/1');
    },
    merchantDetail: async(ctx, next) => {
        let params = ctx.params,
            data = await userDao.getMerchant(params)

        let renderData = data[0].dataValues

        await ctx.render('merchant/merchantDetail',  renderData)
    },
    setMerchantDetail: async (ctx, next) => {
        let body = ctx.request.body,
            params = ctx.params,
            data = await userDao.setMerchantDetail(params.id, body);

        ctx.response.redirect('/users/merchant/merchantList/1');
    },

    // 商品
    commodityList: async (ctx, next) => {
        // 每页多少条数据
        const count = 5;
        
        // merchantID =>商家ID, type =>商品类型ID, page =>当前商品类型的商品页数
        let {merchantID, type, page} = ctx.params,
            sortData = await userDao.getSort({merchantID}),
            result,
            totalCount,
            totalCounts,
            totalPage,
            renderData ;
        
        // 判断商家是否有商品分类, 没有则返回默认数据
        if (sortData.length != 0) {
             // 把获取到的商品类型拿到自己要的值的数组
            sortData.forEach((item, index) => {
                sortData[index] = item.dataValues
            })
            
            // 首次进商品分类页面，默认获取获取第一种商品类型的id
            type = type == 0 ? sortData[0].id : type

            // 获取type商品类型的第几页的五条商品数据
            result = await userDao.countCommodityInfo(count, page, type);

            sortData.forEach(item => {
                if (item.id == type) {
                    result.forEach(el => {
                        el['sortName'] = item.name
                    })
                }
            })
            // 获取type商品类型的所有商品
            totalCount = await userDao.getSortCommodity(merchantID, type);
            
            // 数据总条数
            totalCounts = totalCount.length

            // 多少页
            totalPage = Math.ceil(totalCounts / count)
            
            // 处理数据返回给前端
            renderData = utils.formatData(totalCounts, totalPage, page, result)

            renderData['sortData'] = sortData
        } else {
            // 处理数据返回给前端
            renderData = {
                page: 0,
                totalCounts: 0,
                totalPage: 0,
                num: 0,
                sortData: []
            }
        }
       
    
        await ctx.render('commodity/commodityList', renderData)
    },
    commoditySearch: async (ctx, next) => {

        // value是搜索值， page是页数
        let { value, page, merchantID } = ctx.params;

        // 每页多少条
        const count = 5;

        // 获取商家全部商品类型数据
        let sortData = await userDao.getSort({merchantID});

        // 获取第几页的数据
        const result = await userDao.commoditySearch(value, count, page, merchantID);

        // 获取搜索的全部数据
        const totalCount = await userDao.commodityAllSearch(value, merchantID);
        
         // 判断商家是否有商品分类, 没有则返回默认数据
         if (sortData.length != 0) {
            // 把获取到的商品类型拿到自己要的值的数组
            sortData.forEach((item, index) => {
                sortData[index] = item.dataValues
                result.rows.forEach(el => {
                    if (item.id == el.sortID) {
                        el['sortName'] = item.name
                    }
                })
           })
        }

        // 当前所有数据一共几条
        let totalCounts = totalCount.rows.length
        
        // 当前所有数据有多少页
        const totalPage = Math.ceil(totalCounts / count)
        
        let renderData = utils.formatData(totalCounts, totalPage, page, result.rows)
        renderData['sortData'] = sortData
        
        await ctx.render('commodity/commodityList', renderData)
    },
    deleteCommodity: async(ctx, next) => {
        let { id, page } = ctx.params,
            shopData = await userDao.getCommodity({id}),
            data = await userDao.deleteCommodity(id)
        
        ctx.response.redirect('/users/commodity/commodityList/'+ shopData[0].dataValues.merchantID +'/'+ shopData[0].dataValues.sortID + '/' + page);
       
    },
    deleteSort: async(ctx, next) => {
        let { id } = ctx.params,
            shopData = await userDao.getSort({id}),
            merchantID = shopData[0].dataValues.merchantID,
            data = await userDao.deleteSort(id)
        
        ctx.response.redirect('/users/commodity/commodityList/'+ merchantID +'/0/1');
    },
    deleteCommoditySearch: async(ctx, next) => {
        let { id, value, page, merchantID} = ctx.params,
            data = await userDao.deleteCommodity(id)
        
        ctx.response.redirect('/users/commodity/commoditySearch/'+ value + '/' + merchantID + '/' + page);
            
    },
    addCommodity: async(ctx, next) => {
        
        let body = ctx.request.body,
            { merchantID } = ctx.params,
            data = await userDao.addCommodity(merchantID, body)
        
        
        ctx.response.redirect('/users/commodity/commodityList/'+ merchantID +'/'+ body.sortID +'/1');
    },
    // 添加商品分类
    addSort: async(ctx, next) => {
        
        let body = ctx.request.body,
            { merchantID } = ctx.params,
            data = await userDao.addSort(merchantID, body)

        // data.dataValues.id 是 商品类型id
        ctx.response.redirect('/users/commodity/commodityList/'+ merchantID +'/'+ data.dataValues.id +'/1');
    },
    // 为添加商品获取商品分类
    getSort: async(ctx, next) => {
        let { merchantID } = ctx.params,
            data = await userDao.getSort({merchantID})
        
        data.forEach((item, index) => {
            data[index] = item.dataValues
        })
        
        // 添加商品需要获取当前商家的商品分类
        await ctx.render('commodity/addCommodity' , {'sortData':data});
    },
    commodityDetail: async(ctx, next) => {
        let params = ctx.params,
            data = await userDao.getCommodity(params),
            sortData;

        data = data[0].dataValues

        // 获取该店家的所有商品类型
        sortData = await userDao.getSort({merchantID:data.merchantID})

        sortData.forEach((item, index) => {
            sortData[index] = item.dataValues
        })

        data['sortData'] = sortData

        let renderData = data

        await ctx.render('commodity/commodityDetail',  renderData)
    },
    sortDetail: async(ctx, next) => {
        let params = ctx.params,
            data = await userDao.getSort(params)

        data = data[0].dataValues
        console.log(data)

        await ctx.render('commodity/sortDetail',  data)
    },
    setCommodityDetail: async (ctx, next) => {
        
        let body = ctx.request.body,
            {id} = ctx.params,
            data = await userDao.setCommodityDetail(id, body),
            shopData = await userDao.getCommodity({id}),
            merchantID = shopData[0].dataValues.merchantID;


        ctx.response.redirect('/users/commodity/commodityList/'+ merchantID +'/'+ body.sortID +'/1');
    },
    setSortDetail: async (ctx, next) => {
        
        let body = ctx.request.body,
            { id } = ctx.params,
            shopData = await userDao.getSort({id}),
            data = await userDao.setSortDetail(id, body),
            merchantID = shopData[0].dataValues.merchantID

        ctx.response.redirect('/users/commodity/commodityList/'+ merchantID +'/'+ id +'/1');
    },

}