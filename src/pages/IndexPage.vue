<template>
  <q-page class="q-pa-md">
    <div class="column q-gutter-y-md">
      <h1 class="q-mb-md">Breweries</h1>
      <div class="row q-col-gutter-md">
        <div class="col-12 col-sm-6">
          <q-input outlined v-model="searchQuery" type="search" label="Search breweries">
            <template v-slot:append>
              <q-icon name="search" />
            </template>
          </q-input>
        </div>
        <div class="col-12 col-sm-3">
          <q-select outlined v-model="sortBy" :options="sortOptions" option-value="value" option-label="label"
            map-options emit-value label="Sort by" />
        </div>
        <div class="col-12 col-sm-3">
          <q-select v-model="filterType" :options="breweryTypes" label="Filter by type" outlined clearable />
        </div>
      </div>

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

      <div v-if="isLoading" class="row q-col-gutter-md">
        <div v-for="n in 6" :key="n" class="col-12 col-sm-6 col-md-4">
          <q-skeleton type="rect" height="200px" />
        </div>
      </div>

      <div v-if="!isLoading && breweries.length === 0" class="no-results-container">
        <q-icon name="sentiment_dissatisfied" size="64px" color="grey-6" />
        <h2 class="text-h5 text-grey-8 q-mt-md">No breweries found</h2>
        <p class="text-body1 text-grey-6 q-mt-sm">
          We couldn't find any breweries matching your search criteria.
        </p>
        <div class="q-mt-md">
          <q-btn color="primary" label="Clear filters" @click="clearFilters" />
        </div>
        <div class="q-mt-lg">
          <h3 class="text-h6 text-grey-8">Try adjusting your search:</h3>
          <ul class="text-body1 text-grey-7 q-mt-sm">
            <li>Use different keywords</li>
            <li>Remove the type filter</li>
          </ul>
        </div>
      </div>
    </div>
  </q-page>
</template>

<script setup lang="ts">
import { ref, watch, onMounted } from 'vue';
import { useQuasar, debounce } from 'quasar';
import axios from 'axios';
import BreweryCard from 'components/BreweryCard.vue';
import { Brewery } from 'src/types/Brewery';
import { initializeImagePool, isImagePoolReady } from 'src/services/unsplash';

const $q = useQuasar();

const breweries = ref<Brewery[]>([]);
const page = ref(1);
const canLoadMore = ref(true);
const searchQuery = ref('');
const isLoading = ref(false);
const sortBy = ref('name');
const filterType = ref(null);

const sortOptions = [
  { label: 'Name', value: 'name' },
  { label: 'Type', value: 'type' },
  { label: 'City', value: 'city' },
  { label: 'State', value: 'state' }
];

const breweryTypes = [
  'micro',
  'nano',
  'regional',
  'brewpub',
  'large',
  'planning',
  'bar',
  'contract',
  'proprietor',
  'closed'
];

const clearFilters = () => {
  searchQuery.value = '';
  filterType.value = null;
  sortBy.value = 'name';
  fetchBreweries(true);
};

const fetchBreweries = async (reset = false) => {
  if (reset) {
    page.value = 1;
    breweries.value = [];
  }

  isLoading.value = true;
  try {
    // Ensure image pool is initialized before fetching breweries
    if (!isImagePoolReady()) {
      await initializeImagePool();
    }

    const response = await axios.get('https://api.openbrewerydb.org/v1/breweries', {
      params: {
        page: page.value,
        per_page: 15,
        by_name: searchQuery.value,
        sort: sortBy.value,
        by_type: filterType.value
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
      icon: 'report_problem'
    });
  } finally {
    isLoading.value = false;
  }
};

const onLoad = async (index: number, done: () => void) => {
  await fetchBreweries();
  done();
};

const debouncedFetchBreweries = debounce(fetchBreweries, 300);

watch([searchQuery, sortBy, filterType], () => {
  debouncedFetchBreweries(true);
});

onMounted(async () => {
  await initializeImagePool();
  fetchBreweries();
});
</script>

<style lang="scss">
.q-page {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

.no-results-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  padding: 48px;
  background-color: #f5f5f5;
  border-radius: 8px;
  margin-top: 24px;

  ul {
    list-style-type: none;
    padding-left: 0;
  }

  li {
    margin-bottom: 8px;
  }
}
</style>
