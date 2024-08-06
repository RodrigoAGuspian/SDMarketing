<script setup lang="ts">
import CreateShift from '@/components/shifts/CreateShift.vue';
import { Button } from '@/components/ui/button'
</script>
<template>
    <div class = container>
        <nav>
          <div class="nav-cont">
            <span>SD</span>
            <p>Marketing</p>
          </div>
        </nav>
    <section class="cuerpo"> 
        <article class = "inicio">
            <RouterLink to="/login"><Button class = "login">Login</Button></RouterLink>
        </article>
        <article class="botones ">
            <CreateShift />
            <RouterLink to="/finalizar"><Button class="finalizar" variant="outline">Finalizar Turno</Button></RouterLink>
        </article>
    </section>
    </div>
</template>

<style scoped>

    nav{
        position: relative;
        display: flex;
        align-items: center;
        width: 50%;
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
        font-size: 7.5rem;
        color: #664300;
    }
    .nav-cont p{
        margin-left: 11px;
        font-size: 3.5rem;
    }
    .login{
        align-items:  center;
        margin: 5px;
        padding: 35px 75px 35px 75px;
        font-size: 2.2rem;
        background-color: #f9db5c;
        border: solid #a87b05 1px;
        outline: 0;
        cursor: pointer;
        color: #373739;
        border-radius: 5px;
    }
    .login:hover{
        background-color: #f9db5c;
        padding: 4px 20px 6px 20px;
        border: solid 373739 1px;
        color:#373739;
        transform: translateY(-5%);
    }

@media (max-width: 540px) {
    .container{
        width: 255%;
        height: 260vh;
        background-color: #19191a;
    }
    .inicio{
        padding: 10% 0% 10% 70%;
    }
    .botones{
        justify-content: center;
        padding: 30% 0% 0% 25%;
    }
    .finalizar{
        display: flex;
        align-items:  center;
        font-size: 3.2rem;
        padding: 50px 105px 50px 105px;
        background-color: #19191a;
        border: solid #a87b05 2px;
        outline: 0;
        cursor: pointer;
        color: #f9db5c;
        border-radius: 25px;
    }
    .finalizar:hover{
        padding: 50px 105px 50px 105px;
        background-color: #19191a;
        border: solid 373739 1px;
        color:#f9db5c;
        box-shadow: 3px 3px 5px #a87b05;
        transform: translateY(-3%);
    }

}
@media (min-width: 540px) and (max-width: 1100px) {
    .container{
        width: 255%;
        height: 260vh;
        background-color: #19191a;
    }
    .inicio{
        align-items: end;
        width: 50%;
        padding: 10% 0% 10% 70%;
    }
    .botones{
        width: 70%;
        align-items: center;
        padding: 10% 0% 0% 40%;
    }
    .finalizar{
        display: flex;
        align-items:  center;
        font-size: 3.5rem;
        padding: 55px 105px 55px 105px;
        background-color: #19191a;
        border: solid #a87b05 2px;
        outline: 0;
        cursor: pointer;
        color: #f9db5c;
        border-radius: 25px;
    }
    .finalizar:hover{
        padding: 55px 105px 55px 105px;
        background-color: #19191a;
        border: solid 373739 1px;
        color:#f9db5c;
        box-shadow: 3px 3px 5px #a87b05;
        transform: translateY(-3%);
    }
}
@media (min-width: 1100px) and (max-width: 1550px) {
    .container{
        width: 150%;
        height: 150vh;
        background-color: #19191a;
    }
    .inicio{
        align-items: end;
        width: 50%;
        padding: 2% 0% 2% 80%;
    }
    .finalizar{
        display: flex;
        align-items:  center;
        font-size: 2rem;
        padding: 35px 80px 35px 80px;
        background-color: #19191a;
        border: solid #a87b05 2px;
        outline: 0;
        cursor: pointer;
        color: #f9db5c;
        border-radius: 25px;
    }
    .finalizar:hover{
        padding: 55px 115px 55px 115px;
        background-color: #19191a;
        border: solid 373739 1px;
        color:#f9db5c;
        box-shadow: 3px 3px 5px #a87b05;
        transform: translateY(-3%);
    }
    .botones{
        width: 70%;
        align-items: center;
        padding: 10% 0% 0% 40%;
    }
}
</style>
