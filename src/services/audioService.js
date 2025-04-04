import * as Tone from 'tone';

/**
 * Record audio
 * @param {Function} generationFunction - Music generation function
 * @param {Object} emotionData - Emotion data
 * @returns {Promise<Blob>} - Returns audio Blob
 */
export const recordAudio = async (generationFunction, emotionData) => {
  // Create offline context for recording
  const duration = 10; // Record for 10 seconds
  const offlineContext = new Tone.OfflineContext(2, duration, 44100);
  
  // Set current context to offline context
  Tone.setContext(offlineContext);
  
  // Generate music in offline context
  await generationFunction(emotionData);
  
  // Render audio
  console.log('Starting audio recording...');
  const buffer = await offlineContext.render();
  console.log('Audio recording completed');
  
  // Restore normal context
  Tone.setContext(new Tone.Context());
  
  // Convert AudioBuffer to Blob
  const wavBlob = bufferToWave(buffer, 0, buffer.length);
  
  return wavBlob;
};

/**
 * Convert AudioBuffer to WAV Blob
 * @param {AudioBuffer} abuffer - Audio buffer
 * @param {number} offset - Start position
 * @param {number} len - Length
 * @returns {Blob} - WAV Blob
 */
function bufferToWave(abuffer, offset, len) {
  const numOfChan = abuffer.numberOfChannels;
  const length = len * numOfChan * 2 + 44;
  const buffer = new ArrayBuffer(length);
  const view = new DataView(buffer);
  const channels = [];
  let sample, pos = 0;
  
  // Write WAV header
  setUint32(0x46464952); // "RIFF"
  setUint32(length - 8); // File length - 8
  setUint32(0x45564157); // "WAVE"
  setUint32(0x20746d66); // "fmt "
  setUint32(16); // Block length
  setUint16(1); // Encoding format (PCM)
  setUint16(numOfChan); // Number of channels
  setUint32(abuffer.sampleRate); // Sample rate
  setUint32(abuffer.sampleRate * 2 * numOfChan); // Bytes per second
  setUint16(numOfChan * 2); // Block align
  setUint16(16); // Bits per sample
  setUint32(0x61746164); // "data"
  setUint32(length - pos - 4); // Block length
  
  // Write samples
  for (let i = 0; i < abuffer.numberOfChannels; i++) {
    channels.push(abuffer.getChannelData(i));
  }
  
  while (pos < length) {
    for (let i = 0; i < numOfChan; i++) {
      sample = Math.max(-1, Math.min(1, channels[i][offset]));
      sample = (0.5 + sample < 0 ? sample * 32768 : sample * 32767) | 0;
      view.setInt16(pos, sample, true);
      pos += 2;
    }
    offset++;
  }
  
  // Helper functions
  function setUint16(data) {
    view.setUint16(pos, data, true);
    pos += 2;
  }
  
  function setUint32(data) {
    view.setUint32(pos, data, true);
    pos += 4;
  }
  
  return new Blob([buffer], { type: 'audio/wav' });
}

/**
 * Download audio file
 * @param {Blob} blob - Audio Blob
 * @param {string} fileName - File name
 */
export const downloadAudio = (blob, fileName = 'melody.wav') => {
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = fileName;
  a.click();
  
  setTimeout(() => {
    URL.revokeObjectURL(url);
  }, 100);
}; 