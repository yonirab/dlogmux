const fs = require('fs');

class Store {

    constructor() {
        // Full path on this container of file that stores logs from containers.
        this.path='/mnt/messages';
    }

    // Create any resources needed for this plugin.
    // Authentication can be performed here, if necessary.
    // Make sure to "await" any async calls, e.g.:
    // await foo.athenticate(...);
    // This method will be called once per plugin.
    async createResources() {
        this.logFile=fs.createWriteStream(this.path);
    }

    // Handle a stream of logs from a container.
    // This method will be called once per logged container.
    handleStream(stream) {
        // Pipe the full stream, including header and payload bytes
        stream.pipe(this.logFile);
    }

}

module.exports = {
    Store,
};