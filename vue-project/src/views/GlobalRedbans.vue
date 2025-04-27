<script setup>
  import {useVersionStore} from '@/stores/version.js'
  import { useGlobalRedbanStore } from '@/stores/globalredban';
  const version = useVersionStore();
  const globalredban = useGlobalRedbanStore();
</script>

<template>
  <div class= "RedGlobalBan-container">
    <div v-for="(game, index) in globalredban.GlobalRedban" :key="inedx" class="RedGlobalBan">
      <div>game{{index + 1}} </div>
      <img v-for="(ban, i) in game":key="i" :src = "`https://ddragon.leagueoflegends.com/cdn/${version.version}/img/champion/${ban}.png`" width = "90px" height = "90px">
    </div>
  </div>
    
    
  </template>
  
  <style>
    .RedGlobalBan{
      width: 450px;
      height: 120px;
      /* border: 3px purple solid; */
    }
    .RedGlobalBan-container{
      width: 450px;
      display : flex;
      flex-direction: column;
      justify-content: end;
    }
  </style>