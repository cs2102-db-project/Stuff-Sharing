'use strict';
module.exports = (sequelize, DataTypes) => {
  const Profile = sequelize.define('Profile', {
    userid: DataTypes.INTEGER,
    picture: DataTypes.STRING,
    name: DataTypes.STRING,
    address: DataTypes.STRING
  }, {});
  Profile.associate = function(models) {
    // associations can be defined here
  };
  return Profile;
};