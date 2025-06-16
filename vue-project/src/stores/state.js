import { ref } from "vue";
import { defineStore } from "pinia";

export const useStateStore = defineStore("state", () => {
    const statelist = ref([
        { phase: "Ready", turn: "Blue", index: 0 },
        { phase: "Ban", turn: "Blue", index: 4 },
        { phase: "Ban", turn: "Red", index: 0 },
        { phase: "Ban", turn: "Blue", index: 3 },
        { phase: "Ban", turn: "Red", index: 1 },
        { phase: "Ban", turn: "Blue", index: 2 },
        { phase: "Ban", turn: "Red", index: 2 },

        { phase: "Pick", turn: "Blue", index: 4 },
        { phase: "Pick", turn: "Red", index: 0 },
        { phase: "Pick", turn: "Red", index: 1 },
        { phase: "Pick", turn: "Blue", index: 3 },
        { phase: "Pick", turn: "Blue", index: 2 },
        { phase: "Pick", turn: "Red", index: 2 },

        { phase: "Ban", turn: "Red", index: 3 },
        { phase: "Ban", turn: "Blue", index: 1 },
        { phase: "Ban", turn: "Red", index: 4 },
        { phase: "Ban", turn: "Blue", index: 0 },

        { phase: "Pick", turn: "Red", index: 3 },
        { phase: "Pick", turn: "Blue", index: 1 },
        { phase: "Pick", turn: "Blue", index: 0 },
        { phase: "Pick", turn: "Red", index: 4 },
        { phase: "Done", turn: "None", index: -1 },
    ]);
    const stateindex = ref(0);
    const state = ref(statelist.value[stateindex.value]);

    function set_state(newIndex) {
        stateindex.value = newIndex;
        state.value = statelist.value[stateindex.value];
    }
    function reset() {
        stateindex.value = 0;
        state.value = statelist.value[stateindex.value];
    }
    return { state, set_state, reset };
});
