require('dotenv').config();
const Sequelize = require('sequelize');

const { DATABASE_USER, DATABASE_PASSWORD, DATABASE_HOST, DATABASE_DIALECT, DATABASE_NAME, NODE_ENV } = process.env;

const databaseCredentials = {
  development: {
    username: DATABASE_USER,
    password: DATABASE_PASSWORD,
    database: `${DATABASE_NAME}_${NODE_ENV}`,
    host: DATABASE_HOST,
    dialect: 'postgres',
  },
  test: {
    username: DATABASE_USER,
    password: DATABASE_PASSWORD,
    database: `${DATABASE_NAME}_${NODE_ENV}`,
    host: DATABASE_HOST,
    dialect: 'postgres',
  },
  production: {
    username: DATABASE_USER,
    password: DATABASE_PASSWORD,
    database: DATABASE_NAME,
    host: DATABASE_HOST,
    dialect: 'postgres',
  },
};

const { username, password, database, host, dialect } = databaseCredentials[NODE_ENV];

module.exports = databaseCredentials;

console.log(`[DATABASE]: connecting to the database in ${NODE_ENV} mode.`);

module.exports.connection = new Sequelize(database, username, password, {
  host,
  dialect,
  port: 5432,
  dialectOptions: {
    multipleStatements: true,
  },
  pool: {
    max: 5,
    min: 0,
    idle: 10000,
  },
  logging: false,
});
