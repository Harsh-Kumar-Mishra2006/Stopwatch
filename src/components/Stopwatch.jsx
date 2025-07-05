import React, { useEffect, useRef, useState } from "react";

/**
 * React Stopwatch Component
 * ------------------------------------------------------
 * - Uses images located in /public (Stopwatch frame.webp & clock-hand.png)
 * - TailwindCSS for styling
 * - Features: Start / Pause, Reset, Lap tracking & list, rotating hand
 * - Digital read‑out in an <input> field (read‑only)
 */

const formatTime = (ms) => {
  const totalSeconds = Math.floor(ms / 1000)
  const hours = Math.floor(totalSeconds / 3600)
  const minutes = Math.floor((totalSeconds % 3600) / 60)
  const seconds = totalSeconds % 60
  const centiseconds = Math.floor((ms % 1000) / 10)

  const pad = (n, z = 2) => n.toString().padStart(z, "0")
  return `${pad(hours)}:${pad(minutes)}:${pad(seconds)}.${pad(centiseconds)}`
}

export default function Stopwatch() {
  const [isRunning, setIsRunning] = useState(false)
  const [elapsed, setElapsed] = useState(0)
  const [laps, setLaps] = useState([])

  const intervalRef = useRef(null)
  const startTimeRef = useRef(null)

  // Manage timer lifecycle
  useEffect(() => {
    if (isRunning) {
      // resume from previous elapsed time
      startTimeRef.current = Date.now() - elapsed
      intervalRef.current = setInterval(() => {
        setElapsed(Date.now() - startTimeRef.current)
      }, 10) // 10 ms granularity ➜ 1 cs
    } else if (intervalRef.current) {
      clearInterval(intervalRef.current)
    }
    return () => clearInterval(intervalRef.current)
  }, [isRunning])

  /* ---------- Event handlers ---------- */
  const handleStartPause = () => setIsRunning((prev) => !prev)

  const handleReset = () => {
    setIsRunning(false)
    setElapsed(0)
    setLaps([])
  }

  const handleLap = () => {
    if (!isRunning) return
    setLaps((prev) => [...prev, elapsed])
  }

  /* ---------- Derived values ---------- */
  // Rotate hand: 360° every minute (60 000 ms)
  const rotationDeg = (elapsed % 60000) / 60000 * 360

  /* ---------- Render ---------- */
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-indigo-50 to-blue-100 p-6 select-none">
      {/* Heading */}
      <h1 className="text-4xl font-extrabold tracking-tight text-indigo-700 mb-8 drop-shadow-md">
        React Stopwatch
      </h1>

      {/* Analog stopwatch */}
      <div className="relative w-64 h-64 mb-6">
        {/* Frame */}
        <img
          src="/Stopwatch%20frame.webp"
          alt="Stopwatch frame"
          className="w-full h-full object-contain"
          draggable="false"
        />
        {/* Hand */}
        <img
          src="/clock-hand.png"
          alt="Clock hand"
          className="absolute left-1/2 top-1/2 w-2/3 origin-bottom"
          style={{
            transform: `translate(-50%, -100%) rotate(${rotationDeg}deg)`,
            transition: isRunning ? "none" : "transform 0.2s ease-out",
          }}
          draggable="false"
        />
      </div>

      {/* Digital read‑out (read‑only) */}
      <input
        type="text"
        value={formatTime(elapsed)}
        readOnly
        className="w-72 text-center text-3xl font-mono bg-white rounded-lg shadow-inner py-2 mb-6 cursor-default"
      />

      {/* Control buttons */}
      <div className="flex gap-4 mb-8">
        <button
          onClick={handleStartPause}
          className={`px-6 py-2 rounded-lg text-white font-semibold transition-colors duration-150 ${
            isRunning ? "bg-red-500 hover:bg-red-600" : "bg-green-500 hover:bg-green-600"
          }`}
        >
          {isRunning ? "Pause" : "Start"}
        </button>

        <button
          onClick={handleLap}
          disabled={!isRunning}
          className="px-6 py-2 rounded-lg bg-yellow-400 hover:bg-yellow-500 disabled:opacity-40 disabled:hover:bg-yellow-400 text-white font-semibold transition-colors duration-150"
        >
          Lap
        </button>

        <button
          onClick={handleReset}
          className="px-6 py-2 rounded-lg bg-indigo-500 hover:bg-indigo-600 text-white font-semibold transition-colors duration-150"
        >
          Reset
        </button>
      </div>

      {/* Lap list */}
      <div className="w-full max-w-sm">
        <h2 className="text-xl font-bold text-indigo-600 mb-3">Lap Times</h2>
        <ul className="bg-white rounded-lg shadow divide-y divide-indigo-100">
          {laps.length === 0 ? (
            <li className="py-6 text-center text-indigo-300">No laps recorded</li>
          ) : (
            laps.map((lap, idx) => (
              <li
                key={idx}
                className="flex justify-between px-4 py-2 font-mono text-sm"
              >
                <span className="text-indigo-500">Lap {idx + 1}</span>
                <span>{formatTime(lap)}</span>
              </li>
            ))
          )}
        </ul>
      </div>
    </div>
  )
}