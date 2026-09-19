// Fetch CSV data from file
let csvData = '';

// App state
const appState = {
  notes: [],
  currentEvent: null,
  currentYear: null,
  currentTag: null,
  currentCardIndex: 0,
  touchStartX: 0,
  touchStartY: 0,
  threshold: 50,
  editingField: null,
  editingCardId: null,
  editingValue: '',
  focusedTabBar: null // 'year' or 'tag'
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
      classEvent: row['Occasion'] || 'Unknown',
      year: row['Year'] || '2024',
      tag: row['TAG'] || 'Untagged',
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

  // Tab bar navigation
  if (appState.focusedTabBar === 'year') {
    switch (e.key) {
      case 'ArrowLeft':
      case 'h':
        navigatePrevYear();
        e.preventDefault();
        return;
      case 'ArrowRight':
      case 'l':
        navigateNextYear();
        e.preventDefault();
        return;
      case 'ArrowDown':
      case 'j':
        appState.focusedTabBar = 'tag';
        updateTabBarFocus();
        e.preventDefault();
        return;
    }
  } else if (appState.focusedTabBar === 'tag') {
    switch (e.key) {
      case 'ArrowLeft':
      case 'h':
        navigatePrevTag();
        e.preventDefault();
        return;
      case 'ArrowRight':
      case 'l':
        navigateNextTag();
        e.preventDefault();
        return;
      case 'ArrowUp':
      case 'k':
        appState.focusedTabBar = 'year';
        updateTabBarFocus();
        e.preventDefault();
        return;
      case 'ArrowDown':
      case 'j':
        appState.focusedTabBar = null;
        updateTabBarFocus();
        e.preventDefault();
        return;
    }
  }

  // Card navigation (when no tab bar focused)
  if (!appState.focusedTabBar) {
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
        navigatePrevTag();
        break;
      case 'ArrowRight':
      case 'l':
        navigateNextTag();
        break;
      case '1':
        appState.focusedTabBar = 'year';
        updateTabBarFocus();
        break;
      case '2':
        appState.focusedTabBar = 'tag';
        updateTabBarFocus();
        break;
    }
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
    if (diffX > 0) navigateNextTag();
    else navigatePrevTag();
  }
}

function showListPage() {
  document.getElementById('listPage').classList.remove('hidden');
  document.getElementById('feedPage').classList.add('hidden');
  appState.currentEvent = null;
  appState.currentYear = null;
  appState.currentTag = null;
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
  const years = [...new Set(notesForEvent.map(n => n.year))].sort();

  appState.currentYear = years[0] || null;
  appState.currentCardIndex = 0;
  renderYearTabs(years);
  updateTagTabs(notesForEvent);
  renderFeed(notesForEvent);
}

