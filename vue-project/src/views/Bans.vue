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
      <img v-for="(ban, index) in Bluebans.Blueban" :key="index" :src= "ban?`https://ddragon.leagueoflegends.com/cdn/${version.version}/img/champion/${ban}.png`:default_img" alt="" width = "128px" height = "128px"/>
    </div>

    <div v-if="version.version" class="bancontainer">
      <img v-for="(ban, index) in Redbans.Redban" :key="index" :src= "ban?`https://ddragon.leagueoflegends.com/cdn/${version.version}/img/champion/${ban}.png`:default_img" alt="" width = "128px" height = "128px"/>
    </div>
  </div>
</template>


  <style>
    .Binfo{
      width: 2000px;
      height: 128px;
      /* border: 3px black solid; */
      display: flex;
      justify-content: space-between;
    }
  </style>