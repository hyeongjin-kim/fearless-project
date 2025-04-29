<script setup>
  import {ref} from 'vue'
  import { useRedpickStore } from '@/stores/redpick';
  import topimg from '@/assets/data/top.png'
  import jugimg from '@/assets/data/jug.png'
  import midimg from '@/assets/data/mid.png'
  import botimg from '@/assets/data/bot.png'
  import supimg from '@/assets/data/sup.png'
  const imglist = [topimg, jugimg, midimg, botimg, supimg];
  const redpick = useRedpickStore();

  let players_to_swap = ref([]);
  
  function isselected(index){
    return players_to_swap.value.includes(index);
  }
  function swap(index){
    
    if(players_to_swap.value.includes(index)) return;
    players_to_swap.value.push(index);
    console.log(players_to_swap.value);
    //if() 페이즈가 완료상태일 때만 가능하게 해야함
    if(players_to_swap.value.length == 2){
      let temp = redpick.Redpick[players_to_swap.value[0]];
      redpick.set_pick(redpick.Redpick[players_to_swap.value[1]], players_to_swap.value[0]);
      redpick.set_pick(temp, players_to_swap.value[1]);
      players_to_swap.value = [];
    }
  }
</script>

<template>
  <div class="Rinfo">
    <img v-for="(pick, index) in redpick.Redpick" :key="index"
    class="championiller"
    :class="{target_to_swap: isselected(index)}"
    :src=" pick?`https://ddragon.leagueoflegends.com/cdn/img/champion/loading/${pick}_0.jpg`:imglist[index]"
     alt="" @click="swap(index)" width="154px" height="280px" >
  </div>
</template>

<style>
  .Rinfo{
    width: 770px;
    height: 280px;
    /* border: 3px red solid; */
  }
  .championiller.target_to_swap{
    box-sizing: border-box;
    border: 2px white solid;
  }
</style>
