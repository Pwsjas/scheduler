import {useState} from 'react';

export default function useVisualMode(initial){
  const [mode, setMode] = useState(initial);
  const [history, setHistory] = useState([initial]);

  //Set 'mode' to the given variable and update mode history accordingly
  function transition(targetMode, replace = false){
    setMode(targetMode);
    if (replace) {
      setHistory(prev => [...prev].slice(0, prev.length));
    } else {
      setHistory(prev => [...prev, targetMode]);
    }
  };

  //Set mode to its previous state
  function back() {
    if (history.length > 1) {
      //Copy history and pop() the last value
      const popped = [...history];
      popped.pop();
      setHistory(popped);
      setMode(popped[popped.length-1]);
    }
  };

  return {mode, transition, back};
};