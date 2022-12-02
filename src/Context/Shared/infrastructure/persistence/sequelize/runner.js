const runner = async (promises) => {
  for (let command of promises) {
    try {
      await command();
    } catch (err) {
      if (err.original) {
        if (err.original.code == 'ER_DUP_ENTRY') {
          console.log(`>>> Passable error occurred: ER_DUP_ENTRY`);
        } else if (err.original.code == 'ER_DUP_FIELDNAME') {
          console.log(`>>> Passable error occurred: ER_DUP_FIELDNAME`);
        } else if (err.original.code == 'ER_CANT_DROP_FIELD_OR_KEY') {
          console.log(`>>> Passable error occurred: ER_CANT_DROP_FIELD_OR_KEY`);
        } else if (err.name == 'SequelizeUnknownConstraintError') {
          console.log(`>>> Passable error. Trying to remove constraint that's already been removed.`);
        } else {
          console.log(err);
          throw new Error(err);
        }
      } else {
        console.log(err);
        throw new Error(err);
      }
    }
  }
};

module.exports = { run: runner };
