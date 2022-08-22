import {useState} from 'react';

export default function useVisualMode(initial){
  const [mode, setMode] = useState(initial);
  const [history, setHistory] = useState([initial]);

  function transition(targetMode, replace = false){
    setMode(targetMode);
    if (replace) {
      setHistory(prev => [...prev].slice(0, prev.length));
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

  return {mode, transition, back};
};