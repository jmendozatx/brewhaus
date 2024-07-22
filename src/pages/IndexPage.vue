<template>
  <q-page class="q-pa-md">
    <div class="column">
      <h1 class="text-h3 q-mb-md">Breweries</h1>

      <q-input v-model="searchQuery" filled type="search" label="Search breweries" class="q-mb-md">
        <template v-slot:append>
          <q-icon name="search" />
        </template>
      </q-input>

      <q-infinite-scroll @load="onLoad" :offset="250" :disable="!canLoadMore">
        <div class="row q-col-gutter-md">
          <div v-for="brewery in breweries" :key="brewery.id" class="col-12 col-sm-6 col-md-4">
            <BreweryCard :brewery="brewery" />
          </div>
        </div>
        <template v-slot:loading>
          <div class="row justify-center q-my-md">
            <q-spinner-dots color="primary" size="40px" />
          </div>
        </template>
      </q-infinite-scroll>
    </div>
  </q-page>
</template>

<script setup lang="ts">
import { ref, onMounted, watch } from 'vue';
import { useQuasar, debounce } from 'quasar';
import axios from 'axios';
import BreweryCard from 'components/BreweryCard.vue';
import { Brewery } from 'src/types/Brewery';

const $q = useQuasar();

const breweries = ref<Brewery[]>([]);
const page = ref(1);
const canLoadMore = ref(true);
const searchQuery = ref('');
const isLoading = ref(false);

const fetchBreweries = async (reset = false) => {
  if (reset) {
    page.value = 1;
    breweries.value = [];
  }

  isLoading.value = true;
  try {
    const response = await axios.get('https://api.openbrewerydb.org/v1/breweries', {
      params: {
        page: page.value,
        per_page: 15,
        by_name: searchQuery.value
      }
    });
    breweries.value = reset ? response.data : [...breweries.value, ...response.data];
    page.value++;
    canLoadMore.value = response.data.length === 15;
  } catch (error) {
    console.error('Error fetching breweries:', error);
    canLoadMore.value = false;
    $q.notify({
      color: 'negative',
      position: 'top',
      message: 'Failed to fetch breweries. Please try again.',
    });
  } finally {
    isLoading.value = false;
  }
};

const onLoad = async (index: number, done: () => void) => {
  await fetchBreweries();
  done();
};

// Debounced search function
const debouncedFetchBreweries = debounce(fetchBreweries, 300);

// Watch for changes in searchQuery
watch(searchQuery, () => {
  debouncedFetchBreweries(true);
});

onMounted(() => {
  fetchBreweries();
});
</script>

<style lang="scss">
.q-page {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}
</style>
