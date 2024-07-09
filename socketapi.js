const io = require("socket.io")();
const userModel = require('./models/user.schema')
const socketapi = {
    io: io
};

// Add your socket.io logic here!
io.on("connection", function (socket) {
    console.log("kuch bhi")

    socket.on('join', async username => {
        await userModel.findOneAndUpdate({
            username
        }, {
            socketId: socket.id
        })
    })

    socket.on('sony', async messageObject => {

        const receiver = await userModel.findOne({
            username: messageObject.receiver
        })

        const socketId = receiver.socketId

        socket.to(socketId).emit('max', messageObject)

    })



});
// end of socket.io logic

/* 
socket - single user/browser
io- server
emit - send
on - receive
 */

module.exports = socketapi;