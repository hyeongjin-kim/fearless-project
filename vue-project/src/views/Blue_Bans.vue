<script setup> 
  import { useSetindexStore } from '@/stores/Set_Index';
  import { useVersionStore } from '@/stores/version.js'
  import { useBluebanStore } from '@/stores/Blue_Ban';
  import { UseStateStore } from '@/stores/State';
  import default_img from '@/assets/data/unknown.jpg';

  const Set_Index_Store = useSetindexStore();
  const Version_Store = useVersionStore();
  const Blue_Ban_Store = useBluebanStore();
  const State_Store = UseStateStore();

  function is_activate(index){
    let state = State_Store.state;
    return state.phase == "Ban" && state.turn == "Blue" && state.index == index;
  }
</script>

<template>
    <div v-if="Version_Store.version" class="blue-bancontainer">
      <div style="color : white">Game {{Set_Index_Store.setindex}} </div>
        <div class="bluebans">
          <div v-for="(ban, index) in Blue_Ban_Store.Blueban" :key="index" :class="['banned_champion', {active: is_activate(index)}]">
          <img  :src= "ban?`https://ddragon.leagueoflegends.com/cdn/${Version_Store.version}/img/champion/${ban}.png`:default_img"/>
          <img src="@/assets/data/banned_overlay.png" class="banned-overlay"/>
        </div>
      </div>
    </div>
</template>


<style scoped>
  .blue-bancontainer {
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
  .bluebans{
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