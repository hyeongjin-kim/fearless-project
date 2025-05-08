<script setup>
import { ref, watch } from 'vue';

const emit = defineEmits(["search"])
const props = defineProps({
    QueryProp: Boolean,
})

const SearchQuery = ref("");

watch(() => props.QueryProp, (filtered) => {
    if(filtered) SearchQuery.value = "";
})

function onSearchInput(e){
    emit('search', e.target.value);
}
</script>

<template>
    <input type="text" class="search-bar" v-model="SearchQuery" @input="onSearchInput" placeholder="챔피언 이름을 입력하세요.">
</template>

<style scoped>
    .search-bar{
        width: 500px;
        height: 30px;
        font-size: 20px;
    }
</style>