module.exports = (sequelize, DataTypes) => {
    return sequelize.define(
        'book',
        {
            'id': {
                type: DataTypes.INTEGER,
                primaryKey: true,       //主键
                autoIncrement: true,
            },
            'user_id': DataTypes.INTEGER,
            'ISBN':DataTypes.INTEGER,
            'author':DataTypes.STRING,
            'status':DataTypes.INTEGER,
            'book_name':DataTypes.STRING,
            'img_url':DataTypes.STRING,
            'desc':DataTypes.STRING,
            'delete':DataTypes.STRING
        },
    )
}