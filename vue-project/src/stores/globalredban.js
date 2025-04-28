import { ref } from 'vue'
import { defineStore } from 'pinia'

export const useGlobalRedbanStore = defineStore('GlobalRedban', () => {
  const GlobalRedban = ref([])
  function set_ban(bans){
    GlobalRedban.value.push(bans);
  }
  function reset(){
    GlobalRedban.value = [];
  }
  function set_all(bans){
    GlobalRedban.value = bans;
  }
  return { GlobalRedban, set_ban, reset, set_all}
})
