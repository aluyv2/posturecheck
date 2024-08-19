import { useState, useEffect, useRef } from 'react';
import { database, ref, set, onValue, increment } from '../firebase'; // Import Firebase

export default function Home() {
  const [timeLeft, setTimeLeft] = useState(1800); // 30 minutes = 1800 seconds
  const [isRunning, setIsRunning] = useState(false);
  const [gameMode, setGameMode] = useState(false); // Game Mode state
  const [intervalDuration, setIntervalDuration] = useState(1800); // Default interval in seconds
  const [darkMode, setDarkMode] = useState(false); // Dark Mode state
  const [activePostureChecks, setActivePostureChecks] = useState(0); // Active posture checks
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

  useEffect(() => {
    document.body.classList.toggle("dark-mode", darkMode);
  }, [darkMode]);

  useEffect(() => {
    // Get the current count of active posture checks
    const activeRef = ref(database, 'activePostureChecks');
    onValue(activeRef, (snapshot) => {
      setActivePostureChecks(snapshot.val() || 0);
    });
  }, []);

  const startTimer = () => {
    if (!isRunning) {
      setIsRunning(true);
      // Increment active posture checks
      const activeRef = ref(database, 'activePostureChecks');
      set(activeRef, increment(1));
    }
  };

  const resetTimer = () => {
    clearInterval(timerRef.current); // Clear the existing timer
    setIsRunning(false);
    setTimeLeft(intervalDuration); // Reset to selected interval
    // Decrement active posture checks
    const activeRef = ref(database, 'activePostureChecks');
    set(activeRef, increment(-1));
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
        {darkMode ? "Switch to Light Mode" : "Switch to Dark Mode"}
      </button>
      <div style={{ marginTop: '20px' }}>
        <label htmlFor="interval">Set Reminder Interval: </label>
        <select id="interval" value={intervalDuration} onChange={handleIntervalChange} style={{ padding: '5px 10px' }}>
          <option value={1800}>30 Minutes</option>
          <option value={3600}>1 Hour</option>
          <option value={7200}>2 Hours</option>
        </select>
      </div>
      <p style={{ marginTop: '20px' }}>Active Posture Checks: {activePostureChecks}</p>
    </div>
  );
}
