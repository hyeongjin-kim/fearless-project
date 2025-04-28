<script setup>
import {useVersionStore} from '@/stores/version.js'
import { useGlobalBluebanStore } from '@/stores/globalblueban';
const version = useVersionStore();
const globalblueban = useGlobalBluebanStore();
</script>

<template>
  <div class= "BlueGlobalBan-container">
    <div v-for="(game, index) in globalblueban.GlobalBlueban" :key="index" class="BlueGlobalBan">
      <div style="color : white">Game {{index + 1}} </div>
      <div class="ban-container">
        <div v-for="(ban, i) in game" :key="i" class="globalbannd">
          <img  :src= "ban?`https://ddragon.leagueoflegends.com/cdn/${version.version}/img/champion/${ban}.png`:default_img" alt="" width = "90px" height = "90px"/>
          <img src="@/assets/data/banned_overlay_90.png" class="banned-overlay"/>
        </div>
      </div>
    </div>
  </div>
    
    
  </template>
  
  <style>
    .BlueGlobalBan{
      width: 450px;
      height: 120px;
      /* border: 3px purple solid; */
    }
    .ban-container{
      width: 450px;
      display: flex;
      
    }
    .BlueGlobalBan-container{
      width: 450px;
      
      display : flex;
      flex-direction: column;
      justify-content: end;
    }
    .globalbannd{
      position: relative;
    }
    .banned-overlay {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      opacity: 0.6;
      pointer-events: none;
    }

</style>