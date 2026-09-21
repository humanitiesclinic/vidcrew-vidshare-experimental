// Fetch CSV data from file
let csvData = '';

// App state
const appState = {
  notes: [],
  csvHeaders: [],
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
  // Strip leading pipe (row number marker) from all lines
  const cleanLines = lines.map(l => l.startsWith('|') ? l.substring(1) : l);
  // Detect delimiter: check if first line has pipe or comma
  const firstLine = cleanLines[0];
  const delimiter = firstLine.includes('|') ? '|' : ',';
  const headers = firstLine.split(delimiter).map(h => h.trim());
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
  
  // Destroy old players before clearing DOM
  Object.keys(playerCache).forEach(videoId => {
    if (playerCache[videoId]) {
      playerCache[videoId].dispose();
      delete playerCache[videoId];
    }
  });
  
  content.innerHTML = '';

  filtered.forEach((note, idx) => {
    const card = createNoteCard(note);
    const wrapper = document.createElement('div');
    wrapper.className = 'feed-card-wrapper' + (idx === appState.currentCardIndex ? ' current' : '');
    wrapper.appendChild(card);
    content.appendChild(wrapper);
  });

  updatePositionBadge(filtered);
  
  // Initialize Video.js players for all visible cards
  filtered.forEach((note, idx) => {
    initializeVideoPlayer(note, idx === appState.currentCardIndex);
  });
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
