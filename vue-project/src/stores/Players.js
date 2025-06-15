import { ref } from "vue";
import { defineStore } from "pinia";
import { useClientSocketStore } from "./Client_Socket";

export const usePlayersStore = defineStore('players', () => {
    const players = ref({
        blue_player_1: { socket_id: null, nickname: '' },
        blue_player_2: { socket_id: null, nickname: '' },
        blue_player_3: { socket_id: null, nickname: '' },
        blue_player_4: { socket_id: null, nickname: '' },
        blue_player_5: { socket_id: null, nickname: '' },
        red_player_1: { socket_id: null, nickname: '' },
        red_player_2: { socket_id: null, nickname: '' },
        red_player_3: { socket_id: null, nickname: '' },
        red_player_4: { socket_id: null, nickname: '' },
        red_player_5: { socket_id: null, nickname: '' },
        bench: [],
    });
    function update_players(data){
        Object.assign(players.value, data.player_info);
    }
    function get_player_info(){
        return players.value;
    }
    function is_full() {
        // blue/red 플레이어 1~5까지 모두 socket_id가 null이 아니면 true
        for (let i = 1; i <= 5; i++) {
            if (
                players.value[`blue_player_${i}`].socket_id === null ||
                players.value[`red_player_${i}`].socket_id === null
            ) {
                return false;
            }
        }
        return true;
    }

    return {update_players, get_player_info, is_full};
})
