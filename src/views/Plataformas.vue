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
import { toast } from '@/components/ui/toast';
import Loading from 'vue-loading-overlay';
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
    Loading
  },
    
  setup() {
    const plataformas = ref<Plataforma[]>([]);
    const newPlataforma = ref('');
    const editingPlataforma = ref<Plataforma | null>(null);
    const plataformaToDelete = ref<Plataforma | null>(null);
    let isLoading = false;

    const loadPlataformas = async () => {
      isLoading = true;
      plataformas.value = await fetchPlataformas();
      isLoading = false;
    };

    const addPlataforma = async () => {
      
      if (newPlataforma.value.trim()) {
        isLoading = true;
        await createPlataforma(newPlataforma.value.trim());
        newPlataforma.value = '';
        loadPlataformas();
        isLoading = false;
        toast({
          title: 'Se ha guardado la plataforma con éxito',
          description: '',
        });
        
      } else {
        alert('El nombre de la plataforma no puede estar vacío.');
      }
      
    };

    const editPlataforma = (plataforma: Plataforma) => {
      editingPlataforma.value = { ...plataforma };
    };

    const savePlataforma = async () => {
      if (editingPlataforma.value?.nombre.trim()) {
        isLoading = true;
        await updatePlataforma(editingPlataforma.value?.id, editingPlataforma.value?.nombre.trim());
        editingPlataforma.value = null;
        loadPlataformas();
        isLoading = false;
        
      } else {
        alert('El nombre de la plataforma no puede estar vacío.');
      }
    };

    const confirmDeletePlataforma = (plataforma: Plataforma) => {
      plataformaToDelete.value = plataforma;
    };

    const removePlataforma = async () => {
      if (plataformaToDelete.value) {
        isLoading = true;
        await deletePlataforma(plataformaToDelete.value.id);
        plataformaToDelete.value = null;
        loadPlataformas();
        isLoading = false;
        toast({
          title: 'Se ha eliminado la plataforma con éxito',
          description: '',
        });
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
  <loading v-model:active="isLoading"
                 :can-cancel="false"
                 :is-full-page="true"/>
    <HeaderP />
    <nav class="flex justify-between items-center px-6">
      <RouterLink to="/modelos"><Button>Lista de Modelos</Button></RouterLink>
    </nav>
    <div class="container mx-auto p-4">
      <Card>
        <CardHeader>
          <h1 class="text-2xl font-bold mb-4">Gestión de Plataformas</h1>
        </CardHeader>
        <article class="grid grid-cols-2 gap-10 p-4">
          <section class="flex gap-2">
            <Input v-model="newPlataforma" placeholder="Nueva plataforma" />
            <Button @click="addPlataforma" class="ml-2">Agregar</Button>
          </section>
          <ul class="grid">
            <li v-for="plataforma in plataformas" :key="plataforma.id" class="grid grid-cols-2 gap-2 p-1">
              <span v-if="editingPlataforma?.id !== plataforma.id">{{ plataforma.nombre }}</span>
              <Input v-else v-model="editingPlataforma.nombre" class="mr-2" />
              <div>
                <Button @click="editPlataforma(plataforma)" class="mr-2">Editar</Button>
                <AlertDialog>
                  <AlertDialogTrigger as-child>
                    <Button  @click="confirmDeletePlataforma(plataforma)" class="mr-2 bg-red-500 text-white px-4 py-2">Eliminar</Button>
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
                <Button v-if="editingPlataforma?.id === plataforma.id" class="mr-2" @click="savePlataforma">Guardar</Button>
              </div>
            </li>
          </ul>
        </article>
      </Card>
    </div>
  </template>