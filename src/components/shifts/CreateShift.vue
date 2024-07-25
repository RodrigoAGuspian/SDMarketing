<script lang='ts'>
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
} from '@/components/ui/alert-dialog'
import { Button } from '@/components/ui/button'
import { Search } from 'lucide-vue-next'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

import { ref } from 'vue';
import { collection, query, where, getDocs, addDoc, Timestamp, serverTimestamp } from 'firebase/firestore';
import { db } from '@/utils/firebase'
import type { Modelo } from '@/lib/modelo'
import { toast } from '../ui/toast'
import Loading from 'vue-loading-overlay';



export default {
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
    Loading
    
  },

  
  setup() {
    const searchQuery = ref('');
    const modelos = ref<Modelo[]>([]);
    const filteredModels = ref<Modelo[]>([]);
    let isLoading = false;

    const selectedUsername = ref('')


    const searchModels = async () => {
      if (searchQuery.value.length != 0){
        const q = query(collection(db, 'modelos'), where('username', '>=', searchQuery.value), where('username', '<=', searchQuery.value + '\uf8ff'));
        const querySnapshot = await getDocs(q);
        modelos.value = querySnapshot.docs.map(doc => doc.data() as Modelo);
        filteredModels.value = modelos.value;
      } else{
        filteredModels.value = [];  
      }
    };


    const iniciarTurno = async () =>{
      isLoading = true;
      const modelosRef = collection(db, "modelos");
      const q = query(modelosRef, where("username", "==", selectedUsername.value));
      const querySnapshot = await getDocs(q);

      if (querySnapshot.empty) {
        return;
      }

      const modeloDoc = querySnapshot.docs[0];
      const modeloId = modeloDoc.id;

      // Verificar si ya existe un turno no finalizado para este modelo
      const turnosRef = collection(db, "turnos");
      const turnosQuery = query(turnosRef, where("modelo", "==", modeloId), where("finalizado", "==", false));
      const turnosSnapshot = await getDocs(turnosQuery);

      if (!turnosSnapshot.empty) {
        return;
      }

      const nuevoTurno  = {
        finalizado: false,
        desde:  serverTimestamp(),
        hasta: Timestamp.fromDate(new Date(0)),
        ganancias: {},
        modelo: modeloId,
      };

      await addDoc(turnosRef, nuevoTurno);
      
      toast({
        title: 'Se ha iniciado el turno con éxito',
        description: '',
      });
      isLoading = false;

    }

    return {
      searchQuery,
      filteredModels,
      searchModels,
      iniciarTurno,
      selectedUsername,
      isLoading
    };
  }
};

</script>

<template>
<loading v-model:active="isLoading"
                 :can-cancel="false"
                 :is-full-page="true"/>
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