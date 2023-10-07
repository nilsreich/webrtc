const { Server } = require("socket.io");

const io = new Server({
    cors: {
        origin: "https://cuddly-computing-machine-7v999jrx43g4p-3000.app.github.dev"
    }
}

)
io.on("connection", (socket) => {
    socket.on('answer', (msg) => {
        socket.broadcast.emit('answer', msg);
    });
    socket.on('offer', (msg) => {

        socket.broadcast.emit('offer', msg);
    });
});

io.listen(3001);