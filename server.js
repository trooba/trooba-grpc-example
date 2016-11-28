'use strict';

var Fs = require('fs');
var Grpc = require('grpc');
var hello_proto = Grpc.load(require.resolve('./hello.proto'));

var port = 6565;
var server = new Grpc.Server();
console.log('listening on port:', port);
server.bind('localhost:' + port, Grpc.ServerCredentials.createSsl(
    Fs.readFileSync(require.resolve('./certs/ca.crt')),
    [{
        private_key: Fs.readFileSync(require.resolve('./certs/server.key')),
        cert_chain: Fs.readFileSync(require.resolve('./certs/server.crt'))
    }],
    false
));
server.addProtoService(hello_proto.Hello.service, {sayHello: sayHello});
server.start();

process.on('SIGTERM', close);
process.on('SIGINT', close);

function close() {
    console.log('closing ...');
    server.tryShutdown(function() {
        console.log('done');
    });
}

/**
 * Implements the SayHello RPC method.
 */
function sayHello(call, callback) {
    callback(null, {message: 'Hello ' + call.request.name});
}
