import { ref } from "vue";
import { defineStore } from "pinia";
import { io } from "socket.io-client";

const address = import.meta.env.VITE_SERVER_ADDRESS;
const socket_port = import.meta.env.VITE_SOCKET_PORT;

export const useClientSocketStore = defineStore("Client_Socket", () => {
    // Reactive socket instance
    const socket = ref(null);

    // Connect to the server (call this once, e.g. in App.vue or on login)
    function connectSocket() {
        if (!socket.value) {
            socket.value = io(`${address}`); // Change to your server URL/port
        }
    }

    function get_socket_id() {
        if (socket.value) return socket.value.id;
    }

    // Disconnect from the server
    function disconnectSocket() {
        if (socket.value) {
            socket.value.disconnect();
            socket.value = null;
        }
    }

    // Emit an event
    function emit(event, data) {
        if (socket.value) {
            socket.value.emit(event, data);
        }
    }

    // Listen for an event
    function on(event, callback) {
        if (socket.value) {
            socket.value.on(event, callback);
        }
    }

    return { connectSocket, get_socket_id, disconnectSocket, emit, on };
});
