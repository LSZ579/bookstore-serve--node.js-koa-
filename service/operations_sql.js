const { user, address, book, orders, commodity, sort, merchant, shoppingCart, findList, comment, like, addPaotuiOrders } = require('../models/index');

const { Op } = require('sequelize')
let time = new Date();
let d = time.getDay(), y = time.getFullYear(), m = time.getMonth(), h = time.getHours(), min = time.getMinutes(), se = time.getSeconds();
let nowTime = y + '-' + m + '-' + d + ' ' + h + ':' + min + ':' + se;
// class 一个类 构造函数  类的静态方法
class Sql {

    // 登陆
    static async postLogin(account, password) {
        return await user.findOne({
            where: {
                account,
                password
            }
        })
    }
    static async postLogins(account) {
        return await user.findOne({
            where: {
                account
            }
        })
    }
    static async checkUser(data) {
        return await user.findOne({
            where: {
                account: data.account
            }
        })
    }
    // 注册用户
    static async registered(data) {
        return await user.create({
            name: data.user_name,
            account: data.account,
            password: data.password,
            avatar: 'https://img.yzcdn.cn/vant/cat.jpeg',
        })
    }
    // -----------登录注册end---

    // -----------图书begin--
    // 获取首页图书列表
    // getAllBook
    static async getAllBook(data) {
        book.belongsTo(user, { foreignKey: 'user_id', targetKey: 'id' })
        return book.findAll({
            where: {
                status: 2,//2为正常，3为不可借出，4为被锁定，5为已被借出
                delete: 0
            }, 
            include: {
                model: user, // 关联查询
    
            }
        })
    }
    static async getBookList(data) {
        return book.findAll({
            order: [
                ['id', 'DESC'],
            ],
            where: {
                status: 2,//2为正常，3为不可借出，4为被锁定，5为已被借出
                delete: 0
            }, //user的查询条件
            offset: data.limit * (data.page - 1),//data.page,
            limit: data.limit
        })
    }
    // 获取图书详情
    // 添加图书
    static async getBookDetail(id) {
        book.belongsTo(user, { foreignKey: 'user_id', targetKey: 'id' })
        return book.findOne({
            where: {
                id
            },
            include: {
                model: user, // 关联查询
                attributes: ['name', 'id', 'avatar']
            }
        })
    }
    // 搜索图书 key: ISBN 作者 书名
    static async searchBook(search) {
        return await book.findAll({
            where: {
                status:2,
                [Op.or]: [
                  {book_name: {[Op.like]: `%${search}%`}},
                  {ISBN: {[Op.like]: `%${search}%`}},
                  {author: {[Op.like]: `%${search}%`}},
                ],
              }
        })
    }
    // 添加图书
    static async addBook(data) {
        return book.create({
            ISBN: data.ISBN,
            author: data.author,
            book_name: data.book_name,
            status: data.status,
            user_id: data.user_id,
            img_url: data.img_url,
            desc: data.desc
        })
    }
    // 编辑图书
    static async editBook(data) {
        return book.update(
            {
                ISBN: data.ISBN,
                author: data.author,
                book_name: data.book_name,
                status: data.status,
                img_url: data.img_url,
                desc: data.desc
            }, {
            where: {
                user_id: data.user_id,
                id: data.id,
            }
        })
    }
    // 更改图书状态
    static async changBookStatus(data) {
        return book.update(
            {
                status: data.status,
            }, {
            where: {
                user_id: data.user_id,
                id: data.id,
            }
        })
    }
    // allBookStatus
    static async allBookStatus(data) {
        for (var i = 0; i < data.list.length; i++) {
            // tyep等于true时，标为不可借阅
            if (data.type && data.list[i].status == 2) {
                book.update(
                    {
                        status: 3,
                    }, {
                    where: {
                        user_id: data.list[i].user_id,
                        id: data.list[i].id,
                    }
                })
            }
            else if (!data.type && data.list[i].status == 3) {
                book.update(
                    {
                        status: 2,
                    }, {
                    where: {
                        user_id: data.list[i].user_id,
                        id: data.list[i].id,
                    }
                })
            }
        }
        return 1
    }
    // 删除图书
    static async deleteBook(data) {
        return book.destroy(
            {
                where: {
                    user_id: data.user_id,
                    id: data.id,
                }
            })
    }
    // 获取用户图书
    static async getMyBook(id) {
        return book.findAll({
            order: [
                // 将转义标题，并根据有效的方向参数列表验证DESC
                ['id', 'DESC'],
            ],
            where: {
                delete: 0,
                user_id: id
            }
        })
    }


    // ----地址----
    //  根据用户ID获取用户所有地址
    static async getUserAddress(userID) {
        return await address.findAll({
            where: {
                userID
            }

        })
    }

    //  根据地址ID获取地址信息
    static async getAddress(id) {
        return await address.findOne({
            where: {
                id
            }

        })
    }


    // 删除地址
    static async deleteAddress(id) {
        return await address.destroy({
            where: {
                id
            }
        })
    }

