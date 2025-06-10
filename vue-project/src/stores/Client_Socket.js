import { ref } from "vue";
import { defineStore } from "pinia";
import { io } from "socket.io-client";

export const useClientSocketStore = defineStore("Client_Socket", () => {
    // Reactive socket instance
    const socket = ref(null);

    // Connect to the server (call this once, e.g. in App.vue or on login)
    function connectSocket() {
        if (!socket.value) {
            socket.value = io("http://localhost:3000"); // Change to your server URL/port
        }
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

    return { socket, connectSocket, disconnectSocket, emit, on };
});
