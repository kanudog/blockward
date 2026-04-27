import { useScenariosStore } from "../stores/scenariosStore.js";

export function useProgress(){
  var prog=useScenariosStore(function(s){return s.progress;});
  var recordCompletion=useScenariosStore.getState().recordCompletion;
  var totalAttempts=0;
  Object.values(prog).forEach(function(p){if(p.n)totalAttempts+=p.n;});
  var completed=Object.values(prog).filter(function(p){return p.done;}).length;
  return{
    prog:prog,
    recordCompletion:recordCompletion,
    totalAttempts:totalAttempts,
    completed:completed
  };
}
