<template>
  <div class="no-results-container">
    <q-icon name="sentiment_dissatisfied" size="64px" color="grey-6" />
    <h2 class="text-h5 text-grey-8 q-mt-md">No breweries found</h2>
    <p class="text-body1 text-grey-6 q-mt-sm">
      We couldn't find any breweries matching your search criteria.
    </p>
    <div class="q-mt-md">
      <q-btn color="primary" label="Clear filters" @click="$emit('clearFilters')" />
    </div>
    <div class="q-mt-lg">
      <h3 class="text-h6 text-grey-8">Try adjusting your search:</h3>
      <ul class="text-body1 text-grey-7 q-mt-sm">
        <li>Use different keywords</li>
        <li>Remove the type filter</li>
      </ul>
    </div>
  </div>
</template>

<script setup lang="ts">
defineEmits(['clearFilters']);
</script>

<style lang="scss" scoped>
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
