<script setup lang="ts">
import type { HTMLAttributes } from 'vue'
import { cn } from '@/lib/utils'

const props = defineProps<{
  class?: HTMLAttributes['class']
}>()
</script>

<template>
  <div
    :class="cn('font-bold2 flex flex-col gap-y-2 text-center sm:text-left', props.class)"
  >
    <slot />
  </div>
</template>

<style scoped>

  .font-bold2{
    background-color: #373739;
    border: none;
    color:#f9db5c;
    font-family: 'Karla', sans-serif;
    font-size: 1rem;
  }

</style>