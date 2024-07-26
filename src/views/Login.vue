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

  <header class="flex justify-between items-start p-6 ">
      <RouterLink to="/"><Button>Inicio</Button></RouterLink>
        
  </header>
  <section class="form-content grid justify-items-center">
    <h1 class="font-bold">Login</h1>
    <form class="grid gap-4 w-full md:w-[640px]" @submit="onSubmit">
      <FormField v-slot="{ componentField }" name="user">
        <FormItem>
          <FormLabel>Usuario</FormLabel>
          <FormControl>
            <Input type="text" v-bind="componentField" />
          </FormControl>
        </FormItem>
      </FormField>
      <FormField v-slot="{ componentField }" name="password">
        <FormItem>
          <FormLabel>Contraseña</FormLabel>
          <FormControl>
            <Input type="password" v-bind="componentField" />
          </FormControl>
        </FormItem>
      </FormField>
      <Button type="submit">
        Iniciar Sesión
      </Button>
    </form>
  </section>
</template>

<style scoped>
  .form-content{
    display: grid !important;
		align-content: center !important;
    padding: 20px;
  }
</style>