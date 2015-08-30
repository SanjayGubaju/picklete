
module.exports = (sequelize, DataTypes) => {
  let ProductGm = sequelize.define('ProductGm', {
    // 品牌 id
    brandId: DataTypes.INTEGER,
    // 大館別 id
    dptId: {
      type: DataTypes.STRING,
      get: function() {

        var value = this.getDataValue('photos');

        if(value) {
          return JSON.parse(value);
        }

        return [];
      },
      set: function(value) {
        return this.setDataValue('photos', JSON.stringify(value));
      }
    },
    // 小館別 id
    dptSubId: {
      type: DataTypes.STRING,
      get: function() {

        var value = this.getDataValue('photos');

        if(value) {
          return JSON.parse(value);
        }

        return [];
      },
      set: function(value) {
        return this.setDataValue('photos', JSON.stringify(value));
      }
    },
    // 商品說明
    explain: DataTypes.TEXT,
    // 使用方法
    usage: DataTypes.TEXT,
    // 注意事項
    notice: DataTypes.TEXT,
    // 商品標籤
    tag: {
      type: DataTypes.STRING,
      get: function() {

        var value = this.getDataValue('photos');

        if(value) {
          return JSON.parse(value);
        }

        return [];
      },
      set: function(value) {
        return this.setDataValue('photos', JSON.stringify(value));
      }
    },
    // Cover photos
    coverPhoto: {
      type: DataTypes.STRING,
      get: function() {

        var value = this.getDataValue('photos');

        if(value) {
          return JSON.parse(value);
        }

        return [];
      },
      set: function(value) {
        return this.setDataValue('photos', JSON.stringify(value));
      }
    }

  }, {
    classMethods: {
      associate: (models) => {
        return ProductGm.hasMany(models.Product)
      }
    }
  });

  return ProductGm;
};
