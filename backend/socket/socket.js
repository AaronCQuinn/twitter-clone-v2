const socketIO = require('socket.io');
const http = require('http');

class Socket {
    constructor(expressInstance) {
        const server = http.createServer(expressInstance);
        this.createSocketConnection(server);
    }

    createSocketConnection(server) {
        return new socketIO.Server(server, { 
            pingTimeout: 60000,
            cors: {
                origin: 'http://localhost:3000',
                methods: ['GET', 'POST']
            }
        });
    };
}

// io.on('connection', (socket) => {
//     socket.on('setup', (userData) => {
//         console.log('User data received: ' + userData);
//     });
// });

module.exports = (expressInstance) => new Socket(expressInstance);
