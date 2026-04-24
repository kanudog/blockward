import { usePlayerStore } from "../stores/playerStore.js";

export function useScoring(){
  var score=usePlayerStore(function(s){return s.score;});
  var addScore=usePlayerStore.getState().addScore;
  return{score:score,addScore:addScore};
}
