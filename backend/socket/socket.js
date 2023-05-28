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
        return io.on('connection', (socket) => {
            
            socket.on('setup', (clientId) => {
                // This is done so that if we need to send some sort of specific information to an individual user, we know they're connected to their own id.
                socket.join(clientId);
            })

            socket.on('join room', room => {
                socket.join(room);
            })

        });
    }
}


module.exports = () => new Socket();
