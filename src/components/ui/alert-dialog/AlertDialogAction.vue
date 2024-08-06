<script setup lang="ts">
import { type HTMLAttributes, computed } from 'vue'
import { AlertDialogAction, type AlertDialogActionProps } from 'radix-vue'
import { cn } from '@/lib/utils'
import { buttonVariants } from '@/components/ui/button'

const props = defineProps<AlertDialogActionProps & { class?: HTMLAttributes['class'] }>()

const delegatedProps = computed(() => {
  const { class: _, ...delegated } = props

  return delegated
})
</script>

<template>
  <AlertDialogAction v-bind="delegatedProps" :class="cn(buttonVariants(), 'font-bold3 mt-2 sm:mt-0', props.class)">
    <slot />
  </AlertDialogAction>
</template>

<style scoped>

  .font-bold3{
    align-items:  center;
    padding: 3px 10px 3px 10px;
    font-size: 1.1rem;
    background-color: #f9db5c ;
    font-family: 'Karla', sans-serif;
    border: solid #a87b05 1px ;
    outline: 0;
    cursor: pointer;
    color: #373739;
    border-radius: 5px;
  }
</style>