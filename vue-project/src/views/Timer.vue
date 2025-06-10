<script setup>
import { useStateStore } from '@/stores/State'
import { useTimerStore } from '@/stores/Timer';

const StateStore = useStateStore();
const TimerStore = useTimerStore();

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