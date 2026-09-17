// Fetch CSV data from file
let csvData = '';

// App state
const appState = {
  notes: [],
  currentEvent: null,
  currentInstance: null,
  currentCardIndex: 0,
  touchStartX: 0,
  touchStartY: 0,
  threshold: 50,
  editingField: null,
  editingCardId: null,
  editingValue: ''
};

// Parse CSV to notes
function parseCSV(csv) {
  const lines = csv.trim().split('\n');
  const headers = lines[0].split(',').map(h => h.trim());
  const notes = [];
  let id = 1;

  for (let i = 1; i < lines.length; i++) {
    const line = lines[i];
    if (!line.trim()) continue;

    const cells = parseCSVLine(line);
    const row = {};
    headers.forEach((h, idx) => {
      row[h] = cells[idx] ? cells[idx].trim() : '';
    });

    // Only include rows with Mux Asset ID
    if (!row['Mux Asset ID']) continue;

    const durationStr = row['duration'] || '00:00:00';
    const [dh, dm, ds] = durationStr.split(':').map(Number);
    const duration = dh * 3600 + dm * 60 + ds;

    const startTimeStr = row['start_time'] || '00:00:00';
    const [sh, sm, ss] = startTimeStr.split(':').map(Number);
    const startTime = sh * 3600 + sm * 60 + ss;

    const endTimeStr = row['end_time'] || '00:00:00';
    const [eh, em, es] = endTimeStr.split(':').map(Number);
    const endTime = eh * 3600 + em * 60 + es;

    const note = {
      id: id++,
      classEvent: row['Event'] || 'Unknown',
      instance: 2024, // Extract year from start_date or use default
      descriptionGroup: row['TAG'] || 'Untagged',
      description: row['CUE'] || row['TAG'] || 'No description',
      videoPath: row['Full File Path'] || '',
      muxPlaybackId: row['Mux Playback ID'] || '',
      startTime: startTime,
      endTime: endTime,
      metadata: {
        duration: duration,
        resolution: '1920x1080',
        codec: 'h264',
        frameRate: '30 fps',
        bitrate: '5000 kb/s',
        audioCodec: 'aac',
        sampleRate: '48000 Hz',
        channels: 'stereo'
      },
      createdAt: new Date().toISOString()
    };

    notes.push(note);
  }

  return notes;
}

function parseCSVLine(line) {
  const cells = [];
  let current = '';
  let inQuotes = false;

  for (let i = 0; i < line.length; i++) {
    const char = line[i];

    if (char === '"') {
      inQuotes = !inQuotes;
    } else if (char === ',' && !inQuotes) {
      cells.push(current);
      current = '';
    } else {
      current += char;
    }
  }
  cells.push(current);
  return cells;
}

