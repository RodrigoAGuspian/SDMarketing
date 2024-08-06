<script setup lang="ts">
import { type HTMLAttributes, computed } from 'vue'
import {
  AlertDialogDescription,
  type AlertDialogDescriptionProps,
} from 'radix-vue'
import { cn } from '@/lib/utils'

const props = defineProps<AlertDialogDescriptionProps & { class?: HTMLAttributes['class'] }>()

const delegatedProps = computed(() => {
  const { class: _, ...delegated } = props

  return delegated
})
</script>

<template>
  <AlertDialogDescription
    v-bind="delegatedProps"
    :class="cn('font-bold2 text-sm text-muted-foreground', props.class)"
  >
    <slot />
  </AlertDialogDescription>
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