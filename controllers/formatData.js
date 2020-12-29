const sd = require('silly-datetime');
module.exports = {
    // totalCounts =>总条数, totalPage =>总页数, page => 当前页数, data => 当前页数的数据
    formatData (totalCounts, totalPage, page, data) {
        let num = data.length,
            option = {},
            renderData = {
                totalCounts,        // 一共多少条数据
                totalPage,          // 一共多少页数据
                page,               // 当前页数
                num,                // 当前页的数据条数
            }; 
        
        if (data[0]){
            Object.keys(data[0]).forEach(item => {
                option[item] = []
            })
    
            for (var i = 0; i < num; i++) {
                for (let item in option) {
                    if (item.toLowerCase().match('time')) {
                        option[item].push(sd.format(new Date(data[i][item]),  "YYYY-MM-DD HH:mm:ss"))
                    } else {
                        option[item].push(data[i][item])
                    }
                    renderData[item] = option[item]
                }
            }
        }
        
        return renderData
    }
}