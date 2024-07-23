<template>
  <q-layout view="hHh lpR fFf">
    <q-header class="bg-white text-black">
      <q-toolbar class="column items-center q-py-md">
        <img src="/beer-mug.svg" alt="Brewhaus Logo" width="50" class="q-mb-sm">
        <q-toolbar-title class="text-center brewhaus-title">
          Brewhaus
        </q-toolbar-title>
      </q-toolbar>
    </q-header>

    <q-page-container>
      <router-view />
    </q-page-container>

    <q-footer elevated class=" text-white">
      <q-toolbar>
        © 2024 Brewhaus. All rights reserved.
      </q-toolbar>
    </q-footer>
  </q-layout>
</template>

<script setup lang="ts">
</script>

<style lang="scss">
@import url('https://fonts.googleapis.com/css2?family=Rye&display=swap');

.q-header {
  .q-toolbar {
    min-height: 100px;
  }
}

.brewhaus-title {
  font-family: 'Rye', cursive;
  font-size: 2.5rem;
  letter-spacing: 2px;
}

.q-page {
  min-height: 100vh;
  max-width: 1400px;
  margin: 0 auto;
}
</style>
