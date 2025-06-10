import { ref } from 'vue'
import { defineStore } from 'pinia'
import { io } from "socket.io-client";

export const useClientSocketStore = defineStore('Client_Socket', () => {
  const socket = ref()
  function set_socket(){
    io.socket();
  }
  function get_socket() {
    return io;
  }
  function send_message() {
    // socket.
  }
  return {set_socket, };
})
