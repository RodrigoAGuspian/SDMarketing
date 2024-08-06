<script setup lang="ts">
import { type HTMLAttributes, computed } from 'vue'
import { DialogDescription, type DialogDescriptionProps, useForwardProps } from 'radix-vue'
import { cn } from '@/lib/utils'

const props = defineProps<DialogDescriptionProps & { class?: HTMLAttributes['class'] }>()

const delegatedProps = computed(() => {
  const { class: _, ...delegated } = props

  return delegated
})

const forwardedProps = useForwardProps(delegatedProps)
</script>

<template>
  <DialogDescription
    v-bind="forwardedProps"
    :class="cn('font-bold2 text-sm text-muted-foreground', props.class)"
  >
    <slot />
  </DialogDescription>
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