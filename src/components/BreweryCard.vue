<template>
  <q-card class="brewery-card">
    <div class="image-container">
      <q-img :src="imageUrl" basic contain style="height: 200px;">
        <template v-slot:error>
          <div class="absolute-full flex flex-center bg-negative text-white">
            Cannot load image
          </div>
        </template>
      </q-img>
      <div class="inner-shadow"></div>
      <q-chip color="white" dark :label="brewery.brewery_type" text-color="black" class="brewery-type-chip" />
    </div>
    <q-card-section class="q-pb-none">
      <div class="text-h2">{{ brewery.name }}</div>
      <div>{{ brewery.city }}, {{ brewery.state }}</div>
    </q-card-section>
    <q-card-actions align="right" class="q-pa-md">
      <q-btn outline :to="`/brewery/${brewery.id}`">More Details</q-btn>
    </q-card-actions>
  </q-card>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { Brewery } from 'src/types/Brewery';
import { getNextBeerImage } from 'src/services/unsplash';

const { brewery } = defineProps<{
  brewery: Brewery
}>();

const imageUrl = ref(getNextBeerImage());

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

  .image-container {
    position: relative;
    height: 200px;
    border-radius: 10px 10px 0 0;
    overflow: hidden;
  }

  .inner-shadow {
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    height: 100px;
    background: linear-gradient(to top, rgba(0, 0, 0, 1) 0%, rgba(0, 0, 0, 0) 100%);
    pointer-events: none;
  }

  .brewery-type-chip {
    position: absolute;
    bottom: 8px;
    left: 8px;
    font-weight: 500;
    border: 1px solid black;
  }
}
</style>
