<script setup lang="ts">
import { useForm } from 'vee-validate'
import { toTypedSchema } from '@vee-validate/zod'
import * as z from 'zod'

import { Button } from '@/components/ui/button'
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { useRouter } from 'vue-router';
import { auth } from '@/utils/firebase'
import { signInWithEmailAndPassword } from 'firebase/auth'

import LoadingOverlay from '@/components/Loading/LoadingOverlay.vue';
import { ref } from 'vue'
import { useToast } from 'vue-toast-notification';
import 'vue-toast-notification/dist/theme-sugar.css';

const $toast = useToast();

const router2 = useRouter();
const isLoading = ref(false);

const formSchema = toTypedSchema(z.object({
  user: z.string().min(2).max(100),
  password: z.string().min(2).max(100),
}))

const { handleSubmit } = useForm({
  validationSchema: formSchema,
});

const onSubmit = handleSubmit((values) => {
  isLoading.value = true;  
  const email = values.user; 
  const password = values.password

  signInWithEmailAndPassword(auth, email, password)
  .then((userCredential) => {
    // Signed in 
    //const user = userCredential.user;
    isLoading.value = false;
    router2.push('/modelos');
    $toast.success('Se ha iniciado sesión correctamente.');
    
    
  })
  .catch((error) => {
    console.log(error);
    isLoading.value = false;
    $toast.error('No se ha podido iniciar sesión.');
  });

  
});

</script>

<template>
  <Toaster />
  <loading-overlay :show="isLoading" />

  <div class="vl-parent">
    <loading v-model:active="isLoading"
                :can-cancel="false"
                :is-full-page="true"/>
  </div>

  <header class="header">
      <RouterLink to="/"><Button class = "inicio" >Inicio</Button></RouterLink>
        
  </header>
  <section class="form-content grid justify-items-center">
    <h1 class="font-bold">Login</h1>
    <form class="grid gap-4 w-full md:w-[640px]" @submit="onSubmit">
      <FormField v-slot="{ componentField }" name="user">
        <FormItem>
          <FormLabel class="font-bold2">Usuario</FormLabel>
          <FormControl>
            <Input class="font-bold3" type="text" v-bind="componentField" />
          </FormControl>
        </FormItem>
      </FormField>
      <FormField v-slot="{ componentField }" name="password">
        <FormItem>
          <FormLabel class="font-bold2">Contraseña</FormLabel>
          <FormControl>
            <Input class="font-bold3" type="password" v-bind="componentField" />
          </FormControl>
        </FormItem>
      </FormField>
      <Button class = "sesion" type="submit">
        Iniciar Sesión
      </Button>
    </form>
  </section>
</template>

