<script setup>
import { RouterLink, RouterView } from 'vue-router'
import HomeView from './views/BluePlayers.vue';
import AboutView from './views/RedPlayers.vue';
import GlobalBluebans from './views/GlobalBluebans.vue';
import GlobalRedbans from './views/GlobalRedbans.vue';
import Bans from './views/Bans.vue';
import List from './views/List.vue';
import BluePlayers from './views/BluePlayers.vue';
import RedPlayers from './views/RedPlayers.vue';

</script>

<template>
  <div class="content">
    <div class="total">
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
