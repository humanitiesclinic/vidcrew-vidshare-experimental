// Fetch CSV data from file
let csvData = '';

// App state
const appState = {
  notes: [],
  csvHeaders: [],
  currentEvent: null,
  dimensions: [], // Dynamic list of dimensions (Year, TAG, SN, etc.)
  filters: {}, // Current filter values: { Year: '2025', TAG: 'tag1', SN: '5', cardPos: 1 }
  currentCardIndex: 0,
  touchStartX: 0,
  touchStartY: 0,
  threshold: 50,
  editingField: null,
  editingCardId: null,
  editingValue: '',
  focusedDimensionIdx: null // Index of currently focused dimension for keyboard navigation
};

// Parse CSV to notes
function parseCSV(csv) {
  const lines = csv.trim().split('\n');
  // Strip leading pipe (row number marker) from all lines
  const cleanLines = lines.map(l => l.startsWith('|') ? l.substring(1) : l);
  // Detect delimiter: check if first line has pipe or comma
  const firstLine = cleanLines[0];
  const delimiter = firstLine.includes('|') ? '|' : ',';
  const headers = parseCSVLine(firstLine, delimiter).map(h => h.trim());
  appState.csvHeaders = headers; // Store headers for dynamic rendering
  const notes = [];
  let id = 1;

  for (let i = 1; i < cleanLines.length; i++) {
    const line = cleanLines[i];
    if (!line.trim()) continue;

    const cells = parseCSVLine(line, delimiter);
    const row = {};
    headers.forEach((h, idx) => {
      row[h] = cells[idx] ? cells[idx].trim() : '';
    });

    // Only include rows with Mux Asset ID
    if (!row['Mux Asset ID']) continue;

    const durationStr = row['duration'] || '00:00:00';
    const [dh, dm, ds] = durationStr.split(':').map(Number);
    const duration = dh * 3600 + dm * 60 + ds;

    const startTimeStr = row['segment_start_timecode'] || '00:00:00';
    const [sh, sm, ss] = startTimeStr.split(':').map(Number);
    const startTime = sh * 3600 + sm * 60 + ss;

    const endTimeStr = row['segment_end_timecode'] || '00:00:00';
    const [eh, em, es] = endTimeStr.split(':').map(Number);
    const endTime = eh * 3600 + em * 60 + es;

    const note = {
      id: id++,
      classEvent: row['Occasion'] || 'Unknown',
      year: row['Year'] || '2024',
      tag: row['TAG'] || 'Untagged',
      videoPath: row['Full File Path'] || '',
      muxPlaybackId: row['Mux Playback ID'] || '',
      muxCaptionId: row['Mux Caption ID'] || '',
      startTime: startTime,
      endTime: endTime,
      csvData: row, // Store all CSV row data for dynamic rendering
      createdAt: new Date().toISOString()
    };

    notes.push(note);
  }

  return notes;
}

