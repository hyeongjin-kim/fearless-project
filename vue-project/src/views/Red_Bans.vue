<script setup> 
  import { useSetindexStore } from '@/stores/Set_Index';
  import { useVersionStore } from '@/stores/version.js'
  import { useRedbanStore } from '@/stores/Red_Ban';
  import { UseStateStore } from '@/stores/State';
  import default_img from '@/assets/data/unknown.jpg';
  const Set_Index_Store = useSetindexStore();
  const Version_Store = useVersionStore();
  const Red_Ban_Store = useRedbanStore();
  const State_Store = UseStateStore();

  function is_active(index){
    let state = State_Store.state;
    return state.phase == "Ban" && state.turn == "Red" && state.index == index;
  }
</script>

<template>
  <div v-if="Version_Store.version" class="red-bancontainer">
    <div style="color : white">Game {{Set_Index_Store.setindex}} </div>
      <div class="redbans">
        <div v-for="(ban, index) in Red_Ban_Store.Redban" :key="index" :class="['banned_champion', {active: is_active(index)}]">
        <img  :src= "ban?`https://ddragon.leagueoflegends.com/cdn/${Version_Store.version}/img/champion/${ban}.png`:default_img"/>
        <img src="@/assets/data/banned_overlay.png" class="banned-overlay"/>
      </div>
    </div>
  </div>
</template>

<style scoped>
  .red-bancontainer {
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
  .banned_champion.active{
    border-color: red;
    animation: blink 2s infinite;
    z-index: 2;
  }
  @keyframes blink {
    0%, 100% { box-shadow: 0 0 0px red; }
    50%      { box-shadow: 0 0 15px red; }
  }
  .redbans{
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