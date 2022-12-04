const runner = require('../runner');

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const CREATE_USER = () =>
      queryInterface.createTable(
        'user',
        {
          user_id: {
            type: Sequelize.UUID,
            defaultValue: Sequelize.UUIDV4,
            allowNull: false,
            primaryKey: true,
          },
          user_email: {
            type: Sequelize.STRING(250),
            allowNull: false,
            unique: true,
          },
          is_email_verified: {
            type: Sequelize.BOOLEAN,
            allowNull: false,
            defaultValue: false,
          },
          username: {
            type: Sequelize.STRING(250),
            allowNull: false,
          },
          user_password: {
            type: Sequelize.STRING,
            allowNull: true,
            defaultValue: null,
          },
          role: {
            type: Sequelize.ENUM(['USER', 'ADMIN']),
            allowNull: false,
            defaultValue: 'USER',
          },
          is_deleted: {
            type: Sequelize.BOOLEAN,
            allowNull: false,
            defaultValue: false,
          },
        },
        {
          timestamps: false,
          underscored: true,
          freezeTableName: true,
          tableName: 'user',
          indexes: [{ unique: true, fields: ['email'] }],
        },
      );

    const CREATE_FILE = () =>
      queryInterface.createTable(
        'file',
        {
          id: {
            type: Sequelize.UUID,
            defaultValue: Sequelize.UUIDV4,
            allowNull: false,
            primaryKey: true,
          },
          filename: {
            type: Sequelize.STRING(100),
            allowNull: false,
          },
          path: {
            type: Sequelize.STRING(100),
            allowNull: false,
          },
          created_at: {
            type: Sequelize.DATE,
            allowNull: false,
            defaultValue: Sequelize.NOW,
          },
          updated_at: {
            type: Sequelize.DATE,
            allowNull: true,
          },
        },
        {
          timestamps: false,
          underscored: true,
          tableName: 'file',
        },
      );

    await runner.run([() => CREATE_USER(), () => CREATE_FILE()]);
  },

  down: (queryInterface, Sequelize) => {
    return runner.run([() => queryInterface.dropTable('user'), () => queryInterface.dropTable('file')]);
  },
};
