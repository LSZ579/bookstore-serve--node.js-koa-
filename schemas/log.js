var mongoose=require('../config/mongoose_config');

var logSchema=mongoose.Schema({
    level: {type: String},
    message: {type: String},
    info: {
        method: String,
        url: String,
        costTime: Number,
        body: String,
        response: {
            status: Number,
            message: String,
            header: String,
            body: String
        }
    }
})
module.exports = mongoose.model('log', logSchema)

