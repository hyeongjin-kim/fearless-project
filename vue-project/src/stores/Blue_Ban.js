import { ref } from 'vue'
import { defineStore } from 'pinia'

export const useBluebanStore = defineStore('Blue_Ban', () => {
  const Blueban = ref(["","","","",""])
  function set_ban(target, index){
    Blueban.value[index] = target;
  }
  function reset(){
    Blueban.value = ["","","","",""];
  }
  function set_all(bans){
    Blueban.value = bans;
  }
  return {Blueban, set_ban, reset, set_all}
})
