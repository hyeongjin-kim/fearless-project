<script setup>
import { ref, watch } from 'vue';
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
const audioRef = ref(null);
let isPlayed = false;
const bgm = ref(generalbgm);

watch(() => setindex.setindex, (newVal) => {
  if (newVal == 5) {
    audioRef.value.volume = 0.3;
    bgm.value = silver_scraps;
  } else {
    bgm.value = generalbgm;
  }
});

function handleClick() {
  if (!audioRef.value) return;

  if (audioRef.value.paused) {
    
    audioRef.value.play().catch((e) => {
      console.error('Autoplay error:', e);
    });
  }
}
</script>

<template>
  <main @touchstart="handleClick" @click="handleClick">
    <div class="audio-container" >
      <audio ref="audioRef" :src="bgm" loop controls></audio>
    </div>
    <div class="list-globalban-container">
      <GlobalBluebans></GlobalBluebans>
      <List></List>
      <GlobalRedbans></GlobalRedbans>
    </div>
    <Bans></Bans>
    <div class="players">
      <BluePlayers></BluePlayers>
      <RedPlayers></RedPlayers>
    </div>
  </main>
</template>

<style scoped>
  main{
    display: flex;
    flex-direction: column;
    justify-content: space-between;
  }
  .list-globalban-container{
    display: flex;
    justify-content: space-between;
  }
  .players{
    display: flex;
    justify-content: space-between;
  }
</style>
