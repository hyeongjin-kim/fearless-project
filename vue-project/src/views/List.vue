<script setup>
import { ref, onMounted, computed, watch } from 'vue';
import { useVersionStore } from '@/stores/version.js';
import { useBluebanStore } from '@/stores/Blue_Ban';
import { useRedbanStore } from '@/stores/Red_Ban';
import { useBluepickStore } from '@/stores/Blue_Pick';
import { useRedpickStore } from '@/stores/Red_Pick';
import { useGlobalBluebanStore } from '@/stores/Blue_Global_Ban';
import { useGlobalRedbanStore } from '@/stores/Red_Global_Ban';
import { useSetindexStore } from '@/stores/Set_Index';
import { UseStateStore } from '@/stores/State';


const All_Champions = ref([]);
const Current_Filter = ref({"top" : false, "jug":false , "mid":false, "bot": false, "sup": false, "all": true});
const Line_Champions = ref({"top" : [], "jug":[] , "mid":[], "bot": [], "sup": [] });
const Current_Champion_List = ref([]);

const Selected_Champion = ref("");

const Version_Store = useVersionStore();

const Blue_Ban_Store = useBluebanStore();
const Blue_Pick_Store = useBluepickStore();

const Red_Pick_Store = useRedpickStore();
const Red_Ban_Store = useRedbanStore();

const Red_Global_Ban_Store = useGlobalRedbanStore();
const Blue_Global_Ban_Store = useGlobalBluebanStore();

const Set_Index_Store = useSetindexStore();
const State_Store = UseStateStore();
const Nickname_Map = ref({});
const SearchQuery = ref("");

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
  Version_Store.set_version(versions[0]);
}

async function Get_Champion(){
  if(!Version_Store.version) return;

  const res = await fetch(`https://ddragon.leagueoflegends.com/cdn/${Version_Store.version}/data/ko_KR/champion.json`);
  const data = await res.json();

  All_Champions.value = Object.values(data.data)
  .map(champ => ({
    id: champ.id,
    name: champ.name,
  })).sort((a, b) => a.name.localeCompare(b.name, 'ko-KR'));
  Current_Champion_List.value = All_Champions.value;
}

async function Get_line_Champion() {
  const line = ["top", "jug", "mid", "bot", "sup"];
  for (let i = 0; i < 5; i++) {
    const res = await fetch(`/${line[i]}_champions.json`);
    const data = await res.json();

    Line_Champions.value[line[i]] = data.sort(
      (a, b) => a.name.localeCompare(b.name, 'ko-KR')
    );
  }
}

async function Get_nickname(){
  const res = await fetch(`/nicknames.json`);
  const data = await res.json();

  Nickname_Map.value = data;
}

function choose(id){
  Selected_Champion.value = id;
  if(State_Store.state.phase == "Ban"){
    if(State_Store.state.turn == "Blue"){
       Blue_Ban_Store.set_ban(id, State_Store.state.index);
    }
    else if(State_Store.state.turn == "Red"){
       Red_Ban_Store.set_ban(id, State_Store.state.index);
    }
  }
  else if(State_Store.state.phase == "Pick"){
    if(State_Store.state.turn == "Blue"){
       Blue_Pick_Store.set_pick(id, State_Store.state.index)
    }
    else if(State_Store.state.turn == "Red"){
       Red_Pick_Store.set_pick(id, State_Store.state.index)
    }
  }
}

function isDisabled(championId) {
  const globalBlueBanList = Blue_Global_Ban_Store.GlobalBlueban.flat();
  const globalRedBanList = Red_Global_Ban_Store.GlobalRedban.flat();
  return Selected_Champion.value != championId
      &&( Blue_Ban_Store.Blueban.includes(championId)
      || Red_Ban_Store.Redban.includes(championId)
      || Blue_Pick_Store.Bluepick.includes(championId)
      || Red_Pick_Store.Redpick.includes(championId)
      || globalBlueBanList.includes(championId)
      || globalRedBanList.includes(championId));
}

function isselected(id){
  return Selected_Champion.value == id;
}

function Confirm(){
  //시간제한을 구현해야 함 아직까지는 선택 안하면 선택하라고 돌려보냄
  if(!Selected_Champion.value){
    alert("챔피언이 선택되지 않았습니다.");
    return;
  }
  Selected_Champion.value = "";
  State_Store.next_state();
}

function GameConfirm(){
  State_Store.reset();
  Set_Index_Store.increase_setindex();
  Red_Global_Ban_Store.set_ban(Red_Pick_Store.Redpick);
  Blue_Global_Ban_Store.set_ban(Blue_Pick_Store.Bluepick);
  Blue_Ban_Store.reset();
  Red_Ban_Store.reset();
  Blue_Pick_Store.reset();
  Red_Pick_Store.reset();
}


