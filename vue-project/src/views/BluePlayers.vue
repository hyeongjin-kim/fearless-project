<script setup>
  import { useBluepickStore } from '@/stores/Blue_Pick';
  import { useStateStore } from '@/stores/State';
  import { usePlayersStore } from '@/stores/Players';
  
  import { ref } from 'vue';
  import topimg from '@/assets/data/top.png'
  import jugimg from '@/assets/data/jug.png'
  import midimg from '@/assets/data/mid.png'
  import botimg from '@/assets/data/bot.png'
  import supimg from '@/assets/data/sup.png'
  
  const imglist = [supimg, botimg, midimg, jugimg, topimg];
  
  const Blue_Pick_Store = useBluepickStore();
  const State_Store = useStateStore();
  const Player_store = usePlayersStore();

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

<!-- TODO: 닉네임 써주기 -->
<!-- <template>
  <div class="Blue_Player">
    <img v-for="(pick, index) in Blue_Pick_Store.Bluepick" :key="index"
    :class="['championiller', {active: is_active(index) || isselected(index) }]"
    :src=" pick?`https://ddragon.leagueoflegends.com/cdn/img/champion/loading/${pick}_0.jpg`:imglist[index]"
     alt="" @click="swap(index)">
  </div>
</template> -->
<template>
  <div class="Blue_Player">
    <div v-for="(pick, index) in Blue_Pick_Store.Bluepick" :key="index" class="champion-container">
      <div class="champion-img-wrapper">
        <img
          :class="['championiller', {active: is_active(index) || isselected(index) }]"
          :src="pick ? `https://ddragon.leagueoflegends.com/cdn/img/champion/loading/${pick}_0.jpg` : imglist[index]"
          alt=""
          @click="swap(index)"
        >
        <div class="nickname-overlay">
          {{ Player_store.get_player_info()[`blue_player_${5 - index}`]?.nickname || '' }}
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
  .Blue_Player{
    display: flex;
    width: 40vw;
    height: auto;
    flex-wrap: nowrap;
  }
  .champion-container {
    display: flex;
    flex-direction: column;
    align-items: center;
    width: 8vw;
  }
  .champion-img-wrapper {
    position: relative;
    width: 8vw;
    height: auto;
    display: flex;
    align-items: flex-end;
    justify-content: center;
  }
  .championiller{
    box-sizing: border-box;
    width: 8vw;
    height: auto;
    object-fit: cover;
  }
  .championiller.active{
    border: 3px solid #fff;
    box-shadow: 0 0 16px 4px #00bfff, 0 0 8px 2px #000 inset;
    animation: blink 2s infinite;
    z-index: 2;
  }
  .nickname-overlay {
    position: absolute;
    bottom: 8px;
    left: 50%;
    transform: translateX(-50%);
    width: 90%;
    color: #fff;
    font-weight: bold;
    font-size: 0.8em;
    text-align: center;
    text-shadow:
      0 0 8px #000,
      0 0 4px #000,
      0 2px 8px #00bfff;
    padding: 2px 6px;
    border-radius: 6px;
    background: rgba(0,0,0,0.25);
    pointer-events: none;
    z-index: 3;
    letter-spacing: 0.5px;
  }
  @keyframes blink {
    0%, 100% { box-shadow: 0 0 0px red; }
    50%      { box-shadow: 0 0 15px red; }
  }
</style>
