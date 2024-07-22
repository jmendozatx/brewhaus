<template>
  <q-card class="brewery-card">
    <q-card-section>
      <div class="text-h6">{{ brewery.name }}</div>
      <q-chip :color="getTypeColor(brewery.brewery_type)" text-color="white">
        {{ brewery.brewery_type }}
      </q-chip>
    </q-card-section>
    <q-card-section>
      <div>{{ brewery.city }}, {{ brewery.state }}</div>
    </q-card-section>
    <q-card-actions align="right">
      <q-btn flat color="primary" :to="`/brewery/${brewery.id}`">More Details</q-btn>
    </q-card-actions>
  </q-card>
</template>

<script setup lang="ts">
import { defineProps } from 'vue';
import { Brewery } from 'src/types/Brewery';

defineProps<{
  brewery: Brewery
}>();

const getTypeColor = (type: string) => {
  const colors: { [key: string]: string } = {
    micro: 'primary',
    nano: 'secondary',
    regional: 'accent',
    brewpub: 'positive',
    large: 'negative',
    planning: 'info',
    bar: 'warning',
    contract: 'dark',
    proprietor: 'deep-purple',
    closed: 'grey'
  };
  return colors[type] || 'grey';
};
</script>

<style lang="scss">
.brewery-card {
  height: 100%;
  display: flex;
  flex-direction: column;
  transition: all 0.3s ease;

  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
  }

  .q-card__actions {
    margin-top: auto;
  }
}
</style>
