const userDao = require('../service/operations_sql')
const md5 = require('../middlewares/md5')
const uuid = require('../middlewares/uuid')

const fs = require('fs');
const xlsx = require('node-xlsx');
//太坑了！居然要安装两个！不然没办法readFile
const XLSX = require('xlsx');
const path = require('path');

function getFile(reader, upStream) {
    return new Promise(function(result) {
        let stream = reader.pipe(upStream);
        stream.on('finish', function(err) {
            result(err)
        })
    })
}
module.exports = {
   

    administration: async(ctx, next) => {
        //分页 
        const count = 5;
        
        let page = ctx.params.id;

        const allUserNums = await userDao.allUsers()
        const result = await userDao.countUserInfo(count, page);

        const totalCount = await userDao.totalPage();
        let totalCounts = totalCount.length


        const totalPage = Math.ceil(totalCounts / count)

        // console.log(totalPage);

        let num = result.length;
        let id = [];
        let name = [];
        for (var i = 0; i < num; i++) {
            id[i] = result[i].id;
            name[i] = result[i].name;
        }

        let renderData = {
            totalPage,
            page,
            num,
            id,
            name,
            allNums: allUserNums.length
        }

        await ctx.render('users/administration', renderData)
    },
    search: async(ctx, next) => {
        let { value } = ctx.params;
        // const allUserNums = await userDao.allUsers()
        const searchData = await userDao.search(value);
        const totalCount = searchData.rows;
        let id = [];
        let name = [];
        for (var i = 0; i < searchData.count; i++) {
            id[i] = totalCount[i].id;
            name[i] = totalCount[i].name;
        }
        let renderData = {
            totalPage: 1,
            num: searchData.count,
            page: 1,
            id,
            name,
            allNums: searchData.count
        }
        await ctx.render('users/administration', renderData)
    },
    searchUser: async(ctx, next) => {
        let search = ctx.query.search;
        const count = 5;
        let page = ctx.params.id;

        console.log(search, page)
        if (search == '') {
            // redirect重定向
            ctx.response.redirect('/users/administration/1');
        }
        if (search != ctx.session.search) {
            page = 1
        }
        if (search) {
            ctx.session.search = search
        }
        // if(search == ''){
        //   search = null;
        // }
        const datas = await userDao.searchUser(search, count, page);

        const totalCount = datas.totalCount;
        const dataCount = datas.dataCount;
        const totalPage = Math.ceil(totalCount / count)
        if (dataCount != '') {
            let number = dataCount.length;
            let search_id = [];
            let search_name = [];
            for (var j = 0; j < number; j++) {
                search_id[j] = dataCount[j].user_id;
                search_name[j] = dataCount[j].user_name;
            }
            await ctx.render('users/searchinfo', {
                totalCount: totalCount,
                totalPage: totalPage,
                page: page,
                num: number,
                id: search_id,
                name: search_name
            })
        } else {
            ctx.response.redirect('/users/administration/1');
        }
    },
    addUser: async(ctx, next) => {
        let { name, password, account, type, phone } = ctx.request.body;
        let solt = uuid.Uuid();
        let MDpassword = await md5.MD5(password, solt);
        
        const da = await userDao.addUserInfo(name, account, MDpassword, phone, type, solt);
        
        if (da[1]) {
            await ctx.render('users/push', {
                warn: '添加成功啦'
            })
        } else {
            await ctx.render('users/push', {
                warn: '用户已存在'
            })
        }
    },
    popUser: async(ctx, next) => {
        let id = ctx.params.id
        await userDao.popUserInfo(id);
        ctx.response.redirect('/users/administration/1');
    },
    getDetails: async(ctx, next) => {
        let id = ctx.params.id
        const data = await userDao.getUserInfo(id);

        await ctx.render('users/details', {
            id: data.dataValues.id,
            name: data.dataValues.name,
            account: data.dataValues.account,
            password: data.dataValues.password,
            phone: data.dataValues.phone,
            type: data.dataValues.type == 1 ? '用户' : (
                data.dataValues.type == 2 ? '骑手' : (
                    data.dataValues.type == 3 ? '管理员' : '' 
                )
            )
        })
    },
    graduate: async(ctx, next) => {
        let date = new Date().getFullYear()
        let label = date - 2004
        const data = await userDao.getGraduate(label);
        for (let i = 0; i < data.length; i++) {
            await userDao.changeDeposit(data[i].dorm, 0)
        }
        await userDao.popGraduate(label)
        ctx.response.redirect('/users/administration/1');
    },
    putsolt: async(ctx, next) => {
        const data = await userDao.getIsNull()
        console.log(data[0].user_name)
        for (let i = 0; i < data.length; i++) {
            let solt = uuid.Uuid();
            let md5pass = await md5.MD5(data[i].password, solt);
            await userDao.setSoltpass(data[i].user_id, md5pass, solt);
        }
        ctx.response.redirect('/users/administration/1');
    }
}