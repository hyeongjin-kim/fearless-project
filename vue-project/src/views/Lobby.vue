<script setup>
import { ref } from 'vue';
import router from '@/router';
import { io } from "socket.io-client";

const player = ref([]);

import topimg from '@/assets/data/top_icon.png'
import jugimg from '@/assets/data/jug_icon.png'
import midimg from '@/assets/data/mid_icon.png'
import botimg from '@/assets/data/bot_icon.png'
import supimg from '@/assets/data/sup_icon.png'
  
const imglist = [topimg, jugimg, midimg, botimg, supimg];
// const socket = io('http://localhost:3000');

function start_match(){
    router.push('Fearless');
}
</script>

<template>
    <main>
        <div class="lobby">
            <div class="players">
                <div class="icon" v-for="(position, index) in imglist" :key="index">
                    <div class="team_blue">블루팀 {{ index }}    
                    </div>
                    <img :src ="`${position}`" alt="">
                    <div class="team_red">레드팀 {{ index }}
                    </div>
                </div>
            </div>
        </div>
        <div class="btn-container">
            <button class="btn" @click="start_match()">경기 시작</button>
        </div>
    </main>
    
</template>

<style scoped>
    main{
        display: flex;
        flex-direction: column;
        justify-content: center;
    }
    .lobby{
        display: flex;
        justify-content: center;
    }
    .icon{
        display: flex;
    }
    .team_blue{
        width: 30vh;
        height: 10vh;
        border: 1px blue solid;
        color: white;
    }
    .team_red{
        width: 30vh;
        height: 10vh;
        border: 1px red solid;
        color: white;
    }
    .btn-container{
        display: flex;
        justify-content: center;
    }
    .btn{
        width: 30vh;
        height: 5vh;
        font-size: 30px;
    }
</style>