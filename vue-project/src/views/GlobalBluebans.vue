<script setup>
import {useVersionStore} from '@/stores/version.js'
import { useGlobalBluebanStore } from '@/stores/globalblueban';
const version = useVersionStore();
const globalblueban = useGlobalBluebanStore();
</script>

<template>
  <div class= "BlueGlobalBan-container">
    <div v-for="(game, index) in globalblueban.GlobalBlueban" :key="inedx" class="BlueGlobalBan">
      <div>game{{index + 1}} </div>
      <img v-for="(ban, i) in game":key="i" :src = "`https://ddragon.leagueoflegends.com/cdn/${version.version}/img/champion/${ban}.png`" width = "90px" height = "90px">
    </div>
  </div>
    
    
  </template>
  
  <style>
    .BlueGlobalBan{
      width: 450px;
      height: 120px;
      /* border: 3px purple solid; */
    }
    .BlueGlobalBan-container{
      width: 450px;
      display : flex;
      flex-direction: column;
      justify-content: end;
    }
  </style>