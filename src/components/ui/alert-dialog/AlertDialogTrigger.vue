<script setup lang="ts">
import { AlertDialogTrigger, type AlertDialogTriggerProps } from 'radix-vue'

const props = defineProps<AlertDialogTriggerProps>()
</script>

<template>
  <AlertDialogTrigger class="font-bold3" v-bind="props">
    <slot />
  </AlertDialogTrigger>
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