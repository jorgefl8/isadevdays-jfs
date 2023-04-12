import server from './server.js';

const env = process.env.NODE_ENV ?? 'production';

server.deploy(env).catch((err) => console.error(err));

process.on('SIGINT', function onSigint(){
    console.info('Got SIGINT (aka ctrl-c in docker). Graceful shutdown ', new Date().toISOString());
    shutdown();
});
process.on('SIGTERM', function onSigterm(){
    console.info('Got SIGTERM (docker container stop). Graceful shutdown ', new Date().toISOString());
    shutdown();
});

function shutdown(){
    server.undeploy();
}   