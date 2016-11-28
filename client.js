'use strict';

var Fs = require('fs');
var Trooba = require('trooba');
var GrpcTransport = require('trooba-grpc-transport');
var Grpc = require('grpc');

var hello_proto = Grpc.load(require.resolve('./hello.proto'));

var client = Trooba.transport(GrpcTransport, {
    port: 6565,
    hostname: 'localhost',
    proto: hello_proto,
    serviceName: 'Hello',
    credentials: Grpc.credentials.createSsl(
        Fs.readFileSync(require.resolve('./certs/server.crt')),
        Fs.readFileSync(require.resolve('./certs/client.key')),
        Fs.readFileSync(require.resolve('./certs/client.crt'))
    )
}).create();

client.sayHello('John', function (err, response) {
    console.log('response is', response);
});
