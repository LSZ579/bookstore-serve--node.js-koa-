const allSqlAction = require("../lib/mysql")
async function checkUser(user_id, password) {
    let sql = `select * from user where user_id = ${user_id} and password=${password}`
    return allSqlAction.allSqlAction(sql).then(res => {
        if (res.length == 1 && res[0].user_id == user_id && res[0].password == password) {
            return { msg: "登陆成功", code: 200 ,userName:res[0].user_name}
        } else {
            return { msg: "登录失败", code: 201 }
        }
    })
}

module.exports = {
    checkUser
}

