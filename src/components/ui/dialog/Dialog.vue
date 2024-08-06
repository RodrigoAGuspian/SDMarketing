<script setup lang="ts">
import { DialogRoot, type DialogRootEmits, type DialogRootProps, useForwardPropsEmits } from 'radix-vue'

const props = defineProps<DialogRootProps>()
const emits = defineEmits<DialogRootEmits>()

const forwarded = useForwardPropsEmits(props, emits)
</script>

<template>
  <DialogRoot class="font-bold3"v-bind="forwarded">
    <slot />
  </DialogRoot>
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