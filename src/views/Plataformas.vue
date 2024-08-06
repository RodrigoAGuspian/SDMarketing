<script lang="ts">
import { defineComponent, ref, onMounted } from 'vue';
import { createPlataforma, fetchPlataformas, updatePlataforma, deletePlataforma } from '@/utils/plataformas'; // Asegúrate de importar las funciones correctamente
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardFooter, CardHeader,  } from '@/components/ui/card';
import HeaderP from '@/components/Header/HeaderP.vue';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import LoadingOverlay from '@/components/Loading/LoadingOverlay.vue';
import { useToast } from 'vue-toast-notification';
import 'vue-toast-notification/dist/theme-sugar.css';

const $toast = useToast();

interface Plataforma {
  id: string;
  nombre: string;
}

export default defineComponent({
    components: {
    Button,
    Input,
    Card,
    CardHeader,
    CardFooter,
    HeaderP,
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
    LoadingOverlay,
  },
    
  setup() {
    const plataformas = ref<Plataforma[]>([]);
    const newPlataforma = ref('');
    const editingPlataforma = ref<Plataforma | null>(null);
    const plataformaToDelete = ref<Plataforma | null>(null);
    const isLoading = ref(false);

    const loadPlataformas = async () => {
      isLoading.value = true;
      plataformas.value = await fetchPlataformas();
      isLoading.value = false;
    };

    const addPlataforma = async () => {
      
      if (newPlataforma.value.trim()) {
        isLoading.value = true;
        await createPlataforma(newPlataforma.value.trim());
        newPlataforma.value = '';
        loadPlataformas();
        isLoading.value = false;
        $toast.success('Se ha guardado la plataforma.');
        
      } else {
        alert('El nombre de la plataforma no puede estar vacío.');
      }
      
    };

    const editPlataforma = (plataforma: Plataforma) => {
      editingPlataforma.value = { ...plataforma };
    };

    const savePlataforma = async () => {
      if (editingPlataforma.value?.nombre.trim()) {
        isLoading.value = true;
        await updatePlataforma(editingPlataforma.value?.id, editingPlataforma.value?.nombre.trim());
        editingPlataforma.value = null;
        loadPlataformas();
        isLoading.value = false;
        
      } else {
        alert('El nombre de la plataforma no puede estar vacío.');
      }
    };

    const confirmDeletePlataforma = (plataforma: Plataforma) => {
      plataformaToDelete.value = plataforma;
    };

    const removePlataforma = async () => {
      if (plataformaToDelete.value) {
        isLoading.value = true;
        await deletePlataforma(plataformaToDelete.value.id);
        plataformaToDelete.value = null;
        loadPlataformas();
        isLoading.value = false;
        $toast.success('Se ha eliminado la plataforma.');
      }
    };

    onMounted(loadPlataformas);

    return {
      plataformas,
      newPlataforma,
      editingPlataforma,
      plataformaToDelete,
      addPlataforma,
      editPlataforma,
      savePlataforma,
      confirmDeletePlataforma,
      removePlataforma,
      isLoading,
    };
  }
});
</script>

<template>
  <loading-overlay :show="isLoading" />
    <HeaderP />
    <nav class="seccion flex justify-between items-center px-6">
      <RouterLink to="/modelos"><Button class="button">Lista de Modelos</Button></RouterLink>
    </nav>
    <div class="container mx-auto p-4">
      <Card>
        <CardHeader>
          <h1 class="text-2xl font-bold mb-1">Gestión de Plataformas</h1>
        </CardHeader>
        <article class="font-bold6 grid grid-cols-2 gap-10 p-4">
          <section class="font-bold7 flex gap-2">
            <Input class="font-bold6" v-model="newPlataforma" placeholder="Nueva plataforma" />
            <Button @click="addPlataforma" class="button2 ml-2">Agregar</Button>
          </section>
          <ul class="grid">
          <div class="font-bold5">
            <li v-for="plataforma in plataformas" :key="plataforma.id" class="font-bold6 mt-2 grid grid-cols-2 gap-2 p-1">
              <span class="font-bold5" v-if="editingPlataforma?.id !== plataforma.id">{{ plataforma.nombre }}</span>
              <Input v-else v-model="editingPlataforma.nombre" class="font-bold2 mr-2" />
              <div class="font-bold5">
                <Button @click="editPlataforma(plataforma)" class="font-bold8 mr-2">Editar</Button>
                <AlertDialog>
                  <AlertDialogTrigger as-child>
                    <Button  @click="confirmDeletePlataforma(plataforma)" class="font-bold8 mr-2 mt-2 bg-red-500 text-white px-4 py-2">Eliminar</Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>¿Estás seguro?</AlertDialogTitle>
                      <AlertDialogDescription>
                        Esta acción no se puede deshacer. Esto eliminará permanentemente la plataforma.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancelar</AlertDialogCancel>
                      <AlertDialogAction @click="removePlataforma">Eliminar</AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
                <Button v-if="editingPlataforma?.id === plataforma.id" class="font-bold8 mr-2" @click="savePlataforma">Guardar</Button>
              </div>
            </li>
          </div>
          </ul>
        </article>
      </Card>
    </div>
  </template>


