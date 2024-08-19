import { useState, useEffect } from 'react';

export default function Home() {
  const [timeLeft, setTimeLeft] = useState(1800); // 30 minutes = 1800 seconds
  const [isRunning, setIsRunning] = useState(false);

  useEffect(() => {
    let timer;
    if (isRunning && timeLeft > 0) {
      timer = setInterval(() => {
        setTimeLeft(timeLeft - 1);
      }, 1000);
    } else if (timeLeft === 0) {
      alert("Posture Check! Time to fix your posture.");
      setIsRunning(false);
      setTimeLeft(1800); // Reset to 30 minutes
    }
    return () => clearInterval(timer);
  }, [isRunning, timeLeft]);

  const startTimer = () => {
    setIsRunning(true);
  };

  const resetTimer = () => {
    setIsRunning(false);
    setTimeLeft(1800);
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
    </div>
  );
}
