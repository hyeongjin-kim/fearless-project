<script setup>
import { ref, onMounted, onUnmounted } from "vue";
import router from "@/router";
import { io } from "socket.io-client";
import { usePlayersStore } from "@/stores/Players";
import { useClientSocketStore } from "@/stores/Client_Socket";

import topimg from "@/assets/data/top_icon.png";
import jugimg from "@/assets/data/jug_icon.png";
import midimg from "@/assets/data/mid_icon.png";
import botimg from "@/assets/data/bot_icon.png";
import supimg from "@/assets/data/sup_icon.png";

const imglist = [topimg, jugimg, midimg, botimg, supimg];
const Player_store = usePlayersStore();
const Socket_Store = useClientSocketStore();

function start_match() {
    if (Player_store.is_full()) {
        Socket_Store.emit("game_start");
        router.push("Fearless");
    } else {
        alert("10명이 모두 모이지 않았습니다!");
    }
}

// 서버에서 player_joined 이벤트를 받으면 players 배열을 갱신
function on_update_players(data) {
    Player_store.update_players(data);
}

Socket_Store.on("player_info", (data) => {
    try {
        console.log("player_info 수신됨:", data);
        on_update_players(data);
    } catch (e) {
        console.error("player_info 처리 중 오류 발생:", e);
    }
});

Socket_Store.emit("get_player_info");
Socket_Store.on("game_start", () => {
    router.push("Fearless");
});

onMounted(() => {});

onUnmounted(() => {
    // 컴포넌트가 사라질 때 리스너 해제(메모리 누수 방지)
    // socket.io-client는 off 메서드 사용 가능
    if (Socket_Store.socket) {
        Socket_Store.socket.off("player_info");
    }
});

function bench() {
    Socket_Store.emit("join_bench");
}

function enter(team, index) {
    Socket_Store.emit("move", { team: team, index: index });
}

console.log(Player_store.get_player_info());
</script>

<template>
    <div>
        <main>
            <div class="lobby">
                <div class="players">
                    <div
                        class="icon"
                        v-for="(position, index) in imglist"
                        :key="index"
                    >
                        <div class="team_blue">
                            {{
                                Player_store.get_player_info()[
                                    `blue_player_${index + 1}`
                                ].nickname
                            }}
                            <button
                                v-if="
                                    !Player_store.get_player_info()[
                                        `blue_player_${index + 1}`
                                    ].nickname
                                "
                                @click="enter('blue', index)"
                            >
                                참가
                            </button>
                        </div>
                        <img :src="`${position}`" />
                        <div class="team_red">
                            {{
                                Player_store.get_player_info()[
                                    `red_player_${index + 1}`
                                ].nickname
                            }}
                            <button
                                v-if="
                                    !Player_store.get_player_info()[
                                        `red_player_${index + 1}`
                                    ].nickname
                                "
                                @click="enter('red', index)"
                            >
                                참가
                            </button>
                        </div>
                    </div>
                </div>
            </div>
            <div class="btn-container">
                <button
                    class="btn"
                    @click="start_match()"
                    v-if="
                        Player_store.get_player_info().blue_player_1
                            .socket_id == Socket_Store.get_socket_id()
                    "
                >
                    경기 시작
                </button>
            </div>
        </main>

        <footer>
            <div class="bench">
                <button @click="bench">대기실로 이동</button>
                <div
                    class="bench_player"
                    v-for="(
                        bench_player, index
                    ) in Player_store.get_player_info().bench"
                >
                    {{ bench_player.nickname }}
                </div>
            </div>
        </footer>
    </div>
</template>

<style scoped>
main {
    display: flex;
    flex-direction: column;
    justify-content: center;
}
.lobby {
    display: flex;
    justify-content: center;
}
.icon {
    display: flex;
}
.team_blue {
    width: 30vh;
    height: 10vh;
    border: 1px blue solid;
    color: white;
    text-align: center;
}
.team_red {
    width: 30vh;
    height: 10vh;
    border: 1px red solid;
    color: white;
    text-align: center;
}
.btn-container {
    display: flex;
    justify-content: center;
}
.btn {
    width: 30vh;
    height: 5vh;
    font-size: 30px;
}
.bench_player {
    color: white;
}
</style>
