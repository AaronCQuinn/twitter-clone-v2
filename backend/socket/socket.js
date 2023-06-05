const { createServer } = require("http");
const { Server } = require("socket.io");

class Socket {
    constructor() {
        this.io = this.createSocketConnection();
        this.setEventHandlers(this.io);
    }

    createSocketConnection() {
        const httpServer = createServer();
        httpServer.listen(5001);
        return new Server(httpServer, { 
            pingTimeout: 60000,
            cors: {
                origin: 'http://localhost:3000',
                methods: ['GET', 'POST']
            }
        });
    };

    setEventHandlers(io) {
        io.on('connection', (socket) => {

            socket.on('setup', (userPersonalRoom) => {
                // This is done so that if we need to send some sort of specific information to an individual user, we know they're connected to their own id.
                socket.join(userPersonalRoom);
            })

            socket.on('join room', room => {
                socket.join(room);
            })

            // Emit the typing event within a specified socket channel.
            socket.on('typing', room => {
                socket.in(room).emit('typing')
            });

            socket.on('stop typing', room => {
                socket.in(room).emit('stop typing')
            });

            socket.on('new message', (message) => {
                // Update the chat with the current message.
                socket.in(message.chat._id).emit('new message', message);

                // Send a notification to each user that is part of the chat to notify them there's a new message in the DM.
                const { users } = message.chat;
                  users.forEach(user => {
                    if (user._id === message.userSent._id) { return };
                    socket.in(user._id).emit('message received', message);
                })
            });
        });
    }
}


module.exports = () => new Socket();
