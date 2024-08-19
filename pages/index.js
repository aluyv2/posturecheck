import { useState, useEffect } from 'react';

export default function Home() {
  const [timeLeft, setTimeLeft] = useState(1800); // 30 minutes = 1800 seconds
  const [isRunning, setIsRunning] = useState(false);
  const [gameMode, setGameMode] = useState(false); // Game Mode state
  const [interval, setInterval] = useState(1800); // Default interval
  const [darkMode, setDarkMode] = useState(false); // Dark Mode state

  useEffect(() => {
    if (darkMode) {
      document.body.style.backgroundColor = "#333";
      document.body.style.color = "#fff";
    } else {
      document.body.style.backgroundColor = "#fff";
      document.body.style.color = "#000";
    }
  }, [darkMode]);

  useEffect(() => {
    // Request notification permission on load
    if (Notification.permission !== "granted") {
      Notification.requestPermission();
    }

    let timer;
    if (isRunning && !gameMode && timeLeft > 0) {
      timer = setInterval(() => {
        setTimeLeft(timeLeft - 1);
      }, 1000);
    } else if (timeLeft === 0 && !gameMode) {
      if (Notification.permission === "granted") {
        new Notification("Posture Check!", {
          body: "Time to fix your posture.",
          icon: "/posture-icon.png" // You can add an icon here
        });
      } else {
        alert("Posture Check! Time to fix your posture.");
      }
      setIsRunning(false);
      setTimeLeft(interval); // Reset to selected interval
    }
    return () => clearInterval(timer);
  }, [isRunning, timeLeft, gameMode, interval]);

  const startTimer = () => {
    setIsRunning(true);
  };

  const resetTimer = () => {
    setIsRunning(false);
    setTimeLeft(interval);
  };

  const toggleGameMode = () => {
    setGameMode(!gameMode);
  };

  const handleIntervalChange = (e) => {
    const selectedInterval = parseInt(e.target.value);
    setInterval(selectedInterval);
    setTimeLeft(selectedInterval);
  };

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
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
        {darkMode ? "Light Mode" : "Dark Mode"}
      </button>
      <div style={{ marginTop: '20px' }}>
        <label htmlFor="interval">Set Reminder Interval: </label>
        <select id="interval" value={interval} onChange={handleIntervalChange} style={{ padding: '5px 10px' }}>
          <option value={1800}>30 Minutes</option>
          <option value={3600}>1 Hour</option>
          <option value={7200}>2 Hours</option>
        </select>
      </div>
    </div>
  );
}
