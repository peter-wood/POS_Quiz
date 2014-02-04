var wsserver = (function() {

  var db = require('./db');

  var createMessage = function (request, data) {
    var obj = {}
    obj.request = request;
    if (data) obj.data = data;
    return JSON.stringify(obj);
  };
  
  var parseMessage = function (message) {
    return JSON.parse(message);
  };

  var transpose = {
    "ADJ": "adj",
    "ADV": "adv",
    "CNJ": "con",
    "DET": "det",
    "MOD": "vmo",
    "N": "nou",
    "NP": "pnn",
    "PRO": "pro",
    "P": "pre",
    "V": "ver",
    "VD": "vpt",
    "VG": "vpr",
    "VN": "vpp"
  };

  var assignTag = function (oldTag) {
    var newTag = transpose[oldTag];
    if (newTag === undefined) {
      return 'nil';
    }
    return newTag;
  };

  var readSentence = function(callb) {
    db.getSent( function(data) {
      data.pattern = [];
      data.right = 0;
      data.wrong = 0;
      data.toGo = 0;
      var i = 0;
      for (i = 0; i < data['tokens'].length; i++) {
        if (assignTag(data['tags'][i]) != 'nil') {
          data.pattern.push(true);
          data.toGo += 1;
        } else {
          data.pattern.push(false);
        }
      }
      callb(data);
    });
  };


    var getSent = function(data, socket) {
    // console.log('getSent called');
    readSentence(function (sent) {
      var obj = {}
      socket.storage = sent;
      obj.tokens=sent.tokens;
      obj.pattern = sent.pattern;
      message = createMessage('your sentence', obj);
      socket.send(message);
    });
  };

  var check = function (obj, socket) {
    // console.log('got check...');
    // console.log(obj);
    // console.log(socket.storage);
    var ourPOS = assignTag(socket.storage.tags[obj.data.position]);
      var result = undefined;
      if (obj.data.id === ourPOS ) {
        result = true;
        socket.storage.right += 1;
        socket.storage.pattern[obj.data.position] = false;
      } else {
        result = false;
        socket.storage.wrong += 1;
        socket.storage.pattern[obj.data.position] = true;
      }
      // console.log('is ' + obj.data.id + ' = ' + ourPOS + '? ' + result);
      socket.storage.toGo = 0;
      for (i = 0; i < socket.storage.pattern.length; i++) {
        if (socket.storage.pattern[i]) {
          socket.storage.toGo +=1;
        }
      }
      socket.send(createMessage('result', {'position' : obj.data.position, 'result' : result, 'right' : socket.storage.right, 'wrong' : socket.storage.wrong, 'toGo' : socket.storage.toGo}));
      // console.log('sending result');
      if (socket.storage.toGo === 0) {
        socket.send(createMessage ('done', {'right' : socket.storage.right, 'wrong' : socket.storage.wrong}));
        // console.log('sending all done');
      } 
  };


  var wsStart = function (http) {
    var engine = require('engine.io');
    var server;
    db.init(function () {
      server = engine.attach(http);
      server.on('connection', function(socket) {
        socket.on('close', function() {
          console.log(socket.id, 'connection closed');
        });
        socket.on('message', function(message) {
          data = parseMessage(message);
          switch(data.request) {
            case 'getSent' : getSent(data,socket);
               break;
            case 'check' : check(data, socket);
               break;
            default : console.log(data.request, 'not recoginized');
          }
        });
        socket.send(createMessage('ready'));
      });
      console.log('wsserver started');
    });
  };


  return {wsStart : wsStart};


})();

module.exports = wsserver;

