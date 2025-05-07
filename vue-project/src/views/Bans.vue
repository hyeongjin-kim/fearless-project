<script setup> 
  import { useSetindexStore } from '@/stores/Set_Index';
  import {useVersionStore} from '@/stores/version.js'
  import { useBluebanStore } from '@/stores/Blue_Ban';
  import { useRedbanStore } from '@/stores/Red_Ban';
  import default_img from '@/assets/data/unknown.jpg';
  const setindex = useSetindexStore();
  const version = useVersionStore();
  const Bluebans = useBluebanStore();
  const Redbans = useRedbanStore(); 
  
</script>

<template>
  <div class="Binfo">
    <div v-if="version.version" class="blue-bancontainer">
      <div style="color : white">Game {{setindex.setindex}} </div>
        <div class="bluebans" width="500px" height="100px" >
          <div v-for="(ban, index) in Bluebans.Blueban" :key="index" class="bannd">
          <img  :src= "ban?`https://ddragon.leagueoflegends.com/cdn/${version.version}/img/champion/${ban}.png`:default_img" alt="" width = "100px" height = "100px"/>
          <img src="@/assets/data/banned_overlay.png" class="banned-overlay"/>
        </div>
      </div>
      
    </div>
    <div v-if="version.version" class="red-bancontainer">
      <div style="color : white">Game {{setindex.setindex}} </div>
      <div class="redbans" width="500px" height="100px" >
        <div v-for="(ban, index) in Redbans.Redban" :key="index" class="bannd">
           <img  :src= "ban?`https://ddragon.leagueoflegends.com/cdn/${version.version}/img/champion/${ban}.png`:default_img" alt="" width = "100px" height = "100px"/>
           <img src="@/assets/data/banned_overlay.png" class="banned-overlay"/>
        </div>
      </div>
    </div>
   
  </div>
</template>


  <style scoped>
    .Binfo{
      
      height: 8vh + 24;
      /* border: 3px black solid; */
      display: flex;
      justify-content: space-between;
    }
    .blue-bancontainer {
      display: flex;
      width: 1000px;
      height: 8vh + 24;
      flex-direction: column;
      flex-wrap: nowrap; /* 줄바꿈 없이 */
      gap: 0;            /* 간격 없이 딱 붙게 */
    }
    .red-bancontainer {
      width: 1000px;
      height: 8vh + 24;
      display: flex;
      flex-direction: column;
      align-items: end;
      flex-wrap: nowrap; /* 줄바꿈 없이 */
      gap: 0;            /* 간격 없이 딱 붙게 */
    }
    .bannd {
      position: relative;
      width: 8vh;
      height: 8vh;
    }
    .bluebans{
      display: flex;
    }
    .redbans{
      display: flex;
    }
    .bannd img {
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