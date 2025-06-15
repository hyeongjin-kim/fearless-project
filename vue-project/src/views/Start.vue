<script setup>
import router from "@/router";
import { ref, onMounted } from "vue";
import { useClientSocketStore } from "@/stores/Client_Socket";
import { usePlayersStore } from "@/stores/Players";

const Socket_Store = useClientSocketStore();
const nickname = ref("");
const Player_store = usePlayersStore();

function start() {
    Socket_Store.connectSocket(); //페이지 로딩시가 아니라 닉네임을 입력하면 그때 연결하는게 맞는 거 같음
    if (nickname.value.trim()) {
        Socket_Store.emit("set_nickname", { nickname: nickname.value });
        router.push("Lobby");
    }
}
</script>

<template>
    <main>
        <div class="input-container">
            <input
                class="nickname-input"
                type="text"
                placeholder="닉네임을 입력해주세요"
                v-model="nickname"
            />
        </div>
        <div class="confirm">
            <button @click="start()">입력 완료</button>
        </div>
    </main>
</template>

<style scoped>
main {
    height: 100vh;
    display: flex;
    justify-content: center;
    align-items: center;
}
.input-container {
    display: flex;
    justify-content: center;
}
.nickname-input {
    width: 30vh;
    height: 5vh;
    font-size: 20px;
}
button {
    height: 5vh;
}
</style>
