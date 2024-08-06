<script setup lang="ts">
import HeaderP from '@/components/Header/HeaderP.vue';
import Modelos from '@/components/models/Modelos.vue';
import Button from '@/components/ui/button/Button.vue';


</script>
<template>
   <HeaderP />
   <nav class="font-bold2 flex items-center px-6 gap-4 space-x-6 mb-0">
        <RouterLink  to="/modelos/create"><Button class="button">Crear Modelo</Button></RouterLink>
        <RouterLink  to="/plataformas"><Button class="button">Gestionar Plataformas</Button></RouterLink>
   </nav>
    <section class="font-bold2 flex justify-start items-start p-6">
        <article class="grow ">
            <Modelos />
        </article>
    </section>
</template>

<style scoped>

.button{
    display: flex;
    align-items:  center;
    font-size: 1rem;
    padding: 8% ;
    background-color: #19191a;
    border: solid #a87b05 2px;
    outline: 0;
    cursor: pointer;
    color: #f9db5c;
    border-radius: 5px;
}
.button:hover{
    padding:8%;
    background-color: #19191a;
    border: solid 373739 1px;
    color:#f9db5c;
    box-shadow: 3px 3px 5px #a87b05;
    transform: translateY(-3%);
}
@media (max-width: 450px){
    nav{
    background-color: #19191a;
    width: 170%;
}
    section{
    width: 170%;
    height: 150vh;
    background-color: #19191a;
}
}
@media (min-width: 450px) and (max-width: 1100px){
    nav{
    background-color: #19191a;
    width: 120%;
    height: 3vh;
}
    section{
    width: 120%;
    height: 115vh;
    background-color: #19191a;
}
}
@media (min-width: 1100px) and (max-width: 1550px){
    nav{
    background-color: #19191a;
    width: 100%;
    height: 3vh;
}
    section{
    width: 100%;
    height: 115vh;
    background-color: #19191a;
}
}
</style>