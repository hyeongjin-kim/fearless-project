<script setup>
import { ref, onMounted } from 'vue';
import { useVersionStore } from '@/stores/version.js';
import { useBluebanStore } from '@/stores/blueban';
import { useRedbanStore } from '@/stores/redban';
import { useBluepickStore } from '@/stores/bluepick';
import { useRedpickStore } from '@/stores/redpick';
import { useGlobalBluebanStore } from '@/stores/globalblueban';
import { useGlobalRedbanStore } from '@/stores/globalredban';
import { useSetindexStore } from '@/stores/setindex';
import { UseStateStore } from '@/stores/state';

const champions = ref([]);
const current_champion = ref("");
const version = useVersionStore();
const blueban = useBluebanStore();
const bluepick = useBluepickStore();
const redpick = useRedpickStore();
const redban = useRedbanStore();
const globalredban = useGlobalRedbanStore();
const globalblueban = useGlobalBluebanStore();
const setindex = useSetindexStore();
const state = UseStateStore();

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
  if(state.state.phase == "Ban"){
    if(state.state.turn == "Blue"){
       blueban.set_ban(id, state.state.index);
    }
    else if(state.state.turn == "Red"){
       redban.set_ban(id, state.state.index);
    }
  }
  else if(state.state.phase == "Pick"){
    if(state.state.turn == "Blue"){
       bluepick.set_pick(id, state.state.index)
    }
    else if(state.state.turn == "Red"){
       redpick.set_pick(id, state.state.index)
    }
  }
}

function isDisabled(championId) {
  const globalBlueBanList = globalblueban.GlobalBlueban.flat();
  const globalRedBanList = globalredban.GlobalRedban.flat();
  return current_champion.value != championId
      &&( blueban.Blueban.includes(championId)
      || redban.Redban.includes(championId)
      || bluepick.Bluepick.includes(championId)
      || redpick.Redpick.includes(championId)
      || globalBlueBanList.includes(championId)
      || globalRedBanList.includes(championId));
}

function isselected(id){
  return current_champion.value == id;
}

function Confirm(){
  //시간제한을 구현해야 함 아직까지는 선택 안하면 선택하라고 돌려보냄냄
  if(!current_champion.value){
    alert("챔피언이 선택되지 않았습니다.");
    return;
  }
  current_champion.value = "";
  state.next_state();
}

function GameConfirm(){
  state.reset();
  setindex.increase_setindex();
  globalredban.set_ban(redpick.Redpick);
  globalblueban.set_ban(bluepick.Bluepick);
  blueban.reset();
  redban.reset();
  bluepick.reset();
  redpick.reset();
}


function Swap(){
  let tempban = blueban.Blueban.reverse();
  blueban.set_all(redban.Redban.reverse());
  redban.set_all(tempban);

  let tempglobalben = globalblueban.GlobalBlueban.reverse();
  globalblueban.set_all(globalredban.GlobalRedban.reverse());
  globalredban.set_all(tempglobalben);

  let temppick = bluepick.Bluepick.reverse();
  bluepick.set_all(redpick.Redpick.reverse());
  redpick.set_all(temppick);
}

function cleargame(){
  setindex.reset();
  state.reset();
  globalblueban.reset();
  globalredban.reset();
  blueban.reset();
  redban.reset();
  bluepick.reset();
  redpick.reset();
}
</script>

<template>
  <div class="list-container">
    <div class="champion-grid" v-if="state.state.phase != 'Done'">
      <div 
        v-for="champ in champions" 
        :key="champ.id" 
        :class="['champion-card', {disabled: isDisabled(champ.id)}]"

      >
      <img 
        :src="`https://ddragon.leagueoflegends.com/cdn/${version.version}/img/champion/${champ.id}.png`" 
        :alt="champ.name"
        :class="['champion-icon', { selected: isselected(champ.id) }]"
        @click="choose(champ.id)"
      />
        <img 
        v-if="isDisabled(champ.id)" 
        src="@/assets/data/banned_overlay.png"
        class="banned-overlay"
        />
        <p style="color: white" >{{ champ.name }}</p>
      </div>
    </div>
    <div v-if="state.state.phase == 'Done'" class="swap-anouncement">두 챔피언 초상화를 클릭해 포지션을 바꿀 수 있습니다.</div>
    <div v-if="state.state.phase == 'Done'" class="swap-anouncement">포지션에 맞게 스왑해주세요.</div>
    <div class="confirmbtn-container">
      <div class="game-end-btn-container">
        <button v-if="state.state.phase == 'Pick'" class="confirm" @click="Confirm()">챔피언 선택</button>
        <button v-if="state.state.phase == 'Ban'" class="confirm" @click="Confirm()">챔피언 금지</button>
        <button v-if="state.state.phase == 'Done' && setindex.setindex < 5" class="confirm" @click="GameConfirm()">{{setindex.setindex}}세트 종료</button>
        <button v-if="state.state.phase == 'Done' && setindex.setindex < 5" class="swapbtn" @click="Swap()">진영 변경</button>
        <button v-if="state.state.phase == 'Done' && setindex.setindex == 5" class="gameover" @click="cleargame()">경기 종료</button>
      </div>
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
  text-align: center;
  font-size: 20px;
  position: relative; 
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
.swap-anouncement{
  margin-top: 20px;
  width: 700px;
  height: 50px;
  color: white;
  font-size: 30px;
}
.champion-icon.selected {
  border: 2px solid white;
  box-sizing: border-box;
}
.list-container{
  height: 70vh;
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
.swapbtn{
  margin-top: 20px;
  width: 200px;
  height: 50px;
  font-size: 30px;
}
.gameover{
  margin-top: 20px;
  width: 200px;
  height: 50px;
  font-size: 30px;
}
.banned-overlay {
  position: absolute;
  top: 0;
  left: 27px;
  width: 96px;
  height: 96px;
  opacity: 0.7; 
  pointer-events: none;
}
.game-end-btn-container{
  display: flex;
  justify-content: space-between;
}
</style>