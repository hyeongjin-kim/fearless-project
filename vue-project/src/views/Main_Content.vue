<script setup>
import { ref, onMounted } from 'vue';

import { useBluebanStore } from '@/stores/Blue_Ban';
import { useRedbanStore } from '@/stores/Red_Ban';
import { useBluepickStore } from '@/stores/Blue_Pick';
import { useRedpickStore } from '@/stores/Red_Pick';
import { useGlobalBluebanStore } from '@/stores/Blue_Global_Ban';
import { useGlobalRedbanStore } from '@/stores/Red_Global_Ban';

import { useSetindexStore } from '@/stores/Set_Index';
import { UseStateStore } from '@/stores/State';
import { useVersionStore } from '@/stores/version.js';
import { UseTimerStore } from '@/stores/Timer';

import Line_Filter from './Line_Filter.vue';
import SearchBar from './SearchBar.vue'
import ChampionGrid from './ChampionGrid.vue';

const All_Champions = ref("");
const Current_Champion_List = ref([]);
const Base_List = ref();

const Version_Store = useVersionStore();

const Blue_Ban_Store = useBluebanStore();
const Blue_Pick_Store = useBluepickStore();

const Red_Pick_Store = useRedpickStore();
const Red_Ban_Store = useRedbanStore();

const Red_Global_Ban_Store = useGlobalRedbanStore();
const Blue_Global_Ban_Store = useGlobalBluebanStore();

const Set_Index_Store = useSetindexStore();
const State_Store = UseStateStore();
const Timer_Store = UseTimerStore();

const Nickname_Map = ref({});
const Reset_Search_Bar = ref(false);

onMounted(async () => {
  if(!Version_Store.version) await Version_Store.Get_version();
  await Get_nickname();
});

async function Get_nickname(){
  const res = await fetch(`/nicknames.json`);
  const data = await res.json();
  Nickname_Map.value = data;
}

function Gamestart(){
  Timer_Store.startTimer();
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
  Timer_Store.startTimer();
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

function isDisabled(championId) {
  const globalBlueBanList = Blue_Global_Ban_Store.GlobalBlueban.flat();
  const globalRedBanList = Red_Global_Ban_Store.GlobalRedban.flat();
  return Blue_Ban_Store.Blueban.includes(championId)
      || Red_Ban_Store.Redban.includes(championId)
      || Blue_Pick_Store.Bluepick.includes(championId)
      || Red_Pick_Store.Redpick.includes(championId)
      || globalBlueBanList.includes(championId)
      || globalRedBanList.includes(championId);
}

function select_confirm(choice){
  if(!choice.value && State_Store.state.phase == 'Pick'){
    if(Timer_Store.timer == 0){
      const availableList = All_Champions.value.filter(champ => {return !isDisabled(champ.id);});
      const random_index = Math.floor(Math.random() * availableList.length);
      const random_pick = availableList[random_index].id;
    
      if(State_Store.state.turn == 'Red'){
        Red_Pick_Store.set_pick(random_pick, State_Store.state.index);
      }
      else{
        Blue_Pick_Store.set_pick(random_pick, State_Store.state.index);
      }
    }
    else{
      alert("챔피언을 선택하세요.");
      return;
    }
  }
  else if(!choice.value && State_Store.state.phase == 'Ban' && Timer_Store.timer != 0){
    if(!confirm("챔피언을 금지하지 않으시겠습니까?")){
      return;
    }
  }
  State_Store.next_state();
  if(State_Store.state.phase != 'Done') Timer_Store.startTimer();
  else Timer_Store.timeExpired();
}

function champ_filter(Filtered_List) {
  if(!All_Champions.value){
    All_Champions.value = Filtered_List.value;
  }
  Base_List.value = Filtered_List.value;
  Current_Champion_List.value = Base_List.value;
  Reset_Search_Bar.value = true;
}

function onSearchInput(query) {
  Reset_Search_Bar.value = false;
  const keyword = normalize(query);

  if (!keyword) {
    Current_Champion_List.value = Base_List.value; // 검색어 없으면 필터만 적용
    return;
  }
  Current_Champion_List.value = Base_List.value.filter(champ => {
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
      <Line_Filter @change-filter="champ_filter"/>
      <SearchBar :QueryProp="Reset_Search_Bar" @search="onSearchInput"/>
    </div>
    <div class="champion-grid" v-if="State_Store.state.phase != 'Done'">
      <ChampionGrid :champion-list-prop="Current_Champion_List" @confirm="select_confirm" />
    </div>
    <div v-if="State_Store.state.phase == 'Done'" class="swap-anouncement">두 챔피언 초상화를 클릭해 포지션을 바꿀 수 있습니다.</div>
    <div v-if="State_Store.state.phase == 'Done'" class="swap-anouncement">포지션에 맞게 스왑해주세요.</div>

    <div class="game-end-btn-container">
      <button v-if="State_Store.state.phase == 'Ready'" class="btn" @click="Gamestart()">게임 시작</button>
      <button v-if="State_Store.state.phase == 'Done' && Set_Index_Store.setindex < 5" class="btn" @click="GameConfirm()">{{Set_Index_Store.setindex}}세트 종료</button>
      <button v-if="State_Store.state.phase == 'Done' && Set_Index_Store.setindex < 5" class="btn" @click="Swap()">진영 변경</button>
      <button v-if="State_Store.state.phase == 'Done' && Set_Index_Store.setindex == 5" class="btn" @click="cleargame()">경기 종료</button>
    </div>
  </div>
</template>

<style scoped>
  .champion-grid {
    height: 60vh;
    width: 90vh;
    max-height: 60vh;
  }
  .swap-anouncement{
    margin-top: 20px;
    width: 700px;
    height: 50px;
    color: white;
    font-size: 30px;
  }
  .list-container{
    height: 60vh;
    width: 90vh;
    display: flex;
    justify-content: center;
    flex-direction: column;
    align-items: center;
  }
  .btn{
    margin-top: 20px;
    width: 200px;
    height: 50px;
    font-size: 30px;
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
</style>