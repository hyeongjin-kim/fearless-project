<script setup>
import { UseStateStore } from '@/stores/State'
import { UseTimerStore } from '@/stores/Timer';

const StateStore = UseStateStore();
const TimerStore = UseTimerStore();

</script>

<template>
  <div class="timer-display" v-if="StateStore.state.phase != 'Done'">
    {{ TimerStore.timer }}
  </div>
</template>

<style scoped>
  .timer-display {
    z-index: 1;
    text-align: center;
    font-size: 36px;
    color: #fff;
    margin-top: 10px;
    pointer-events: none;
  }
</style>