<style scoped>
@media (max-width: 412px){
  .form-content{
    display: grid !important;
		align-content: center !important;
    padding: 0px 20px 250px 30px;
    background-color: #19191a;
    width: 100%;
    height: 100vh;
  }
  .header{
    background-color: #19191a;
    padding: 10% 65% 10% 10%;
    align-items: flex-start;
  }

  .inicio{
    display: flex;
    align-items:  center;
    font-size: 1.2rem;
    padding: 10% 35% 10% 35%;
    background-color: #19191a;
    border: solid #a87b05 2px;
    outline: 0;
    cursor: pointer;
    color: #f9db5c;
    border-radius: 5px;
  }
  .inicio:hover{
    padding:10% 35% 10% 35%;
    background-color: #19191a;
    border: solid 373739 1px;
    color:#f9db5c;
    box-shadow: 3px 3px 5px #a87b05;
    transform: translateY(-3%);
  }
  .sesion{
    display: flex;
    align-items:  center;
    margin: 5px;
    font-size: 1.2rem;
    padding: 5%;
    background-color: #f9db5c;
    border: solid #a87b05 1px;
    outline: 0;
    cursor: pointer;
    color: #373739;
    font-size: 1.1rem;
    border-radius: 25px;
  }
  .sesion:hover{
    padding:5%;
    background-color: #f9db5c;
    border: solid 373739 1px;
    color:#373739;
    font-size: 1.1rem;
    transform: translateY(-5%);
  }
  .font-bold{
    color:#f9db5c;
    font-family: 'Karla', sans-serif;
    font-size: 1.15rem;
  }
  .font-bold2{
    color:#f9db5c;
    font-family: 'Karla', sans-serif;
    font-size: 1rem;
  }
  .font-bold3{
    color:#f9db5c;
    background-color: #19191a;
    border:solid #a87b05 1px;
    font-family: 'Karla', sans-serif;
    font-size: 1rem;
  }
}
@media (min-width: 412px) and (max-width: 1100px){
  .form-content{
    display: grid !important;
		align-content: center !important;
    padding: 0px 20px 500px 30px;
    background-color: #19191a;
    width: 100%;
    height: 100vh;
  }
  .header{
    background-color: #19191a;
    padding: 10% 65% 5% 10%;
    align-items: flex-start;
  }

  .inicio{
    display: flex;
    align-items:  center;
    font-size: 1.2rem;
    padding: 10% 35% 10% 35%;
    background-color: #19191a;
    border: solid #a87b05 2px;
    outline: 0;
    cursor: pointer;
    color: #f9db5c;
    border-radius: 5px;
  }
  .inicio:hover{
    padding:10% 35% 10% 35%;
    background-color: #19191a;
    border: solid 373739 1px;
    color:#f9db5c;
    box-shadow: 3px 3px 5px #a87b05;
    transform: translateY(-3%);
  }
  .sesion{
    display: flex;
    align-items:  center;
    margin: 5px;
    font-size: 1.2rem;
    padding: 2%;
    background-color: #f9db5c;
    border: solid #a87b05 1px;
    outline: 0;
    cursor: pointer;
    color: #373739;
    font-size: 1.1rem;
    border-radius: 25px;
  }
  .sesion:hover{
    padding:2%;
    background-color: #f9db5c;
    border: solid 373739 1px;
    color:#373739;
    font-size: 1.1rem;
    transform: translateY(-5%);
  }
  .font-bold{
    color:#f9db5c;
    font-family: 'Karla', sans-serif;
    font-size: 1.15rem;
  }
  .font-bold2{
    color:#f9db5c;
    font-family: 'Karla', sans-serif;
    font-size: 1rem;
  }
  .font-bold3{
    color:#f9db5c;
    background-color: #19191a;
    border:solid #a87b05 1px;
    font-family: 'Karla', sans-serif;
    font-size: 1rem;
  }
}
@media (min-width: 1100px) and (max-width: 1550px){
  .form-content{
    display: grid !important;
		align-content: center !important;
    padding: 0px 20px 600px 30px;
    background-color: #19191a;
    width: 100%;
    height: 100vh;
  }
  .header{
    background-color: #19191a;
    padding: 5% 75% 13% 5%;
    align-items: flex-start;
  }

  .inicio{
    display: flex;
    align-items:  center;
    font-size: 1.2rem;
    padding: 5% 20% 5% 20%;
    margin-top: 5px;
    background-color: #19191a;
    border: solid #a87b05 2px;
    outline: 0;
    cursor: pointer;
    color: #f9db5c;
    border-radius: 5px;
  }
  .inicio:hover{
    padding: 5% 20% 5% 20%;
    background-color: #19191a;
    border: solid 373739 1px;
    color:#f9db5c;
    box-shadow: 3px 3px 5px #a87b05;
    transform: translateY(-3%);
  }
  .sesion{
    display: flex;
    align-items:  center;
    margin: 2%;
    font-size: 1.2rem;
    padding: 2% 5%;
    background-color: #f9db5c;
    border: solid #a87b05 1px;
    outline: 0;
    cursor: pointer;
    color: #373739;
    font-size: 1.1rem;
    border-radius: 25px;
  }
  .sesion:hover{
    padding:2% 5%;
    background-color: #f9db5c;
    border: solid 373739 1px;
    color:#373739;
    font-size: 1.1rem;
    transform: translateY(-5%);
  }
  .font-bold{
    color:#f9db5c;
    font-family: 'Karla', sans-serif;
    font-size: 1.15rem;
  }
  .font-bold2{
    color:#f9db5c;
    font-family: 'Karla', sans-serif;
    font-size: 1rem;
  }
  .font-bold3{
    color:#f9db5c;
    background-color: #19191a;
    border:solid #a87b05 1px;
    font-family: 'Karla', sans-serif;
    font-size: 1rem;
  }
}
</style>