<script setup>
import { ref, onMounted } from "vue";

import { useBluebanStore } from "@/stores/Blue_Ban";
import { useRedbanStore } from "@/stores/Red_Ban";
import { useBluepickStore } from "@/stores/Blue_Pick";
import { useRedpickStore } from "@/stores/Red_Pick";
import { useGlobalBluebanStore } from "@/stores/Blue_Global_Ban";
import { useGlobalRedbanStore } from "@/stores/Red_Global_Ban";

import { useSetindexStore } from "@/stores/Set_Index";
import { useStateStore } from "@/stores/state";
import { useVersionStore } from "@/stores/version.js";
import { useTimerStore } from "@/stores/Timer";
import { useClientSocketStore } from "@/stores/Client_Socket";
import { usePlayersStore } from "@/stores/Players";

import Line_Filter from "./Line_Filter.vue";
import SearchBar from "./SearchBar.vue";
import ChampionGrid from "./ChampionGrid.vue";

const All_Champions = ref("");
const Current_Champion_List = ref([]);
const Base_List = ref();
const Game_info = ref({
    blue_ban: ["", "", "", "", ""],
    red_ban: ["", "", "", "", ""],
    blue_pick: ["", "", "", "", ""],
    red_pick: ["", "", "", "", ""],
    blue_global_ban: [],
    red_global_ban: [],
    set_idx: 1,
    state_idx: 0,
});

const Version_Store = useVersionStore();

const Blue_Ban_Store = useBluebanStore();
const Blue_Pick_Store = useBluepickStore();

const Red_Pick_Store = useRedpickStore();
const Red_Ban_Store = useRedbanStore();

const Red_Global_Ban_Store = useGlobalRedbanStore();
const Blue_Global_Ban_Store = useGlobalBluebanStore();

const Set_Index_Store = useSetindexStore();
const State_Store = useStateStore();
const Timer_Store = useTimerStore();
const Player_store = usePlayersStore();
const Socket_Store = useClientSocketStore();

const Nickname_Map = ref({});
const Reset_Search_Bar = ref(false);

onMounted(async () => {
    if (!Version_Store.version) await Version_Store.Get_version();
    await Get_nickname();
    Socket_Store.on("game_start", () => {
        try {
            console.log("game start");
            Timer_Store.startTimer();
            console.log(State_Store.state);
        } catch (e) {
            console.log("게임 시작 오류");
        }
    });
    Socket_Store.on("game_reset", () => {
        try {
            console.log("game reset");
            Timer_Store.timeExpired();
        } catch (e) {
            console.log("게임 종료 오류");
        }
    });
    Socket_Store.on("game_end", () => {
        try {
            console.log("game end");
            Timer_Store.timeExpired();
        } catch (e) {
            console.log("게임 종료 오류");
        }
    });
    Socket_Store.on("match_reset", () => {
        try {
            console.log("match reset");
            Timer_Store.timeExpired();
        } catch (e) {
            console.log("매치 초기화 오류");
        }
    });
    Socket_Store.on("get_game_info", (game_info) => {
        try {
            Object.assign(Game_info.value, game_info.game_info);
            console.log(`get game info: ${JSON.stringify(Game_info.value)}`);
            Set_Index_Store.set_setindex(Game_info.value.set_idx);
            State_Store.set_state(Game_info.value.state_idx);
            Blue_Global_Ban_Store.set_all(Game_info.value.blue_global_ban);
            Red_Global_Ban_Store.set_all(Game_info.value.red_global_ban);
            Blue_Ban_Store.set_all(Game_info.value.blue_ban);
            Red_Ban_Store.set_all(Game_info.value.red_ban);
            Blue_Pick_Store.set_all(Game_info.value.blue_pick);
            Red_Pick_Store.set_all(Game_info.value.red_pick);
        } catch (e) {
            console.log("게임 정보 동기화 오류");
            console.log(e);
        }
    });
    Socket_Store.on("confirm", () => {
        const phase = State_Store.phase;
        if (phase !== "Done" && phase !== "Ready") {
            Timer_Store.startTimer();
        } else Timer_Store.timeExpired();
    });
    Socket_Store.on("player_info", (data) => {
        try {
            console.log("player_info 수신됨:", data);
            Player_store.update_players(data);
        } catch (e) {
            console.error("player_info 처리 중 오류 발생:", e);
        }
    });
    Socket_Store.emit("get_game_info");
});

async function Get_nickname() {
    const res = await fetch(`nicknames.json`);
    const data = await res.json();
    Nickname_Map.value = data;
}

function GameStart() {
    Socket_Store.emit("game_start");
}

function GameConfirm() {
    Socket_Store.emit("game_end");
}

function Swap() {
    Socket_Store.emit("swap");
}

function MatchClear() {
    Socket_Store.emit("match_reset");
}

