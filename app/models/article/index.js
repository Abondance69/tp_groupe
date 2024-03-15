const { DataTypes } = require('sequelize')
const sequelize = require("../../config/db"),
    User = require('../user')

const Article = sequelize.define('Article', {
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        allowNull: false,
        primaryKey: true
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
    },
    content: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    createdAt: {
        type:DataTypes.DATE,
        allowNull: false,
        unique: true
    },
    updatedAt: {
      type: DataTypes.DATE, 
      allownull: true,
    },
    userId: {
        type: DataTypes.UUID,
        allowNull: false,
        references: {
            model: User,
            key: 'id'
        }
    }
}, {timestamps: true})

Article.belongsTo(User, {
    foreignKey: 'userId',
    as: 'author',
})
User.hasMany(Article, {
    foreignKey: 'userId',
    as: 'user_hasOne_article'
})

// Article.sync({ force: true })
module.exports = Article
