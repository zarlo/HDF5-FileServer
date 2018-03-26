var express = require('express');
var router = express.Router({ caseSensitive : true });
var request = require('request');

var baseURL = "http://127.0.0.1:5000"

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index');
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
      res.render('list', {APIbaseURL : baseURL, db : req.params['data_base'] + '.h5/' + req.params[0] ,  url : req.url, data : data['data']});
      }
      console.log(data);
    }
});
});

module.exports = router;
