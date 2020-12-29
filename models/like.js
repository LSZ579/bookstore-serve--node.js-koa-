module.exports = (sequelize, DataTypes) => {
    return sequelize.define(
        'find_like',
        {
            'id': {
                type: DataTypes.INTEGER,
                primaryKey: true,       //主键
                autoIncrement: true,
            },
            'find_id': DataTypes.INTEGER ,
            'user_id': DataTypes.INTEGER ,
            'like': DataTypes.INTEGER,
        }
    )
}