function renderYearTabs(years) {
  const yearTabsScroll = document.getElementById('yearTabsScroll');
  yearTabsScroll.innerHTML = '';

  years.forEach(year => {
    const tab = document.createElement('button');
    const isActive = year === appState.currentYear;
    tab.className = 'tab' + (isActive ? ' active' : '');
    tab.textContent = year;
    tab.addEventListener('click', () => switchYear(year));
    yearTabsScroll.appendChild(tab);
    if (isActive) {
      setTimeout(() => tab.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' }), 0);
    }
  });
}

function updateTagTabs(notesForEvent) {
  const tagsForYearOccasion = [...new Set(notesForEvent
    .filter(n => n.year === appState.currentYear)
    .map(n => n.tag))].sort();

  if (!appState.currentTag || !tagsForYearOccasion.includes(appState.currentTag)) {
    appState.currentTag = tagsForYearOccasion[0] || null;
  }

  const tagTabsScroll = document.getElementById('tagTabsScroll');
  tagTabsScroll.innerHTML = '';

  tagsForYearOccasion.forEach(tag => {
    const tab = document.createElement('button');
    const isActive = tag === appState.currentTag;
    tab.className = 'tab' + (isActive ? ' active' : '');
    tab.textContent = tag;
    tab.addEventListener('click', () => switchTag(tag));
    tagTabsScroll.appendChild(tab);
    if (isActive) {
      setTimeout(() => tab.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' }), 0);
    }
  });
}

function switchYear(year) {
  appState.currentYear = year;
  appState.currentCardIndex = 0;
  const notesForEvent = appState.notes.filter(n => n.classEvent === appState.currentEvent);
  const years = [...new Set(notesForEvent.map(n => n.year))].sort();
  renderYearTabs(years);
  updateTagTabs(notesForEvent);
  renderFeed(notesForEvent);
}

function switchTag(tag) {
  appState.currentTag = tag;
  appState.currentCardIndex = 0;
  const notesForEvent = appState.notes.filter(n => n.classEvent === appState.currentEvent);
  updateTagTabs(notesForEvent);
  renderFeed(notesForEvent);
}

function renderFeed(notesForEvent) {
  const filtered = notesForEvent.filter(n => 
    n.classEvent === appState.currentEvent && 
    n.year === appState.currentYear && 
    n.tag === appState.currentTag
  );
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
        <mux-player playbackId="${note.muxPlaybackId}" controls autoplay muted></mux-player>
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
        <div class="meta-item editable-item" data-field="tag" data-id="${note.id}">
          <div class="label-with-chip">
            <span class="label">TAG:</span>
            <span class="badge editable">editable</span>
          </div>
          <span class="value">${escapeHtml(note.tag)}</span>
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
  const filtered = notesForEvent.filter(n => 
    n.year === appState.currentYear && 
    n.tag === appState.currentTag
  );
  if (filtered.length === 0) return;
  if (appState.currentCardIndex < filtered.length - 1) {
    appState.currentCardIndex++;
  } else {
    appState.currentCardIndex = 0; // wrap around
  }
  renderFeed(notesForEvent);
  scrollCurrentCardIntoView();
}

function scrollPrevCard() {
  const notesForEvent = appState.notes.filter(n => n.classEvent === appState.currentEvent);
  const filtered = notesForEvent.filter(n => 
    n.year === appState.currentYear && 
    n.tag === appState.currentTag
  );
  if (filtered.length === 0) return;
  if (appState.currentCardIndex > 0) {
    appState.currentCardIndex--;
  } else {
    appState.currentCardIndex = filtered.length - 1; // wrap around
  }
  renderFeed(notesForEvent);
  scrollCurrentCardIntoView();
}

function navigateNextYear() {
  const notesForEvent = appState.notes.filter(n => n.classEvent === appState.currentEvent);
  const years = [...new Set(notesForEvent.map(n => n.year))].sort();
  const idx = years.indexOf(appState.currentYear);
  if (idx < years.length - 1) {
    switchYear(years[idx + 1]);
  }
}

function navigatePrevYear() {
  const notesForEvent = appState.notes.filter(n => n.classEvent === appState.currentEvent);
  const years = [...new Set(notesForEvent.map(n => n.year))].sort();
  const idx = years.indexOf(appState.currentYear);
  if (idx > 0) {
    switchYear(years[idx - 1]);
  }
}

function navigateNextTag() {
  const notesForEvent = appState.notes.filter(n => n.classEvent === appState.currentEvent);
  const tagsForYearOccasion = [...new Set(notesForEvent
    .filter(n => n.year === appState.currentYear)
    .map(n => n.tag))].sort();
  const idx = tagsForYearOccasion.indexOf(appState.currentTag);
  if (idx < tagsForYearOccasion.length - 1) {
    switchTag(tagsForYearOccasion[idx + 1]);
  }
}

function navigatePrevTag() {
  const notesForEvent = appState.notes.filter(n => n.classEvent === appState.currentEvent);
  const tagsForYearOccasion = [...new Set(notesForEvent
    .filter(n => n.year === appState.currentYear)
    .map(n => n.tag))].sort();
  const idx = tagsForYearOccasion.indexOf(appState.currentTag);
  if (idx > 0) {
    switchTag(tagsForYearOccasion[idx - 1]);
  }
}

function updatePositionBadge(filtered) {
  const current = filtered[appState.currentCardIndex];
  const badge = document.getElementById('positionBadge');
  if (current) {
    badge.textContent = `${appState.currentYear} | ${appState.currentTag} | ${appState.currentCardIndex + 1}/${filtered.length}`;
  }
}

function updateTabBarFocus() {
  const yearTabs = document.querySelectorAll('.year-tabs .tab');
  const tagTabs = document.querySelectorAll('.tag-tabs .tab');
  
  yearTabs.forEach(t => t.classList.remove('focused'));
  tagTabs.forEach(t => t.classList.remove('focused'));
  
  if (appState.focusedTabBar === 'year') {
    const activeYear = document.querySelector('.year-tabs .tab.active');
    if (activeYear) activeYear.classList.add('focused');
  } else if (appState.focusedTabBar === 'tag') {
    const activeTag = document.querySelector('.tag-tabs .tab.active');
    if (activeTag) activeTag.classList.add('focused');
  }
}

function scrollCurrentCardIntoView() {
  const currentCard = document.querySelector('.feed-card-wrapper.current');
  if (currentCard) {
    currentCard.scrollIntoView({ behavior: 'smooth', block: 'center' });
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
