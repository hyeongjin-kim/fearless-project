import { ref } from 'vue'
import { defineStore } from 'pinia'

export const useBluepickStore = defineStore('Blue_Pick', () => {
  const Bluepick = ref(["","","","",""])
  function set_pick(target, index){
    Bluepick.value[index] = target;
  }
  function reset(){
    Bluepick.value = ["","","","",""];
  }
  function set_all(picks){
    Bluepick.value = picks;
  }
  return {Bluepick, set_pick, reset, set_all}
})
