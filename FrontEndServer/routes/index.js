var express = require('express');
var router = express.Router({ caseSensitive : true });
var request = require('request');

var Cache = require('cache-storage');
var FileStorage = require('cache-storage/Storage/FileSyncStorage');
 
var cache = new Cache(new FileStorage('cache-storage'));


var baseURL = "http://130.56.35.179:5000"

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index');
});


router.post('/settings', function(req, res, next) {

  req.session[req.body.id] = req.body.value

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
    
  res.render('settings', {use_thumbnail, use_thumbnail});
  
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

router.get('/db/:data_base?.h5*', function(req, res, next) {
  
  request.get({
    url: baseURL + '/api/' + req.params['data_base'] + '.h5/' + req.params[0] ,
    json: true,
    headers: {'User-Agent': 'request'}
  }, (err, resboop, data) => {
    if (err) {
      console.log('Error:', err);
    } else if (res.statusCode !== 200) {
      console.log('Status:', res.statusCode);
    } else {
      // data is already parsed as JSON:
      if(data['type'] == "file")
      {
        res.render('file', {data : baseURL + '/' +  req.params['data_base'] + '.h5/' + req.params[0]});
      }
      else{

        var workingURL = baseURL + "/thumbnail";

        if(req.session['use-thumb'] == 'no') 
        {
          workingURL = baseURL;
        }

      res.render('list', {baseURL : workingURL, db : req.params['data_base'] + '.h5/' + req.params[0] ,  url : req.url, data : data['data']});
      
    }
      console.log(data);
    }
});
});


module.exports = router;
