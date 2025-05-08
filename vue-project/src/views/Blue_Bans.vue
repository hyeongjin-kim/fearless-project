<script setup> 
  import { useSetindexStore } from '@/stores/Set_Index';
  import {useVersionStore} from '@/stores/version.js'
  import { useBluebanStore } from '@/stores/Blue_Ban';
  import default_img from '@/assets/data/unknown.jpg';
  const setindex = useSetindexStore();
  const version = useVersionStore();
  const Bluebans = useBluebanStore();
  
</script>

<template>
    <div v-if="version.version" class="blue-bancontainer">
      <div style="color : white">Game {{setindex.setindex}} </div>
        <div class="bluebans">
          <div v-for="(ban, index) in Bluebans.Blueban" :key="index" class="banned_champion">
          <img  :src= "ban?`https://ddragon.leagueoflegends.com/cdn/${version.version}/img/champion/${ban}.png`:default_img"/>
          <img src="@/assets/data/banned_overlay.png" class="banned-overlay"/>
        </div>
      </div>
    </div>
</template>


  <style scoped>
    .blue-bancontainer {
      display: flex;
      width: auto;
      height: 8vh + 24;
      flex-direction: column;
      flex-wrap: nowrap;
    }
    .banned_champion {
      position: relative;
      width: 8vh;
      height: 8vh;
    }
    .bluebans{
        width: inherit;
        height: inherit;
      display: flex;
    }
    .banned_champion img {
      width: 100%;
      height: 100%;
      object-fit: cover;
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