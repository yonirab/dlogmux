# README #

`dlogmux` - Simple demo of multiplexing logs from configurable docker containers to configurable storage,
implemented in microservice "mux".

## How to run the demo ##

On a machine with docker installed:

> git clone git@bitbucket.org:yoni_rabinovitch/dlogmux.git
> cd dlogmux
> cp .env.example .env

Edit .env, and make sure HOST_LOGFILE_DIR points to a directory on your machine that can be
mounted as a container volume.

Then, run the demo with:

> docker-compose up

In the docker-compose terminal, observe output such as the following:

> logerrors_1  | bash: ping: command not found
> notlogged_1  | 000002-47a10eb285d7 This should not appear in /workspace/dlogmux/logs/messages
> logoutput_1  | 000002-80b4278b91ab

Note that the "command not found" messages are expected!

Now, in a separate terminal, run:

> tail -f $HOST_LOGFILE_DIR/messages

Observe the logs from services logerrors and logoutput, but NOT from service notlogged, e.g:

>      bash: ping: command not found
>      000002-80b4278b91ab

This is because services logerrors and logoutput are defined with label $LOG_STRATEGY_KEY=LOG
in docker-compose.yml, whereas notlogged is not.

## Software Architecture ##

Microservice mux consists of 2 main modules:

### logger.js ###
Retrieves logs streams from docker containers running on the same docker host, provided they are labelled
with $LOG_STRATEGY_KEY=<Any Value>  

### storage.js ###
Stores streams using "plugin" storage methods.

Module logger.js knows nothing about how logs get stored. 
It simply requires storage.js, and calls storage.handleStream() once per log stream.

Module storage.js handles streams by storing them using multiple "plugin" storage methods.

### Plugin Storage ###

Each subdirectory of dlogmux/mux/lib/plugins corresponds to a storage method.

The "fs" and "console" storage methods are provided out of the box.

The "fs" storage method stores logs on $HOST_LOGFILE_DIR/messages.
The "fs" storage method is currently implemented as a simple pipe, which means that it does NOT
filter out the 8 byte headers prepended to each log line chunk (per https://docs.docker.com/engine/api/v1.24/).
That is why the output from "tail -f $HOST_LOGFILE_DIR/messages" appears with 8
blank characters at the beginnning of each line.

The "console" storage method pushes logs to the console.
Unlike the "fs" storage method, the "console" storage method filters out the 8 byte headers in every log chunk. 
This storage method is disabled by default. To enable it, edit .env, and set:

> CONSOLE_LOGGING=Enabled

## How to define new plugins ##

To create a plugin for storage method "foo", do the following:

> mkdir mux/lib/plugins/foo
> cp mux/lib/plugins/store.js.template mux/lib/plugins/foo/store.js

Edit your new store.js file, and implement the "Store" class for foo,
making sure to implement at least methods createResources() and handleStream()
per the requirements of foo.

Any necessary authentication should be performed in createResources().
Make sure to use "await" with any async calls in createResources().

createResources() gets called once per storage method.
handleStream() gets called once per connected logged container.

## Limitations ##

The mux microservice uses the "logs" endpoint from the Docker remote API to retrieve log streams from
containers. Although both stdout and stderr are retrieved, it seems that non-newline terminated logs
are not streamed. This can be demonstrated by uncommenting service logmix in docker-compose.yml.
This service logs to both stdout and stderr, however, the logs to stdout are not newline-terminated.
This means that only the stderr logs from service logmix make it to $HOST_LOGFILE_DIR/messages (although
both stdout and stderr logs appear in the docker-compose terminal output).



