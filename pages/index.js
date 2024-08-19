import { useState, useEffect, useRef } from 'react';

export default function Home() {
  const [timeLeft, setTimeLeft] = useState(1800); // 30 minutes = 1800 seconds
  const [isRunning, setIsRunning] = useState(false);
  const [gameMode, setGameMode] = useState(false); // Game Mode state
  const [intervalDuration, setIntervalDuration] = useState(1800); // Default interval in seconds
  const timerRef = useRef(null); // To hold the timer interval ID

  useEffect(() => {
    if (isRunning && !gameMode && timeLeft > 0) {
      timerRef.current = setInterval(() => {
        setTimeLeft((prevTimeLeft) => prevTimeLeft - 1);
      }, 1000);
    } else if (timeLeft === 0 && !gameMode) {
      if (Notification.permission === "granted") {
        new Notification("Posture Check!", {
          body: "Time to fix your posture.",
          icon: "/posture-icon.png" // Optional: Add a custom icon
        });
      } else {
        alert("Posture Check! Time to fix your posture.");
      }
      setIsRunning(false);
      setTimeLeft(intervalDuration); // Reset to selected interval
    }

    return () => clearInterval(timerRef.current);
  }, [isRunning, timeLeft, gameMode, intervalDuration]);

  const startTimer = () => {
    if (!isRunning) {
      setIsRunning(true);
    }
  };

  const resetTimer = () => {
    clearInterval(timerRef.current); // Clear the existing timer
    setIsRunning(false);
    setTimeLeft(intervalDuration); // Reset to selected interval
  };

  const toggleGameMode = () => {
    setGameMode(!gameMode);
    if (gameMode) {
      startTimer(); // Resume timer when game mode is turned off
    } else {
      clearInterval(timerRef.current); // Pause timer when game mode is on
      setIsRunning(false);
    }
  };

  const handleIntervalChange = (e) => {
    const selectedInterval = parseInt(e.target.value);
    setIntervalDuration(selectedInterval);
    setTimeLeft(selectedInterval);
  };

  const toggleDarkMode = () => {
    document.body.classList.toggle("dark-mode");
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100vh' }}>
      <h1>Posture Check!</h1>
      <p>{Math.floor(timeLeft / 60)}:{('0' + (timeLeft % 60)).slice(-2)}</p>
      {!isRunning ? (
        <button onClick={startTimer} style={{ padding: '10px 20px', fontSize: '16px' }}>Start Posture Check</button>
      ) : (
        <button onClick={resetTimer} style={{ padding: '10px 20px', fontSize: '16px' }}>Reset Timer</button>
      )}
      <button onClick={toggleGameMode} style={{ padding: '10px 20px', fontSize: '16px', marginTop: '10px' }}>
        {gameMode ? "Disable Game Mode" : "Enable Game Mode"}
      </button>
      <button onClick={toggleDarkMode} style={{ padding: '10px 20px', fontSize: '16px', marginTop: '10px' }}>
        Toggle Dark Mode
      </button>
      <div style={{ marginTop: '20px' }}>
        <label htmlFor="interval">Set Reminder Interval: </label>
        <select id="interval" value={intervalDuration} onChange={handleIntervalChange} style={{ padding: '5px 10px' }}>
          <option value={1800}>30 Minutes</option>
          <option value={3600}>1 Hour</option>
          <option value={7200}>2 Hours</option>
        </select>
      </div>
    </div>
  );
}
