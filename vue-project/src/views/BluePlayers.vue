<script setup>
  import { useBluepickStore } from '@/stores/Blue_Pick';
  import { UseStateStore } from '@/stores/State';
  
  import { ref } from 'vue';
  import topimg from '@/assets/data/top.png'
  import jugimg from '@/assets/data/jug.png'
  import midimg from '@/assets/data/mid.png'
  import botimg from '@/assets/data/bot.png'
  import supimg from '@/assets/data/sup.png'
  
  const imglist = [supimg, botimg, midimg, jugimg, topimg];
  
  const Blue_Pick_Store = useBluepickStore();
  const State_Store = UseStateStore();

  let players_to_swap = ref([]);

  function is_active(index){
    let state = State_Store.state;
    return state.phase == "Pick" && state.turn == "Blue" && state.index == index;
  }

  function isselected(index){
    return players_to_swap.value.includes(index);
  }
  
  function swap(index){
    if(State_Store.state.phase != 'Done') return;
    if(players_to_swap.value.includes(index)) players_to_swap.value = [];
    else{
      players_to_swap.value.push(index);
    
      if(players_to_swap.value.length == 2){
        let temp = Blue_Pick_Store.Bluepick[players_to_swap.value[0]];
        Blue_Pick_Store.set_pick(Blue_Pick_Store.Bluepick[players_to_swap.value[1]], players_to_swap.value[0]);
        Blue_Pick_Store.set_pick(temp, players_to_swap.value[1]);
        players_to_swap.value = [];
      }
    } 
  }
</script>

<template>
  <div class="Blue_Player">
    <img v-for="(pick, index) in Blue_Pick_Store.Bluepick" :key="index"
    :class="['championiller', {active: is_active(index) || isselected(index) }]"
    :src=" pick?`https://ddragon.leagueoflegends.com/cdn/img/champion/loading/${pick}_0.jpg`:imglist[index]"
     alt="" @click="swap(index)">
  </div>
</template>

<style scoped>
  .Blue_Player{
    display: flex;
    width: auto;
    height: 25vh;
    flex-wrap: nowrap;
  }
  .championiller{
    box-sizing: border-box;
    width: auto;
    height: 25vh;
  }
  .championiller.active{
    border-color: red;
    animation: blink 2s infinite;
    z-index: 2;
  }
  @keyframes blink {
    0%, 100% { box-shadow: 0 0 0px red; }
    50%      { box-shadow: 0 0 15px red; }
  }
</style>