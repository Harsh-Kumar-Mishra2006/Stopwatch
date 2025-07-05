import React, { useState, useRef, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import "./App.css";            // ← bring in the styles

/* Utility: ms → HH:MM:SS.CS */
const format = (ms) => {
  const secs = Math.floor(ms / 1000);
  const hh   = String(Math.floor(secs / 3600)).padStart(2, "0");
  const mm   = String(Math.floor((secs % 3600) / 60)).padStart(2, "0");
  const ss   = String(secs % 60).padStart(2, "0");
  const cs   = String(Math.floor((ms % 1000) / 10)).padStart(2, "0");
  return `${hh}:${mm}:${ss}.${cs}`;
};

function Stopwatch() {
  const [running, setRunning]       = useState(false);
  const [elapsed, setElapsed]       = useState(0);                // ms
  const [lastPaused, setLastPaused] = useState("00:00:00.00");

  const timer  = useRef(null);
  const startT = useRef(null);

  /* start / stop interval ------------------------------------------------ */
  useEffect(() => {
    if (running) {
      startT.current = Date.now() - elapsed;
      timer.current  = setInterval(
        () => setElapsed(Date.now() - startT.current),
        10                                              // 1 centisecond
      );
    } else {
      clearInterval(timer.current);
    }
    return () => clearInterval(timer.current);
  }, [running]);

  /* handlers ------------------------------------------------------------- */
  const handleStart  = () => setRunning(true);
  const handlePause  = () => {
    setRunning(false);
    setLastPaused(format(elapsed));
  };
  const handleReset  = () => {
    setRunning(false);
    setElapsed(0);
    setLastPaused("00:00:00.00");
  };

  /* --------------------------------------------------------------------- */
  return (
    <div className="stopwatch-container">
      {/* heading */}
      <h1 className="stopwatch-title">STOPWATCH</h1>

      {/* colourful card */}
      <div className="stopwatch-card">
        {/* digital read‑out */}
        <div className="display">{format(elapsed)}</div>

        {/* buttons */}
        <div className="buttons">
          <button
            className="btn start"
            onClick={handleStart}
            disabled={running}
          >
            Start
          </button>

          <button
            className="btn pause"
            onClick={handlePause}
            disabled={!running}
          >
            Pause
          </button>

          <button className="btn reset" onClick={handleReset}>
            Reset
          </button>
        </div>
      </div>

      {/* history */}
      <div className="history-container">
        <label>Last paused time</label>
        <input
          className="history-input"
          value={lastPaused}
          readOnly
        />
      </div>
    </div>
  );
}

/* Router root ------------------------------------------------------------ */
export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Stopwatch />} />
      </Routes>
    </Router>
  );
}






