<script setup lang="ts">
import { DialogClose, type DialogCloseProps } from 'radix-vue'

const props = defineProps<DialogCloseProps>()
</script>

<template>
  <DialogClose class= "font-bold2" v-bind="props">
    <slot />
  </DialogClose>
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