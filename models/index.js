const Sequelize = require('../config/mysql_sequelize');

// 通过导入的 Sequelize 得到七张表
const user = Sequelize.sequelize.import(__dirname + '/user.js'),
    address = Sequelize.sequelize.import(__dirname + '/address.js'),
    orders = Sequelize.sequelize.import(__dirname + '/orders.js'),
    like = Sequelize.sequelize.import(__dirname + '/like.js'),
    book = Sequelize.sequelize.import(__dirname + '/book.js')
    
module.exports = { user, address, orders,book};