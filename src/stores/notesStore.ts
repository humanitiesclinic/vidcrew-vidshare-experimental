import { defineStore } from 'pinia';
import { ref, computed } from 'vue';

export interface VideoMetadata {
  duration: number; // seconds
  bitrate: string;
  codec: string;
  resolution: string;
  frameRate: string;
  audioCodec: string;
  sampleRate: string;
  channels: string;
}

export interface Note {
  id: number;
  classEvent: string; // e.g., "31-Dec", "BD", "CNY"
  instance: number; // year or custom number
  descriptionGroup: string; // group name for left/right nav
  description: string; // main note text
  videoPath: string;
  startTime: number;
  endTime: number;
  metadata: VideoMetadata;
  pointers: Array<{ time: number; label: string }>; // optional bookmarks
  createdAt: string;
  updatedAt: string;
}

export const useNotesStore = defineStore('notes', () => {
  const notes = ref<Note[]>([
    // 31-Dec entries
    { id: 1, classEvent: '31-Dec', instance: 2022, descriptionGroup: 'setup', description: 'Setup 2022', videoPath: '/videos/screen_recording.mov', startTime: 10, endTime: 80, metadata: { duration: 725.73, bitrate: '2069 kb/s', codec: 'h264 (Main)', resolution: '1440x900', frameRate: '14.57 fps', audioCodec: 'aac (LC)', sampleRate: '44100 Hz', channels: 'stereo' }, pointers: [], createdAt: '2022-12-31T10:00:00Z', updatedAt: '2022-12-31T10:00:00Z' },
    { id: 2, classEvent: '31-Dec', instance: 2022, descriptionGroup: 'preparation', description: 'Preparation 2022', videoPath: '/videos/screen_recording.mov', startTime: 100, endTime: 200, metadata: { duration: 725.73, bitrate: '2069 kb/s', codec: 'h264 (Main)', resolution: '1440x900', frameRate: '14.57 fps', audioCodec: 'aac (LC)', sampleRate: '44100 Hz', channels: 'stereo' }, pointers: [], createdAt: '2022-12-31T10:30:00Z', updatedAt: '2022-12-31T10:30:00Z' },
    { id: 3, classEvent: '31-Dec', instance: 2022, descriptionGroup: 'execution', description: 'Execution 2022', videoPath: '/videos/screen_recording.mov', startTime: 220, endTime: 350, metadata: { duration: 725.73, bitrate: '2069 kb/s', codec: 'h264 (Main)', resolution: '1440x900', frameRate: '14.57 fps', audioCodec: 'aac (LC)', sampleRate: '44100 Hz', channels: 'stereo' }, pointers: [], createdAt: '2022-12-31T11:00:00Z', updatedAt: '2022-12-31T11:00:00Z' },
    { id: 4, classEvent: '31-Dec', instance: 2023, descriptionGroup: 'setup', description: 'Setup 2023', videoPath: '/videos/iphone_clip.mp4', startTime: 15, endTime: 75, metadata: { duration: 369.78, bitrate: '7390 kb/s', codec: 'h264 (High)', resolution: '888x1920', frameRate: '41.97 fps', audioCodec: 'aac (LC)', sampleRate: '44100 Hz', channels: 'stereo' }, pointers: [], createdAt: '2023-12-31T10:00:00Z', updatedAt: '2023-12-31T10:00:00Z' },
    { id: 5, classEvent: '31-Dec', instance: 2023, descriptionGroup: 'preparation', description: 'Preparation 2023', videoPath: '/videos/iphone_clip.mp4', startTime: 100, endTime: 180, metadata: { duration: 369.78, bitrate: '7390 kb/s', codec: 'h264 (High)', resolution: '888x1920', frameRate: '41.97 fps', audioCodec: 'aac (LC)', sampleRate: '44100 Hz', channels: 'stereo' }, pointers: [], createdAt: '2023-12-31T10:45:00Z', updatedAt: '2023-12-31T10:45:00Z' },
    { id: 6, classEvent: '31-Dec', instance: 2023, descriptionGroup: 'execution', description: 'Execution 2023', videoPath: '/videos/iphone_clip.mp4', startTime: 200, endTime: 330, metadata: { duration: 369.78, bitrate: '7390 kb/s', codec: 'h264 (High)', resolution: '888x1920', frameRate: '41.97 fps', audioCodec: 'aac (LC)', sampleRate: '44100 Hz', channels: 'stereo' }, pointers: [], createdAt: '2023-12-31T11:30:00Z', updatedAt: '2023-12-31T11:30:00Z' },
    { id: 7, classEvent: '31-Dec', instance: 2024, descriptionGroup: 'setup', description: 'Setup 2024', videoPath: '/videos/screen_recording.mov', startTime: 30, endTime: 120, metadata: { duration: 725.73, bitrate: '2069 kb/s', codec: 'h264 (Main)', resolution: '1440x900', frameRate: '14.57 fps', audioCodec: 'aac (LC)', sampleRate: '44100 Hz', channels: 'stereo' }, pointers: [{ time: 40, label: 'Start setup' }], createdAt: '2024-12-31T10:00:00Z', updatedAt: '2024-12-31T10:00:00Z' },
    { id: 8, classEvent: '31-Dec', instance: 2024, descriptionGroup: 'preparation', description: 'Preparation 2024', videoPath: '/videos/screen_recording.mov', startTime: 250, endTime: 400, metadata: { duration: 725.73, bitrate: '2069 kb/s', codec: 'h264 (Main)', resolution: '1440x900', frameRate: '14.57 fps', audioCodec: 'aac (LC)', sampleRate: '44100 Hz', channels: 'stereo' }, pointers: [], createdAt: '2024-12-31T10:45:00Z', updatedAt: '2024-12-31T10:45:00Z' },
    { id: 9, classEvent: '31-Dec', instance: 2024, descriptionGroup: 'execution', description: 'Execution 2024', videoPath: '/videos/screen_recording.mov', startTime: 450, endTime: 600, metadata: { duration: 725.73, bitrate: '2069 kb/s', codec: 'h264 (Main)', resolution: '1440x900', frameRate: '14.57 fps', audioCodec: 'aac (LC)', sampleRate: '44100 Hz', channels: 'stereo' }, pointers: [], createdAt: '2024-12-31T11:30:00Z', updatedAt: '2024-12-31T11:30:00Z' },
    { id: 10, classEvent: '31-Dec', instance: 2025, descriptionGroup: 'setup', description: 'Setup 2025', videoPath: '/videos/iphone_clip.mp4', startTime: 20, endTime: 100, metadata: { duration: 369.78, bitrate: '7390 kb/s', codec: 'h264 (High)', resolution: '888x1920', frameRate: '41.97 fps', audioCodec: 'aac (LC)', sampleRate: '44100 Hz', channels: 'stereo' }, pointers: [], createdAt: '2025-12-31T10:00:00Z', updatedAt: '2025-12-31T10:00:00Z' },
    // BD entries
    { id: 11, classEvent: 'BD', instance: 2023, descriptionGroup: 'setup', description: 'BD Setup 2023', videoPath: '/videos/iphone_clip.mp4', startTime: 10, endTime: 90, metadata: { duration: 369.78, bitrate: '7390 kb/s', codec: 'h264 (High)', resolution: '888x1920', frameRate: '41.97 fps', audioCodec: 'aac (LC)', sampleRate: '44100 Hz', channels: 'stereo' }, pointers: [], createdAt: '2023-01-15T09:00:00Z', updatedAt: '2023-01-15T09:00:00Z' },
    { id: 12, classEvent: 'BD', instance: 2023, descriptionGroup: 'execution', description: 'BD Execution 2023', videoPath: '/videos/iphone_clip.mp4', startTime: 120, endTime: 250, metadata: { duration: 369.78, bitrate: '7390 kb/s', codec: 'h264 (High)', resolution: '888x1920', frameRate: '41.97 fps', audioCodec: 'aac (LC)', sampleRate: '44100 Hz', channels: 'stereo' }, pointers: [], createdAt: '2023-01-15T10:30:00Z', updatedAt: '2023-01-15T10:30:00Z' },
    { id: 13, classEvent: 'BD', instance: 2024, descriptionGroup: 'setup', description: 'BD Setup 2024', videoPath: '/videos/screen_recording.mov', startTime: 50, endTime: 150, metadata: { duration: 725.73, bitrate: '2069 kb/s', codec: 'h264 (Main)', resolution: '1440x900', frameRate: '14.57 fps', audioCodec: 'aac (LC)', sampleRate: '44100 Hz', channels: 'stereo' }, pointers: [], createdAt: '2024-01-15T09:00:00Z', updatedAt: '2024-01-15T09:00:00Z' },
    { id: 14, classEvent: 'BD', instance: 2024, descriptionGroup: 'execution', description: 'BD Execution 2024', videoPath: '/videos/screen_recording.mov', startTime: 200, endTime: 350, metadata: { duration: 725.73, bitrate: '2069 kb/s', codec: 'h264 (Main)', resolution: '1440x900', frameRate: '14.57 fps', audioCodec: 'aac (LC)', sampleRate: '44100 Hz', channels: 'stereo' }, pointers: [], createdAt: '2024-01-15T10:45:00Z', updatedAt: '2024-01-15T10:45:00Z' },
    { id: 15, classEvent: 'BD', instance: 2025, descriptionGroup: 'setup', description: 'BD Setup 2025', videoPath: '/videos/iphone_clip.mp4', startTime: 15, endTime: 95, metadata: { duration: 369.78, bitrate: '7390 kb/s', codec: 'h264 (High)', resolution: '888x1920', frameRate: '41.97 fps', audioCodec: 'aac (LC)', sampleRate: '44100 Hz', channels: 'stereo' }, pointers: [], createdAt: '2025-01-15T09:00:00Z', updatedAt: '2025-01-15T09:00:00Z' },
    // CNY entries
    { id: 16, classEvent: 'CNY', instance: 2023, descriptionGroup: 'preparation', description: 'CNY Prep 2023', videoPath: '/videos/screen_recording.mov', startTime: 100, endTime: 250, metadata: { duration: 725.73, bitrate: '2069 kb/s', codec: 'h264 (Main)', resolution: '1440x900', frameRate: '14.57 fps', audioCodec: 'aac (LC)', sampleRate: '44100 Hz', channels: 'stereo' }, pointers: [], createdAt: '2023-01-22T14:00:00Z', updatedAt: '2023-01-22T14:00:00Z' },
    { id: 17, classEvent: 'CNY', instance: 2024, descriptionGroup: 'preparation', description: 'CNY Prep 2024', videoPath: '/videos/iphone_clip.mp4', startTime: 50, endTime: 200, metadata: { duration: 369.78, bitrate: '7390 kb/s', codec: 'h264 (High)', resolution: '888x1920', frameRate: '41.97 fps', audioCodec: 'aac (LC)', sampleRate: '44100 Hz', channels: 'stereo' }, pointers: [], createdAt: '2024-02-10T14:00:00Z', updatedAt: '2024-02-10T14:00:00Z' },
    // National Day entries
    { id: 18, classEvent: 'National Day', instance: 2023, descriptionGroup: 'celebration', description: 'Celebration 2023', videoPath: '/videos/screen_recording.mov', startTime: 200, endTime: 400, metadata: { duration: 725.73, bitrate: '2069 kb/s', codec: 'h264 (Main)', resolution: '1440x900', frameRate: '14.57 fps', audioCodec: 'aac (LC)', sampleRate: '44100 Hz', channels: 'stereo' }, pointers: [], createdAt: '2023-08-09T15:00:00Z', updatedAt: '2023-08-09T15:00:00Z' },
    { id: 19, classEvent: 'National Day', instance: 2024, descriptionGroup: 'celebration', description: 'Celebration 2024', videoPath: '/videos/iphone_clip.mp4', startTime: 100, endTime: 300, metadata: { duration: 369.78, bitrate: '7390 kb/s', codec: 'h264 (High)', resolution: '888x1920', frameRate: '41.97 fps', audioCodec: 'aac (LC)', sampleRate: '44100 Hz', channels: 'stereo' }, pointers: [], createdAt: '2024-08-09T15:00:00Z', updatedAt: '2024-08-09T15:00:00Z' }
  ]);

  const currentNoteIndex = ref(0);

  const currentNote = computed(() => notes.value[currentNoteIndex.value] || null);

  const totalNotes = computed(() => notes.value.length);

  function addNote(note: Omit<Note, 'id' | 'createdAt' | 'updatedAt'>) {
    const newNote: Note = {
      ...note,
      id: Math.max(...notes.value.map(n => n.id), 0) + 1,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    notes.value.push(newNote);
    return newNote;
  }

  function updateNote(id: number, updates: Partial<Omit<Note, 'id' | 'createdAt'>>) {
    const index = notes.value.findIndex(n => n.id === id);
    if (index !== -1) {
      notes.value[index] = {
        ...notes.value[index],
        ...updates,
        updatedAt: new Date().toISOString()
      };
    }
  }

  function deleteNote(id: number) {
    const index = notes.value.findIndex(n => n.id === id);
    if (index !== -1) {
      notes.value.splice(index, 1);
      if (currentNoteIndex.value >= notes.value.length) {
        currentNoteIndex.value = Math.max(0, notes.value.length - 1);
      }
    }
  }

  function goToNote(index: number) {
    if (index >= 0 && index < notes.value.length) {
      currentNoteIndex.value = index;
    }
  }

  function nextNote() {
    if (currentNoteIndex.value < notes.value.length - 1) {
      currentNoteIndex.value++;
    }
  }

  function prevNote() {
    if (currentNoteIndex.value > 0) {
      currentNoteIndex.value--;
    }
  }

  // Left/Right navigation: find prev/next note with same descriptionGroup
  function prevInGroup() {
    if (!currentNote.value) return;
    const currentGroup = currentNote.value.descriptionGroup;
    for (let i = currentNoteIndex.value - 1; i >= 0; i--) {
      if (notes.value[i].descriptionGroup === currentGroup) {
        currentNoteIndex.value = i;
        return;
      }
    }
  }

  function nextInGroup() {
    if (!currentNote.value) return;
    const currentGroup = currentNote.value.descriptionGroup;
    for (let i = currentNoteIndex.value + 1; i < notes.value.length; i++) {
      if (notes.value[i].descriptionGroup === currentGroup) {
        currentNoteIndex.value = i;
        return;
      }
    }
  }

  return {
    notes,
    currentNoteIndex,
    currentNote,
    totalNotes,
    addNote,
    updateNote,
    deleteNote,
    goToNote,
    nextNote,
    prevNote,
    prevInGroup,
    nextInGroup
  };
});
