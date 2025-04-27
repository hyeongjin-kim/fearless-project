<script setup>
import { ref, onMounted } from 'vue';
import { useVersionStore } from '@/stores/version.js';
import { useBluebanStore } from '@/stores/blueban';
import { useRedbanStore } from '@/stores/redban';
import { useBluepickStore } from '@/stores/bluepick';
import { useRedpickStore } from '@/stores/redpick';
import { useGlobalBluebanStore } from '@/stores/globalblueban';
import { useGlobalRedbanStore } from '@/stores/globalredban';

const champions = ref([]);
const current_champion = ref("");
const version = useVersionStore();
const blueban = useBluebanStore();
const bluepick = useBluepickStore();
const redpick = useRedpickStore();
const redban = useRedbanStore();
const setindex = ref(1);
const stateindex = ref(0);
const globalredban = useGlobalRedbanStore();
const globalblueban = useGlobalBluebanStore();

const statelist = ref([{phase: "Ban", turn: "Blue", index: 4},
                       {phase: "Ban", turn: "Red", index: 0},
                       {phase: "Ban", turn: "Blue", index: 3},
                       {phase: "Ban", turn: "Red", index: 1},
                       {phase: "Ban", turn: "Blue", index: 2},
                       {phase: "Ban", turn: "Red", index: 2},
                       
                       {phase: "Pick", turn: "Blue", index: 4},
                       {phase: "Pick", turn: "Red", index: 0},
                       {phase: "Pick", turn: "Red", index: 1},
                       {phase: "Pick", turn: "Blue", index: 3},
                       {phase: "Pick", turn: "Blue", index: 2},
                       {phase: "Pick", turn: "Red", index: 2},

                       {phase: "Ban", turn: "Red", index: 3},
                       {phase: "Ban", turn: "Blue", index: 1},
                       {phase: "Ban", turn: "Red", index: 4},
                       {phase: "Ban", turn: "Blue", index: 0},

                       {phase: "Pick", turn: "Red", index: 3},
                       {phase: "Pick", turn: "Blue", index: 1},
                       {phase: "Pick", turn: "Blue", index: 0},
                       {phase: "Pick", turn: "Red", index: 4},
                       {phase: "Done", turn: "None", index: -1},
                      ])
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
    ban: false,
    pick: false,
  })).sort((a, b) => a.name.localeCompare(b.name, 'ko-KR'));
}

function choose(id){
  
  current_champion.value = id;
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
       bluepick.set_pick(id, state.value.index)
    }
    else if(state.value.turn == "Red"){
       redpick.set_pick(id, state.value.index)
    }
  }
}
function isDisabled(championId) {
  const globalBlueBanList = globalblueban.GlobalBlueban.flat();
  const globalRedBanList = globalredban.GlobalRedban.flat();
  return blueban.Blueban.includes(championId)
      || redban.Redban.includes(championId)
      || bluepick.Bluepick.includes(championId)
      || redpick.Redpick.includes(championId)
      || globalBlueBanList.includes(championId)
      || globalRedBanList.includes(championId)
      ;
}
function Confirm(){
  if(!current_champion.value){
    alert("챔피언이 선택되지 않았습니다.");
    return;
  }
  current_champion.value = "";
  stateindex.value = stateindex.value + 1;
  state.value = statelist.value[stateindex.value];
}

function GameConfirm(){
  stateindex.value = 0;
  state.value = statelist.value[stateindex.value];
  setindex.value++;
  globalredban.set_ban(redban.Redban);
  globalblueban.set_ban(blueban.Blueban);
  blueban.reset();
  redban.reset();
  bluepick.reset();
  redpick.reset();
}

</script>

<template>
  <div class="list-container">
    <div class="champion-grid" v-if="state.phase != 'Done'">
      <div 
        v-for="champ in champions" 
        :key="champ.id" 
        class="champion-card"
        :class="{ disabled: isDisabled(champ.id) }"
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
    <div class="confirmbtn-container">
      <button v-if="state.phase == 'Pick'" class="confirm" @click="Confirm()">챔피언 선택</button>
      <button v-if="state.phase == 'Ban'" class="confirm" @click="Confirm()">챔피언 금지</button>
      <button v-if="state.phase == 'Done' || setindex.value < 5" class="confirm" @click="GameConfirm()">{{setindex}}세트 종료</button>
    </div>
  </div>
  
</template>

<style scoped>
.champion-grid {
  display: grid;
  grid-template-columns: repeat(8, 1fr);
  gap: 8px;
  max-height: 750px;
  overflow-y: auto;
}
.champion-card {
  box-sizing: border-box;
  text-align: center;
  font-size: 12px;
  cursor: pointer;
  transition: opacity 0.3s;
}
.champion-card.disabled {
  opacity: 0.4;
  pointer-events: none;
}
.champion-icon {
  width: 96px;
  height: 96px;
  object-fit: contain;
}
.list-container{
  height: 900px;
  display: flex;
  justify-content: center;
  flex-direction: column;
  align-items: center;
}
.confirm{
  margin-top: 20px;
  width: 200px;
  height: 50px;
  font-size: 30px;
}
</style>