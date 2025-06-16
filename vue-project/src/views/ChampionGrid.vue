<script setup>
import { ref, watch } from "vue";
import { useVersionStore } from "@/stores/version";
import { useGlobalBluebanStore } from "@/stores/Blue_Global_Ban";
import { useGlobalRedbanStore } from "@/stores/Red_Global_Ban";
import { useBluebanStore } from "@/stores/Blue_Ban";
import { useRedbanStore } from "@/stores/Red_Ban";
import { useStateStore } from "@/stores/state";
import { useBluepickStore } from "@/stores/Blue_Pick";
import { useRedpickStore } from "@/stores/Red_Pick";
import { useTimerStore } from "@/stores/Timer";
import { usePlayersStore } from "@/stores/Players";
import { useClientSocketStore } from "@/stores/Client_Socket";

const Red_Ban_Store = useRedbanStore();
const Red_Global_Ban_Store = useGlobalRedbanStore();
const Red_Pick_Store = useRedpickStore();

const Blue_Ban_Store = useBluebanStore();
const Blue_Global_Ban_Store = useGlobalBluebanStore();
const Blue_Pick_Store = useBluepickStore();

const Version_Store = useVersionStore();

const State_Store = useStateStore();
const Timer_Store = useTimerStore();

const Player_store = usePlayersStore();
const Socket_Store = useClientSocketStore();
const props = defineProps(["championListProp"]);

function isselected(id) {
    return Selected_Champion.value == id;
}

const Selected_Champion = ref("");

function choose(id) {
    Selected_Champion.value = id;
    Socket_Store.emit("choose", { champion_name: id });
}

function isDisabled(championId) {
    const globalBlueBanList = Blue_Global_Ban_Store.GlobalBlueban.flat();
    const globalRedBanList = Red_Global_Ban_Store.GlobalRedban.flat();
    return (
        Selected_Champion.value != championId &&
        (Blue_Ban_Store.Blueban.includes(championId) ||
            Red_Ban_Store.Redban.includes(championId) ||
            Blue_Pick_Store.Bluepick.includes(championId) ||
            Red_Pick_Store.Redpick.includes(championId) ||
            globalBlueBanList.includes(championId) ||
            globalRedBanList.includes(championId))
    );
}

const emit = defineEmits(["confirm"]);

watch(
    () => Timer_Store.timer,
    (time) => {
        if (time == 0) {
            Confirm();
        }
    }
);

function Confirm() {
    emit("confirm", Selected_Champion);
    Selected_Champion.value = "";
}

function index_conversion(team, index) {
    if (team == "Blue") return 5 - index;
    if (team == "Red") return index + 1;
}
</script>

<template>
    <main>
        <div class="champion-grid" v-if="championListProp">
            <div
                v-for="champ in championListProp"
                :key="champ.id"
                :class="['champion-card', { disabled: isDisabled(champ.id) }]"
            >
                <img
                    :src="`https://ddragon.leagueoflegends.com/cdn/${Version_Store.version}/img/champion/${champ.id}.png`"
                    :alt="champ.name"
                    :class="[
                        'champion-icon',
                        { selected: isselected(champ.id) },
                    ]"
                    @click="choose(champ.id)"
                />
                <img
                    v-if="isDisabled(champ.id)"
                    src="@/assets/data/banned_overlay.png"
                    class="banned-overlay"
                />
                <p style="color: white">{{ champ.name }}</p>
            </div>
        </div>
        <div class="confirmbtn-container">
            <button
                v-if="
                    State_Store.state.phase == 'Pick' &&
                    Player_store.get_player_info()[
                        `${State_Store.state.turn.toLocaleLowerCase()}_player_${index_conversion(
                            State_Store.state.turn,
                            State_Store.state.index
                        )}`
                    ].socket_id === Socket_Store.get_socket_id()
                "
                class="confirm"
                @click="Confirm()"
            >
                챔피언 선택
            </button>
            <button
                v-if="
                    State_Store.state.phase == 'Ban' &&
                    Player_store.get_player_info()[
                        `${State_Store.state.turn.toLocaleLowerCase()}_player_1`
                    ].socket_id === Socket_Store.get_socket_id()
                "
                class="confirm"
                @click="Confirm()"
            >
                챔피언 금지
            </button>
        </div>
    </main>
</template>

<style scoped>
.champion-grid {
    display: grid;
    grid-template-columns: repeat(8, 1fr);
    gap: 8px;
    height: 50vh;
    width: 90vh;
    max-height: 60vh;
    overflow-y: auto;
    align-content: start;
}
.champion-card {
    text-align: center;
    font-size: 20px;
    position: relative;
    cursor: pointer;
    transition: opacity 0.3s;
}
.champion-card.disabled {
    opacity: 0.4;
    pointer-events: none;
}
.champion-icon {
    width: auto;
    height: 8vh;
    object-fit: contain;
}
.champion-icon.selected {
    border: 2px solid white;
    box-sizing: border-box;
}
.confirmbtn-container {
    display: flex;
    justify-content: center;
}
.confirm {
    margin-top: 5px;
    width: 20vh;
    height: 5vh;
    font-size: 30px;
    z-index: 2;
}
.banned-overlay {
    position: absolute;
    top: 0;
    left: 1.2vh;
    width: auto;
    height: 8vh;
    opacity: 0.7;
    pointer-events: none;
}
</style>
