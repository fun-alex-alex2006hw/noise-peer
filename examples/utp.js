var utp = require('utp-native')
var pump = require('pump')
var peer = require('..')

var server = utp.createServer(function onconnection (rawStream) {
  var sec = peer(rawStream, false)
  rawStream.on('timeout', () => sec.end())

  pump(sec, sec, function (err) {
    if (err) throw err
  })
})

server.listen(function () {
  var port = server.address().port

  var clientRawStream = utp.connect(port)
  var clientSec = peer(clientRawStream, true)
  clientRawStream.on('timeout', () => clientSec.end())

  clientSec.on('data', function (data) {
    console.log(data.toString())
  })

  clientSec.on('end', function () {
    server.close()
  })

  clientSec.write('Hello world')
  clientSec.end()
})
