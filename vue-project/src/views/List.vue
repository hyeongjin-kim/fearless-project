<script setup>
import { ref, onMounted, computed, watch } from 'vue';
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
const current_filter = ref({"top" : false, "jug":false , "mid":false, "bot": false, "sup": false, "all": true});
const line_champions = ref({"top" : [], "jug":[] , "mid":[], "bot": [], "sup": [] });
const champion_list = ref([]);
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
const nicknameMap = ref({});
const searchQuery = ref("");

onMounted(async () => {
  await Get_version();
  await Get_Champion();
  await Get_line_Champion();
  await Get_nickname();
  onSearchInput({ target: { value: "" } });
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
  champion_list.value = champions.value;
}

async function Get_line_Champion() {
  const line = ["top", "jug", "mid", "bot", "sup"];
  for (let i = 0; i < 5; i++) {
    const res = await fetch(`/${line[i]}_champions.json`);
    const data = await res.json();

    line_champions.value[line[i]] = data.sort(
      (a, b) => a.name.localeCompare(b.name, 'ko-KR')
    );
  }
}

async function Get_nickname(){
  const res = await fetch(`/nicknames.json`);
  const data = await res.json();

  nicknameMap.value = data;
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

function champ_filter(line) {
  if (!current_filter.value[line]) {
    Object.keys(current_filter.value).forEach(key => {
      current_filter.value[key] = false;
    });
    champion_list.value = line_champions.value[line];
    current_filter.value[line] = true;
  } else {
    current_filter.value[line] = false;
    current_filter.value.all = true;
    champion_list.value = champions.value;
  }
}

function is_filtered(line){
  return current_filter.value[line];
}

function onSearchInput(e) {
  const keyword = normalize(e.target.value);

  const line = Object.keys(current_filter.value).find(key => current_filter.value[key]) || 'all';

  const baseList = (line === 'all') ? champions.value : line_champions.value[line];

  if (!keyword) {
    champion_list.value = baseList; // 검색어 없으면 필터만 적용
    return;
  }

  champion_list.value = baseList.filter(champ => {
    const id = champ.id;
    const allNames = nicknameMap.value[id];
    return allNames.some(name => normalize(name).includes(keyword));
  });
}

function normalize(str) {
  return str.replace(/\s/g, "").toLowerCase();
}

</script>

<template>
  
  <div class="list-container">
    <div class="filter-container"  v-if="state.state.phase != 'Done'">
      <div class="positions">
        <img src="/src/assets/data/top_icon.png" alt="" class="filter" :class="{filtered : is_filtered('top')}" @click="champ_filter('top')">
        <img src="/src/assets/data/jug_icon.png" alt="" class="filter" :class="{filtered : is_filtered('jug')}" @click="champ_filter('jug')">
        <img src="/src/assets/data/mid_icon.png" alt="" class="filter" :class="{filtered : is_filtered('mid')}" @click="champ_filter('mid')">
        <img src="/src/assets/data/bot_icon.png" alt="" class="filter" :class="{filtered : is_filtered('bot')}" @click="champ_filter('bot')">
        <img src="/src/assets/data/sup_icon.png" alt="" class="filter" :class="{filtered : is_filtered('sup')}" @click="champ_filter('sup')">
      </div>
      <input type="text" class="search-bar" v-model="searchQuery" @input="onSearchInput" placeholder="챔피언 이름을 입력하세요.">
    </div>
    <div class="champion-grid" v-if="state.state.phase != 'Done'">
      <div 
        v-for="champ in champion_list" 
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
  height: 60vh;
  width: 55vw;
  max-height: 60vh;
  overflow-y: auto;
  align-content: start; 
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
  height: 60vh;
  width: 55vw;
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
.filter-container{
  width: inherit;
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.positions{
  width: 700px;
  display: flex;
  justify-content: left;
}
.filter{
  width: 50px;
  height: 50px;
  cursor: pointer;
  margin-right: 15px;

}
.search-bar{
  width: 200px;
  height: 40px;
}
.filter.filtered{
  border: 2px solid white;
  box-sizing: border-box;
}
</style>