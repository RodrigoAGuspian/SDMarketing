<script setup lang="ts">
import { type HTMLAttributes, computed } from 'vue'
import { AlertDialogTitle, type AlertDialogTitleProps } from 'radix-vue'
import { cn } from '@/lib/utils'

const props = defineProps<AlertDialogTitleProps & { class?: HTMLAttributes['class'] }>()

const delegatedProps = computed(() => {
  const { class: _, ...delegated } = props

  return delegated
})
</script>

<template>
  <AlertDialogTitle
    v-bind="delegatedProps"
    :class="cn('font-bold2 text-lg font-semibold', props.class)"
  >
    <slot />
  </AlertDialogTitle>
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