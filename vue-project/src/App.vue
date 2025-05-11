<script setup>
import { ref, watch } from 'vue';
import { useSetindexStore } from '@/stores/Set_Index';
import { useVersionStore } from './stores/version';

import GlobalBluebans from './views/GlobalBluebans.vue';
import GlobalRedbans from './views/GlobalRedbans.vue';
import Main_Content from './views/Main_Content.vue';
import BluePlayers from './views/BluePlayers.vue';
import RedPlayers from './views/RedPlayers.vue';
import Red_Bans from './views/Red_Bans.vue';
import Blue_Bans from './views/Blue_Bans.vue';
import Timer from './views/Timer.vue'

import generalbgm from  '@/assets/data/general.m4a';
import silver_scraps from '@/assets/data/Silver Scrapes.m4a';
import Logo from '@/assets/data/LCK LOGO.png'

const Set_Index_Store = useSetindexStore();
const Version_Store = useVersionStore();

const audioRef = ref(null);
const bgm = ref(generalbgm);

watch(() => Set_Index_Store.setindex, (newVal) => {
  if (newVal == 5) {
    audioRef.value.volume = 0.2;
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
      <audio class="BGM" ref="audioRef" :src="bgm" loop controls></audio>
    </div>
    <div class="container">
      <GlobalBluebans/>
      <Main_Content />
      <GlobalRedbans/>
    </div>
    <div class="container">
      <Blue_Bans/>
      <Timer />
      <Red_Bans/>
    </div>
    <div class="container">
      <BluePlayers/>
      <div class="info">
        <div class="version" v-if="Version_Store.version">
          PATCH {{ Version_Store.Version_info }}
        </div>        
        <img :src="Logo" class = "Logo">
      </div>
      
      <RedPlayers/>
    </div>
  </main>
</template>

<style scoped>
  main{
    display: flex;
    flex-direction: column;
    justify-content: space-between;
  }
  .BGM{
    margin-top: 10px;
    margin-right: 10px;
    height: 30px;
  }
  .audio-container{
    display: flex;
    justify-content: end;
  }
  .container{
    display: flex;
    justify-content: space-between;

  }
  .info{
    display: flex;
    flex-direction: column;
  }
  .Logo{
    width: auto;
    height: 20vh;
  }
  .version{
    font-size: 20px;
    text-align: center;
    color: white;
  }
</style>
