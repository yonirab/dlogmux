const {lstatSync, readdirSync} = require('fs'),
      {join} = require('path');

// Is source a directory?
const isDirectory = source => lstatSync(source).isDirectory();

// Get sub-directories of source
const getSubDirectories = source => readdirSync(source).map(name => join(source,name)).filter(isDirectory);

// The root directory for all storage methods
const storageMethodsRootDir = join(__dirname, 'plugins');

// Each sub-directory of storageMethodsRootDir corresponds to a storage method 
const storageMethods = getSubDirectories(storageMethodsRootDir);

// An array of objects, capable of handling logs.
// Each object in logStores is an instance of a Store class, defined in a plugin and required here. 
const logStores = storageMethods.map(storageMethod => {
    // Require store.js file found under any defined storageMethod directory
    const storeJsPath=join(storageMethod,'store.js');
    console.log(`Found ${storeJsPath}`); 
    const {Store} = require(storeJsPath);
    return new Store();
});

// Create resources for stores
const createResources = stores => stores.map(store => store.createResources());

// Handle a stream across all logStores
const handleStream = stream => logStores.map(logStore => logStore.handleStream(stream));

// When this module is required, we create resources for all our logStores
createResources(logStores);

// Users of this module call handleStream() to handle a log stream across all logStores
module.exports = {
    handleStream,
};









