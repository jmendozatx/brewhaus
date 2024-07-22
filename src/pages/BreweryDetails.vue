<template>
  <q-page class="q-pa-md">
    <div v-if="brewery">
      <h1 class="text-h3 q-mb-md">{{ brewery.name }}</h1>
      <div class="row q-col-gutter-md">
        <div class="col-12 col-md-6">
          <q-card class="q-mb-md">
            <q-card-section>
              <div class="text-h6">Details</div>
              <q-list>
                <q-item>
                  <q-item-section>
                    <q-item-label caption>Type</q-item-label>
                    <q-item-label>
                      <q-chip :color="getTypeColor(brewery.brewery_type)" text-color="white">
                        {{ brewery.brewery_type }}
                      </q-chip>
                    </q-item-label>
                  </q-item-section>
                </q-item>
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
            </q-card-section>
          </q-card>
        </div>
        <div class="col-12 col-md-6">
          <q-card class="map-card">
            <q-card-section>
              <div class="text-h6">Location</div>
              <iframe width="100%" height="300" frameborder="0" style="border:0"
                :src="`https://www.google.com/maps/embed/v1/place?key=YOUR_API_KEY&q=${encodeURIComponent(fullAddress)}`"
                allowfullscreen></iframe>
            </q-card-section>
          </q-card>
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
import { ref, computed, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import axios from 'axios';
import { Brewery } from 'src/types/Brewery';

const route = useRoute();

const brewery = ref<Brewery | null>(null);
const isLoading = ref(true);

const fullAddress = computed(() => {
  if (!brewery.value) return '';
  const { street, city, state, postal_code, country } = brewery.value;
  return `${street}, ${city}, ${state} ${postal_code}, ${country}`.trim();
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
.q-page {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

.map-card {
  height: 100%;
}
</style>
