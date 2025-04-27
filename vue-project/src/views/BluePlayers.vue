<script setup>
  import { useBluepickStore } from '@/stores/bluepick';
  import topimg from '@/assets/data/top.png'
  import jugimg from '@/assets/data/jug.png'
  import midimg from '@/assets/data/mid.png'
  import botimg from '@/assets/data/bot.png'
  import supimg from '@/assets/data/sup.png'
  const imglist = [supimg, botimg, midimg, jugimg, topimg];
  
  const bluepick = useBluepickStore();
</script>

<template>
  <div class="Linfo">
    <img v-for="(pick, index) in bluepick.Bluepick" :key="index" :src=" pick?`https://ddragon.leagueoflegends.com/cdn/img/champion/loading/${pick}_0.jpg`:imglist[index]" alt="" width="154px" height="280px" >
  </div>

</template>

<style>
  .Linfo{
    width: 770px;
    height: 280px;
    /* border: 3px blue solid; */
  }
</style>