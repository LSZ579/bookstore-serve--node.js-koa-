module.exports = (sequelize, DataTypes) => {
    return sequelize.define(
        'lend',
        {
            'id': {
                type: DataTypes.INTEGER,
                primaryKey: true,       //主键
                autoIncrement: true,
            },
            'user_id': DataTypes.INTEGER,
            'owner_id':DataTypes.INTEGER,
            'lend_id':DataTypes.INTEGER,
            'status':DataTypes.INTEGER,
            'delete':DataTypes.INTEGER
        },
    )
}