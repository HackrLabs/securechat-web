'use strict'
var koa = require('koa'),
    router = require('koa-router'),
    sockjs = require('sockjs'),
    config = require('./libs/config.json'),
    app = new koa(),
    http = require('http'),
    connections = [],
    chat = sockjs.createServer(),
    namespace = require('koa-router-namespace')

chat.on('connection',function(conn){
  connections.push(conn);
  console.log('connection:',conn);
  conn.on('data', function(msg){
    console.log(msg)
  })
  conn.on('close', function(){
    console.log('Disconnected: %s', conn)
  })
})

app.use(router(app))
namespace(app);
app.namespace("/" + config.app.namespace, function(){
  app.get('/', function* (){
    this.body = {"timestamp": Date.now()}
  })
})

var server = http.createServer(app.callback()).listen(config.app.port, function(){
  console.log('Listening on port: %s', config.app.port)
})
chat.installHandlers(server, {prefix: '/api/sock'})
