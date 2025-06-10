import { ref } from 'vue'
import { defineStore } from 'pinia'

export const UseTimerStore = defineStore('Timer', ()=>{
    const timer = ref(1000);
    const isTiming = ref(false);
    let timerInterval = null;

    function startTimer(duration = 1000) {
        clearTimer();
        timer.value = duration;
        isTiming.value = true;

        timerInterval = setInterval(() => {
            if (timer.value > 0) {
            timer.value -= 1;
            } else {
            timeExpired();
            }
        }, 1000);
    }

    function clearTimer() {
        if (timerInterval) {
            clearInterval(timerInterval);
            timerInterval = null;
        }
        timer.value = 1000;
        isTiming.value = false;
    }

    function timeExpired() {
        clearTimer();
    }
    return {timer, startTimer, timeExpired};
})