import { ref } from 'vue'
import { defineStore } from 'pinia'

export const useBluebanStore = defineStore('Blueban', () => {
  const Blueban = ref(["","","","",""])
  function set_ban(target, index){
    Blueban.value[index] = target;
    console.log(Blueban.value[index]);
  }
  return {Blueban, set_ban}
})
