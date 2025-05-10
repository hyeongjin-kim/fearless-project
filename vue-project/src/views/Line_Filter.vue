<script setup>
import { ref, onMounted } from 'vue';
import { useVersionStore } from '@/stores/version.js';
import { UseStateStore } from '@/stores/State';

onMounted(async () => {
  await Get_line_Champion();
  await Get_Champion();
  champ_filter('all');
});

const All_Champions = ref([]);
const Current_Champion_List = ref([]);
const Version_Store = useVersionStore();
const State_Store = UseStateStore();

async function Get_Champion(){
  if(!Version_Store.version) return;

  const res = await fetch(`https://ddragon.leagueoflegends.com/cdn/${Version_Store.version}/data/ko_KR/champion.json`);
  const data = await res.json();

  All_Champions.value = Object.values(data.data)
  .map(champ => ({
    id: champ.id,
    name: champ.name,
  })).sort((a, b) => a.name.localeCompare(b.name, 'ko-KR'));
  Current_Champion_List.value = All_Champions.value;
}

const Current_Filter = ref({"top" : false, "jug":false , "mid":false, "bot": false, "sup": false, "all": true});
const Line_Champions = ref({"top" : [], "jug":[] , "mid":[], "bot": [], "sup": [] });

async function Get_line_Champion() {
  const line = ["top", "jug", "mid", "bot", "sup"];
  for (let i = 0; i < 5; i++) {
    const res = await fetch(`/${line[i]}_champions.json`);
    const data = await res.json();

    Line_Champions.value[line[i]] = data.sort(
      (a, b) => a.name.localeCompare(b.name, 'ko-KR')
    );
  }
}

const emit = defineEmits(["changeFilter"]);

function champ_filter(line) {
  if (!Current_Filter.value[line]) {
    Object.keys(Current_Filter.value).forEach(key => {
      Current_Filter.value[key] = false;
    });
    Current_Champion_List.value = Line_Champions.value[line];
    Current_Filter.value[line] = true;
  } else {
    Current_Filter.value[line] = false;
    Current_Filter.value.all = true;
    Current_Champion_List.value = All_Champions.value;
  }
  emit('changeFilter', Current_Champion_List);
}

function is_filtered(line){
  return Current_Filter.value[line];
}
</script>

<template>
  <div class="filter-container"  v-if="State_Store.state.phase != 'Done'">
    <div class="Position-Filters">
      <img src="/src/assets/data/top_icon.png" class="filter" :class="{filtered : is_filtered('top')}" @click="champ_filter('top')">
      <img src="/src/assets/data/jug_icon.png" class="filter" :class="{filtered : is_filtered('jug')}" @click="champ_filter('jug')">
      <img src="/src/assets/data/mid_icon.png" class="filter" :class="{filtered : is_filtered('mid')}" @click="champ_filter('mid')">
      <img src="/src/assets/data/bot_icon.png" class="filter" :class="{filtered : is_filtered('bot')}" @click="champ_filter('bot')">
      <img src="/src/assets/data/sup_icon.png" class="filter" :class="{filtered : is_filtered('sup')}" @click="champ_filter('sup')">
    </div>
  </div>
</template>

<style scoped>
  .Position-Filters{
    width: 28vw;
    height: 5vh;
    min-width: 250px;
    min-height: 50px;
  }
  .filter{
    width: 5vh;
    height: 5vh;
    min-width: 50px;
    min-height: 50px;
  }
  .filter.filtered{
    border: 2px solid white;
    box-sizing: border-box;
  }
</style>