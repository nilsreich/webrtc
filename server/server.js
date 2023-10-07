const { Server } = require("socket.io");

const io = new Server({
    cors: {
        origin: "https://cuddly-computing-machine-7v999jrx43g4p-3000.app.github.dev"
    }
}

)
io.on("connection", (socket) => {
    socket.on('signal', (msg) => {
        socket.broadcast.emit('signal', msg);
    });

    socket.on('ice-candidate', (msg) => {
        socket.broadcast.emit('ice-candidate', msg);
    }
    );

});

io.listen(3001);