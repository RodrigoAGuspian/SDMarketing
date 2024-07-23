<script setup lang="ts">
import HeaderP from '@/components/Header/HeaderP.vue';
import Modelos from '@/components/models/Modelos.vue';
import Button from '@/components/ui/button/Button.vue';


</script>
<template>
   <HeaderP />
   <nav class="flex items-center px-6 gap-4">
        <RouterLink to="/modelos/create"><Button>Crear Modelo</Button></RouterLink>
        <RouterLink to="/plataformas"><Button>Gestionar Plataformas</Button></RouterLink>
   </nav>
    <section  class="flex justify-start items-start p-6">
        <article class="grow ">
            <Modelos />
        </article>
    </section>
</template>