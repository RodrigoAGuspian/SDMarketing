<script setup lang="ts">
import { Button } from '@/components/ui/button'
import { useRouter } from 'vue-router'
const router = useRouter();
function logout(){
    router.push('/');

}
</script>
<template>
    <header class="flex justify-between items-center p-6">
        <h1 class="font-black opacity-80 ">SD Marketing</h1>

        <nav class="flex flex-row gap-x-4"> 
            <Button v-on:click="logout">Cerrar sesion</Button>
        </nav>
    </header>
</template>