<style scoped>
  *{
    background-color: #19191a;
    border: none;
  }
  .button{
    display: flex;
    align-items:  center;
    font-size: 1.2rem;
    padding: 10% 15% 10% 15%;
    background-color: #19191a;
    border: solid #a87b05 2px;
    outline: 0;
    cursor: pointer;
    color: #f9db5c;
    border-radius: 5px;
  }
  .button:hover{
    padding:10% 15% 10% 15%;
    background-color: #19191a;
    border: solid 373739 1px;
    color:#f9db5c;
    box-shadow: 3px 3px 5px #a87b05;
    transform: translateY(-3%);
  }
  .button2{
    display: flex;
    align-items:  center;
    font-size: 0.9rem;
    padding: 4%;
    background-color: #f9db5c;
    border: solid #a87b05 1px;
    outline: 0;
    cursor: pointer;
    color: #373739;
    border-radius: 5px;
  }
  .button2:hover{
    padding:4%;
    background-color: #f9db5c;
    border: solid 373739 1px;
    color:#373739;
    font-size: 0.9rem;
    transform: translateY(-5%);
  }
  .font-bold{
    color:#f9db5c;
    font-family: 'Karla', sans-serif;
    font-size: 1.1rem;
  }
  .font-bold2{
    background-color: #19191a;
    border: none;
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
  .font-bold4{
    color:#f9db5c;
    padding: -1% 10% 1% 10%;
    background-color: #19191a;
    border:solid #a87b05 1px;
    font-family: 'Karla', sans-serif;
    font-size: 0.8rem;
  }
  .font-bold5{
    color:#f9db5c;
    background-color: #2f2f2f;
    padding: 5% 5% 3% 5%;
    font-family: 'Karla', sans-serif;
    font-size: 1rem;
    border-radius: 5px;
  }
  .font-bold6{
    color:#f9db5c;
    background-color: #2f2f2f;
    border:solid #a87b05 1px;
    font-family: 'Karla', sans-serif;
    font-size: 0.8rem;
    border-radius: 5px;
  }
  .font-bold6:hover{
    color:#f9db5c;
    background-color: #2f2f2f;
    border:solid #a87b05 1px;
    font-family: 'Karla', sans-serif;
    font-size: 0.8rem;
    border-radius: 5px;
    transform: translateY(-5%);
  }
  .font-bold7{
    color:#f9db5c;
    padding: 5% 4% 3% 4%;
    background-color: #2f2f2f;
    border:solid #a87b05 1px;
    font-family: 'Karla', sans-serif;
    font-size: 0.8rem;
    border-radius: 5px;
  }
  .font-bold8{
    color:#f9db5c;
    background-color: #2f2f2f;
    border:solid #a87b05 1px;
    font-family: 'Karla', sans-serif;
    font-size: 0.8rem;
    border-radius: 5px;
  }
  .font-bold8:hover{
    color:#f9db5c;
    background-color: #2f2f2f;
    border:solid #a87b05 1px;
    font-family: 'Karla', sans-serif;
    box-shadow: 2px 2px 1px #a87b05;
    font-size: 0.8rem;
    border-radius: 5px;
    transform: translateY(-5%);
  }
@media (max-width: 450px){
  .container{
    background-color: #19191a;
    width: 170%;
    height: 145vh;
    margin: 0px 0px 0px 0px;
  }
  .seccion{
    width: 170%;
  }
}
@media (min-width: 450px) and (max-width: 1100px){
  .container{
    background-color: #19191a;
    width: 120%;
    height: 95vh;
    margin:0px 0px 0px 0px;
  }
  .seccion{
    width: 120%;
  }
}
@media (min-width: 1100px) and (max-width: 1550px){
  .container{
    background-color: #19191a;
    width: 100%;
    height: 80vh;
    margin:0px 0px 0px 0px;
  }
  .seccion{
    width: 100%;
  }
}
  
</style>