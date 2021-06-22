const Sequelize = require('sequelize');

module.exports = orm=> {
  const User = orm.define('User', {
    name: {
      type: Sequelize.DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    hashPassword: {
      type: Sequelize.DataTypes.STRING,
      allowNull: false,
    }, 
  }, {
    freezeTableName: true,
  });

  return { User };
};
