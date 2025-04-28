<script setup>
import GlobalBluebans from './views/GlobalBluebans.vue';
import GlobalRedbans from './views/GlobalRedbans.vue';
import Bans from './views/Bans.vue';
import List from './views/List.vue';
import BluePlayers from './views/BluePlayers.vue';
import RedPlayers from './views/RedPlayers.vue';
import { useSetindexStore } from '@/stores/setindex';
import generalbgm from  '@/assets/data/general.m4a';
import silver_scraps from '@/assets/data/Silver Scrapes.m4a';

const setindex = useSetindexStore();

</script>

<template>
  <div class="content">
   
    <div class="total"> 
      <div class="audio-container">
      <audio v-if="setindex.setindex < 5" :src="generalbgm" autoplay volume=0.3 loop controls></audio>
      <audio v-if="setindex.setindex == 5" :src="silver_scraps"  autoplay volume=0.3 loop controls></audio>
    </div>
      <main>
        <GlobalBluebans></GlobalBluebans>
        <List></List>
        <GlobalRedbans></GlobalRedbans>
      </main>
      <Bans> </Bans>
      <div class="pick">
        <BluePlayers></BluePlayers>
        <RedPlayers></RedPlayers>
      </div>
    </div>
  </div>
</template>

<style scoped>
.content{
  background-image: url(/src/assets/data/lck_dark_background_with_logo.png);
  background-size: cover;
  background-repeat: no-repeat;
  background-position: center center;
  background-attachment: fixed;
  min-height: 100vh;
}
  main{
    width: 2000px;
    height: 900px;
    display: flex;
    justify-content: space-between;
    
  }
  .pick{
    width: 2000px;
    height: 280px;
    display: flex;
    justify-content: space-between;
  }
  .content{
    display: flex;
    justify-content: center;
  }
</style>
