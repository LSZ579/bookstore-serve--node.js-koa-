module.exports = (sequelize, DataTypes) => {
    return sequelize.define(
        'user',
        {
            'id': {
                type: DataTypes.INTEGER,
                primaryKey: true,       //主键
                autoIncrement: true,
            },
            'name': DataTypes.STRING,
            'account': DataTypes.STRING,  
            'password': DataTypes.STRING ,
            'avatar': DataTypes.STRING ,
            'solt': DataTypes.STRING ,
            'type': DataTypes.STRING
        }
    )
}