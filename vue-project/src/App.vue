<script setup>
import { RouterLink, RouterView } from 'vue-router'
import HomeView from './views/BluePlayers.vue';
import AboutView from './views/RedPlayers.vue';
import Globalbans from './views/Globalbans.vue';
import Bans from './views/Bans.vue';
import List from './views/List.vue';
import BluePlayers from './views/BluePlayers.vue';
import RedPlayers from './views/RedPlayers.vue';



</script>

<template>
    <div class="bans-container">
      <Globalbans></Globalbans>
      
    </div>
    
    <main>
      <List></List>
    </main>
    <Bans> </Bans>
    <div class="pick">
      <RedPlayers></RedPlayers>
      <BluePlayers></BluePlayers>
    </div>

    
</template>

<style scoped>
  main{
    width: 1660px;
    height: 800px;
    display: flex;
    justify-content: center;
  }
  .pick{
    width: 1660px;
    height: 500px;
    display: flex;
    justify-content: space-between;
  }
</style>
