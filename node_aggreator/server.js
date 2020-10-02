'use strict';

process.setMaxListeners(10);

const config          =  require('./config/config');
const globalinfo          =  require('./config/globalinfo');

globalinfo.languages['en'] = new require('./languages/en.js');

const http        =  require('http');
const https       =  require('https');
const express     =  require('express');
const app         =  express();

const connection  =  require('./config/db');

const dboperation   =  require('./config/dboperation');

const AdminController = require('./controllers/adminController');
const admincontroller = new AdminController();

app.use('/avatar', express.static(__dirname + '/public/images'));
app.use(express.static('public'));



var server;

if (config.sslSwitch) {
	var sslOptions = {
	    key: fs.readFileSync(config.sslinfo.key).toString(),
	    cert: fs.readFileSync(config.sslinfo.cert).toString(),
	    ca: [fs.readFileSync(config.sslinfo.ca).toString()]
	};

	server = https.createServer(sslOptions, app);
} else {
	server = http.createServer(app, function(req, res) {
		res.writeHead(200);
	    res.end("Server running on HTTP\n");
	});
  //io = io.listen(server, { pingInterval: 10000, pingTimeout: 5000,perMessageDeflate:false,httpCompression:false, transports: ['websocket'] });
  io = io.listen(server, { pingInterval: 10000, pingTimeout: 5000,perMessageDeflate:false,httpCompression:false, transports: ['websocket'] });
}

server.listen(config.port, function() { 
	console.log("Server listening on : "+ config.port);
});



globalinfo.io = io;

const chat = require('./routes/chat');

const bodyParser = require('body-parser');
const expressFileupload =require('express-fileupload');

app.use(expressFileupload());
//app.use(bodyParser.urlencoded({extended:false}));
//app.use(bodyParser.json());

app.use(bodyParser.json({limit: '10mb', extended: true}))
app.use(bodyParser.urlencoded({limit: '10mb', extended: true}));

const adminLoginRoute = require("./routes/adminLoginRoute");
app.use("/api/admin", adminLoginRoute);

const validateadminauth = function (req, res, next) {
 // console.log(req.headers.authorization);
  if(req && req.headers && req.headers.authorization){
     admincontroller.verifyTokenAuth(req.headers.authorization, function(err,data){
      if(!err){
        //console.log(data,data.status);
        if(data.status == 'success'){
          next();
        }else{
          res.status(401);
          res.json({"status":"fail","message":"Admin authorization failed"});
          return;
        }
      }else{
        res.status(401);
        res.json({"status":"fail","message":"Admin authorization failed"});
        return;
      }
     });
     
  }else{
    res.status(401);
    res.json({"status":"fail","message":"Admin authorization failed"});
    return;
  } 
}

const adminRoute = require("./routes/adminRoute");
app.use("/api/admin", validateadminauth, adminRoute);

