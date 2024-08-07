<script setup lang="ts">
import CreateShift from '@/components/shifts/CreateShift.vue';
import { Button } from '@/components/ui/button'
</script>
<template>
<<<<<<< HEAD
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
=======
    
    <section class="sm:flex sm:justify-between sm:items-start sm:p-6 px-2 grid-flow-col"> 
        <article class="sm:p-6">
            <h1 class="text-9xl text-[#f9db5c] text-sd">SD</h1>
            <h2 class="text-6xl p-8 text-gray-200 text-marketing">Marketing</h2>
        </article>
        
        <RouterLink to="/login"><Button class="w-full sm:w-min">Login</Button></RouterLink>
    </section>

    <article class="sm:flex sm:flex-wrap sm:gap-2 sm:p-6 px-2 grid grid-col-1 gap-2">
            <CreateShift />
            <RouterLink to="/finalizar"><Button variant="outline" class="w-full sm:w-min">Finalizar Turno</Button></RouterLink>
    </article>
</template>

<style>
.text-sd{
    color: #f9db5c;
    
    font-family: 'Libre Baskerville', serif;
}

.text-marketing{
    font-family: 'Karla', sans-serif;
}
</style>
>>>>>>> b11030d
