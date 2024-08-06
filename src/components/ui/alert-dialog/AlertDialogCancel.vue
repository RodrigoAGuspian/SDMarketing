<script setup lang="ts">
import { type HTMLAttributes, computed } from 'vue'
import { AlertDialogCancel, type AlertDialogCancelProps } from 'radix-vue'
import { cn } from '@/lib/utils'
import { buttonVariants } from '@/components/ui/button'

const props = defineProps<AlertDialogCancelProps & { class?: HTMLAttributes['class'] }>()

const delegatedProps = computed(() => {
  const { class: _, ...delegated } = props

  return delegated
})
</script>

<template>
  <AlertDialogCancel v-bind="delegatedProps" :class="cn(buttonVariants({ variant: 'outline' }), 'font-bold3 mt-2 sm:mt-0', props.class)">
    <slot />
  </AlertDialogCancel>
</template>

<style scoped>
  .font-bold3{
    color:#f9db5c;
    background-color: #373739;
    border:solid #a87b05 1px;
    font-family: 'Karla', sans-serif;
    font-size: 1rem;
  }
</style>