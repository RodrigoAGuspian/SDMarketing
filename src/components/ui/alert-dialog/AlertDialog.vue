<script setup lang="ts">
import { type AlertDialogEmits, type AlertDialogProps, AlertDialogRoot, useForwardPropsEmits } from 'radix-vue'

const props = defineProps<AlertDialogProps>()
const emits = defineEmits<AlertDialogEmits>()

const forwarded = useForwardPropsEmits(props, emits)
</script>

<template>
  <AlertDialogRoot class="font-bold3" v-bind="forwarded">
    <slot />
  </AlertDialogRoot>
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