function Swap(){
  let tempban = Blue_Ban_Store.Blueban.reverse();
  Blue_Ban_Store.set_all(Red_Ban_Store.Redban.reverse());
  Red_Ban_Store.set_all(tempban);

  let tempglobalben = Blue_Global_Ban_Store.GlobalBlueban.reverse();
  Blue_Global_Ban_Store.set_all(Red_Global_Ban_Store.GlobalRedban.reverse());
  Red_Global_Ban_Store.set_all(tempglobalben);

  let temppick = Blue_Pick_Store.Bluepick.reverse();
  Blue_Pick_Store.set_all(Red_Pick_Store.Redpick.reverse());
  Red_Pick_Store.set_all(temppick);
}

function cleargame(){
  Set_Index_Store.reset();
  State_Store.reset();
  Blue_Global_Ban_Store.reset();
  Red_Global_Ban_Store.reset();
  Blue_Ban_Store.reset();
  Red_Ban_Store.reset();
  Blue_Pick_Store.reset();
  Red_Pick_Store.reset();
}

function champ_filter(line) {
  if (!Current_Filter.value[line]) {
    Object.keys(Current_Filter.value).forEach(key => {
      Current_Filter.value[key] = false;
    });
    Current_Champion_List.value = Line_Champions.value[line];
    Current_Filter.value[line] = true;
  } else {
    Current_Filter.value[line] = false;
    Current_Filter.value.all = true;
    Current_Champion_List.value = All_Champions.value;
  }
}

function is_filtered(line){
  return Current_Filter.value[line];
}

function onSearchInput(e) {
  const keyword = normalize(e.target.value);

  const line = Object.keys(Current_Filter.value).find(key => Current_Filter.value[key]) || 'all';

  const baseList = (line === 'all') ? All_Champions.value : Line_Champions.value[line];

  if (!keyword) {
    Current_Champion_List.value = baseList; // 검색어 없으면 필터만 적용
    return;
  }

  Current_Champion_List.value = baseList.filter(champ => {
    const id = champ.id;
    const allNames = Nickname_Map.value[id];
    return allNames.some(name => normalize(name).includes(keyword));
  });
}

function normalize(str) {
  return str.replace(/\s/g, "").toLowerCase();
}

</script>

<template>
  
  <div class="list-container">
    <div class="filter-container"  v-if="State_Store.state.phase != 'Done'">
      <div class="positions">
        <img src="/src/assets/data/top_icon.png" alt="" class="filter" :class="{filtered : is_filtered('top')}" @click="champ_filter('top')">
        <img src="/src/assets/data/jug_icon.png" alt="" class="filter" :class="{filtered : is_filtered('jug')}" @click="champ_filter('jug')">
        <img src="/src/assets/data/mid_icon.png" alt="" class="filter" :class="{filtered : is_filtered('mid')}" @click="champ_filter('mid')">
        <img src="/src/assets/data/bot_icon.png" alt="" class="filter" :class="{filtered : is_filtered('bot')}" @click="champ_filter('bot')">
        <img src="/src/assets/data/sup_icon.png" alt="" class="filter" :class="{filtered : is_filtered('sup')}" @click="champ_filter('sup')">
      </div>
      <input type="text" class="search-bar" v-model="SearchQuery" @input="onSearchInput" placeholder="챔피언 이름을 입력하세요.">
    </div>
    <div class="champion-grid" v-if="State_Store.state.phase != 'Done'">
      <div 
        v-for="champ in Current_Champion_List" 
        :key="champ.id" 
        :class="['champion-card', {disabled: isDisabled(champ.id)}]"

      >
      <img 
        :src="`https://ddragon.leagueoflegends.com/cdn/${Version_Store.version}/img/champion/${champ.id}.png`" 
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
    <div v-if="State_Store.state.phase == 'Done'" class="swap-anouncement">두 챔피언 초상화를 클릭해 포지션을 바꿀 수 있습니다.</div>
    <div v-if="State_Store.state.phase == 'Done'" class="swap-anouncement">포지션에 맞게 스왑해주세요.</div>
    
    <div class="confirmbtn-container">
      <div class="game-end-btn-container">
        <button v-if="State_Store.state.phase == 'Pick'" class="confirm" @click="Confirm()">챔피언 선택</button>
        <button v-if="State_Store.state.phase == 'Ban'" class="confirm" @click="Confirm()">챔피언 금지</button>
        <button v-if="State_Store.state.phase == 'Done' && Set_Index_Store.setindex < 5" class="confirm" @click="GameConfirm()">{{Set_Index_Store.setindex}}세트 종료</button>
        <button v-if="State_Store.state.phase == 'Done' && Set_Index_Store.setindex < 5" class="swapbtn" @click="Swap()">진영 변경</button>
        <button v-if="State_Store.state.phase == 'Done' && Set_Index_Store.setindex == 5" class="gameover" @click="cleargame()">경기 종료</button>
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
  width: 90vh;
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
  width: auto;
  height: 8vh;
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
  width: 90vh;
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