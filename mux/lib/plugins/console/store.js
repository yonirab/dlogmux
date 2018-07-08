// Header length of stream chunks, per https://docs.docker.com/engine/api/v1.24/
const HEADER_LEN = 8;

// Log buf to the console as a utf8 encoded string
const logBuf = buf => console.log(buf.toString('utf8'));

class Store {

    constructor() {
        this.enabled = (process.env.CONSOLE_LOGGING==='Enabled');
    }

    // Create any resources needed for this plugin.
    // Authentication can be performed here, if necessary.
    // This method will be called once per plugin.
    createResources() {    
    }

    // Handle a stream of logs from a container.
    // This method will be called once per logged container.
    handleStream(stream) {
        if (this.enabled) {
            // Log payload to console skipping header
            stream.on('data', info => logBuf(info.slice(HEADER_LEN)));
            stream.on('error', err => logBuf(err.slice(HEADER_LEN)));
        }
    }

}

module.exports = {
    Store,
};