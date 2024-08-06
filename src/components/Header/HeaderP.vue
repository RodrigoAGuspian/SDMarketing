<script setup lang="ts">
import { Button } from '@/components/ui/button'
import { auth } from '@/utils/firebase'
import { signOut } from 'firebase/auth';
import { useRouter } from 'vue-router'
const router = useRouter();
function logout(){
    signOut(auth).then(() => {
        router.push('/');        
    }).catch((error) => {
        router.push('/');
    });

}
</script>
<template>
    <header class="header flex justify-between items-center p-6 ">
        <nav class = "cont">
          <div class="nav-cont">
            <span>SD</span>
            <p>Marketing</p>
          </div>
        </nav>
        <nav class="flex flex-row gap-x-4"> 
            <Button class="button" v-on:click="logout">Cerrar sesion</Button>
        </nav>
    </header>
</template>

<style scoped>
.button{
    align-items:  center;
    margin: 5px;
    font-size: 1.2rem;
    background-color: #f9db5c;
    border: solid #a87b05 1px;
    outline: 0;
    cursor: pointer;
    color: #373739;
    font-size: 1.1rem;
    border-radius: 5px;
}
.button:hover{
    background-color: #f9db5c;
    border: solid 373739 1px;
    color:#373739;
    font-size: 1.1rem;
    transform: translateY(-5%);
  }
.cont{
    position: relative;
    display: flex;
    align-items: center;
    width: 100%;
    padding: 0 5% 5% 0;
    color: #f9db5c;
    font-family: 'Karla', sans-serif;
    font-size: 1.15rem;
}
li{
    list-style: none;
}
.nav-cont{
    display: flex;
    align-items: center;
}
.nav-cont span{
    font-family: 'Libre Baskerville', serif;
    font-size: 3.2rem;
    color: #664300;
}
.nav-cont p{
    margin-left: 3px;
    font-size: 1.5rem;
}
@media (max-width: 450px){
    .header{
    background-color: #19191a;
    width: 170%;
    height: 20vh;
}
}
@media (min-width: 450px) and (max-width: 1100px){
    .header{
    background-color: #19191a;
    width: 120%;
    height: 20vh;
}
}
@media (min-width: 1100px) and (max-width: 1550px){
    .header{
    background-color: #19191a;
    width: 100%;
    height: 20vh;
}
}
</style>