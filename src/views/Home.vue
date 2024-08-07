<script setup lang="ts">
import CreateShift from '@/components/shifts/CreateShift.vue';
import { Button } from '@/components/ui/button'
</script>
<template>
    <div class="w-full lg:w-[1024px]">
        <nav class="flex justify-between ">
            <div>
                <span class="text-9xl sd">SD</span>
                <p class="text-6xl">Marketing</p>
                <article class="flex justify-normal">
                    <CreateShift />
                    <RouterLink to="/finalizar"><Button variant="outline">Finalizar Turno</Button></RouterLink>
                </article>
            </div>
            <RouterLink to="/login" class="order-last"><Button class="text-2xl scale-125 hover:scale-150" >Login</Button></RouterLink>
        </nav>
    </div>
</template>

<style>

nav{
    color: #f9db5c;
    font-family: 'Karla', sans-serif;
    font-size: 1.15rem;
}

.sd{
    font-family: 'Libre Baskerville', serif;
    font-size: 7.5rem;
    color: #664300;
}
.nav-cont p{
    margin-left: 8px;
    font-size: 3.5rem;
}
</style>
