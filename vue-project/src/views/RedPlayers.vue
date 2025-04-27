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
</script>

<template>
  <div class="Rinfo">
    <img v-for="(pick, index) in redpick.Redpick" :key="index" :src=" pick?`https://ddragon.leagueoflegends.com/cdn/img/champion/loading/${pick}_0.jpg`:imglist[index]" alt="" width="154px" height="280px" >
  </div>
</template>

<style>
  .Rinfo{
    width: 770px;
    height: 280px;
    /* border: 3px red solid; */
  }
</style>
