const {Docker} = require('node-docker-api'),
      {handleStream} = require('./storage');   

// This is the label key that we use to specify if a container should be logged. 
const logStrategyKey = process.env.LOG_STRATEGY_KEY || 'io.logmux.strategy';       

// We should log a container if it has a logStrategyKey in its Labels. Currently, we don't care what the value is.            
const shouldLog = container => logStrategyKey in container.data.Labels;

// A logs stream from a container (including both stdout and stderr)
const logsStream = async container => await container.logs({follow: true, stdout: true, stderr: true});

// Handle a stream by passing it to storage.handleStream (which takes care of handling the stream across all defined storage methods)
const handle = stream => handleStream(stream);

// Log applicable containers running on the current host
const activate = async () => {

  try {
    const docker = new Docker({ socketPath: '/var/run/docker.sock' });
  
    // Get all containers on current host
    let containers = await docker.container.list();
    
    // We will only log containers that pass the shouldLog filter
    let containersToLog = containers.filter(shouldLog);

    // An array of logs streams, one for each container that we need to log 
    let streams = await Promise.all(containersToLog.map(logsStream));
                 
    // Handle all our logs streams 
    streams.map(handle);            
      
  } catch (err) {
      console.error(`attachToContainers: ${err.message}`);
      throw (err);
  }
};

module.exports = {
  activate,  
}