import React, {useState} from 'react';

export default function useVisualMode(initial){
  const [mode, setMode] = useState(initial);
  const [history, setHistory] = useState([initial]);

  function transition(targetMode, replace = false){
    setMode(targetMode);
    if (replace) {
      const replaceLast = [...history];
      replaceLast[replaceLast - 1] = targetMode;
      setHistory(replaceLast);
    } else {
      setHistory(prev => [...prev, targetMode]);
    }
  };

  function back() {
    if (history.length > 1) {
      let popped = [...history];
      popped.pop();
      setHistory(popped);
      setMode(popped[popped.length-1]);
    }
  };

  console.log(history, mode);
  return {mode, transition, back};
};