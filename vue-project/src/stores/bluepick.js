import { ref } from 'vue'
import { defineStore } from 'pinia'

export const useBluepickStore = defineStore('Bluepick', () => {
  const Bluepick = ref(["","","","",""])
  function set_pick(target, index){
    Bluepick.value[index] = target;
  }
  function reset(){
    Bluepick.value = ["","","","",""];
  }
  return {Bluepick, set_pick, reset}
})