// Helpers
function formatTime(seconds) {
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}:${secs.toString().padStart(2, '0')}`;
}

function formatDate(dateStr) {
  if (!dateStr) return 'N/A';
  return new Date(dateStr).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });
}

// Init
window.addEventListener('DOMContentLoaded', async () => {
  try {
    const response = await fetch('data.csv');
    csvData = await response.text();
    appState.notes = parseCSV(csvData);
    renderListPage();
    setupEventListeners();
  } catch (err) {
    console.error('Failed to load CSV:', err);
    document.body.innerHTML = '<p>Error loading data. Make sure data.csv is in the same folder.</p>';
  }
});

function setupEventListeners() {
  document.getElementById('backBtn').addEventListener('click', showListPage);
  window.addEventListener('keydown', handleKeyDown);
  window.addEventListener('touchstart', handleTouchStart);
  window.addEventListener('touchend', handleTouchEnd);
}

function handleKeyDown(e) {
  if (!appState.currentEvent) return;

  switch (e.key) {
    case 'ArrowUp':
    case 'k':
      scrollPrevCard();
      break;
    case 'ArrowDown':
    case 'j':
      scrollNextCard();
      break;
    case 'ArrowLeft':
    case 'h':
      navigatePrevInstance();
      break;
    case 'ArrowRight':
    case 'l':
      navigateNextInstance();
      break;
  }
}

function handleTouchStart(e) {
  if (!e.touches[0]) return;
  appState.touchStartX = e.touches[0].clientX;
  appState.touchStartY = e.touches[0].clientY;
}

function handleTouchEnd(e) {
  if (!e.changedTouches[0]) return;
  const touchEndX = e.changedTouches[0].clientX;
  const touchEndY = e.changedTouches[0].clientY;
  const diffX = appState.touchStartX - touchEndX;
  const diffY = appState.touchStartY - touchEndY;
  const absX = Math.abs(diffX);
  const absY = Math.abs(diffY);

  if (absX > absY && absX > appState.threshold) {
    if (diffX > 0) navigateNextInstance();
    else navigatePrevInstance();
  }
}

function showListPage() {
  document.getElementById('listPage').classList.remove('hidden');
  document.getElementById('feedPage').classList.add('hidden');
  appState.currentEvent = null;
  appState.currentInstance = null;
}

function renderListPage() {
  const eventClasses = new Map();

  appState.notes.forEach(note => {
    if (!eventClasses.has(note.classEvent)) {
      eventClasses.set(note.classEvent, { name: note.classEvent, count: 0 });
    }
    eventClasses.get(note.classEvent).count++;
  });

  const sorted = Array.from(eventClasses.values()).sort((a, b) =>
    a.name.localeCompare(b.name)
  );

  const grid = document.getElementById('classesGrid');
  grid.innerHTML = '';

  sorted.forEach(cls => {
    const card = document.createElement('div');
    card.className = 'class-card';
    card.innerHTML = `
      <div class="card-content">
        <h2 class="class-name">${escapeHtml(cls.name)}</h2>
        <p class="card-count">${cls.count} cards</p>
      </div>
    `;
    card.addEventListener('click', () => showFeedPage(cls.name));
    grid.appendChild(card);
  });
}

function showFeedPage(eventClass) {
  appState.currentEvent = eventClass;
  document.getElementById('eventTitle').textContent = eventClass;
  document.getElementById('listPage').classList.add('hidden');
  document.getElementById('feedPage').classList.remove('hidden');

  const notesForEvent = appState.notes.filter(n => n.classEvent === eventClass);
  const instances = [...new Set(notesForEvent.map(n => n.instance))].sort((a, b) => a - b);

  appState.currentInstance = instances[0] || null;
  renderTabs(instances);
  renderFeed(notesForEvent);
}

function renderTabs(instances) {
  const tabsScroll = document.getElementById('tabsScroll');
  tabsScroll.innerHTML = '';

  instances.forEach(instance => {
    const tab = document.createElement('button');
    tab.className = 'tab' + (instance === appState.currentInstance ? ' active' : '');
    tab.textContent = instance;
    tab.addEventListener('click', () => switchInstance(instance));
    tabsScroll.appendChild(tab);
  });
}

function switchInstance(instance) {
  appState.currentInstance = instance;
  appState.currentCardIndex = 0;
  renderTabs([...new Set(appState.notes
    .filter(n => n.classEvent === appState.currentEvent)
    .map(n => n.instance))].sort((a, b) => a - b));
  renderFeed(appState.notes.filter(n => n.classEvent === appState.currentEvent));
}

function renderFeed(notesForEvent) {
  const filtered = notesForEvent.filter(n => n.instance === appState.currentInstance);
  const content = document.getElementById('feedContent');
  content.innerHTML = '';

  filtered.forEach((note, idx) => {
    const card = createNoteCard(note);
    const wrapper = document.createElement('div');
    wrapper.className = 'feed-card-wrapper' + (idx === appState.currentCardIndex ? ' current' : '');
    wrapper.appendChild(card);
    content.appendChild(wrapper);
  });

  updatePositionBadge(filtered);
}

function createNoteCard(note) {
  const card = document.createElement('div');
  card.className = 'note-card';
  card.innerHTML = `
    <div class="video-container">
      ${note.muxPlaybackId ? `
        <mux-player playback-id="${note.muxPlaybackId}" controls autoplay muted></mux-player>
      ` : `
        <video controls autoplay muted>
          <source src="${note.videoPath}" type="video/mp4">
        </video>
      `}
    </div>
    <div class="metadata-section">
      <h2 class="description">${escapeHtml(note.description)}</h2>
      <div class="metadata-grid">
        <div class="meta-item editable-item" data-field="classEvent" data-id="${note.id}">
          <div class="label-with-chip">
            <span class="label">Class Event:</span>
            <span class="badge editable">editable</span>
          </div>
          <span class="value">${escapeHtml(note.classEvent)}</span>
        </div>
        <div class="meta-item editable-item" data-field="descriptionGroup" data-id="${note.id}">
          <div class="label-with-chip">
            <span class="label">Description Group:</span>
            <span class="badge editable">editable</span>
          </div>
          <span class="value">${escapeHtml(note.descriptionGroup)}</span>
        </div>
        <div class="meta-item editable-item" data-field="startTime" data-id="${note.id}">
          <div class="label-with-chip">
            <span class="label">Start Time:</span>
            <span class="badge editable">editable</span>
          </div>
          <span class="value">${formatTime(note.startTime)}</span>
        </div>
        <div class="meta-item">
          <div class="label-with-chip">
            <span class="label">Duration:</span>
            <span class="badge readonly">read-only</span>
          </div>
          <span class="value">${formatTime(note.metadata.duration)}</span>
        </div>
        <div class="meta-item">
          <div class="label-with-chip">
            <span class="label">Resolution:</span>
            <span class="badge readonly">read-only</span>
          </div>
          <span class="value">${note.metadata.resolution}</span>
        </div>
        <div class="meta-item">
          <div class="label-with-chip">
            <span class="label">Codec:</span>
            <span class="badge readonly">read-only</span>
          </div>
          <span class="value">${note.metadata.codec}</span>
        </div>
      </div>
    </div>
  `;

  card.querySelectorAll('.editable-item').forEach(item => {
    item.addEventListener('click', () => {
      const field = item.dataset.field;
      const id = item.dataset.id;
      const note = appState.notes.find(n => n.id === parseInt(id));
      if (note) startEdit(item, field, note);
    });
  });

  return card;
}

function startEdit(element, field, note) {
  const valueSpan = element.querySelector('.value');
  const currentValue = valueSpan.textContent;
  valueSpan.contentEditable = 'true';
  valueSpan.focus();

  const finishEdit = () => {
    valueSpan.contentEditable = 'false';
    const newValue = valueSpan.textContent;
    if (newValue !== currentValue) {
      note[field] = newValue;
    }
    valueSpan.removeEventListener('blur', finishEdit);
    valueSpan.removeEventListener('keydown', handleEditKeydown);
  };

  const handleEditKeydown = (e) => {
    if (e.key === 'Enter') finishEdit();
    if (e.key === 'Escape') {
      valueSpan.textContent = currentValue;
      finishEdit();
    }
  };

  valueSpan.addEventListener('blur', finishEdit);
  valueSpan.addEventListener('keydown', handleEditKeydown);
}

function scrollNextCard() {
  const notesForEvent = appState.notes.filter(n => n.classEvent === appState.currentEvent);
  const filtered = notesForEvent.filter(n => n.instance === appState.currentInstance);
  if (appState.currentCardIndex < filtered.length - 1) {
    appState.currentCardIndex++;
    renderFeed(notesForEvent);
  }
}

function scrollPrevCard() {
  if (appState.currentCardIndex > 0) {
    appState.currentCardIndex--;
    const notesForEvent = appState.notes.filter(n => n.classEvent === appState.currentEvent);
    renderFeed(notesForEvent);
  }
}

function navigateNextInstance() {
  const instances = [...new Set(appState.notes
    .filter(n => n.classEvent === appState.currentEvent)
    .map(n => n.instance))].sort((a, b) => a - b);
  const idx = instances.indexOf(appState.currentInstance);
  if (idx < instances.length - 1) {
    switchInstance(instances[idx + 1]);
  }
}

function navigatePrevInstance() {
  const instances = [...new Set(appState.notes
    .filter(n => n.classEvent === appState.currentEvent)
    .map(n => n.instance))].sort((a, b) => a - b);
  const idx = instances.indexOf(appState.currentInstance);
  if (idx > 0) {
    switchInstance(instances[idx - 1]);
  }
}

function updatePositionBadge(filtered) {
  const current = filtered[appState.currentCardIndex];
  const badge = document.getElementById('positionBadge');
  if (current) {
    badge.textContent = `${appState.currentInstance} | ${current.descriptionGroup}`;
  }
}

function escapeHtml(text) {
  const map = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#039;'
  };
  return text.replace(/[&<>"']/g, m => map[m]);
}
