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

const router2 = useRouter();


const formSchema = toTypedSchema(z.object({
  user: z.string().min(2).max(100),
  password: z.string().min(2).max(100),
}))

const { handleSubmit } = useForm({
  validationSchema: formSchema,
});

const onSubmit = handleSubmit((values) => {
  router2.push('/modelos');
  
  
});

</script>

<template>
  <section class="form-content grid justify-items-center">
    
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