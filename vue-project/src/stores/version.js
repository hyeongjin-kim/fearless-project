import { ref } from 'vue'
import { defineStore } from 'pinia'

export const useVersionStore = defineStore('version', () => {
  const version = ref('0')
  function set_version(info){
    version.value = info;
  }
  return { version, set_version}
})
