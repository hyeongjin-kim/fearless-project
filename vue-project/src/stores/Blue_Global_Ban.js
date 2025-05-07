import { ref } from 'vue'
import { defineStore } from 'pinia'

export const useGlobalBluebanStore = defineStore('Blue_Global_Ban', () => {
  const GlobalBlueban = ref([])
  function set_ban(bans){
    GlobalBlueban.value.push(bans);
  }
  function reset(){
    GlobalBlueban.value = [];
  }
  function set_all(bans){
    GlobalBlueban.value = bans;
  }
  return {GlobalBlueban, set_ban, reset, set_all}
})
