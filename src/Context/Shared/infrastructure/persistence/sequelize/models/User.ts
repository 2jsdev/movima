module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define(
    'user',
    {
      user_id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        allowNull: false,
        primaryKey: true,
      },
      username: {
        type: DataTypes.STRING(250),
        allowNull: false,
      },
      user_email: {
        type: DataTypes.STRING(250),
        allowNull: false,
        unique: true,
      },
      user_password: {
        type: DataTypes.STRING,
        allowNull: true,
        defaultValue: null,
      },
      is_email_verified: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
      },
      role: {
        type: DataTypes.ENUM(['USER', 'ADMIN']),
        allowNull: false,
        defaultValue: 'USER',
      },
      is_deleted: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
      },
    },
    {
      timestamps: false,
      underscored: true,
      tableName: 'user',
      indexes: [{ unique: true, fields: ['email'] }],
    },
  );

  return User;
};
