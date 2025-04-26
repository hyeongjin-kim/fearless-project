import { ref } from 'vue'
import { defineStore } from 'pinia'

export const useRedbanStore = defineStore('Redban', () => {
  const Redban = ref(["","","","",""])
  function set_ban(target, index){
    Redban.value[index] = target;
  }
  return { Redban, set_ban}
})
