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
      <Bans> </Bans>
    </div>
    
    <main>
      <BluePlayers></BluePlayers>
      <List></List>
      <RedPlayers></RedPlayers>
    </main>
    
</template>

<style scoped>
  main{
    width: 1000px;
    height: 500px;
    display: flex;
    justify-content: space-between;
  }
</style>
