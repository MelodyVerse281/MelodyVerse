import { useState, useCallback } from 'react';
import { recordAudio } from '../services/audioService';

/**
 * Audio Recording Hook
 * @param {Function} generationFunction - Music generation function
 * @returns {Object} - Recording state and control functions
 */
const useAudioRecorder = (generationFunction) => {
  const [isRecording, setIsRecording] = useState(false);
  const [audioBlob, setAudioBlob] = useState(null);
  const [error, setError] = useState(null);
  const [progress, setProgress] = useState(0);

  /**
   * Start recording audio
   * @param {Object} params - Recording parameters
   * @returns {Promise<Blob>} - Recorded audio Blob
   */
  const startRecording = useCallback(async (params) => {
    if (isRecording) {
      return null;
    }

    setIsRecording(true);
    setError(null);
    setProgress(0);
    
    try {
      // Simulate progress updates
      const progressInterval = setInterval(() => {
        setProgress(prev => {
          if (prev >= 95) {
            clearInterval(progressInterval);
            return prev;
          }
          return prev + 5;
        });
      }, 300);
      
      // Call recording service
      const blob = await recordAudio(generationFunction, params);
      
      clearInterval(progressInterval);
      setProgress(100);
      setAudioBlob(blob);
      return blob;
    } catch (err) {
      setError(err.message || 'Recording failed');
      return null;
    } finally {
      setIsRecording(false);
    }
  }, [generationFunction, isRecording]);

  /**
   * Cancel recording
   */
  const cancelRecording = useCallback(() => {
    // In a real application, you might need to cancel the ongoing recording process
    setIsRecording(false);
    setProgress(0);
  }, []);

  /**
   * Clear recorded audio
   */
  const clearRecording = useCallback(() => {
    setAudioBlob(null);
    setProgress(0);
  }, []);

  return {
    isRecording,
    audioBlob,
    error,
    progress,
    startRecording,
    cancelRecording,
    clearRecording
  };
};

export default useAudioRecorder; 