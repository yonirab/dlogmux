const {activate} = require('./lib/logger');

const init = async argv => {
  try {
      if (argv.length !== 2) {
          console.error(`Usage: ${argv[0]} ${argv[1]}`);
          process.exit(1);
      }

      // If we get this far, all our storage plugins should be instatiated already,
      // so let's start logging containers 
      await activate();
  
  } catch (err) {
      console.error(`${__filename}: Exiting due to exception: ${err.stack}`);
      process.exit(1);
  }
};

init(process.argv);