/* io stuff */


/*
 * GET home page.
 */

exports.index = function(req, res){
  var start = new Date().getTime();
  res.render('index', { title : 'Identify parts of speech using the Brown corpus' });
        var end = new Date().getTime();
        console.log('Request processed in: ' + (end - start));
};
