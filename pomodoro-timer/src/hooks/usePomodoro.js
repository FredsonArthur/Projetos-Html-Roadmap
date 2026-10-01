import { useState, useEffect, useRef, useCallback } from "react";

// Configuração padrão, conforme pedido no projeto (em minutos)
const DEFAULT_SETTINGS = {
  work: 25,
  shortBreak: 5,
  longBreak: 15,
  sessionsBeforeLongBreak: 4,
};

const SESSION_TYPES = {
  WORK: "Work",
  SHORT_BREAK: "Short Break",
  LONG_BREAK: "Long Break",
};

// Toca um beep sintetizado via Web Audio API, sem precisar de arquivo de áudio
function playNotificationSound() {
  const AudioContextClass = window.AudioContext || window.webkitAudioContext;
  const audioContext = new AudioContextClass();

  const oscillator = audioContext.createOscillator();
  const gainNode = audioContext.createGain();

  oscillator.connect(gainNode);
  gainNode.connect(audioContext.destination);

  oscillator.type = "sine";
  oscillator.frequency.value = 880; // nota A5, um beep agudo e claro

  // Fade out suave para não soar um "clique" seco no final
  gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
  gainNode.gain.exponentialRampToValueAtTime(
    0.001,
    audioContext.currentTime + 0.6
  );

  oscillator.start();
  oscillator.stop(audioContext.currentTime + 0.6);
}

export function usePomodoro() {
  const [settings, setSettings] = useState(DEFAULT_SETTINGS);
  const [sessionType, setSessionType] = useState(SESSION_TYPES.WORK);
  const [secondsLeft, setSecondsLeft] = useState(DEFAULT_SETTINGS.work * 60);
  const [isRunning, setIsRunning] = useState(false);
  const [completedWorkSessions, setCompletedWorkSessions] = useState(0);

  // useRef guarda o id do setInterval sem causar re-render a cada mudança
  const intervalRef = useRef(null);

  // Decide qual é a próxima sessão (Work -> Short/Long Break -> Work...)
  const getNextSession = useCallback(
    (currentType, sessionsCompleted) => {
      if (currentType === SESSION_TYPES.WORK) {
        const isTimeForLongBreak =
          sessionsCompleted % settings.sessionsBeforeLongBreak === 0;
        return isTimeForLongBreak
          ? SESSION_TYPES.LONG_BREAK
          : SESSION_TYPES.SHORT_BREAK;
      }
      return SESSION_TYPES.WORK;
    },
    [settings.sessionsBeforeLongBreak]
  );

  function getDurationFor(type) {
    if (type === SESSION_TYPES.WORK) return settings.work * 60;
    if (type === SESSION_TYPES.SHORT_BREAK) return settings.shortBreak * 60;
    return settings.longBreak * 60;
  }

  function handleSessionEnd() {
    playNotificationSound();

    setIsRunning(false);

    setCompletedWorkSessions((prevCount) => {
      const newCount =
        sessionType === SESSION_TYPES.WORK ? prevCount + 1 : prevCount;

      const nextSession = getNextSession(sessionType, newCount);
      setSessionType(nextSession);
      setSecondsLeft(getDurationFor(nextSession));

      return newCount;
    });
  }

  // Roda o cronômetro a cada segundo, só enquanto isRunning for true
  useEffect(() => {
    if (!isRunning) return;

    intervalRef.current = setInterval(() => {
      setSecondsLeft((prev) => {
        if (prev <= 1) {
          handleSessionEnd();
          return prev;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(intervalRef.current);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isRunning, sessionType, settings]);

  function start() {
    setIsRunning(true);
  }

  function pause() {
    setIsRunning(false);
  }

  function reset() {
    setIsRunning(false);
    setSecondsLeft(getDurationFor(sessionType));
  }

  // Permite ao usuário configurar os minutos de cada tipo de sessão
  function updateSettings(newSettings) {
    const updated = { ...settings, ...newSettings };
    setSettings(updated);

    // Se o timer não estiver rodando, já reflete a nova duração na tela
    if (!isRunning) {
      const durationKey =
        sessionType === SESSION_TYPES.WORK
          ? "work"
          : sessionType === SESSION_TYPES.SHORT_BREAK
          ? "shortBreak"
          : "longBreak";
      setSecondsLeft(updated[durationKey] * 60);
    }
  }

  return {
    sessionType,
    secondsLeft,
    isRunning,
    completedWorkSessions,
    settings,
    start,
    pause,
    reset,
    updateSettings,
  };
}