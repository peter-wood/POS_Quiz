// connect to mongodb and retrieve a random sentence fromr the Brown corpus
var db = (function() {

  var mongodb = require ('mongodb');
  var server = new mongodb.Server('localhost', 27017, {auto_reconnect : true});
  var db = new mongodb.Db('posquiz', server, {safe: true});

  var init = function(cb) {
    db.open(function(err, db) {
      if (err) throw err;
      cb();
    });
  };

  var query = function(snum, cb) {
    db.collection('brown').findOne({number : snum}, function(err, data) {
        if (!err) {
          cb(data);
        } else {
          throw err;
        }
      });
  };

  var getSent = function(callb) {
	var rnum = Math.floor(Math.random()*57339);
	query(rnum, callb);
};

return {getSent : getSent, 
        init : init};
})();

module.exports = db

