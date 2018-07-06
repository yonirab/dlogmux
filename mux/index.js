const {logContainers} = require('./lib/logger');

const init = async argv => {
  try {
      if (argv.length !== 2) {
          console.error(`Usage: ${argv[0]} ${argv[1]}`);
          process.exit(0);
      }
      else {
          await logContainers();
      }
  } catch (err) {
      console.error(`${__filename}: Exiting due to exception: ${err.stack}`);
      process.exit(1);
  }
};

init(process.argv);