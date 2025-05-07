<script setup>
import BluePlayers from './BluePlayers.vue';
import RedPlayers from './RedPlayers.vue';
import Bans from './Bans.vue';

</script>


<template>
    <div class="upper-part">
        <div class="Champion-List">
            <div class="Filter-container">
                <div class="Line-Filter-container">

                </div>
                <div class="Search-bar-container">
                    
                </div>
            </div>
            <div class="champion-grid">
                
            </div>
        </div>
    </div>
    <div class="lower-part">
        <div class="ban">
                <Bans/>
        </div>
        <div class="pick">
            <BluePlayers/>
            <RedPlayers/>
        </div>
    </div>



</template>

<style scoped>


</style>