function isDisabled(championId) {
    const globalBlueBanList = Blue_Global_Ban_Store.GlobalBlueban.flat();
    const globalRedBanList = Red_Global_Ban_Store.GlobalRedban.flat();
    return (
        Blue_Ban_Store.Blueban.includes(championId) ||
        Red_Ban_Store.Redban.includes(championId) ||
        Blue_Pick_Store.Bluepick.includes(championId) ||
        Red_Pick_Store.Redpick.includes(championId) ||
        globalBlueBanList.includes(championId) ||
        globalRedBanList.includes(championId)
    );
}

function select_confirm(choice) {
    if (!choice.value && State_Store.state.phase == "Pick") {
        if (Timer_Store.timer == 0) {
            const availableList = All_Champions.value.filter((champ) => {
                return !isDisabled(champ.id);
            });
            const random_index = Math.floor(
                Math.random() * availableList.length
            );
            const random_pick = availableList[random_index].id;

            Socket_Store.emit("choose", { champion_name: random_pick });
        } else {
            alert("챔피언을 선택하세요.");
            return;
        }
    } else if (
        !choice.value &&
        State_Store.state.phase == "Ban" &&
        Timer_Store.timer != 0
    ) {
        if (!confirm("챔피언을 금지하지 않으시겠습니까?")) {
            return;
        }
    }
    Socket_Store.emit("confirm");
}

function champ_filter(Filtered_List) {
    if (!All_Champions.value) {
        All_Champions.value = Filtered_List.value;
    }
    Base_List.value = Filtered_List.value;
    Current_Champion_List.value = Base_List.value;
    Reset_Search_Bar.value = true;
}

console.log(Player_store.get_player_info().blue_player_1.socket_id);
console.log(Socket_Store.get_socket_id());

function onSearchInput(query) {
    Reset_Search_Bar.value = false;
    const keyword = normalize(query);

    if (!keyword) {
        Current_Champion_List.value = Base_List.value; // 검색어 없으면 필터만 적용
        return;
    }
    Current_Champion_List.value = Base_List.value.filter((champ) => {
        const id = champ.id;
        const allNames = Nickname_Map.value[id];
        return allNames.some((name) => normalize(name).includes(keyword));
    });
}

function normalize(str) {
    return str.replace(/\s/g, "").toLowerCase();
}
console.log(Game_info.value);
</script>

<template>
    <div class="list-container" v-if="Game_info">
        <div class="filter-container" v-if="State_Store.state.phase != 'Done'">
            <Line_Filter @change-filter="champ_filter" />
            <SearchBar :QueryProp="Reset_Search_Bar" @search="onSearchInput" />
        </div>
        <div class="champion-grid" v-if="State_Store.state.phase != 'Done'">
            <ChampionGrid
                :champion-list-prop="Current_Champion_List"
                @confirm="select_confirm"
            />
        </div>
        <div v-if="State_Store.state.phase == 'Done'" class="swap-anouncement">
            두 챔피언 초상화를 클릭해 포지션을 바꿀 수 있습니다.
        </div>
        <div v-if="State_Store.state.phase == 'Done'" class="swap-anouncement">
            포지션에 맞게 스왑해주세요.
        </div>

        <div
            class="game-end-btn-container"
            v-if="
                Player_store.get_player_info().blue_player_1.socket_id ==
                Socket_Store.get_socket_id()
            "
        >
            <button
                v-if="State_Store.state.phase == 'Ready'"
                class="btn"
                @click="GameStart()"
            >
                게임 시작
            </button>
            <button
                v-if="
                    State_Store.state.phase == 'Done' &&
                    Set_Index_Store.setindex < 5
                "
                class="btn"
                @click="GameConfirm()"
            >
                {{ Set_Index_Store.setindex }}세트 종료
            </button>
            <button
                v-if="
                    State_Store.state.phase == 'Done' &&
                    Set_Index_Store.setindex < 5
                "
                class="btn"
                @click="Swap()"
            >
                진영 변경
            </button>
            <button
                v-if="
                    State_Store.state.phase == 'Done' &&
                    Set_Index_Store.setindex == 5
                "
                class="btn"
                @click="MatchClear()"
            >
                경기 종료
            </button>
        </div>
    </div>
</template>

<style scoped>
.champion-grid {
    height: 60vh;
    width: 90vh;
    max-height: 60vh;
}
.swap-anouncement {
    margin-top: 20px;
    width: 700px;
    height: 50px;
    color: white;
    font-size: 30px;
}
.list-container {
    height: 60vh;
    width: 90vh;
    display: flex;
    justify-content: center;
    flex-direction: column;
    align-items: center;
}
.btn {
    margin-top: 20px;
    width: 20vh;
    height: 5vh;
    font-size: 30px;
}
.game-end-btn-container {
    display: flex;
    justify-content: space-between;
}
.filter-container {
    width: inherit;
    display: flex;
    justify-content: space-between;
    align-items: center;
}
</style>
