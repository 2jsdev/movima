const pgtools = require('pgtools');

require('dotenv').config();

const { DATABASE_USER, DATABASE_HOST, DATABASE_PORT, DATABASE_PASSWORD, DATABASE_NAME, NODE_ENV } = process.env;

const dbName = NODE_ENV === 'production' ? DATABASE_NAME : `${DATABASE_NAME}_${NODE_ENV}`;

const config = {
  user: DATABASE_USER,
  host: DATABASE_HOST,
  port: DATABASE_PORT,
  password: DATABASE_PASSWORD,
};

pgtools.dropdb(config, dbName, function (error, res) {
  if (error && error.name == 'invalid_catalog_name') {
    console.error(`[DATABASE]: database ${dbName} does not exist.`);
    process.exit(0);
  }
  console.log(`[DATABASE]: ${dbName} database was deleted successfully.`);
  process.exit(0);
});
