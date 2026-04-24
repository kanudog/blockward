import { useScenariosStore } from "../stores/scenariosStore.js";

export function useProgress(){
  var prog=useScenariosStore(function(s){return s.progress;});
  var recordCompletion=useScenariosStore.getState().recordCompletion;
  var totalAttempts=0;
  Object.values(prog).forEach(function(p){if(p.n)totalAttempts+=p.n;});
  var completed=Object.values(prog).filter(function(p){return p.done;}).length;
  var avgScore=0;var scoreCount=0;
  Object.values(prog).forEach(function(p){if(p.best>0){avgScore+=p.best;scoreCount++;}});
  if(scoreCount>0)avgScore=Math.round(avgScore/scoreCount*100);
  return{
    prog:prog,
    recordCompletion:recordCompletion,
    totalAttempts:totalAttempts,
    completed:completed,
    avgScore:avgScore
  };
}
