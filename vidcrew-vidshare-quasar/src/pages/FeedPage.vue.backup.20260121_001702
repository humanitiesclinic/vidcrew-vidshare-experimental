<template>
  <q-page class="feed-page">
    <!-- Back button -->
    <div class="back-button-bar">
      <q-btn
        flat
        round
        icon="arrow_back"
        color="primary"
        size="md"
        @click="router.back()"
      />
      <h2 class="event-title">{{ route.params.eventClass }}</h2>
    </div>

    <!-- Tab bar for instances -->
    <div class="tab-bar">
      <div class="tabs-scroll">
        <button
          v-for="instance in uniqueInstances"
          :key="instance"
          :class="['tab', { active: currentInstance === instance }]"
          @click="switchToInstance(instance)"
        >
          {{ instance }}
        </button>
      </div>
    </div>

    <!-- Virtual scroll for lazy loading cards -->
    <q-virtual-scroll
      ref="feedContainer"
      :items="notesInCurrentInstance"
      class="feed-scroll"
      virtual-scroll-item-size="450"
    >
      <template #default="scope">
        <div class="feed-card-wrapper" :class="{ 'animate-left': animationDirection === 'left', 'animate-right': animationDirection === 'right' }">
          <NoteCard
            :note="scope.item"
            class="feed-card"
            :class="{ 'current-card': currentCard?.id === scope.item.id }"
          />
        </div>
      </template>
    </q-virtual-scroll>

    <!-- Position indicator -->
    <div class="position-badge">
      <q-badge color="primary" text-color="white">
        {{ currentInstance }} | {{ currentCard?.descriptionGroup }}
      </q-badge>
    </div>
  </q-page>
</template>

<script setup lang="ts">
import { onMounted, onUnmounted, ref, computed } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import NoteCard from 'components/NoteCard.vue';
import { useNotesStore } from 'stores/notesStore';
import type { Note } from 'stores/notesStore';

const route = useRoute();
const router = useRouter();
const notesStore = useNotesStore();
const feedContainer = ref<HTMLElement | null>(null);
const currentInstance = ref<number>(2024);
const currentCardId = ref<number | null>(null);
const threshold = 50;
const animationDirection = ref<'left' | 'right' | null>(null);
let touchStartX = 0;
let touchStartY = 0;

// Get notes for current event class
const notesForEventClass = computed(() => {
  return notesStore.notes.filter(n => n.classEvent === route.params.eventClass);
});

// Get unique instances sorted for current event class
const uniqueInstances = computed(() => {
  const instances = new Set(notesForEventClass.value.map(n => n.instance));
  return Array.from(instances).sort((a, b) => a - b);
});

// Get notes for current instance and event class
const notesInCurrentInstance = computed(() => {
  return notesForEventClass.value.filter(n => n.instance === currentInstance.value);
});

// Get current card
const currentCard = computed(() => {
  if (!currentCardId.value) {
    return notesInCurrentInstance.value[0] || null;
  }
  return notesStore.notes.find(n => n.id === currentCardId.value) || null;
});

onMounted(() => {
  // Initialize with first note in first instance
  if (uniqueInstances.value.length > 0) {
    currentInstance.value = uniqueInstances.value[0];
    const firstNote = notesInCurrentInstance.value[0];
    if (firstNote) {
      currentCardId.value = firstNote.id;
    }
  }

  window.addEventListener('keydown', handleKeyDown);
  window.addEventListener('touchstart', handleTouchStart);
  window.addEventListener('touchend', handleTouchEnd);
});

onUnmounted(() => {
  window.removeEventListener('keydown', handleKeyDown);
  window.removeEventListener('touchstart', handleTouchStart);
  window.removeEventListener('touchend', handleTouchEnd);
});

// Switch to different instance
const switchToInstance = (instance: number) => {
  currentInstance.value = instance;
  // Find first card of current category in new instance
  if (currentCard.value) {
    const nextCard = notesInCurrentInstance.value.find(
      n => n.descriptionGroup === currentCard.value!.descriptionGroup
    );
    currentCardId.value = nextCard?.id || notesInCurrentInstance.value[0]?.id || null;
  } else {
    currentCardId.value = notesInCurrentInstance.value[0]?.id || null;
  }
  scrollToCard(0);
};

const scrollToCard = (delta: number) => {
  if (feedContainer.value) {
    const cardHeight = 450;
    feedContainer.value.scrollBy({
      top: delta * cardHeight,
      behavior: 'smooth'
    });
  }
};

// Navigate left: go to same category in previous instance
const navigateLeft = () => {
  if (!currentCard.value) return;
  const currentIdx = uniqueInstances.value.indexOf(currentInstance.value);
  if (currentIdx > 0) {
    animationDirection.value = 'left';
    const prevInstance = uniqueInstances.value[currentIdx - 1];
    const category = currentCard.value.descriptionGroup;
    const prevCard = notesStore.notes.find(
      n => n.instance === prevInstance && n.descriptionGroup === category
    );
    if (prevCard) {
      currentInstance.value = prevInstance;
      currentCardId.value = prevCard.id;
      scrollToCard(0);
      setTimeout(() => { animationDirection.value = null; }, 600);
    }
  }
};

// Navigate right: go to same category in next instance
const navigateRight = () => {
  if (!currentCard.value) return;
  const currentIdx = uniqueInstances.value.indexOf(currentInstance.value);
  if (currentIdx < uniqueInstances.value.length - 1) {
    animationDirection.value = 'right';
    const nextInstance = uniqueInstances.value[currentIdx + 1];
    const category = currentCard.value.descriptionGroup;
    const nextCard = notesStore.notes.find(
      n => n.instance === nextInstance && n.descriptionGroup === category
    );
    if (nextCard) {
      currentInstance.value = nextInstance;
      currentCardId.value = nextCard.id;
      scrollToCard(0);
      setTimeout(() => { animationDirection.value = null; }, 600);
    }
  }
};

