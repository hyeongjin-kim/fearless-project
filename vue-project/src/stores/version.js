import { ref } from 'vue'
import { defineStore } from 'pinia'

export const useVersionStore = defineStore('version', () => {
  const version = ref("");
  const Version_info = ref("");
  async function Get_version(){
    const res = await fetch('https://ddragon.leagueoflegends.com/api/versions.json');
    const versions = await res.json();
    version.value = versions[0];
    Version_info.value = convertVersion(version.value);
  }
  
  function convertVersion(versionStr) {
    const [year, patch] = versionStr.split('.');
    const newYear = 10 + parseInt(year);
    const paddedPatch = patch.padStart(2, '0');
    return `${newYear}.${paddedPatch}`;
  }

  return { version, Get_version, Version_info}
})