    // 修改地址
    static async setAddress(id, data) {
        return await address.update(
            {
                'name': data.name,
                'sex': data.sex,
                'about': data.about,
                'detail': data.detail,
                'code': data.code,
                'phone': data.phone,
                'createTime': new Date()
            },
            {
                where: {
                    id
                }
            })
    }

    // 新增地址
    static async addAddress(userID, data) {
        return await address.create({
            'userID': userID,
            'name': data.name,
            'sex': data.sex,
            'about': data.about,
            'detail': data.detail,
            'code': data.code,
            'phone': data.phone,
            'createTime': new Date()
        })
    }

    // ----地址end---
    // 'review_time':nowTime
    // 借书------begin-------------------
    // 新增订单
    static async addOrders(data) {
        await book.update(
            {
                status: 4,//把图书锁定
            }, {
            where: {
                id: data.book_id
            }
        })
        console.log(data, 888888)
        return await orders.create({
            'book_id': data.book_id,
            'lend_userId': data.lend_userId,
            'user_id': data.user_id,
            'book_name': data.book_name,
            'address': data.address,
            'tell': data.tell,
            'name': data.name,
            'sex': data.sex,
            'status': data.status,
            'lend_remark': data.lend_remark,
            'remask': data.remask,
            'apply_time': nowTime
        })
    }

    //  根据条件获取用户所有订单
    static async getOrders(data) {
        orders.belongsTo(user, { foreignKey: 'user_id', targetKey: 'id' })
        return await orders.findAll({
            where: data,
            include: {
                model: user, // 关联查询
                attributes: ['name', 'id', 'avatar']
            }
        })
    }
    // getMessage获取未处理的订单，获取所有消息
    static async getMessage(data) {
        orders.belongsTo(user, { foreignKey: 'lend_userId', targetKey: 'id' })
        let arr = await orders.findAll({
            where: {
                user_id: data.uid,
                isReslove: 0
            },
            include: {
                model: user, // 关联查询
                attributes: ['name', 'id', 'avatar']
            }
        })
        let arr2 = await orders.findAll({
            where: {
                lend_userId: data.uid,
                isReslove: 0
            },
            include: {
                model: user, // 关联查询
                attributes: ['name', 'id', 'avatar']
            }
        })
        return {
            a: arr,
            b: arr2
        }
    }
    // 我借出的图书
    static async getlendBook(data) {
        let arr = await orders.findAll({
            where: {
                status:1,
                user_id: data.uid
            }
        })
        return arr;
    }
    // 审核借书
    static async resloveLend(data) {
        await book.update(
            {
                status: data.status,//把图书锁定2为正常，3为不可借出，4为被锁定，5为已被借出
            }, {
            where: {
                id: data.book_id
            }
        })
       return await  orders.update({
            isReslove:1,
            review_time:nowTime,
            remask:data.remark,
            status: data.statusId,//0提交审核，1同意借出，2拒绝
        }, {
            where: {
                book_id: data.book_id
            }
        })
    }

    // 还书申请
    static async backBook(data) {
        await book.update(
            {
                status: 2,//把图书锁定2为正常，3为不可借出，4为被锁定，5为已被借出
            }, {
            where: {
                id: data.book_id
            }
        })
        return await  orders.update({
            isback:1,
            back_time:nowTime
        }, {
            where: {
                book_id: data.book_id
            }
        })
    }
    // ---------订单分界点-----
    
    
    static async getUserInfo(id) {
        return await user.findOne({
            where: {
                id
            }
        })
    }


    //删除用户
    static async popUserInfo(id) {
        return await user.destroy({
            where: {
                id
            }
        })
    }



    static async countUserInfo(count, page) {
        return await user.findAll({
            limit: count,
            offset: count * (page - 1),
            raw: true
        }).then(res => {
            return res;
        })
    }

    static async allUsers() {
        return await user.findAll()
    }

  

    static async search(value, count) {
        return await user.findAndCountAll({
            attributse: ['id', 'name'],
            where: {
                [Op.or]: {
                    id: {
                        [Op.like]: '%' + value + '%'
                    },
                    name: {
                        [Op.like]: '%' + value + '%'
                    }
                }
            },
            limit: count,
            raw: true
        }).then(res => {
            return res;
        })
    }

  


    // 密码加密
    static async setSoltpass(id, password, solt) {
        return await user.update({
            password, solt
        }, {
            where: {
                id
            }
        })
    }
    // 修改密码
    static async setPassword(newPassword, account) {
        return await user.update(
            {
                'password': newPassword
            },
            {
                where: {
                    account
                }
            })
    }

    // 修改手机号
    static async setPhone(data) {
        return await user.update(
            {
                'phone': data.phone
            },
            {
                where: {
                    'account': data.account
                }
            })
    }

    //  根据用户ID获取用户信息
    static async getUser(id) {
        return await user.findOne({
            where: {
                id
            }

        })
    }


    
    // 删除订单
    static async deleteOrders(id) {
        return await orders.destroy({
            where: {
                id
            }
        })
    }
}

module.exports = Sql;
