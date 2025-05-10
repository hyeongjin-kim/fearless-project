<script setup>
  import {useVersionStore} from '@/stores/version.js'
  import { useGlobalRedbanStore } from '@/stores/Red_Global_Ban';
  import default_img from '@/assets/data/unknown.jpg';
  const version = useVersionStore();
  const globalredban = useGlobalRedbanStore();
</script>

<template>
  <div class= "RedGlobalBan-container">
    <div v-for="(game, index) in globalredban.GlobalRedban" :key="index" class="RedGlobalBan">
      <div style="color : white">Game {{index + 1}} </div>
      <div class="ban-container">
        <div v-for="(ban, i) in game" :key="i" class="globalbannd">
          <img  :src= "ban?`https://ddragon.leagueoflegends.com/cdn/${version.version}/img/champion/${ban}.png`:default_img" alt="" class = "bans"/>
          <img src="@/assets/data/banned_overlay_90.png" class="global_banned-overlay"/>
        </div>
      </div>
    </div>
  </div>
</template>
  
<style scoped>
  .RedGlobalBan{
    width: 30vh;
    height: 6vh + 24;
    display: flex;
    flex-direction: column;
    align-items: end;
  }
  .ban-container{
    width: 30vh;
    display: flex;
  }
  .RedGlobalBan-container{
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
  .global_banned-overlay {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    opacity: 0.6;
    pointer-events: none;
  }
</style>