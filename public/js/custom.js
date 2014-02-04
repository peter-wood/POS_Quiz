var currentId = undefined;
var currentToken = undefined;
var sent = undefined;
var socket = new eio.Socket('ws://127.0.0.1');

var createMessage = function (request, data) {
  var obj = {}
  obj.request = request;
  if (data) obj.data = data;
  return JSON.stringify(obj);
};

var parseMessage = function (message) {
  return JSON.parse(message);
};

var updateJumbotron = function (obj) {
    var data = obj.data.tokens;
    var pattern = obj.data.pattern;
    sent = data;
    var i = 0;
    for (i = 0; i < sent.length; i++) {
      $('#buttonGroup').append("<button type='button' class='btn btn-info' id='btn_" + i + "' data-toggle='modal' data-target='#myModal'>"+data[i]+ "</button>\n");
      if (! pattern[i]) {
        $('.btn#btn_' + i).attr('class', 'btn btn-default');
        $('.btn#btn_' + i).attr('disabled', 'disabled');
      }
    }
    $('.btn').on('click', introspect);
};
 
var checkResult = function(obj) {
         if (obj.data.result) {
                $('#btn_' + obj.data.position).attr('class', 'btn btn-success');
                $('#btn_' + obj.data.position).attr('disabled', 'disabled');
          } else {
                $('#btn_' + obj.data.position).attr('class', 'btn btn-danger');
          }
          updateResults(obj.data.right, obj.data.wrong, obj.data.toGo);
  };

var done = function(obj) {
	$('#theResults').html('<h1>All done. Mistakes: ' + obj.data.wrong + '.</h1>');
}

socket.onopen = function() {
  //console.log('engine.io connected.');

  socket.onmessage = function(message) {
    message = parseMessage(message)
    switch (message.request) {

      case ('ready') : {
          //console.log('received ready.');
          socket.send(createMessage('getSent'));
        }
        break;

      case ('your sentence') : {
          //console.log('received my sentence.');
          updateJumbotron(message);
        }
        break;

      case ('result') : {
          //console.log('received result');
          checkResult(message);
        }
        break;

      case ('done') : {
        //console.log('received done');
        done(message);
        }
        break;

      default: console.log(message, 'not recognized');

    };
  };

  socket.onclose = function() {};

};
  

  socket.on('done', function(right, wrong) {
          $('#theResults').html('<h1>All done. Mistakes: ' + wrong + '.</h1>');
  });



$('#myModal').on('shown.bs.modal', function(e) {
	showOpts();
	$('a.list-group-item').on('mouseout', function(event) {
		event.target.className = 'list-group-item';
	});
	$('a.list-group-item').on('mouseover', function(event) {
		event.target.className = 'list-group-item active';
	});
	$('a.list-group-item').unbind('click').click( function(event) {
                socket.send(createMessage('check', 
                  {'id' : event.target.id, 'position' :parseInt(currentId.replace('btn_', ''))}
                )); 
		$('#myModal').modal('hide');
        });
});

$(document).ready(function() {
	$('#newSent').on('click', function() {
		window.location.reload(true);
	});
});

var showOpts = function() {
	$('#myModalLabel').html('<h4>Here are your options for: ' + currentToken + '</h4>');
}

var introspect = function(event) {
	currentId = event.target['id'];
	currentToken = event.target['textContent'];
}

var updateResults = function(right, wrong, toGo) {
	$('#theResults').html('<h5>Words left: ' + toGo + ', correct: ' + right + ', wrong: ' + wrong + '.</h5>');
}

	
