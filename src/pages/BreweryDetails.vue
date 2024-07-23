<template>
  <q-page class="q-pa-md">
    <div v-if="brewery">
      <div class="row items-center">
        <h1 class="q-mr-md">{{ brewery.name }}</h1>
        <q-chip :color="getTypeColor(brewery.brewery_type)" text-color="white">
          {{ brewery.brewery_type }}
        </q-chip>
      </div>
      <div class="row q-col-gutter-md items-center">
        <div class="col-12 col-md-6">
          <div id="map" style="height: 300px;"></div>
        </div>
        <div class="col-12 col-md-6">
          <q-list>
            <q-item>
              <q-item-section>
                <q-item-label caption>Address</q-item-label>
                <q-item-label>{{ fullAddress }}</q-item-label>
              </q-item-section>
            </q-item>
            <q-item v-if="brewery.phone">
              <q-item-section>
                <q-item-label caption>Phone</q-item-label>
                <q-item-label>{{ brewery.phone }}</q-item-label>
              </q-item-section>
            </q-item>
            <q-item v-if="brewery.website_url">
              <q-item-section>
                <q-item-label caption>Website</q-item-label>
                <q-item-label>
                  <a :href="brewery.website_url" target="_blank">{{ brewery.website_url }}</a>
                </q-item-label>
              </q-item-section>
            </q-item>
          </q-list>
        </div>
      </div>
      <q-btn color="primary" icon="arrow_back" label="Back to List" @click="$router.push('/')" class="q-mt-md" />
    </div>
    <div v-else-if="isLoading" class="text-center">
      <q-spinner-dots color="primary" size="40px" />
    </div>
    <div v-else class="text-center">
      <p>Brewery not found.</p>
      <q-btn color="primary" icon="arrow_back" label="Back to List" @click="$router.push('/')" />
    </div>
  </q-page>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch, nextTick } from 'vue';
import { useRoute } from 'vue-router';
import axios from 'axios';
import { Brewery } from 'src/types/Brewery';
import L from 'leaflet';

const route = useRoute();

const brewery = ref<Brewery | null>(null);
const isLoading = ref(true);

const fullAddress = computed(() => {
  if (!brewery.value) return '';
  const { street, city, state, postal_code, country } = brewery.value;
  return `${street}, ${city}, ${state} ${postal_code}, ${country}`.trim();
});

const initMap = () => {
  if (brewery.value && brewery.value.latitude && brewery.value.longitude) {
    const map = L.map('map').setView([brewery.value.latitude, brewery.value.longitude], 13);
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(map);
    L.marker([brewery.value.latitude, brewery.value.longitude]).addTo(map)
      .bindPopup(brewery.value.name)
      .openPopup();
  }
};

watch(() => brewery.value, (newValue) => {
  if (newValue) {
    nextTick(() => {
      initMap();
    });
  }
});

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

const fetchBreweryDetails = async () => {
  const id = route.params.id as string;
  isLoading.value = true;
  try {
    const response = await axios.get(`https://api.openbrewerydb.org/v1/breweries/${id}`);
    brewery.value = response.data;
  } catch (error) {
    console.error('Error fetching brewery details:', error);
    brewery.value = null;
  } finally {
    isLoading.value = false;
  }
};

onMounted(() => {
  fetchBreweryDetails();
});
</script>

<style lang="scss">
@import 'leaflet/dist/leaflet.css';

.q-page {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

.map-card {
  height: 100%;
}
</style>
