import { ref } from "vue";
import { defineStore } from "pinia";

export const useSetindexStore = defineStore("SetIndex", () => {
    const setindex = ref(1);

    // deprecated
    function increase_setindex() {
        setindex.value += 1;
    }
    function set_setindex(newIndex) {
        setindex.value = newIndex;
    }
    function reset() {
        setindex.value = 1;
        console.log(`DEBUG - set index after reset: ${setindex.value}`);
    }
    return { setindex, increase_setindex, set_setindex, reset };
});
