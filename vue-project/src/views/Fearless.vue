<script setup>
import { ref, watch } from "vue";
import { useSetindexStore } from "@/stores/Set_Index";
import { useVersionStore } from "@/stores/version";
import { useClientSocketStore } from "@/stores/Client_Socket";

import GlobalBluebans from "@/views/GlobalBluebans.vue";
import GlobalRedbans from "@/views/GlobalRedbans.vue";
import Main_Content from "@/views/Main_Content.vue";
import BluePlayers from "@/views/BluePlayers.vue";
import RedPlayers from "@/views/RedPlayers.vue";
import Red_Bans from "@/views/Red_Bans.vue";
import Blue_Bans from "@/views/Blue_Bans.vue";
import Timer from "@/views/Timer.vue";

import generalbgm from "@/assets/data/general.m4a";
import silver_scraps from "@/assets/data/Silver Scrapes.m4a";
import Logo from "@/assets/data/LCK LOGO.png";
import { usePlayersStore } from "@/stores/Players";
import sound_icon from "@/assets/data/sound_icon.png";
import mute_icon from "@/assets/data/mute_icon.png";

const Set_Index_Store = useSetindexStore();
const Version_Store = useVersionStore();
const Socket_Store = useClientSocketStore();
const Player_store = usePlayersStore();

const audioRef = ref(null);
const bgm = ref(generalbgm);

const icon = ref(sound_icon);

watch(
    () => Set_Index_Store.setindex,
    (newVal) => {
        if (newVal == 5) {
            audioRef.value.volume = 0.2;
            bgm.value = silver_scraps;
            icon.value = sound_icon;
        } else {
            bgm.value = generalbgm;
        }
    }
);

function handleClick() {
    if (!audioRef.value) return;

    if (audioRef.value.paused) {
        audioRef.value.play().catch((e) => {
            console.error("Autoplay error:", e);
        });
    }
}

function sound() {
    if (!audioRef.value) return;

    if (audioRef.value.volume === 0) {
        audioRef.value.volume = 0.2;
        icon.value = sound_icon;
    } else {
        audioRef.value.volume = 0;
        icon.value = mute_icon;
    }
}

function MatchClear() {
    Socket_Store.emit("match_reset");
}

function GameReset() {
    Socket_Store.emit("game_reset");
}
</script>

<template>
    <main @touchstart="handleClick" @click="handleClick">
        <div class="audio-container">
            <audio
                class="BGM"
                ref="audioRef"
                :src="bgm"
                volume="0.2"
                loop
            ></audio>
            <div
                class="clearbtn-container"
                v-if="
                    Player_store.get_player_info().blue_player_1.socket_id ==
                    Socket_Store.get_socket_id()
                "
            >
                <button class="clear_btn" @click="MatchClear()">
                    전체 초기화
                </button>
                <button class="clear_btn" @click="GameReset()">
                    게임 초기화
                </button>
            </div>
            <img :src="icon" @click="sound()" class="sound_icon" />
        </div>

        <div class="container">
            <GlobalBluebans />
            <Main_Content />
            <GlobalRedbans />
        </div>
        <div class="container">
            <Blue_Bans />
            <Timer />
            <Red_Bans />
        </div>
        <div class="container">
            <BluePlayers />
            <div class="info">
                <div class="version" v-if="Version_Store.version">
                    PATCH {{ Version_Store.Version_info }}
                </div>
                <img :src="Logo" class="Logo" />
            </div>
            <RedPlayers />
        </div>
    </main>
</template>

<style scoped>
main {
    display: flex;
    flex-direction: column;
    justify-content: space-between;
}
.BGM {
    margin-top: 10px;
    margin-right: 10px;
    height: 5vh;
}
.audio-container {
    display: flex;
    justify-content: space-between;
}
.sound_icon {
    height: 7vh;
    width: auto;
    cursor: pointer;
}
.container {
    display: flex;
    justify-content: space-between;
}
.info {
    display: flex;
    flex-direction: column;
}
.Logo {
    width: 12vw;
    height: auto;
}
.version {
    font-size: 20px;
    text-align: center;
    color: white;
}
.clearbtn-container {
    display: flex;
    width: 20vh;
    height: 3vh;
}
.clear_btn {
    width: 10vw;
}
</style>
