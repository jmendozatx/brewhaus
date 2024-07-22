<template>
  <q-card class="brewery-card">
    <q-card-section>
      <div class="text-h6">{{ brewery.name }}</div>
      <div class="text-subtitle2">{{ brewery.brewery_type }}</div>
    </q-card-section>
    <q-card-section>
      <div>{{ brewery.city }}, {{ brewery.state }}</div>
    </q-card-section>
    <q-card-actions align="right">
      <q-btn flat :to="`/brewery/${brewery.id}`">More Details</q-btn>
    </q-card-actions>
  </q-card>
</template>

<script setup lang="ts">
import { defineProps } from 'vue';
import { Brewery } from 'src/types/Brewery';

defineProps<{
  brewery: Brewery
}>();
</script>

<style lang="scss">
.brewery-card {
  width: 100%;
  max-width: 300px;
  margin-bottom: 1rem;
}
</style>
