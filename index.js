const {Docker} = require('node-docker-api'),
            fs = require('fs');

// We should log a container if it has a logging strategy in its Labels            
const shouldLog = container => 'io.logmux.strategy' in container.data.Labels;

// Collect logs from a container
const logs = container => container.logs({follow: true, stdout: true, stderr: true});

const attachToContainers = async () => {

  try {
    const docker = new Docker({ socketPath: '/var/run/docker.sock' });

    let logFile = fs.createWriteStream('/mnt/messages');

    let containers = await docker.container.list();

    console.log(`========Found ${containers.length} containers`) ; 
    containers.map(container => console.log(container.data.Labels));
    console.log(`=======================================================`)
    
    let attachees = 
      containers.filter(shouldLog);
 
    let streams = await Promise.all(attachees.map(logs));
                 
    streams.map(stream => stream.pipe(logFile));

      //stream.on('data', info => console.log(info.toString()));
      //stream.on('error', err => console.log(err.toString()));
    //})              
      
  } catch (err) {
      console.error(`attachToContainers: ${err.message}`);
  }
};

const init = async () => {
    await attachToContainers();
};

init();
