const express	= require('express');
const path		= require('path');
const http		= require('http');

var app = express();
var httpApp = http.Server(app);

app.use(express.static('./src'));

httpApp.listen(3000, function() {
	console.log('listening on *:3000');
});
