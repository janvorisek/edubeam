<script lang="ts" setup>
defineProps({
  caption: {
    type: String,
    required: false,
    default: null,
  },
  hinges: {
    type: Array,
    required: false,
    default: () => [false, false],
  },
  moment: {
    type: Boolean,
    required: false,
    default: false,
  },
});
</script>

<template>
  <figure class="figclass">
    <svg xmlns="http://www.w3.org/2000/svg" width="220" height="120">
      <defs>
        <marker
          id="arrowhead"
          markerWidth="6"
          markerHeight="6"
          refX="3"
          refY="3"
          orient="auto"
          markerUnits="strokeWidth"
        >
          <polygon points="0,0 0,6 6,3" fill="blue" />
        </marker>
        <marker
          id="arrowhead2"
          markerWidth="6"
          markerHeight="6"
          refX="3"
          refY="3"
          orient="auto"
          markerUnits="strokeWidth"
        >
          <polygon points="6,0 6,6 0,3" fill="blue" />
        </marker>
        <marker
          id="dimstart"
          markerWidth="12"
          markerHeight="12"
          refX="6"
          refY="6"
          orient="auto"
          markerUnits="strokeWidth"
        >
          <polygon points="12,3 12,9 6,6" fill="black" />
          <line x1="6" y1="12" x2="6" y2="0" stroke="black" stroke-width="1" />
        </marker>
        <marker
          id="dimend"
          markerWidth="12"
          markerHeight="12"
          refX="6"
          refY="6"
          orient="auto"
          markerUnits="strokeWidth"
        >
          <polygon points="0,3 0,9 6,6" fill="black" />
          <line x1="6" y1="12" x2="6" y2="0" stroke="black" stroke-width="1" />
        </marker>
      </defs>

      <!-- Truss Element -->
      <line x1="20" y1="50" x2="180" y2="50" stroke="black" stroke-width="2" />

      <!-- Nodes -->
      <circle v-if="hinges[0]" cx="20" cy="50" r="4" fill="black" />
      <circle v-if="hinges[1]" cx="180" cy="50" r="4" fill="black" />

      <!-- Hinges -->
      <circle v-if="hinges[0]" cx="20" cy="50" r="4" fill="white" stroke="black" stroke-width="2" />
      <circle v-if="hinges[1]" cx="180" cy="50" r="4" fill="white" stroke="black" stroke-width="2" />

      <!-- Degrees of Freedom (DOFs) -->
      <!-- Node 1 -->
      <line x1="20" y1="50" x2="20" y2="70" stroke="blue" stroke-width="1" marker-end="url(#arrowhead)" />
      <line x1="20" y1="50" x2="40" y2="50" stroke="blue" stroke-width="1" marker-end="url(#arrowhead)" />
      <path v-if="moment" d="M 20 40 A 10 10 0 1 1 10 50" fill="none" stroke="blue" marker-start="url(#arrowhead2)" />

      <!-- Node 2 -->
      <line x1="180" y1="50" x2="180" y2="70" stroke="blue" stroke-width="1" marker-end="url(#arrowhead)" />
      <line x1="180" y1="50" x2="200" y2="50" stroke="blue" stroke-width="1" marker-end="url(#arrowhead)" />
      <path v-if="moment" d="M 180 40 A 10 10 0 1 1 170 50" fill="none" stroke="blue" marker-start="url(#arrowhead2)" />

      <!-- Length Dimensioning -->
      <line
        x1="20"
        y1="80"
        x2="180"
        y2="80"
        stroke="black"
        stroke-width="1"
        marker-start="url(#dimstart)"
        marker-end="url(#dimend)"
      />
      <text x="100" y="100" fill="black" text-anchor="middle">L</text>

      <!-- EA -->
      <text x="100" y="45" fill="black" text-anchor="middle">EA</text>
    </svg>
    <figcaption v-if="caption">{{ caption }}</figcaption>
  </figure>
</template>
