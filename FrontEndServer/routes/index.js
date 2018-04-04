var express = require('express');
var router = express.Router({ caseSensitive : true });
var request = require('request');

var Cache = require('cache-storage');
var FileStorage = require('cache-storage/Storage/FileSyncStorage');
 
var Filecache = new Cache(new FileStorage('cache-storage'));

var decode = require('decode-html');


var baseURL = "http://127.0.0.1:5000";

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index');
});


router.post('/settings', function(req, res, next) {

  req.session[req.body.id] = req.body.value;

  res.json({ "code" : "yay" });
  
});

router.get('/session', function(req, res, next) {

  res.json(req.session);
  
});

router.get('/settings', function(req, res, next) {

  var use_thumbnail = "yes";
  
  if(req.session['use-thumb'])
  {
    use_thumbnail = req.session['use-thumb'];
  }
    
  var auto_reload = "yes";
  
  if(req.session['auto-reload'])
  {
    auto_reload = req.session['auto-reload'];
  }

  res.render('settings', {use_thumbnail, auto_reload});
  
});


router.get('/db/list', function(req, res, next) {


  request.get({
    url: baseURL + '/api/',
    json: true,
    headers: {'User-Agent': 'request'}
  }, (err, resboop, data) => {
    if (err) {
      console.log('Error:', err);
    } else if (res.statusCode !== 200) {
      console.log('Status:', res.statusCode);
    } else {
      // data is already parsed as JSON:
      res.render('list_db', {dbs : data});
      console.log(data);
    }
});

});

router.get('/db/*', function(req, res, next) {
  res.render('app', {baseURL, workingPath: req.params[0], "useThumbnails": req.session['use-thumb'] });
});


router.get('/proxy/*', function(req, res, next) {
  request(decode(req.params[0])).pipe(res);
});


module.exports = router;
  
