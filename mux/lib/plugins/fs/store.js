const fs = require('fs');

class Store {

    constructor() {
        // Logs will get written to /mnt/messages unless overriden by env var FS_STORE_PATH
        this.path=process.env.FS_STORE_PATH || '/mnt/messages';
    }

    createResources() {
        this.logFile=fs.createWriteStream(this.path);
    }

    handleStream(stream) {
        stream.pipe(this.logFile);
    }

}

module.exports = {
    Store,
};