// Scroll through categories in current instance
const scrollToNextCard = (delta: number) => {
  const notes = notesInCurrentInstance.value;
  if (!currentCard.value || notes.length === 0) return;

  const currentIdx = notes.findIndex(n => n.id === currentCard.value!.id);
  const nextIdx = currentIdx + delta;

  if (nextIdx >= 0 && nextIdx < notes.length) {
    currentCardId.value = notes[nextIdx].id;
    scrollToCard(delta);
  }
};

const handleKeyDown = (e: KeyboardEvent) => {
  switch (e.key) {
    case 'ArrowUp':
    case 'k':
      scrollToNextCard(-1);
      break;
    case 'ArrowDown':
    case 'j':
      scrollToNextCard(1);
      break;
    case 'ArrowLeft':
    case 'h':
      navigateLeft();
      break;
    case 'ArrowRight':
    case 'l':
      navigateRight();
      break;
  }
};

const handleTouchStart = (e: TouchEvent) => {
  touchStartX = e.touches[0].clientX;
  touchStartY = e.touches[0].clientY;
};

const handleTouchEnd = (e: TouchEvent) => {
  const touchEndX = e.changedTouches[0].clientX;
  const touchEndY = e.changedTouches[0].clientY;

  const diffX = touchStartX - touchEndX;
  const diffY = touchStartY - touchEndY;

  const absX = Math.abs(diffX);
  const absY = Math.abs(diffY);

  if (absX > absY && absX > threshold) {
    // Horizontal swipe - switch instance
    if (diffX > 0) {
      // Swiped left - next instance
      navigateRight();
    } else {
      // Swiped right - prev instance
      navigateLeft();
    }
  }
  // Vertical swipe/scroll handled by browser
};
</script>

<style scoped lang="scss">
@keyframes slideOutLeft {
  from {
    opacity: 1;
    transform: translateX(0);
  }
  to {
    opacity: 0;
    transform: translateX(-100%);
  }
}

@keyframes slideInRight {
  from {
    opacity: 0;
    transform: translateX(100%);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
}

@keyframes slideOutRight {
  from {
    opacity: 1;
    transform: translateX(0);
  }
  to {
    opacity: 0;
    transform: translateX(100%);
  }
}

@keyframes slideInLeft {
  from {
    opacity: 0;
    transform: translateX(-100%);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
}

.feed-page {
  background: #0f0f0f;
  height: 100vh;
  width: 100vw;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  position: relative;

  .back-button-bar {
    background: #1a1a1a;
    border-bottom: 1px solid #333;
    padding: 12px 20px;
    display: flex;
    align-items: center;
    gap: 16px;
    height: 50px;
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    z-index: 21;

    .event-title {
      margin: 0;
      font-size: 1.125rem;
      font-weight: 600;
      color: white;
    }
  }

  .tab-bar {
    background: #1a1a1a;
    border-bottom: 1px solid #333;
    padding: 0;
    height: 50px;
    display: flex;
    align-items: center;
    position: fixed;
    top: 50px;
    left: 0;
    right: 0;
    z-index: 20;

    .tabs-scroll {
      display: flex;
      gap: 0;
      overflow-x: auto;
      width: 100%;
      padding: 0 12px;
      scroll-behavior: smooth;

      &::-webkit-scrollbar {
        height: 3px;
      }

      &::-webkit-scrollbar-track {
        background: transparent;
      }

      &::-webkit-scrollbar-thumb {
        background: #555;
        border-radius: 3px;
      }
    }

    .tab {
      background: none;
      border: none;
      color: #999;
      padding: 12px 20px;
      font-size: 0.9rem;
      font-weight: 500;
      cursor: pointer;
      white-space: nowrap;
      transition: all 0.2s ease;
      border-bottom: 3px solid transparent;

      &:hover {
        color: #fff;
      }

      &.active {
        color: #fff;
        border-bottom-color: #1976d2;
      }
    }
  }

  .feed-scroll {
    flex: 1;
    overflow-y: auto;
    overflow-x: hidden;
    scroll-behavior: smooth;
    margin-top: 100px;

    &::-webkit-scrollbar {
      width: 8px;
    }

    &::-webkit-scrollbar-track {
      background: transparent;
    }

    &::-webkit-scrollbar-thumb {
      background: #444;
      border-radius: 4px;

      &:hover {
        background: #555;
      }
    }
  }

  .feed-content {
    display: flex;
    flex-direction: column;
    gap: 20px;
    padding: 20px;
    align-items: center;
    max-width: 100%;
  }

  .feed-card {
    width: 100%;
    max-width: 600px;
    flex-shrink: 0;
  }

  .position-badge {
    position: fixed;
    bottom: 20px;
    right: 20px;
    z-index: 10;
  }

  .feed-card-wrapper {
    display: flex;
    justify-content: center;
    padding: 20px;

    &.animate-left {
      animation: slideOutLeft 0.6s ease-in-out;
    }

    &.animate-right {
      animation: slideOutRight 0.6s ease-in-out;
    }
  }

  .feed-card {
    width: 100%;
    max-width: 600px;
    opacity: 0.6;
    transition: opacity 0.3s ease;

    &.current-card {
      opacity: 1;
    }
  }
}
</style>
