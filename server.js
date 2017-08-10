
var express=require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);


app.use(express.static('client'));
app.get('/', function(req, res){
  res.sendFile(__dirname+'/client/index.html');
});
  var names=[];
  var userGenerateId=[];
//Whenever someone connects this gets executed
io.on('connection', function(socket){
  console.log('A user connected');
  //Name 
  socket.on('name',function(data){
  	if(names.indexOf(data.name)==-1)
  	{
  		names.push(data.name);
  		var userData={"id":names.length,"name":data.name,"messageArray":[]};
  		userGenerateId.push(userData);
  		socket.emit('nameValue',{"present":1,"userdata":userData});
  		io.sockets.emit('users',userGenerateId);
  	}
  	else{
  		socket.emit('nameValue',{"present":0});
  	}
  });

  // Sending number oF users to CLient to generate user record 
  io.sockets.emit('users',userGenerateId);

  // Chat room 
  socket.on('room',function(data){
   	io.sockets.emit('chatRoom',data);
   	console.log(data);
  });

  // Getting Individual Messgaes 
  socket.on('UserPersonalRoom',function(data){
  	console.log("ME AND OTHER ARE "+data.me+" "+(data.person).id+" "+(data.person).name);
  	socket.emit((data.me).id,{"name":"You","SendingMsgToThisPerson":data.person,"msg":data.msg});
  	io.sockets.emit((data.person).id,{"name":(data.me).name,"gettingMsgFromThisPerson":data.me,"msg":data.msg});
  
  });

  //Whenever someone disconnects this piece of code executed
  socket.on('disconnect', function () {
    console.log('A user disconnected');
  });

});

http.listen(4000, function(){
  console.log('listening on *:4000');
});