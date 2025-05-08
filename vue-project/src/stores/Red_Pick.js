import { ref } from 'vue'
import { defineStore } from 'pinia'

export const useRedpickStore = defineStore('Redpick', () => {
  const Redpick = ref(["","","","",""])
  function set_pick(target, index){
    Redpick.value[index] = target;
  }
  function reset(){
    Redpick.value = ["","","","",""];
  }
  function set_all(picks){
    Redpick.value = picks;
  }
  return { Redpick, set_pick, reset, set_all}
})
