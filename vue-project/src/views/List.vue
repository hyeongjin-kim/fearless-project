<script setup>
import { ref, onMounted } from 'vue';

const champions = ref([]);
const current_champion = ref("");

onMounted(async () => {
  const res = await fetch('@/../champion-names.json');
  champions.value = await res.json();
});
</script>

<template>
  <div class="champion-grid">
    <div 
      v-for="champ in champions" 
      :key="champ.id" 
      class="champion-card"
    >
      <img 
        :src="`https://ddragon.leagueoflegends.com/cdn/15.8.1/img/champion/${champ.image}`" 
        :alt="champ.name" 
        class="champion-icon"
        v-on:click=""
      />
      <p>{{ champ.name }}</p>
    </div>
  </div>
</template>

<style scoped>
.champion-grid {
  display: grid;
  grid-template-columns: repeat(8, 1fr);
  gap: 8px;
  max-height: 800px;
  overflow-y: auto;
}
.champion-card {
  text-align: center;
  font-size: 12px;
}
.champion-icon {
  width: 96px;
  height: 96px;
  object-fit: contain;
}
</style>