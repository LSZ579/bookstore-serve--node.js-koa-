var uuid = require('node-uuid')

exports.Uuid = function generateId(){
    return uuid.v4();
}