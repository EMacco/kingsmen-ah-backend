module.exports = (sequelize, DataTypes) => {
  const PasswordReset = sequelize.define('PasswordReset', {
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    resetPasswordoken: {
      type: DataTypes.STRING,
      allowNull: true
    },
    resetPasswordExpiry: {
      type: DataTypes.INTEGER,
      allowNull: true
    }
  }, {});

  PasswordReset.associate = (models) => {
    const { User } = models;

    PasswordReset.belongsTo(User, {
      foreignKey: 'userId'
    });
  };

  return PasswordReset;
};
