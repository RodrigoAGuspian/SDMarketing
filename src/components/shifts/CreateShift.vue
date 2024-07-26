<script lang="ts">
import { defineComponent, ref } from 'vue';
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
import { collection, query, where, getDocs, addDoc, Timestamp, serverTimestamp } from 'firebase/firestore';
import { db } from '@/utils/firebase';
import type { Modelo } from '@/lib/modelo';
import LoadingOverlay from '../Loading/LoadingOverlay.vue';
import { useToast } from 'vue-toast-notification';
import 'vue-toast-notification/dist/theme-sugar.css';

const $toast = useToast();


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
    LoadingOverlay,
  },
  data() {
    return {
      searchQuery: ref(''),
      filteredModels: ref<Modelo[]>([]),
      isLoading: false,
      selectedUsername: ref(''),
    };
  },
  methods: {
    async searchModels() {
      if (this.searchQuery.length !== 0) {
        const q = query(
          collection(db, 'modelos'),
          where('username', '>=', this.searchQuery),
          where('username', '<=', this.searchQuery + '\uf8ff')
        );
        const querySnapshot = await getDocs(q);
        this.filteredModels = querySnapshot.docs.map((doc) => doc.data() as Modelo);
      } else {
        this.filteredModels = [];
      }
    },
    async iniciarTurno() {
      
      this.isLoading = true;
      const modelosRef = collection(db, 'modelos');
      const q = query(modelosRef, where('username', '==', this.selectedUsername));
      const querySnapshot = await getDocs(q);

      if (querySnapshot.empty) {
        return;
      }

      const modeloDoc = querySnapshot.docs[0];
      const modeloId = modeloDoc.id;

      // Verificar si ya existe un turno no finalizado para este modelo
      const turnosRef = collection(db, 'turnos');
      const turnosQuery = query(
        turnosRef,
        where('modelo', '==', modeloId),
        where('finalizado', '==', false)
      );
      const turnosSnapshot = await getDocs(turnosQuery);

      if (!turnosSnapshot.empty) {
        $toast.error('Ya hay un turno para ese username.');
        this.isLoading = false;
        return;
      }

      const nuevoTurno = {
        finalizado: false,
        desde: serverTimestamp(),
        hasta: Timestamp.fromDate(new Date(0)),
        ganancias: {},
        modelo: modeloId,
      };

      await addDoc(turnosRef, nuevoTurno);

      $toast.success('Se ha iniciado el turno con éxito.');
      this.isLoading = false;
    },
  },
});
</script>

<template>
<Toaster />
<loading-overlay :show="isLoading" />
<AlertDialog>
    <AlertDialogTrigger as-child>
      <Button variant="outline">
        Iniciar Turno
      </Button>
    </AlertDialogTrigger>
    <AlertDialogContent>
      <AlertDialogHeader>
        <AlertDialogTitle>Iniciar Turno</AlertDialogTitle>
        <AlertDialogDescription>
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
        </AlertDialogDescription>
      </AlertDialogHeader>
      <AlertDialogFooter>
        <AlertDialogCancel>Cancelar</AlertDialogCancel>
        <AlertDialogAction @click="iniciarTurno()">Iniciar</AlertDialogAction>
      </AlertDialogFooter>
    </AlertDialogContent>
</AlertDialog>
</template>