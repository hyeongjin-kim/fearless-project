<script setup>
import { ref, onMounted, computed, watch } from 'vue';

const Current_Filter = ref({"top" : false, "jug":false , "mid":false, "bot": false, "sup": false, "all": true});
const Line_Champions = ref({"top" : [], "jug":[] , "mid":[], "bot": [], "sup": [] });
const Current_Champion_List = ref([]);

onMounted(async () => {
  await Get_line_Champion();
});


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
}

function is_filtered(line){
  return Current_Filter.value[line];
}

</script>


<template>
<div class="filter-container"  v-if="State_Store.state.phase != 'Done'">
      <div class="positions">
        <img src="/src/assets/data/top_icon.png" alt="" class="filter" :class="{filtered : is_filtered('top')}" @click="champ_filter('top')">
        <img src="/src/assets/data/jug_icon.png" alt="" class="filter" :class="{filtered : is_filtered('jug')}" @click="champ_filter('jug')">
        <img src="/src/assets/data/mid_icon.png" alt="" class="filter" :class="{filtered : is_filtered('mid')}" @click="champ_filter('mid')">
        <img src="/src/assets/data/bot_icon.png" alt="" class="filter" :class="{filtered : is_filtered('bot')}" @click="champ_filter('bot')">
        <img src="/src/assets/data/sup_icon.png" alt="" class="filter" :class="{filtered : is_filtered('sup')}" @click="champ_filter('sup')">
      </div>
</div>

</template>


<style scoped>


</style>