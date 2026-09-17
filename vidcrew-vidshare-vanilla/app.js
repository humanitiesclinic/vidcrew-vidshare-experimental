// CSV data (paste content here or load dynamically)
const csvData = `SN,Book,Page,Slot,Event,TAG,CUE,Mux Upload Comments,Mux Asset ID,Mux Playback ID,Mux Caption ID,Full File Path,start_date,start_time,end_date,end_time,duration,absolute_path . only for corrob. delete if correct,Date,Time - Start,Time - End,,,,,mapping to the exact NTDs. as of now only from \`__agenda for BD2026, CN2026, SAn2026, haircut etc.txt\`,ORIGIN FILE,,
1183,SD1,,1-6,BD2024+CN2024 (4outshows),angbao giving - we talk,,402KoC81oh5JUcasJtZJgUM3UWL9jl1OQeaa3qhY2NYA,402KoC81oh5JUcasJtZJgUM3UWL9jl1OQeaa3qhY2NYA,eTCawVAMtLXUn4GlLKnxtbZNvyuPw7BrGPCnjLoDBgc,rjob_M3gUYl00oYaDyH2ITC30200tviXYYd5hOuXs35XYpIcg9mqBShnlcXo1Pxnkvy68rFA8tSKyAKpcaY,/Volumes/Untitled 1/private/M4ROOT/CLIP/20240701_JPN1797.MP4,,,,,,,,,,,,,,,,,
1328,SD1,,1-2,BD2024+CN2024 (4outshows) - Countdown Show,speaking - imp - so X year has just given way to Y year,,A,Aa01KDsyxFFZg6fyG3Z6rWeCldEgr1lPK3bGUdg1fjcY,mPUVTc4h0201OwpC1gAedYB700kwGGdQetJCD0200p8qlgl4,N3FBPaNP1HdKLh009yJosgGwopRdtZT3jW01xeGzFT4sK5EkbiBSabwA,/Volumes/Untitled 1/PRIVATE/M4ROOT/CLIP/20240704_JPN1869.MP4,2024-07-04,03:40:50,2024-07-04,03:46:26,00:05:36,,,,,,,,,,,,
1332,SD1,,1-2,BD2024+CN2024 (4outshows) - Countdown Show,speaking - imp - so X year has just given way to Y year,,A,T2gnN00ikzb0100t3GJjVNJvs00WRP6bIPSvgKtb9Z1Yv4s,yvkETrLm02mcTRDMt9Ta5o1moFgUJ74lUJKQ4x1a4h00s,Q2UUO7sxkG4zbrLfFJ7ilvjyPp4LyvLELhAgWx5r7CSJbi6qcjHiog,/Volumes/Untitled 1/PRIVATE/M4ROOT/CLIP/20240704_JPN1871.MP4,2024-07-04,04:00:38,2024-07-04,04:07:15,00:06:37,,,,,,,,,,,,
1334,SD1,,1-2,BD2024+CN2024 (4outshows) - Countdown Show,speaking - imp - so X year has just given way to Y year,,A,jSC9rG2glHiX502lAeJArAdZ01ITjIeae73xlwDuW3Tss,Sc0002gQ01RcumcrH01HCytWYi1FD9h4ZOH2ohw02cZsokrE,HlAVmmlwI5NidJO8Iju02CPXgpUFTNidVzXO00jE1rpeSYag9101w1Y8w,/Volumes/Untitled 1/PRIVATE/M4ROOT/CLIP/20240704_JPN1872.MP4,2024-07-04,04:07:47,2024-07-04,04:10:35,00:02:48,,,,,,,,,,,,
1336,SD1,,1-2,BD2024+CN2024 (4outshows) - Countdown Show,speaking - imp - where the coutndown is today VS last time,,A,vbyvcqTFwKOf00V3X7SzEqppxnStVZC2h3mzSlmVk5Ck,802SbBKzI01FVCatYKOanoPTnc3yGb8Tc3S1YAWYgACz4,h8jnfgdAK4o2qI9UrkZSycAL6Tq01eSaS4aNgvzPuTaiLAiwzdGnm1w,/Volumes/Untitled 1/PRIVATE/M4ROOT/CLIP/20240704_JPN1873.MP4,2024-07-04,04:19:25,2024-07-04,04:25:33,00:06:08,,,,,,,,,,,,
1347,SD1,,1-2,BD2024+CN2024 (4outshows) - Countdown Show,show - imp part - end of show PLUS speaking - imp - so X year has just given way to Y year PLUS CN and BD coincide since 2013 and not again until 2043,,A,O3Sp2l2SKLEfBQ022pISXbKx024KqPkkktckAFcPTN1js,fjLtLGWtJQPH202QKn6pzFn2W5xPCKnPpLs8aBljpWA4,7abTJoFlukT11o213T00HaXvsPRq1YUuyG01ltlQXf8g2RziZdRxkTcA,/Volumes/Untitled 1/PRIVATE/M4ROOT/CLIP/20240704_JPN1878.MP4,2024-07-04,04:59:15,2024-07-04,05:07:20,00:08:05,,,,,,,,,,,,
1353,SD1,,1-2,BD2024+CN2024 (4outshows) - Countdown Show,(speaking - imp),,A,rlkOceSd2B60002VEEMme01nsvZ9ViXhxx4Eu8mPOKQpEg,2YhYma101HekCY6d6kusfLDUl1NIGQePLpspt7nk7vAk,xgzbhzGDXiMm9aaRutEX2JST01hEJcARm6hK4W6Dgqm02nXmW5028r02tA,/Volumes/Untitled 1/PRIVATE/M4ROOT/CLIP/20240704_JPN1881.MP4,2024-07-04,05:55:42,2024-07-04,06:03:21,00:07:39,,,,,,,,,,,,
1355,SD1,,1-2,BD2024+CN2024 (4outshows) - Countdown Show,(speaking - imp),,A,uo6DSbH02NedRQUqd01mijR5CqB8QG5OoXoCfMY9IcajI,db02g4ZnkyKLrZsenZc00rdUgHb3JsnWXoQZXosT5z6Cc,5JqFZqGnfulZvcRkI6o018mHX26UBVvoU102Njyixc8ajvhj4Bw00uMMQ,/Volumes/Untitled 1/PRIVATE/M4ROOT/CLIP/20240704_JPN1882.MP4,2024-07-04,06:10:19,2024-07-04,06:10:58,00:00:39,,,,,,,,,,,,
1310,SD1,,1-2,BD2024+CN2024 (4outshows) - Countdown Show,show - imp part - cai shen dao part after countdown,,B,FztcrShJotTIV01tNirhNuorRyAhuYajclIdT9yBR8W4,1pqGtB902D1R00jwz02PFh3iyEwLNNLzqM6wBavP81lz4Q,At84YjKbeckH2n02W3rVHSUZKelSzQcVeDUsT02QTMpexcaK17zFM9qA,/Volumes/Untitled 1/PRIVATE/M4ROOT/CLIP/20240704_JPN1860.MP4,2024-07-04,02:12:39,2024-07-04,02:15:48,00:03:09,,,,,,,,,,,,
1312,SD1,,1-2,BD2024+CN2024 (4outshows) - Countdown Show,show - imp part - cai shen dao part after countdown,,B,a02DupqwZdq6PlTd386HAIn2i1ISWQUhaX6ZXpBF2w2g,3uAuEuDJNqNx1ebCUqjZFUuOd811lMtL8qXvdnJTlMo,O00cPL00u9x1hYwNDGwOIe02GVksgODCXk4c02UHfpcNKIML8L2GcHvV4Q,/Volumes/Untitled 1/PRIVATE/M4ROOT/CLIP/20240704_JPN1861.MP4,2024-07-04,02:23:00,2024-07-04,02:25:46,00:02:46,,,,,,,,,,,,
1314,SD1,,1-2,BD2024+CN2024 (4outshows) - Countdown Show,show - imp part - performance of this year's CNY song,,B,01wux2Yzo4IkKyFVQYawq8TrA2451NPhWgzk77z78AwM,DJ97QO4ND8UfJXLx0001sin7CFJ7cMwGn6LOOgaAZWdQA,YoNiwGdQ26Tzw8yAERqmPdm01R6NbMPc8MWkWkJKxg4aRf5LnYbxFqQ,/Volumes/Untitled 1/PRIVATE/M4ROOT/CLIP/20240704_JPN1862.MP4,2024-07-04,02:30:25,2024-07-04,02:33:23,00:02:58,,,,,,,,,,,,
1316,SD1,,1-2,BD2024+CN2024 (4outshows) - Countdown Show,show - imp part - yun shi - horse,,B,017y01neSOurOzEUUrt2ICK89ip1Cg4sTJy01lDZRaRbDA,CzxS7F4uTFGajxCSvrwF1QSX7ng01dayqI9UUNx02wSnk,WX00AgUFTIMZYNgut1Z94hwMrhCVlKU9Fchw77sdPaqFE7sP6Ik6HqQ,/Volumes/Untitled 1/PRIVATE/M4ROOT/CLIP/20240704_JPN1863.MP4,2024-07-04,02:36:56,2024-07-04,02:44:56,00:08:00,,,,,,,,,,,,
1318,SD1,,1-2,BD2024+CN2024 (4outshows) - Countdown Show,show - imp part - ending skit,,B,CjG4mMlzMWiHsPc3rgT00KIzvHwIE1svk0100jtrVQlBbw,Jjb78CsnKMNzaR2hu00D565WN02ZM4xJxvfC1K4fJO5fc,pxsw85bRHFkcmKynv9bE7WGtEaDULipRmwS9N9Gdy01eda012V3xLHhg,/Volumes/Untitled 1/PRIVATE/M4ROOT/CLIP/20240704_JPN1864.MP4,2024-07-04,02:45:52,2024-07-04,02:49:06,00:03:14,,,,,,,,,,,,
1320,SD1,,1-2,BD2024+CN2024 (4outshows) - Countdown Show,show - imp part - ending skit,,B,IYEzgtHC7bgYovKXB8lkO57isYkYFmHDPSoI02ucxhtU,EWAJ9kyfXbautVq02IEXN4w9V017QFZoA1cMItRUZSj9c,o025t8NsQCkPcSKyG3H00TCxDDexQvyJgSIE02YbQKgmubNFxfu1Xa7VQ,/Volumes/Untitled 1/PRIVATE/M4ROOT/CLIP/20240704_JPN1865.MP4,2024-07-04,02:50:36,2024-07-04,02:51:14,00:00:38,,,,,,,,,,,,
1324,SD1,,1-2,BD2024+CN2024 (4outshows) - Countdown Show,show - imp part - end of show,,B,tKcOecxpl702TG7lVrI02hWyVUyXrUt4LhQyPewknhX3w,5UYNDvBbaXCP7JrfdR8EiXHsNNGwgwBAhGY6n7edFYc,QuSIersMvv00xIqY8YjA200N83GwJ012hdx8rMWrfX4cT00QJ3n9GjXTYQ,/Volumes/Untitled 1/PRIVATE/M4ROOT/CLIP/20240704_JPN1867.MP4,2024-07-04,03:20:48,2024-07-04,03:26:09,00:05:21,,,,,,,,,,,,
1330,SD1,,1-2,BD2024+CN2024 (4outshows) - Countdown Show,show - imp part,,B,tWi6Dou3Braqw00fJCqTI01mSOuBwt2IdXzSXGAfJ6qW8,Lp00wcj9sbzjUkP1cHwtzoMPahA9cnwYEPsLQpTOlLCY,xZJZuNUNxKSMedf00wmybQnmrjwQJHjCEGvZyTShiCSMJms21MGNf5g,/Volumes/Untitled 1/PRIVATE/M4ROOT/CLIP/20240704_JPN1870.MP4,2024-07-04,03:56:05,2024-07-04,03:56:43,00:00:38,,,,,,,,,,,,
1286,SD1,,1-2,MUBD2024 (4outshows),,,x,,,,/Volumes/Untitled 1/PRIVATE/M4ROOT/CLIP/20240703_JPN1848.MP4,2024-07-03,22:22:06,2024-07-03,22:32:22,00:10:16,,,,,,,,,,,,
1288,SD1,,1-2,MUBD2024 (4outshows),,,x,,,,/Volumes/Untitled 1/PRIVATE/M4ROOT/CLIP/20240703_JPN1849.MP4,2024-07-03,22:54:21,2024-07-03,22:54:45,00:00:24,,,,,,,,,,,,
1290,SD1,,1-2,MUBD2024 (4outshows),,,x,,,,/Volumes/Untitled 1/PRIVATE/M4ROOT/CLIP/20240703_JPN1850.MP4,2024-07-03,22:54:47,2024-07-03,23:03:02,00:08:15,,,,,,,,,,,,
1292,SD1,,1-2,MUBD2024 (4outshows),,,x,,,,/Volumes/Untitled 1/PRIVATE/M4ROOT/CLIP/20240703_JPN1851.MP4,2024-07-03,23:09:25,2024-07-03,23:16:12,00:06:47,,,,,,,,,,,,`;

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
window.addEventListener('DOMContentLoaded', () => {
  appState.notes = parseCSV(csvData);
  renderListPage();
  setupEventListeners();
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
