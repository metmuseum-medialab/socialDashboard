// node server for socialDash
/*
- return index.html
- process request for new list(s) from various social media feeds:
-- twitter
-- instagram
-- flickr
-- facebook?
*/


var async = require("async");

var urlparser = require("url");
var fs = require("fs");
var pathparser = require("path");


var mysecrets  = require (__dirname + "/secrets.js").secrets();


var Twitter = require('twitter');
 
var twitter_client = new Twitter({
  consumer_key: mysecrets.twitter.consumer_key,
  consumer_secret: mysecrets.twitter.consumer_secret,
  access_token_key: mysecrets.twitter.access_token_key,
  access_token_secret: mysecrets.twitter.access_token_secret
});

 
var instagram = require('instagram-node').instagram();
 
instagram.use({ client_id: mysecrets.instagram.client_id,
         client_secret: mysecrets.instagram.client_secret });

var port = mysecrets.port;
if(process && process.env && process.env.NODE_ENV == "production"){
  port = mysecrets.prod_port;
}

startServer();

var started = false;
function startServer(){

  if(!started){
    started = true;
  }else{
    console.log("!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!! already started!");
    return;
  }
    
  var http = require('http');
  http.createServer(function (req, res) {
    parseRequest(req, res);

  }).listen(port);
  console.log('Server running at port ' + port);
}



function parseRequest(req, res){
	var rand = Math.random() * 100;
  res.setHeader("Access-Control-Allow-Headers", req.headers["access-control-request-headers"]);        
  res.setHeader("Access-Control-Allow-Origin", "*");        

  console.log("got request");
  var parsed = urlparser.parse(req.url, true)
  var query = urlparser.parse(req.url, true).query;
  console.log('~~~~~~~~~~~~~~~~~');
 // console.log(parsed);
  console.log('~~~~~~~~~~~~~~~~~');
  //console.log(query);
  console.log('~~~~~~~~~~~~~~~~~');

  if(!query.action){
    sendFile(parsed.pathname, query, res, rand);

  }else if (query.action == "searchTwitter"){
    
  	console.log(query.searchTerms);
  	searchTwitter(query.searchTerms, query.sinceId, 
  		function(results){
	   		res.writeHead(200, {'Content-Type': 'text/html'}); 
	   		res.end(JSON.stringify(results));
		},
		function(error){
	   		res.writeHead(200, {'Content-Type': 'text/html'}); 
	   		res.end(JSON.stringify(error));
		});
  }else if (query.action == "searchInstagramTag"){
    
  	console.log(query.tag);
  	searchInstagramTag(query.tag, query.sinceId, 
  		function(results){
	   		res.writeHead(200, {'Content-Type': 'text/html'}); 
	   		res.end(JSON.stringify(results));
		},
		function(error){
	   		res.writeHead(200, {'Content-Type': 'text/html'}); 
	   		res.end(JSON.stringify(error));
		});
  }else{
   res.writeHead(200, {'Content-Type': 'text/html', 
                        'Access-Control-Allow-Origin' : '*'});
   res.end("<html><body><pre>not sure what to do</pre></body></html>");
  }

}


function searchTwitter(searchTerms, sinceId, callback, errorCallback){

	twitter_client.get('search/tweets', {q: searchTerms, result_type : "recent", count: 50, since_id : sinceId}, function(error, tweets, response){
		if(error){
			console.log("twitter error ");
			console.log(error);
			errorCallback(error);
			return;
		}
   	//	console.log(JSON.stringify(tweets, null, 4));
   		callback({results: tweets, searchTerms : searchTerms});
	});
}

function searchInstagramTag(tag, sinceId, callback, errorCallback){
	instagram.tag_media_recent(tag, function(error, result, remaining, limit){
		console.log("got instagram");
		console.log(error);
		console.log(result);
		console.log(remaining);
		console.log(limit);
		if(error){
			console.log("instagram error ");
			console.log(error);
			errorCallback(error);
			return;
		}

   		callback({results: result, tag : tag});
	});
}


var dataCache = {};
function sendFile(path, query, res){

  if(path == "/"){
    path = "/index.html";
  }
  var extname = pathparser.extname(path);
  var contentType = 'text/html';
  switch (extname.toLowerCase()) {
    case '.js':
      contentType = 'text/javascript';
      break;
    case '.css':
      contentType = 'text/css';
      break;
    case '.png':
      contentType = 'image/png';
      break;
    case '.jpg':
      contentType = 'image/jpeg';
      break;
  }

  if(!dataCache[path]){
    fs.readFile("."+path, function(err, data){
      if(err){
        console.log("file read error");
        console.log(err);
        res.writeHead(404, {'Content-Type': contentType, 
                        'Access-Control-Allow-Origin' : '*'});
        //indexhtml = data;
        res.end(data);
      }else{
        res.writeHead(200, {'Content-Type': contentType, 
                        'Access-Control-Allow-Origin' : '*'});
        console.log("writing file " + path);
     //   console.log(data);
        //dataCache[path] = data;
        res.end(data);
      }
    });
  }else{
    res.writeHead(200, {'Content-Type': contentType, 
                        'Access-Control-Allow-Origin' : '*'});
    res.end(dataCache[path]);
  }
}
