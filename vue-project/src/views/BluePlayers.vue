<script setup>
  import { useBluepickStore } from '@/stores/Blue_Pick';
 
  import { ref } from 'vue';
  import topimg from '@/assets/data/top.png'
  import jugimg from '@/assets/data/jug.png'
  import midimg from '@/assets/data/mid.png'
  import botimg from '@/assets/data/bot.png'
  import supimg from '@/assets/data/sup.png'
  import { UseStateStore } from '@/stores/State';
  const imglist = [supimg, botimg, midimg, jugimg, topimg];
  
  const bluepick = useBluepickStore();
  const state = UseStateStore();

  let players_to_swap = ref([]);

  function isselected(index){
    return players_to_swap.value.includes(index);
  }
  function swap(index){
    if(state.state.phase != 'Done') return;
    if(players_to_swap.value.includes(index)) players_to_swap.value = [];
    else{
      players_to_swap.value.push(index);
    
      if(players_to_swap.value.length == 2){
        let temp = bluepick.Bluepick[players_to_swap.value[0]];
        bluepick.set_pick(bluepick.Bluepick[players_to_swap.value[1]], players_to_swap.value[0]);
        bluepick.set_pick(temp, players_to_swap.value[1]);
        players_to_swap.value = [];
      }
    } 
  }
</script>

<template>
  <div class="Linfo">
    <img v-for="(pick, index) in bluepick.Bluepick" :key="index"
    class="championiller"
    :class="{target_to_swap: isselected(index)}"
    :src=" pick?`https://ddragon.leagueoflegends.com/cdn/img/champion/loading/${pick}_0.jpg`:imglist[index]"
     alt="" @click="swap(index)">

  </div>

</template>

<style scoped>
  .Linfo{
    width: auto;
    height: 25vh;
    /* border: 3px blue solid; */
  }
  .championiller{
    width: auto;
    height: 25vh;
  }
  .championiller.target_to_swap{
    box-sizing: border-box;
    border: 2px white solid;
  }
</style>