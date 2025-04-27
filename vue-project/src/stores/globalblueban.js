import { ref } from 'vue'
import { defineStore } from 'pinia'

export const useGlobalBluebanStore = defineStore('useGlobalBlueban', () => {
  const GlobalBlueban = ref([])
  function set_ban(bans){
    GlobalBlueban.value.push(bans);
  }
  function reset(){
    GlobalBlueban.value = [];
  }
  return {GlobalBlueban, set_ban, reset}
})
