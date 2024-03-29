<script lang="ts" setup>
const props = withDefaults(
  defineProps<{
    colors?: {
      normalForce: string;
      shearForce: string;
      bendingMoment: string;
      deformedShape: string;
      loads: string;
      nodes: string;
      elements: string;
      reactions: string;
    };
    supportSize?: number;
    scale?: number;
  }>(),
  {
    colors: () => {
      return {
        normalForce: "#2222ff",
        shearForce: "#00af00",
        bendingMoment: "#ff2222",
        deformedShape: "#555555",
        loads: "#ff8700",
        nodes: "#000000",
        elements: "#000000",
        reactions: "#a020f0",
      };
    },
    supportSize: 1,
    scale: 1,
  }
);
</script>

<template>
  <defs>
    <marker
      id="arrow"
      viewBox="0 0 10 10"
      refX="5"
      refY="5"
      markerWidth="12"
      markerHeight="12"
      orient="auto-start-reverse"
      markerUnits="strokeWidth"
    >
      <path d="M 0 0 L 10 5 L 0 10 z" :fill="colors.loads" />
    </marker>
    <marker
      id="arrow_reaction"
      viewBox="0 0 10 10"
      refX="5"
      refY="5"
      markerWidth="12"
      markerHeight="12"
      orient="auto-start-reverse"
      markerUnits="strokeWidth"
    >
      <path d="M 0 0 L 10 5 L 0 10 z" :fill="colors.reactions" />
    </marker>
    <marker
      id="arrow_hover"
      viewBox="0 0 10 10"
      refX="5"
      refY="5"
      markerWidth="12"
      markerHeight="12"
      orient="auto-start-reverse"
      markerUnits="userSpaceOnUse"
    >
      <path d="M 0 0 L 10 5 L 0 10 z" fill="blue" />
    </marker>
    <marker
      id="moment_reaction_ccw"
      viewBox="0 0 20 60"
      refX="10"
      refY="60"
      :markerWidth="20 / scale"
      :markerHeight="50 / scale"
      overflow="visible"
      markerUnits="userSpaceOnUse"
      marker-end="url(#arrow_reaction)"
    >
      <path d="M -10 60 A 20 20, 135, 1, 0, 0 40" fill="none" :stroke="colors.reactions" />
    </marker>
    <marker
      id="moment_reaction_cw"
      viewBox="0 0 20 60"
      refX="-20"
      refY="45"
      :markerWidth="20 / scale"
      :markerHeight="50 / scale"
      overflow="visible"
      markerUnits="userSpaceOnUse"
      marker-end="url(#arrow_reaction)"
    >
      <path d="M -10 60 A 20 20, 135, 1, 1, 0 40" fill="none" :stroke="colors.reactions" />
    </marker>
    <marker
      id="moment_ccw"
      viewBox="0 0 20 60"
      refX="10"
      refY="60"
      :markerWidth="20 / scale"
      :markerHeight="50 / scale"
      overflow="visible"
      markerUnits="userSpaceOnUse"
      marker-end="url(#arrow)"
    >
      <path d="M -10 60 A 20 20, 135, 1, 0, 0 40" fill="none" :stroke="colors.loads" />
    </marker>
    <marker
      id="moment_cw"
      viewBox="0 0 20 60"
      refX="-20"
      refY="45"
      :markerWidth="20 / scale"
      :markerHeight="50 / scale"
      overflow="visible"
      markerUnits="userSpaceOnUse"
      marker-end="url(#arrow)"
    >
      <path d="M -10 60 A 20 20, 135, 1, 1, 0 40" fill="none" :stroke="colors.loads" />
    </marker>
    <marker
      id="moment_ccw_hover"
      viewBox="0 0 20 60"
      refX="10"
      refY="60"
      markerWidth="20"
      markerHeight="50"
      overflow="visible"
      markerUnits="strokeWidth"
      marker-end="url(#arrow_hover)"
    >
      <path d="M -10 60 A 20 20, 135, 1, 0, 0 40" stroke-width="3" fill="none" stroke="blue" />
    </marker>
    <marker
      id="moment_cw_hover"
      viewBox="0 0 20 60"
      refX="-20"
      refY="45"
      markerWidth="20"
      markerHeight="50"
      overflow="visible"
      markerUnits="strokeWidth"
      marker-end="url(#arrow_hover)"
    >
      <path d="M -10 60 A 20 20, 135, 1, 1, 0 40" stroke-width="3" fill="none" stroke="blue" />
    </marker>
    <marker
      id="forceTip"
      viewBox="0 0 20 60"
      refX="60"
      refY="10"
      :markerWidth="20 / scale"
      :markerHeight="50 / scale"
      overflow="visible"
      markerUnits="userSpaceOnUse"
      orient="auto"
    >
      <polyline points="45,5 55,10 45,15" stroke-width="1" :fill="colors.loads" :stroke="colors.loads" />
    </marker>
    <marker
      id="force"
      viewBox="0 0 20 60"
      refX="10"
      refY="60"
      :markerWidth="20 / scale"
      :markerHeight="50 / scale"
      overflow="visible"
      markerUnits="userSpaceOnUse"
    >
      <polyline points="5,45 10,55 15,45" stroke-width="1" :fill="colors.loads" :stroke="colors.loads" />
      <line y1="55" x1="10" y2="11" x2="10" stroke-width="1" :stroke="colors.loads" />
    </marker>
    <marker
      id="reaction"
      viewBox="0 0 20 60"
      refX="10"
      refY="60"
      :markerWidth="20 / scale"
      :markerHeight="50 / scale"
      overflow="visible"
      markerUnits="userSpaceOnUse"
    >
      <polyline points="5,45 10,55 15,45" stroke-width="1" :fill="colors.reactions" :stroke="colors.reactions" />
      <line y1="55" x1="10" y2="11" x2="10" stroke-width="1" :stroke="colors.reactions" />
    </marker>
    <marker
      id="force_hover"
      viewBox="0 0 20 60"
      refX="10"
      refY="60"
      :markerWidth="20 / scale"
      :markerHeight="50 / scale"
      overflow="visible"
      markerUnits="userSpaceOnUse"
    >
      <polyline points="5,45 10,55 15,45" stroke-width="1" fill="blue" stroke="blue" />
      <line y1="55" x1="10" y2="11" x2="10" stroke-width="3" stroke="blue" />
    </marker>

    <marker
      id="force_centered"
      viewBox="0 0 20 60"
      refX="10"
      refY="35"
      :markerWidth="20 / scale"
      :markerHeight="50 / scale"
      overflow="visible"
      markerUnits="userSpaceOnUse"
    >
      <polyline points="5,45 10,55 15,45" stroke-width="1" :fill="colors.loads" :stroke="colors.loads" />
      <line y1="55" x1="10" y2="11" x2="10" stroke-width="1" :stroke="colors.loads" />
    </marker>

    <marker
      id="force_centered_hover"
      viewBox="0 0 20 60"
      refX="10"
      refY="35"
      markerWidth="20"
      markerHeight="50"
      overflow="visible"
      markerUnits="strokeWidth"
    >
      <polyline points="5,45 10,55 15,45" stroke-width="1" :fill="colors.loads" :stroke="colors.loads" />
      <line y1="55" x1="10" y2="11" x2="10" stroke-width="1" :stroke="colors.loads" />
    </marker>

    <marker
      id="dot"
      viewBox="-20 -10 20 70"
      refX="0"
      refY="24.5"
      :markerWidth="(supportSize * 20) / scale"
      :markerHeight="(supportSize * 80) / scale"
      orient="auto"
      markerUnits="userSpaceOnUse"
    >
      <line y1="6" x1="0" y2="44" x2="0" :stroke-width="2" stroke="black" />
      <line
        v-for="i in 6"
        :key="i"
        :y1="(i * 50) / 7"
        x1="0"
        :y2="10 + (i * 50) / 7"
        x2="-10"
        :stroke-width="1"
        stroke="black"
        fill="none"
      />
    </marker>

    <marker
      id="hinge-xy"
      viewBox="0 0 20 20"
      refX="10"
      refY="0"
      :markerWidth="(supportSize * 20) / scale"
      :markerHeight="(supportSize * 20) / scale"
      overflow="visible"
      orient="auto"
      markerUnits="userSpaceOnUse"
    >
      <polyline points="10,0 -5,20 25,20 10,0" :stroke-width="1" fill="transparent" stroke="black" />
    </marker>

    <marker
      id="hinge-x"
      viewBox="0 0 20 20"
      refX="10"
      refY="0"
      :markerWidth="(supportSize * 20) / scale"
      :markerHeight="(supportSize * 20) / scale"
      overflow="visible"
      orient="auto"
      markerUnits="userSpaceOnUse"
    >
      <polyline points="10,0 -5,20 25,20 10,0" :stroke-width="1" fill="transparent" stroke="black" />
      <line y1="25" x1="-5" y2="25" x2="25" :stroke-width="1" stroke="black" />
    </marker>

    <marker
      id="hinge-y"
      viewBox="0 0 20 20"
      refX="0"
      refY="10"
      :markerWidth="(supportSize * 20) / scale"
      :markerHeight="(supportSize * 20) / scale"
      overflow="visible"
      orient="auto"
      markerUnits="userSpaceOnUse"
    >
      <polyline points="0,10 20,-5 20,25 0,10" :stroke-width="1" fill="transparent" stroke="black" />
      <line y1="-5" x1="25" y2="25" x2="25" :stroke-width="1" stroke="black" />
    </marker>

    <marker
      id="hinge-start"
      viewBox="0 0 20 20"
      refX="0"
      refY="0"
      markerWidth="20"
      markerHeight="20"
      overflow="visible"
      markerUnits="strokeWidth"
    >
      <circle r="7" fill="white" stroke="black" stroke-width="2" />
    </marker>

    <marker
      id="hinge-end"
      viewBox="0 0 20 20"
      refX="0"
      refY="0"
      markerWidth="20"
      markerHeight="20"
      overflow="visible"
      markerUnits="strokeWidth"
    >
      <circle r="7" fill="white" stroke="black" stroke-width="2" />
    </marker>

    <filter id="textLabel" x="-5%" width="110%" y="0%" height="100%">
      <feFlood flood-color="white" flood-opacity="0.75" />
    </filter>
  </defs>
</template>
