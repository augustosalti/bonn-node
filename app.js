const express = require('express');
const cors = require('cors');
fs = require('fs');
const path = require('path');
const options = {};
middlewares();
const app = express();
const http = require('https').createServer(options, app);
require('./mongo/mongo');
const mongo = require('./mongo/mongo')

//enable cors for all origins
////////////////////////////////////////////////
function middlewares() {
    const corsOptions = {
     origin: '*',
     optionsSuccessStatus: 200 
   };
  }
////////////////////////////////////////////////

const io = require('socket.io')(http, {
    cors: {
        origin: '*'
    }
});

app.get('/', (req, res)=>{
    res.send('Hola! Corriendo server chat on PORT 3003');
});
let userList = new Map();
io.on('connection', (socket) =>{
    let host = socket.handshake.headers.origin;
    let id = socket.id;
    let id_cliente = socket.handshake.query.id_cliente;
    let tipo = socket.handshake.query.tipo; //0 admin | 1 cliente
    let sala;
    
    let userData = {
        id,
        id_cliente,
        tipo
    }
    //mongo.insertMongoAcceso(userData);

    addUser(id, userData);

    socket.broadcast.emit('user-list', [...userList])  //emite a todas las conexiones
    socket.emit('user-list', [...userList])  //emite solo a la current conexion

    socket.on('message', (msg)=>{
        console.log(msg);
/*         for (let value of userList) {
            if(msg['is'] == value[0]){
                socket.to(value[1]['id']).emit('message-id', {message: msg['message'], userName: userName, usuario: msg['usuario'], idComunidad: idComunidad, idAdministrador: idAdministrador,idPropietario:idPropietario, tipo: msg['tipo']});
            }
            value += 1;
        } */
    });


    socket.on('disconnect', function(){
        console.log("/////////////////////////////////////////");
        removeUser(id);
        socket.to(sala).emit('user-list', [...userList.keys()] );
        socket.to(sala).emit('user-disconnect', id);
        console.log("/////////////////////////////////////////");
    });

    socket.on('join', (room) => {
        console.log(`Socket ${socket.id} joining ${room}`);
        sala = room;
        socket.join(room);
     });
});


function addUser(userId, userData){
    if(!userList.has(userId)){
        userList.set(userId, userData);
    }
    console.log(userList);
}



function removeUser(id){
    if(userList.has(id)){
        userList.delete(id);
        console.log('usuario desconectado : ' + id);
    }
}


http.listen(process.env.PORT || 3003, ()=>{
    console.log('Server is running!');
});