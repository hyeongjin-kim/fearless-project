<script setup> 

  import {ref} from 'vue'
  import {useVersionStore} from '@/stores/version.js'
  import { useBluebanStore } from '@/stores/blueban';
  import { useRedbanStore } from '@/stores/redban';
  import default_img from '@/assets/data/unknown.jpg';

  const version = useVersionStore();
  const Bluebans = useBluebanStore();
  const Redbans = useRedbanStore(); 
  
</script>

<template>
  <div class="Binfo">
    <div v-if="version.version" class="bancontainer">
      <div v-for="(ban, index) in Bluebans.Blueban" :key="index" class="bannd">
        <img  :src= "ban?`https://ddragon.leagueoflegends.com/cdn/${version.version}/img/champion/${ban}.png`:default_img" alt="" width = "100px" height = "100px"/>
        <img src="@/assets/data/banned_overlay.png" class="banned-overlay"/>
      </div>
    </div>
    <div v-if="version.version" class="bancontainer">
      <div v-for="(ban, index) in Redbans.Redban" :key="index" class="bannd">
        <img  :src= "ban?`https://ddragon.leagueoflegends.com/cdn/${version.version}/img/champion/${ban}.png`:default_img" alt="" width = "100px" height = "100px"/>
        <img src="@/assets/data/banned_overlay.png" class="banned-overlay"/>
      </div>
    </div>
   
  </div>
</template>


  <style>
    .Binfo{
      width: 2000px;
      height: 100px;
      /* border: 3px black solid; */
      display: flex;
      justify-content: space-between;
    }
    .bancontainer {
      display: flex;
      flex-wrap: nowrap; /* 줄바꿈 없이 */
      gap: 0;            /* 간격 없이 딱 붙게 */
    }

.bannd {
  position: relative;
  width: 100px;
  height: 100px;
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