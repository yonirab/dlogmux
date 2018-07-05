const {Docker} = require('node-docker-api');

const attachToContainers = async () => {

  try {
    const docker = new Docker({ socketPath: '/var/run/docker.sock' });

    let containers = await docker.container.list();
    //let inspections = await Promise.all(containers.map(container=>container.status()));
    
    //console.log(`========Found ${inspections.length} inspections`) ; 
    //inspections.map(inspection => console.log(inspection));

    console.log(`========Found ${containers.length} containers`) ; 
    containers.map(container => console.log(container.data.Labels));
    console.log(`=======================================================`)
    
    let attachees = 
      containers.filter(container => 'io.logmux.strategy' in container.data.Labels);
 
    let streams = await Promise.all
      (attachees
        .map(attachee=>attachee
          .logs({follow: true,
                  stdout: true,
                  stderr: true})));
                 
    streams.map(stream => {
      stream.on('data', info => console.log(info.toString()));
      stream.on('error', err => console.log(err.toString()));
    })              
      
  } catch (err) {
      console.error(`attachToContainers: ${err.message}`);
  }
};

const init = async () => {
    await attachToContainers();
};

init();
