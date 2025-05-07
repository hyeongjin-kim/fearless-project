import { ref } from 'vue'
import { defineStore } from 'pinia'

export const useRedbanStore = defineStore('Redban', () => {
  const Redban = ref(["","","","",""])
  function set_ban(target, index){
    Redban.value[index] = target;
  }
  function reset(){
    Redban.value = ["","","","",""];
  }
  function set_all(bans){
    Redban.value = bans;
  }
  return { Redban, set_ban, reset, set_all}
})