function parseCSVLine(line, delimiter = ',') {
  const cells = [];
  let current = '';
  let inQuotes = false;

  for (let i = 0; i < line.length; i++) {
    const char = line[i];

    if (char === '"') {
      inQuotes = !inQuotes;
    } else if (char === delimiter && !inQuotes) {
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

  const notesForEvent = appState.notes.filter(n => n.classEvent === appState.currentEvent);
  const filtered = notesForEvent.filter(n => {
    return n.classEvent === appState.currentEvent && 
           appState.dimensions.every(dim => n.csvData[dim.field] === appState.filters[dim.field]);
  });

  // Dimension gear navigation
  if (appState.focusedDimensionIdx !== null) {
    const dimIdx = appState.focusedDimensionIdx;
    const dim = appState.dimensions[dimIdx];
    const values = [...new Set(notesForEvent.map(n => n.csvData[dim.field]))].filter(Boolean).sort();
    const currentVal = appState.filters[dim.field];
    const currentIdx = values.indexOf(currentVal);

    switch (e.key) {
      case 'ArrowLeft':
      case 'h':
        if (currentIdx > 0) {
          appState.filters[dim.field] = values[currentIdx - 1];
          appState.currentCardIndex = 0;
          appState.filters.cardPos = 1;
          renderDynamicTabBars();
          renderSingleCard(notesForEvent);
        }
        e.preventDefault();
        return;
      case 'ArrowRight':
      case 'l':
        if (currentIdx < values.length - 1) {
          appState.filters[dim.field] = values[currentIdx + 1];
          appState.currentCardIndex = 0;
          appState.filters.cardPos = 1;
          renderDynamicTabBars();
          renderSingleCard(notesForEvent);
        }
        e.preventDefault();
        return;
      case 'ArrowUp':
      case 'k':
        if (dimIdx > 0) appState.focusedDimensionIdx--;
        else appState.focusedDimensionIdx = null;
        updateDimensionFocus();
        e.preventDefault();
        return;
      case 'ArrowDown':
      case 'j':
        if (dimIdx < appState.dimensions.length - 1) appState.focusedDimensionIdx++;
        else appState.focusedDimensionIdx = null;
        updateDimensionFocus();
        e.preventDefault();
        return;
    }
  }

  // Card navigation (when no dimension focused)
  if (appState.focusedDimensionIdx === null) {
    switch (e.key) {
      case 'ArrowUp':
      case 'k':
        if (appState.currentCardIndex > 0) {
          appState.currentCardIndex--;
          appState.filters.cardPos = appState.currentCardIndex + 1;
          renderSingleCard(notesForEvent);
        }
        e.preventDefault();
        break;
      case 'ArrowDown':
      case 'j':
        if (appState.currentCardIndex < filtered.length - 1) {
          appState.currentCardIndex++;
          appState.filters.cardPos = appState.currentCardIndex + 1;
          renderSingleCard(notesForEvent);
        }
        e.preventDefault();
        break;
      case '1':
      case '2':
      case '3':
      case '4':
        const dimIdx = parseInt(e.key) - 1;
        if (dimIdx < appState.dimensions.length) {
          appState.focusedDimensionIdx = dimIdx;
          updateDimensionFocus();
        }
        e.preventDefault();
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
  initializeDimensions(notesForEvent);
  appState.currentCardIndex = 0;
  appState.focusedDimensionIdx = null;
  renderDynamicTabBars();
  renderSingleCard(notesForEvent);
}

function initializeDimensions(notesForEvent) {
  // Define dimensions: Occasion, Year, TAG, SN - all should be filterable
  const dimensionFields = ['Occasion', 'Year', 'TAG', 'SN'];
  appState.dimensions = dimensionFields.map(field => ({ field, name: field }));
  
  // Initialize filters with first available value for each dimension
  appState.filters = {};
  appState.dimensions.forEach(dim => {
    const values = [...new Set(notesForEvent.map(n => n.csvData[dim.field]))].filter(Boolean).sort();
    appState.filters[dim.field] = values[0] || null;
  });
  
  // cardPos is special: it's the position within filtered results (1-indexed)
  appState.filters.cardPos = 1;
}

function renderDynamicTabBars() {
  const notesForEvent = appState.notes.filter(n => n.classEvent === appState.currentEvent);
  const container = document.getElementById('tabBarsContainer');
  container.innerHTML = '';
  
  appState.dimensions.forEach((dim, dimIdx) => {
    const barDiv = document.createElement('div');
    barDiv.className = 'tab-bar dimension-bar';
    barDiv.dataset.dimIdx = dimIdx;
    
    const label = document.createElement('span');
    label.className = 'tab-label';
    label.textContent = dim.name + ':';
    barDiv.appendChild(label);
    
    const tabsScroll = document.createElement('div');
    tabsScroll.className = 'tabs-scroll';
    
    // Get unique values for this dimension from filtered notes
    const values = [...new Set(notesForEvent.map(n => n.csvData[dim.field]))].filter(Boolean).sort();
    
    values.forEach(value => {
      const tab = document.createElement('button');
      const isActive = value === appState.filters[dim.field];
      tab.className = 'tab' + (isActive ? ' active' : '');
      tab.textContent = value;
      tab.addEventListener('click', () => {
        appState.filters[dim.field] = value;
        appState.currentCardIndex = 0;
        appState.filters.cardPos = 1;
        renderDynamicTabBars();
        renderSingleCard(notesForEvent);
      });
      tabsScroll.appendChild(tab);
      
      if (isActive) {
        setTimeout(() => tab.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' }), 0);
      }
    });
    
    barDiv.appendChild(tabsScroll);
    container.appendChild(barDiv);
  });
}

function renderSingleCard(notesForEvent) {
  // Filter based on current filters
  const filtered = notesForEvent.filter(n => {
    return n.classEvent === appState.currentEvent && 
           appState.dimensions.every(dim => n.csvData[dim.field] === appState.filters[dim.field]);
  });
  
  const content = document.getElementById('feedContent');
  
  // Destroy old player
  Object.keys(playerCache).forEach(videoId => {
    if (playerCache[videoId]) {
      playerCache[videoId].dispose();
      delete playerCache[videoId];
    }
  });
  
  content.innerHTML = '';
  
  if (filtered.length === 0) {
    content.innerHTML = '<p style="padding: 20px; color: #999;">No cards match current filters</p>';
    updatePositionBadge([]);
    return;
  }
  
  // Ensure currentCardIndex is within bounds
  appState.currentCardIndex = Math.min(appState.currentCardIndex, filtered.length - 1);
  appState.filters.cardPos = appState.currentCardIndex + 1;
  
  const note = filtered[appState.currentCardIndex];
  const card = createNoteCard(note);
  const wrapper = document.createElement('div');
  wrapper.className = 'feed-card-wrapper current';
  wrapper.appendChild(card);
  content.appendChild(wrapper);
  
  updatePositionBadge(filtered);
  initializeVideoPlayer(note, true);
}

function createNoteCard(note) {
  const card = document.createElement('div');
  card.className = 'note-card';
  const videoId = `player-${note.id}`;
  
  // Build metadata grid from ALL CSV headers
  const metadataHtml = appState.csvHeaders
    .map(header => {
      const value = note.csvData[header] || '';
      return `
        <div class="meta-item editable-item" data-field="csvData.${header}" data-id="${note.id}">
          <div class="label-with-chip">
            <span class="label">${escapeHtml(header)}:</span>
            <span class="badge editable">editable</span>
          </div>
          <span class="value">${escapeHtml(value)}</span>
        </div>
      `;
    })
    .join('');
  
  card.innerHTML = `
    <div class="video-container">
      <video id="${videoId}" class="video-js vjs-default-skin" controls preload="auto" width="100%" height="100%">
        ${note.muxPlaybackId && note.muxCaptionId ? `<track kind="captions" src="https://stream.mux.com/${note.muxPlaybackId}/text/${note.muxCaptionId}.vtt" srclang="en" label="English" default>` : ''}
        <p class="vjs-no-js">Enable JavaScript for video playback</p>
      </video>
    </div>
    <div class="caption-list" id="caption-list-${note.id}"></div>
    <div class="metadata-section">
      <div class="metadata-grid">
        ${metadataHtml}
      </div>
    </div>
  `;

  card.querySelectorAll('.editable-item').forEach(item => {
    item.addEventListener('click', () => {
      const field = item.dataset.field;
      const id = item.dataset.id;
      const note = appState.notes.find(n => n.id === parseInt(id));
      if (note) startEdit(item, field, note, field.startsWith('csvData.'));
    });
  });

  return card;
}

function startEdit(element, field, note, isCsvField) {
  const valueSpan = element.querySelector('.value');
  const currentValue = valueSpan.textContent;
  valueSpan.contentEditable = 'true';
  valueSpan.focus();

  const finishEdit = () => {
    valueSpan.contentEditable = 'false';
    const newValue = valueSpan.textContent;
    if (newValue !== currentValue) {
      if (isCsvField) {
        const fieldName = field.replace('csvData.', '');
        note.csvData[fieldName] = newValue;
      } else {
        note[field] = newValue;
      }
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


function updatePositionBadge(filtered) {
  const badge = document.getElementById('positionBadge');
  if (filtered.length === 0) {
    badge.textContent = 'No cards';
    return;
  }
  const filterStr = appState.dimensions.map(dim => `${dim.name}: ${appState.filters[dim.field]}`).join(' | ');
  badge.textContent = `${filterStr} | Card: ${appState.currentCardIndex + 1}/${filtered.length}`;
}

function updateDimensionFocus() {
  const bars = document.querySelectorAll('.dimension-bar');
  bars.forEach((bar, idx) => {
    if (idx === appState.focusedDimensionIdx) {
      bar.classList.add('focused');
    } else {
      bar.classList.remove('focused');
    }
  });
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

// Video.js player initialization and caption loading
const playerCache = {};

function initializeVideoPlayer(note, isCurrent) {
  const videoId = `player-${note.id}`;
  const videoElement = document.getElementById(videoId);
  if (!videoElement) return;
  
  // Only initialize if not already initialized
  if (playerCache[videoId]) return;
  
  let player = videojs(videoId, {
    controls: true,
    autoplay: isCurrent,
    preload: 'auto',
    responsive: true,
    fluid: true
  });
  
  playerCache[videoId] = player;
  
  // Set HLS source for Mux
  if (note.muxPlaybackId) {
    const hlsUrl = `https://stream.mux.com/${note.muxPlaybackId}.m3u8`;
    player.src({
      src: hlsUrl,
      type: 'application/x-mpegURL'
    });
    
    // Segment control: auto-seek to start, auto-pause at end
    player.on('play', function() {
      player.currentTime(note.startTime);
    });
    
    player.on('timeupdate', function() {
      if (player.currentTime() >= note.endTime) {
        player.pause();
      }
    });
    
    // Set default playback rate to 1.5x
    player.on('loadedmetadata', function() {
      player.playbackRate(1.5);
      loadCaptionsForNote(player, note);
    });
    
    // Caption list scroll and highlight on timeupdate
    player.on('timeupdate', function() {
      updateCaptionHighlight(note, player.currentTime());
    });
  } else if (note.videoPath) {
    player.src({
      src: note.videoPath,
      type: 'video/mp4'
    });
  }
}

function loadCaptionsForNote(player, note) {
  const vttUrl = (note.muxPlaybackId && note.muxCaptionId) ? `https://stream.mux.com/${note.muxPlaybackId}/text/${note.muxCaptionId}.vtt` : '';
  const captionListEl = document.getElementById(`caption-list-${note.id}`);
  
  if (!vttUrl || !captionListEl) {
    if (captionListEl) captionListEl.innerHTML = '<p style="padding: 10px; color: #999; font-size: 12px;">No captions available</p>';
    return;
  }
  
  fetch(vttUrl)
    .then(response => response.text())
    .then(vttText => {
      const lines = vttText.split('\n');
      let i = 0;
      const allCues = [];
      
      while (i < lines.length) {
        const line = lines[i].trim();
        
        if (line.includes('-->')) {
          const [startStr, endStr] = line.split('-->').map(t => t.trim());
          const start = timeToSeconds(startStr);
          const end = timeToSeconds(endStr);
          
          i++;
          let text = '';
          while (i < lines.length && lines[i].trim() !== '') {
            text += lines[i].trim() + ' ';
            i++;
          }
          
          if (text.trim()) {
            allCues.push({ start, end, text: text.trim() });
          }
        }
        i++;
      }
      
      // Store cues on note for highlight function
      note.cues = allCues;
      
      if (allCues.length > 0) {
        captionListEl.innerHTML = '';
        allCues.forEach((cue, idx) => {
          const item = document.createElement('div');
          item.className = 'caption-item';
          const overlapsSegment = cue.end > note.startTime && cue.start < note.endTime;
          if (overlapsSegment) item.classList.add('in-segment');
          item.id = `caption-${note.id}-${idx}`;
          item.innerHTML = `
            <div class="caption-time">${formatTimeExtended(cue.start)} → ${formatTimeExtended(cue.end)}</div>
            <div class="caption-text">${escapeHtml(cue.text)}</div>
          `;
          item.addEventListener('click', () => {
            player.currentTime(cue.start);
            player.play();
          });
          captionListEl.appendChild(item);
        });
      } else {
        captionListEl.innerHTML = '<p style="padding: 10px; color: #999; font-size: 12px;">No captions found</p>';
      }
    })
    .catch(err => {
      console.error('Error loading captions:', err);
      if (captionListEl) captionListEl.innerHTML = '<p style="padding: 10px; color: #999; font-size: 12px;">Error loading captions</p>';
    });
}

function updateCaptionHighlight(note, currentTime) {
  if (!note.cues) return;
  
  const captionListEl = document.getElementById(`caption-list-${note.id}`);
  if (!captionListEl) return;
  
  // Remove all active classes
  captionListEl.querySelectorAll('.caption-item').forEach(item => item.classList.remove('active'));
  
  // Find matching cue and highlight
  note.cues.forEach((cue, idx) => {
    if (currentTime >= cue.start && currentTime < cue.end) {
      const item = document.getElementById(`caption-${note.id}-${idx}`);
      if (item) {
        item.classList.add('active');
        item.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      }
    }
  });
}

function timeToSeconds(timeStr) {
  const parts = timeStr.split(':');
  const hours = parseInt(parts[0]) || 0;
  const minutes = parseInt(parts[1]) || 0;
  const seconds = parseFloat(parts[2]) || 0;
  return hours * 3600 + minutes * 60 + seconds;
}

function formatTimeExtended(seconds) {
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = Math.floor(seconds % 60);
  return `${h > 0 ? h + ':' : ''}${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
}
