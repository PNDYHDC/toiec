const { DataTypes, Model } = require('sequelize');
const { sequelize } = require('../config/mysql');

class Vocabulary extends Model {
    static associate(models) {
        Vocabulary.hasMany(models.FrameVocabulary, {
            foreignKey: 'vocab_id',
            as: 'frameVocabularies',
        });
        Vocabulary.belongsToMany(models.UserFrameItem, {
            through: models.UserFrameItemVocabulary,
            foreignKey: 'vocab_id',
            otherKey: 'user_frame_item_id',
            as: 'userFrameItems',
        });
    }
}

Vocabulary.init(
    {
        id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true, allowNull: false },
        english_word: { type: DataTypes.STRING(50), allowNull: false },
        vietnamese_word: { type: DataTypes.STRING(50), allowNull: false },
        audio_url: { type: DataTypes.STRING(255), allowNull: true },
    },
    {
        sequelize,
        modelName: 'Vocabulary',
        tableName: 'vocabulary',
        timestamps: false,
    },
);

module.exports = Vocabulary;
