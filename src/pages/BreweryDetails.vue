<template>
  <q-page class="q-pa-md">
    <div v-if="brewery">
      <h1 class="text-h3 q-mb-md">{{ brewery.name }}</h1>
      <q-card class="q-mb-md">
        <q-card-section>
          <div class="text-h6">Details</div>
          <q-list>
            <q-item>
              <q-item-section>
                <q-item-label caption>Type</q-item-label>
                <q-item-label>{{ brewery.brewery_type }}</q-item-label>
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
      <q-btn color="primary" icon="arrow_back" label="Back to List" @click="$router.push('/')" />
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
import { useRoute, useRouter } from 'vue-router';
import axios from 'axios';
import { Brewery } from 'src/types/Brewery';

const route = useRoute();
const router = useRouter();

const brewery = ref<Brewery | null>(null);
const isLoading = ref(true);

const fullAddress = computed(() => {
  if (!brewery.value) return '';
  const { street, city, state, postal_code, country } = brewery.value;
  return `${street}, ${city}, ${state} ${postal_code}, ${country}`.trim();
});

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
</style>
