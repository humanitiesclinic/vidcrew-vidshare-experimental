<template>
  <q-page class="list-page">
    <div class="list-container">
      <h1 class="page-title">Select Event Class</h1>

      <div class="classes-grid">
        <q-card
          v-for="eventClass in eventClasses"
          :key="eventClass.id"
          class="class-card"
          clickable
          @click="selectClass(eventClass)"
        >
          <q-card-section class="card-content">
            <h2 class="class-name">{{ eventClass.name }}</h2>
            <p class="card-count">{{ eventClass.count }} cards</p>
          </q-card-section>
        </q-card>
      </div>
    </div>
  </q-page>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useRouter } from 'vue-router';
import { useNotesStore } from 'stores/notesStore';

const router = useRouter();
const notesStore = useNotesStore();

// Get unique event classes with card counts
const eventClasses = computed(() => {
  const classMap = new Map<string, { id: string; name: string; count: number }>();

  notesStore.notes.forEach(note => {
    if (!classMap.has(note.classEvent)) {
      classMap.set(note.classEvent, {
        id: note.classEvent,
        name: note.classEvent,
        count: 0
      });
    }
    const cls = classMap.get(note.classEvent)!;
    cls.count++;
  });

  return Array.from(classMap.values()).sort((a, b) => a.name.localeCompare(b.name));
});

const selectClass = (eventClass: { id: string; name: string; count: number }) => {
  router.push(`/feed/${eventClass.id}`);
};
</script>

<style scoped lang="scss">
.list-page {
  background: #0f0f0f;
  min-height: 100vh;
  padding: 40px 20px;

  .list-container {
    max-width: 1200px;
    margin: 0 auto;
  }

  .page-title {
    margin: 0 0 40px 0;
    font-size: 2rem;
    font-weight: 600;
    color: white;
    text-align: center;
  }

  .classes-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
    gap: 20px;
  }

  .class-card {
    background: #1a1a1a;
    border: 1px solid #333;
    border-radius: 12px;
    transition: all 0.3s ease;
    cursor: pointer;

    &:hover {
      background: #222;
      border-color: #1976d2;
      transform: translateY(-4px);
      box-shadow: 0 8px 24px rgba(25, 118, 210, 0.2);
    }

    .card-content {
      padding: 30px 20px;
      display: flex;
      flex-direction: column;
      align-items: center;
      text-align: center;
      min-height: 150px;
      justify-content: center;
    }

    .class-name {
      margin: 0 0 12px 0;
      font-size: 1.5rem;
      font-weight: 600;
      color: white;
    }

    .card-count {
      margin: 0;
      font-size: 0.9rem;
      color: #999;
    }
  }
}

@media (max-width: 768px) {
  .list-page {
    padding: 20px 12px;

    .page-title {
      font-size: 1.5rem;
      margin-bottom: 30px;
    }

    .classes-grid {
      grid-template-columns: 1fr;
    }
  }
}
</style>
