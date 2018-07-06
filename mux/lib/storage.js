const {lstatSync, readdirSync} = require('fs'),
      {join} = require('path');

// Is source a directory?
const isDirectory = source => lstatSync(source).isDirectory();

// Get sub-directories of source
const getSubDirectories = source => readdirSync(source).map(name => join(source,name)).filter(isDirectory);

// The root directory for all storage methods
const storageMethodsRootDir = join(__dirname, 'stores');

// Each sub-directory of storageMethodsRootDir corresponds to a storage method 
const storageMethods = getSubDirectories(storageMethodsRootDir);

// logStores is an array of Store objects, capable of handling logs 
const logStores = storageMethods.map(storageMethod => {
    // Require store.js file found under any defined storageMethod directory
    const storeJsPath=join(storageMethod,'store.js');
    console.log(`Require ${storeJsPath}`); 
    const {Store} = require(storeJsPath);
    return new Store();
});

// Create resources for stores
const createResources = stores => stores.map(store => store.createResources());

// Handle a stream across all logStores
const handleStream = stream => logStores.map(logStore => logStore.handleStream(stream));

// When this module is required, go ahead and create resources for all our logStores
createResources(logStores);

// Users of this module simply call handleStream() to handle a log stream across all logStores
module.exports = {
    handleStream,
};









