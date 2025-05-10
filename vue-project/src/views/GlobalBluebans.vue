<script setup>
import { useVersionStore } from '@/stores/version.js'
import { useGlobalBluebanStore } from '@/stores/Blue_Global_Ban';
import default_img from '@/assets/data/unknown.jpg';
const Version_Store = useVersionStore();
const Global_Blue_Ban_Store = useGlobalBluebanStore();
</script>

<template>
  <div class= "BlueGlobalBan-container">
    <div v-for="(game, index) in Global_Blue_Ban_Store.GlobalBlueban" :key="index" class="BlueGlobalBan">
      <div style="color : white">Game {{index + 1}} </div>
      <div class="ban-container">
        <div v-for="(ban, i) in game" :key="i" class="globalbannd">
          <img  :src= "ban?`https://ddragon.leagueoflegends.com/cdn/${Version_Store.version}/img/champion/${ban}.png`:default_img" class="bans" alt=""/>
          <img src="@/assets/data/banned_overlay_90.png" class="banned-overlay"/>
        </div>
      </div>
    </div>
  </div>
</template>
  
<style scoped>
  .BlueGlobalBan{
    width: 30vh;
    height: 6vh + 24;
  }
  .ban-container{
    width: 30vh;
    display: flex;
  }
  .BlueGlobalBan-container{
    width: 30vh;
    display : flex;
    flex-direction: column;
    justify-content: end;
  }
  .globalbannd{
    position: relative;
  }
  .bans{
    width: auto;
    height: 6vh;
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