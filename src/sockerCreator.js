import io from "socket.io-client";

const socketCreator = {
    create() {
        if (this.socket) {
            console.log(`Return existing socket ...`);
            return this.socket
        }
        const socket = io('http://localhost:4300');
        console.log(`Creating new socket`);
        this.socket = socket;
        return this.socket;
    }
};

export default socketCreator