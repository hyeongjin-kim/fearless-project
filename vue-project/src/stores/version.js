import { ref } from 'vue'
import { defineStore } from 'pinia'

export const useVersionStore = defineStore('version', () => {
  const version = ref("");
  
  async function Get_version(){
    const res = await fetch('https://ddragon.leagueoflegends.com/api/versions.json');
    const versions = await res.json();
    version.value = versions[0];
  }

  return { version, Get_version}
})
