<script lang='ts'>
import { defineComponent } from 'vue';
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
import { Button } from '@/components/ui/button';
import { Search } from 'lucide-vue-next';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

import { collection, query, where, getDocs, serverTimestamp, updateDoc } from 'firebase/firestore';
import { db } from '@/utils/firebase';
import type { Modelo } from '@/lib/modelo';
import { useRouter } from 'vue-router';

export default defineComponent({
  name: 'ModelSearch',
  components: {
    Button,
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectLabel,
    SelectTrigger,
    SelectValue,
    Input,
    Search,
  },
  data() {
    return {
      searchQuery: '',
      modelos: [] as Modelo[],
      filteredModels: [] as Modelo[],
      selectedUsername: '',
      plataformasDisponibles: [] as string[],
      ganancias: {} as { [key: string]: number },
    };
  },
  methods: {
    async fetchPlataformas() {
      const querySnapshot = await getDocs(collection(db, 'plataformas'));
      this.plataformasDisponibles = querySnapshot.docs.map(doc => doc.data().nombre);
    },
    async searchModels() {
      try {
        if (this.searchQuery.length !== 0) {
        const q = query(
          collection(db, 'modelos'),
          where('username', '>=', this.searchQuery),
          where('username', '<=', this.searchQuery + '\uf8ff')
        );
        const querySnapshot = await getDocs(q);
        this.modelos = querySnapshot.docs.map(doc => doc.data() as Modelo);
        this.filteredModels = this.modelos;
      } else {
        this.filteredModels = [];
      }
      } catch (error) {
        console.log("Error", error);
      }
    },
    async finalizarTurno() {
      try {
        const modelosRef = collection(db, 'modelos');
        const q = query(modelosRef, where('username', '==', this.selectedUsername));
        const querySnapshot = await getDocs(q);

        if (querySnapshot.empty) {
          return;
        }

        const modeloDoc = querySnapshot.docs[0];
        const modeloId = modeloDoc.id;

        const turnosRef = collection(db, 'turnos');
        const turnosQuery = query(turnosRef, where('modelo', '==', modeloId), where('finalizado', '==', false));
        const turnosSnapshot = await getDocs(turnosQuery);

        if (turnosSnapshot.empty) {
          return;
        }

        const turnoDoc = turnosSnapshot.docs[0];
        const turnoId = turnoDoc.id;

        // Actualizar el turno para marcarlo como finalizado
        const turnoRef = turnoDoc.ref;
        await updateDoc(turnoRef, {
          finalizado: true,
          hasta: serverTimestamp(),
          ganancias: this.ganancias,
        });

        this.$router.push('/');

        console.log('Turno finalizado con ID: ', turnoId);
      } catch (error) {
        console.error('Error finalizando el turno: ', error);
      }
    },
  },
  async created() {
    await this.fetchPlataformas();
    await this.searchModels()
  },
});
</script>


<template>
    <header class="flex justify-between items-start p-6">
      <RouterLink to="/"><Button>Inicio</Button></RouterLink>
        
    </header>
    <section class="max-w-lg my-6 mx-auto p-6 bg-white shadow-md rounded">
        <h1 class="text-2xl font-bold mb-4">Finalizar Turno</h1>
        <Select v-model="selectedUsername">
            <SelectTrigger>
            <SelectValue placeholder="Buscar por username..." />
            </SelectTrigger>
            <SelectContent>
            <div class="relative w-full items-center">
                <Input id="search" v-model="searchQuery" @input="searchModels" type="text" placeholder="Buscar por username..." class="pl-10 w-full" />
                <span class="absolute start-0 inset-y-0 flex items-center justify-center px-2">
                <Search class="size-6 text-muted-foreground" />
                </span>
            </div>
            <SelectGroup>
                <SelectLabel>Resultados</SelectLabel>
                <SelectItem v-for="modelo in filteredModels" :key="modelo.id" :value="modelo.username" >
                <span>{{ modelo.username }}</span>
                </SelectItem>
            </SelectGroup>
            </SelectContent>
        </Select>
        <div class="mb-4">
        <label class="block text-gray-700 text-sm font-bold mb-2">Ganancias:</label>
        <div v-for="plataforma in plataformasDisponibles" :key="plataforma" class="mb-2">
            <label class="block text-gray-600">{{ plataforma }}:</label>
            <input v-model="ganancias[plataforma]" type="number" class="w-full px-3 py-2 border rounded" />
        </div>
        </div>
        <div class="flex items-center justify-end space-x-2 py-2">
            <div class="space-x-2">
            <RouterLink to="/"><Button>Cancelar</Button></RouterLink>
            <Button @click="finalizarTurno" >Finalizar</Button>
            </div>
        </div>
    </section>
</template>