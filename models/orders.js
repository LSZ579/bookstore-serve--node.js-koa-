module.exports = (sequelize, DataTypes) => {
    return sequelize.define(
        'order',
        {
            'id': {
                type: DataTypes.INTEGER,
                primaryKey: true,       //主键
                autoIncrement: true,
            },
            'book_id': DataTypes.INTEGER,
            'lend_userId': DataTypes.INTEGER,
            'user_id': DataTypes.INTEGER,
            'book_name': DataTypes.STRING,
            'address': DataTypes.STRING,
            'tell': DataTypes.INTEGER,
            'name': DataTypes.STRING,
            'sex': DataTypes.STRING,
            'status': DataTypes.STRING,
            'lend_remark': DataTypes.STRING,
            'remask': DataTypes.STRING,
            'isReslove':DataTypes.STRING,
            'apply_time':DataTypes.STRING,
            'back_time':DataTypes.STRING,
            'isback':DataTypes.STRING,
            'review_time':DataTypes.STRING,
        },
    )
}