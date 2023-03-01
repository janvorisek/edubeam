<template>
  <div class="d-flex flex-column fill-height">
    <HelloWorld class="fill-height" style="min-height: 0; overflow: hidden" />
    <BottomBar style="min-height: 256px; overflow: hidden" />
  </div>
</template>

<script lang="ts" setup>
import HelloWorld from "@/components/HelloWorld.vue";
import BottomBar from "@/components/BottomBar.vue";
</script>
