<script setup lang="ts">
import HeaderP from '@/components/Header/HeaderP.vue';
import { modelosPrev } from '@/lib/utils';
import { useRoute } from 'vue-router';

const route = useRoute()
let id = Number(route.params.id)
const modelo = modelosPrev.find( (a) =>{
    if (a.idModelo == id)
        return 1;
})
</script>
<template>
    <HeaderP />
    <article class="mx-12">
        <h2>Nombre: {{ modelo?.nombre }}</h2>
        <h2>Username: {{ modelo?.username }}</h2>
        <h2>Jornada: {{ modelo?.jornada }}</h2>
        
    </article>
</template>
