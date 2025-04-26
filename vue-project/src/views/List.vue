<script setup>
import { ref, onMounted } from 'vue';
import { useVersionStore } from '@/stores/version.js';
import { useBluebanStore } from '@/stores/blueban';


const champions = ref([]);
const current_champion = ref("");
const version = useVersionStore();
const blueban = useBluebanStore();

const state = ref({phase: "Ban", turn: "Blue", index: 4});

onMounted(async () => {
  await Get_version();
  await Get_Champion();
});

async function Get_version(){
  const res = await fetch('https://ddragon.leagueoflegends.com/api/versions.json');
  const versions = await res.json();
  version.set_version(versions[0]);
}

async function Get_Champion(){
  if(!version.version) return;

  const res = await fetch(`https://ddragon.leagueoflegends.com/cdn/${version.version}/data/ko_KR/champion.json`);
  const data = await res.json();

  champions.value = Object.values(data.data)
  .map(champ => ({
    id: champ.id,
    name: champ.name,
  })).sort((a, b) => a.name.localeCompare(b.name, 'ko-KR'));
}

function choose(id){
  current_champion.value = id;
  console.log(id);
  if(state.value.phase == "Ban"){
    if(state.value.turn == "Blue"){
      blueban.set_ban(id, state.value.index);
    }
    else if(state.value.turn == "Red"){
      redban.set_ban(id, state.value.index);
    }
  }
  else if(state.value.phase == "Pick"){
    if(state.value.turn == "Blue"){
      
    }
  }
}

</script>

<template>
  <div class="champion-grid">
    <div 
      v-for="champ in champions" 
      :key="champ.id" 
      class="champion-card"
    >
      <img 
        :src="`https://ddragon.leagueoflegends.com/cdn/${version.version}/img/champion/${champ.id}.png`" 
        :alt="champ.name" 
        class="champion-icon"
        v-on:click="choose(champ.id)"
      />
      <p>{{ champ.name }}</p>
    </div>
  </div>
</template>

<style scoped>
.champion-grid {
  display: grid;
  grid-template-columns: repeat(8, 1fr);
  gap: 8px;
  max-height: 800px;
  overflow-y: auto;
}
.champion-card {
  text-align: center;
  font-size: 12px;
}
.champion-icon {
  width: 96px;
  height: 96px;
  object-fit: contain;
}
</style>