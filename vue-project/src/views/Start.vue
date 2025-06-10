<script setup>
import router from '@/router';

function start(){
    router.push('Lobby');
}
</script>

<template>
    <main>
        <div class="input-container">
            <input class="nickname-input" type="text" placeholder="닉네임을 입력해주세요">
        </div>
        <div class="confirm">
            <button @click="start()">입력 완료</button>
        </div>
    </main>
</template>

<style scoped>
    main{
        height: 100vh;
        display: flex;
        justify-content: center;
        align-items: center;
    }
    .input-container{
        display: flex;
        justify-content: center;
    }
    .nickname-input{
        width: 30vh;
        height: 5vh;
        font-size: 20px;
    }
    button{
        height: 5vh;
    }
</style>