<script setup lang="ts">
import CreateShift from '@/components/shifts/CreateShift.vue';
import { Button } from '@/components/ui/button'
</script>
<template>
    <section class="flex justify-between items-center p-6"> 
        <article class="flex flex-wrap gap-2">
            <CreateShift />
            <RouterLink to="/finalizar"><Button variant="outline">Finalizar Turno</Button></RouterLink>
        </article>
        <RouterLink to="/login"><Button>Login</Button></RouterLink>
    </section>

</template>