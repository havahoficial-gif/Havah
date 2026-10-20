import React, { useState, useEffect, useRef } from 'react';
import { Mic, Square, Play, Pause, Trash2, Save, X, Volume2, Sparkles, Check, Clock } from 'lucide-react';
import { Language } from '../types';
import { ThemeColors } from '../theme';

interface VoicePrayerModalProps {
  isOpen: boolean;
  language: Language;
  theme: ThemeColors;
  onClose: () => void;
}

export interface SavedVoicePrayer {
  id: string;
  title: string;
  date: string;
  duration: number; // in seconds
  audioUrl: string;
}

const STORAGE_KEY = 'havah_voice_prayers_v1';

export const VoicePrayerModal: React.FC<VoicePrayerModalProps> = ({
  isOpen,
  language,
  theme,
  onClose,
}) => {
  const [isRecording, setIsRecording] = useState(false);
  const [recordingSeconds, setRecordingSeconds] = useState(0);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [prayerTitle, setPrayerTitle] = useState('');
  const [savedPrayers, setSavedPrayers] = useState<SavedVoicePrayer[]>([]);
  const [permissionError, setPermissionError] = useState<string | null>(null);
  const [playingPrayerId, setPlayingPrayerId] = useState<string | null>(null);

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const timerRef = useRef<number | null>(null);
  const audioPlayerRef = useRef<HTMLAudioElement | null>(null);

  // Load saved voice prayers on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        setSavedPrayers(JSON.parse(stored));
      }
    } catch {
      // Ignore storage errors
    }
  }, []);

  // Sync saved voice prayers to localStorage
  const savePrayersToStorage = (list: SavedVoicePrayer[]) => {
    setSavedPrayers(list);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
    } catch {
      // Storage quota or error handling
    }
  };

  // Timer ticker while recording
  useEffect(() => {
    if (isRecording) {
      timerRef.current = window.setInterval(() => {
        setRecordingSeconds((prev) => prev + 1);
      }, 1000);
    } else {
      if (timerRef.current) clearInterval(timerRef.current);
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isRecording]);

  if (!isOpen) return null;

  // Start Mic Recording
  const startRecording = async () => {
    setPermissionError(null);
    setAudioUrl(null);
    setRecordingSeconds(0);
    audioChunksRef.current = [];

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
        // Convert Blob to DataURL so it persists in localStorage
        const reader = new FileReader();
        reader.readAsDataURL(audioBlob);
        reader.onloadend = () => {
          const base64Audio = reader.result as string;
          setAudioUrl(base64Audio);
        };

        // Stop all tracks to release mic
        stream.getTracks().forEach((track) => track.stop());
      };

      mediaRecorder.start();
      setIsRecording(true);
    } catch (err) {
      console.error('Error accessing microphone:', err);
      setPermissionError(
        language === 'es'
          ? 'No se pudo acceder al micrófono. Por favor permite los permisos en tu navegador.'
          : 'Microphone access denied. Please allow microphone permissions in your browser.'
      );
    }
  };

  // Stop Recording
  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    }
  };

  // Save current recording
  const handleSavePrayer = () => {
    if (!audioUrl) return;

    const titleToSave =
      prayerTitle.trim() ||
      (language === 'es'
        ? `Oración de Voz (${new Date().toLocaleDateString()})`
        : `Voice Prayer (${new Date().toLocaleDateString()})`);

    const newPrayer: SavedVoicePrayer = {
      id: Date.now().toString(),
      title: titleToSave,
      date: new Date().toLocaleDateString('es-ES', {
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      }),
      duration: recordingSeconds,
      audioUrl: audioUrl,
    };

    const updated = [newPrayer, ...savedPrayers];
    savePrayersToStorage(updated);

    // Reset current recording state
    setAudioUrl(null);
    setPrayerTitle('');
    setRecordingSeconds(0);
  };

  // Play / Pause saved prayer
  const handlePlaySavedPrayer = (prayer: SavedVoicePrayer) => {
    if (playingPrayerId === prayer.id && isPlaying) {
      if (audioPlayerRef.current) {
        audioPlayerRef.current.pause();
      }
      setIsPlaying(false);
      setPlayingPrayerId(null);
      return;
    }

    if (audioPlayerRef.current) {
      audioPlayerRef.current.pause();
    }

    const audio = new Audio(prayer.audioUrl);
    audioPlayerRef.current = audio;

    audio.play();
    setIsPlaying(true);
    setPlayingPrayerId(prayer.id);

    audio.onended = () => {
      setIsPlaying(false);
      setPlayingPrayerId(null);
    };
  };

  // Delete saved prayer
  const handleDeletePrayer = (id: string) => {
    if (playingPrayerId === id && audioPlayerRef.current) {
      audioPlayerRef.current.pause();
      setIsPlaying(false);
      setPlayingPrayerId(null);
    }
    const filtered = savedPrayers.filter((p) => p.id !== id);
    savePrayersToStorage(filtered);
  };

  // Format time (hh:mm:ss or mm:ss)
  const formatTime = (seconds: number) => {
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    if (hrs > 0) {
      return `${hrs}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    }
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const currentHour = new Date().getHours();
  const isDaytime = currentHour >= 6 && currentHour < 19;

  return (
    <div className={`fixed inset-0 z-50 flex items-center justify-center p-4 backdrop-blur-xl animate-fade-in ${
      theme.isDark ? 'bg-black/75' : 'bg-sky-950/20'
    }`}>
      <div
        className="w-full max-w-lg rounded-3xl p-6 border shadow-2xl overflow-hidden relative max-h-[90vh] flex flex-col backdrop-blur-2xl liquid-glass"
        style={{
          backgroundColor: theme.glassCard,
          borderColor: theme.cardBorder,
          color: theme.text,
        }}
      >
        {/* Dynamic Celestial Atmosphere Background */}
        {isDaytime ? (
          <div className="absolute inset-0 pointer-events-none overflow-hidden z-0">
            <div className="absolute -top-20 -left-20 w-64 h-64 rounded-full bg-sky-300/40 blur-3xl" />
            <div className="absolute -bottom-20 -right-20 w-64 h-64 rounded-full bg-cyan-300/35 blur-3xl" />
          </div>
        ) : (
          <div className="absolute inset-0 pointer-events-none overflow-hidden z-0">
            <img
              src="/night-space.jpg"
              alt="Night Space"
              className="w-full h-full object-cover opacity-30 mix-blend-screen scale-110"
            />
            <div className="absolute inset-0 bg-gradient-to-b from-[#060B18]/80 via-transparent to-[#060B18]/90" />
          </div>
        )}

        <div className="relative z-10 flex flex-col max-h-[80vh] overflow-hidden">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full border cursor-pointer transition-all hover:scale-105 active:scale-95 z-10"
          style={{
            backgroundColor: theme.isDark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.05)',
            borderColor: theme.cardBorder,
            color: theme.text,
          }}
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="flex items-center gap-3 mb-5">
          <div
            className="w-11 h-11 rounded-2xl flex items-center justify-center shadow-md p-2 border"
            style={{
              backgroundColor: theme.accentBg,
              borderColor: theme.accentBorder,
            }}
          >
            <Mic className="w-6 h-6" style={{ color: theme.accent }} />
          </div>
          <div>
            <h2 className="font-serif-scripture font-bold text-xl" style={{ color: theme.text }}>
              {language === 'es' ? 'Oración de Voz' : 'Voice Prayer'}
            </h2>
            <p className="text-xs" style={{ color: theme.textMuted }}>
              {language === 'es'
                ? 'Habla con el Padre en la intimidad de tu voz'
                : 'Speak with the Father in the intimacy of your voice'}
            </p>
          </div>
        </div>

        {/* Error message */}
        {permissionError && (
          <div className="p-3 mb-4 rounded-2xl bg-red-500/10 border border-red-500/30 text-red-400 text-xs text-center">
            {permissionError}
          </div>
        )}

        {/* Main Recorder Controls in Liquid Glass Card */}
        <div
          className="p-6 rounded-2xl border text-center space-y-4 relative overflow-hidden liquid-glass-subtle mb-5"
          style={{ borderColor: theme.cardBorder }}
        >
          {/* Animated Liquid Waveform Visualization */}
          <div className="h-14 flex items-center justify-center gap-1.5 py-2">
            {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15].map((bar) => {
              const height = isRecording
                ? `${Math.max(15, (bar * 17 + recordingSeconds * 23) % 100)}%`
                : audioUrl
                ? '40%'
                : '15%';

              return (
                <div
                  key={bar}
                  className="w-1.5 rounded-full transition-all duration-150"
                  style={{
                    height,
                    backgroundColor: isRecording
                      ? '#EF4444' // Red pulsing while recording
                      : theme.accent,
                    boxShadow: isRecording
                      ? '0 0 10px rgba(239, 68, 68, 0.8)'
                      : `0 0 8px ${theme.accent}`,
                  }}
                />
              );
            })}
          </div>

          {/* Time Counter */}
          <div className="text-2xl font-mono font-bold tracking-wider" style={{ color: theme.text }}>
            {formatTime(recordingSeconds)}
          </div>

          {/* Recording Status Tag */}
          <p className="text-xs font-semibold" style={{ color: theme.textMuted }}>
            {isRecording
              ? language === 'es'
                ? 'Grabando oración... Háblale a Dios con libertad'
                : 'Recording prayer... Speak freely to God'
              : audioUrl
              ? language === 'es'
                ? 'Grabación lista para escuchar o guardar'
                : 'Recording ready to listen or save'
              : language === 'es'
              ? 'Presiona el micrófono para iniciar tu oración'
              : 'Press microphone to start your prayer'}
          </p>

          {/* Record / Stop Button */}
          <div className="flex items-center justify-center gap-4 pt-2">
            {!isRecording ? (
              <button
                onClick={startRecording}
                className="w-16 h-16 rounded-full flex items-center justify-center cursor-pointer transition-all hover:scale-110 active:scale-95 shadow-xl border"
                style={{
                  backgroundColor: theme.accent,
                  borderColor: theme.accent,
                  color: '#FFFFFF',
                  boxShadow: `0 0 25px ${theme.accent}`,
                }}
                title={language === 'es' ? 'Iniciar grabación' : 'Start recording'}
              >
                <Mic className="w-7 h-7" />
              </button>
            ) : (
              <button
                onClick={stopRecording}
                className="w-16 h-16 rounded-full flex items-center justify-center cursor-pointer transition-all hover:scale-110 active:scale-95 shadow-xl border bg-red-600 border-red-500 text-white"
                style={{
                  boxShadow: '0 0 25px rgba(239, 68, 68, 0.8)',
                }}
                title={language === 'es' ? 'Detener grabación' : 'Stop recording'}
              >
                <Square className="w-7 h-7 fill-white" />
              </button>
            )}
          </div>

          {/* Save Recording Form */}
          {audioUrl && !isRecording && (
            <div className="pt-3 border-t border-black/5 dark:border-white/5 space-y-3 animate-fade-in">
              <input
                type="text"
                placeholder={
                  language === 'es'
                    ? 'Título o intención (ej: Gracias por la familia)'
                    : 'Title or intention (e.g. Thanks for family)'
                }
                value={prayerTitle}
                onChange={(e) => setPrayerTitle(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl text-xs border outline-none transition-all liquid-glass-subtle"
                style={{
                  color: theme.text,
                  borderColor: theme.accentBorder,
                }}
              />

              <div className="flex items-center gap-2">
                <button
                  onClick={handleSavePrayer}
                  className="flex-1 py-2.5 px-4 rounded-xl text-xs font-bold flex items-center justify-center gap-2 cursor-pointer shadow-md transition-all active:scale-95"
                  style={{
                    backgroundColor: theme.accent,
                    color: '#FFFFFF',
                  }}
                >
                  <Save className="w-4 h-4" />
                  <span>{language === 'es' ? 'Guardar mi Oración de Voz' : 'Save Voice Prayer'}</span>
                </button>

                <button
                  onClick={() => {
                    setAudioUrl(null);
                    setRecordingSeconds(0);
                  }}
                  className="p-2.5 rounded-xl border cursor-pointer transition-all hover:bg-red-500/10 text-red-400 border-red-500/30"
                  title={language === 'es' ? 'Descartar' : 'Discard'}
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Saved Voice Prayers List */}
        <div className="flex-1 overflow-y-auto space-y-3 pr-1">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-xs font-bold uppercase tracking-wider" style={{ color: theme.accent }}>
              {language === 'es' ? 'Tus Oraciones de Voz Guardadas' : 'Your Saved Voice Prayers'}
            </h3>
            <span className="text-[11px]" style={{ color: theme.textMuted }}>
              {savedPrayers.length} {language === 'es' ? 'grabaciones' : 'recordings'}
            </span>
          </div>

          {savedPrayers.length === 0 ? (
            <div
              className="p-6 rounded-2xl border text-center liquid-glass-subtle space-y-2"
              style={{ borderColor: theme.cardBorder }}
            >
              <Volume2 className="w-8 h-8 mx-auto opacity-40" style={{ color: theme.accent }} />
              <p className="text-xs font-semibold" style={{ color: theme.text }}>
                {language === 'es'
                  ? 'Aún no has guardado oraciones habladas'
                  : 'No saved voice prayers yet'}
              </p>
              <p className="text-[11px]" style={{ color: theme.textMuted }}>
                {language === 'es'
                  ? 'Tus oraciones grabadas se guardarán de forma privada en tu dispositivo.'
                  : 'Your recorded prayers will be stored privately on your device.'}
              </p>
            </div>
          ) : (
            savedPrayers.map((prayer) => {
              const isThisPlaying = playingPrayerId === prayer.id && isPlaying;
              return (
                <div
                  key={prayer.id}
                  className="p-3.5 rounded-2xl border flex items-center justify-between transition-all liquid-glass-subtle group hover:border-sky-400/50"
                  style={{ borderColor: theme.cardBorder }}
                >
                  <div className="flex items-center gap-3 overflow-hidden">
                    {/* Play/Pause Button */}
                    <button
                      onClick={() => handlePlaySavedPrayer(prayer)}
                      className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0 cursor-pointer transition-all hover:scale-105 active:scale-95 border"
                      style={{
                        backgroundColor: isThisPlaying ? theme.accent : theme.accentBg,
                        color: isThisPlaying ? (theme.isDark ? '#000' : '#FFF') : theme.accent,
                        borderColor: theme.accentBorder,
                      }}
                    >
                      {isThisPlaying ? (
                        <Pause className="w-4 h-4 fill-current" />
                      ) : (
                        <Play className="w-4 h-4 fill-current ml-0.5" />
                      )}
                    </button>

                    <div className="truncate">
                      <h4 className="text-xs font-bold truncate" style={{ color: theme.text }}>
                        {prayer.title}
                      </h4>
                      <div className="flex items-center gap-2 mt-0.5 text-[10px]" style={{ color: theme.textMuted }}>
                        <span className="flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {formatTime(prayer.duration)}
                        </span>
                        <span>•</span>
                        <span>{prayer.date}</span>
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  <button
                    onClick={() => handleDeletePrayer(prayer.id)}
                    className="p-2 rounded-xl border opacity-60 hover:opacity-100 transition-opacity text-red-400 hover:bg-red-500/10 border-red-500/20 cursor-pointer"
                    title={language === 'es' ? 'Eliminar oración' : 'Delete prayer'}
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              );
            })
          )}
        </div>
        </div>
      </div>
    </div>
  );
};
