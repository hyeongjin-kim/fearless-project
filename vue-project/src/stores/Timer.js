import { ref } from 'vue'
import { defineStore } from 'pinia'

export const UseTimerStore = defineStore('Timer', ()=>{
    const timer = ref(50);
    const isTiming = ref(false);
    let timerInterval = null;

    function startTimer(duration = 50) {
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
        isTiming.value = false;
    }

    function timeExpired() {
        clearTimer();
    }
    return {timer, startTimer, timeExpired};
})