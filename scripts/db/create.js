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

pgtools.createdb(config, dbName, function (error, res) {
  if (error && error.name == 'duplicate_database') {
    console.error(`[DATABASE]: database ${dbName} already exists.`);
    process.exit(0);
  }
  console.log(`[DATABASE]: ${dbName} database was created successfully.`);
  process.exit(0);
});
