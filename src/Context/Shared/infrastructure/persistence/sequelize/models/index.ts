import * as fs from 'fs';
import * as path from 'path';
import config from '../config';
import * as Sequelize from 'sequelize';

const sequelize = config.connection;

let models: any = {};
let modelsLoaded = false;

function toCamelCase(str) {
  const _ = str.indexOf('_');
  if (~_) {
    return toCamelCase(
      str.substring(0, _) +
        str
          .substring(_ + 1)
          .substring(0, 1)
          .toUpperCase() +
        str.substring(_ + 2),
    );
  } else {
    return str.substring(0, 1).toUpperCase() + str.substring(1);
  }
}

const createModels = () => {
  if (modelsLoaded) return models;

  fs.readdirSync(path.join(__dirname, './'))
    .filter((t) => (~t.indexOf('.ts') || ~t.indexOf('.js')) && !~t.indexOf('index') && !~t.indexOf('.map'))
    .forEach((file) => {
      const model = require(path.join(__dirname, file))(sequelize, Sequelize.DataTypes);
      const modelName = toCamelCase(model.name);
      models[modelName] = model;
    });

  Object.keys(models).forEach((modelName) => {
    if (models[modelName].associate) {
      models[modelName].associate(models);
    }
  });

  models['sequelize'] = sequelize;
  models['Sequelize'] = Sequelize;

  modelsLoaded = true;

  return models;
};

export default createModels();

export { createModels };
