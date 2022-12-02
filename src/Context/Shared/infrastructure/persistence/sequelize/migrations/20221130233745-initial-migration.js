const runner = require('../runner');

module.exports = {
  up: async (queryInterface, Sequelize) => {
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

    await runner.run([() => CREATE_FILE()]);
  },

  down: (queryInterface, Sequelize) => {
    return runner.run([() => queryInterface.dropTable('file')]);
  },
};
