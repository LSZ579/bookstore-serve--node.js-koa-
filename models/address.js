module.exports = (sequelize, DataTypes) => {
    return sequelize.define(
        'address',
        {
            'id': {
                type: DataTypes.INTEGER,
                primaryKey: true,       //主键
                autoIncrement: true,
            },
            'userID': DataTypes.INTEGER,
            'name': DataTypes.STRING,
            'sex': DataTypes.STRING,
            'about': DataTypes.STRING,
            'detail': DataTypes.STRING,
            'code': DataTypes.STRING,
            'phone': DataTypes.STRING,
            'createTime': DataTypes.DATE
        },
    )
}