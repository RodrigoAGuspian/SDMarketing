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
      searchQuery: '',
      modelos: [] as Modelo[],
      filteredModels: [] as Modelo[],
      selectedUsername: '',
      plataformasDisponibles: [] as string[],
      ganancias: {} as { [key: string]: number },
      isLoading: false,
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
      this.isLoading = true;
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
        $toast.success('Se ha finalizado el turno con éxito.');
        this.isLoading = false;
        this.$router.push('/');
        

      } catch (error) {
        $toast.error('No se pudo finalizar el turno.');
        this.isLoading = false;
      }
    },
  },
  async created() {
    this.isLoading = true;
    await this.fetchPlataformas();
    await this.searchModels()
    this.isLoading = false;
  },
});
</script>


<template>
  <loading-overlay :show="isLoading" />
    <header class="header">
      <RouterLink to="/"><Button class = "inicio">Inicio</Button></RouterLink>
        
    </header>
    <section class="form-content max-w-lg mx-auto p-6 shadow-md">
      <div class="container">
        <h1 class="text-2xl font-bold mb-4">Finalizar Turno</h1>
        <Select v-model="selectedUsername">
            <SelectTrigger class="font-bold3">
            <SelectValue placeholder="Buscar por username..." />
            </SelectTrigger>
            <SelectContent class="select">
            <div class="font-bold2 relative w-full items-center">
                <Input id="search" v-model="searchQuery" @input="searchModels" type="text" placeholder="Buscar por username..." class="font-bold2 pl-10 w-full" />
                <span class="absolute start-0 inset-y-0 flex items-center justify-center px-2">
                <Search class="font-bold2 size-6 text-muted-foreground" />
                </span>
            </div>
            <SelectGroup class="select">
                <SelectLabel class="font-bold2">Resultados</SelectLabel>
                <SelectItem v-for="modelo in filteredModels" :key="modelo.id" :value="modelo.username" >
                <span>{{ modelo.username }}</span>
                </SelectItem>
            </SelectGroup>
            </SelectContent>
        </Select>
        <div class="mb-4">
        <label class="block text-gray-700 text-sm font-bold mb-2 mt-5">Ganancias:</label>
        <div v-for="plataforma in plataformasDisponibles" :key="plataforma" class="mb-2">
            <label class="font-bold2 block text-gray-600">{{ plataforma }}:</label>
            <input v-model="ganancias[plataforma]" type="number" class=" font-bold3 w-full px-3 py-2 border rounded" />
        </div>
        </div>
        <div class="flex items-center justify-end space-x-2 py-2">
            <div class="space-x-2">
            <RouterLink to="/"><Button class = "sesion">Cancelar</Button></RouterLink>
            <Button class = "sesion" @click="finalizarTurno" >Finalizar</Button>
            </div>
        </div>
      </div>
    </section>
</template>

<style scoped>

  .inicio{
    display: flex;
    align-items:  center;
    font-size: 1.2rem;
    padding: 5px 25px 5px 25px;
    background-color: #19191a;
    border: solid #a87b05 2px;
    outline: 0;
    cursor: pointer;
    color: #f9db5c;
    border-radius: 5px;
  }
  .inicio:hover{
    padding:5px 20px 5px 20px;
    background-color: #19191a;
    border: solid 373739 1px;
    color:#f9db5c;
    box-shadow: 3px 3px 5px #a87b05;
    transform: translateY(-3%);
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
  .sesion{
    align-items:  center;
    margin: 5px;
    font-size: 1.2rem;
    background-color: #f9db5c;
    border: solid #a87b05 1px;
    outline: 0;
    cursor: pointer;
    color: #373739;
    border-radius: 5px;
  }
  .sesion:hover{
    background-color: #f9db5c;
    border: solid 373739 1px;
    color:#373739;
    font-size: 1.1rem;
    transform: translateY(-5%);
  }
@media (max-width: 450px){
  .header{
    background-color: #19191a;
    padding: 10% 10% 10% 10%;
    width: 135%;
    align-items: flex-start;
  }
  .container{
    width: 100%;
    height: 120vh;
  }
  .form-content{
    display: grid !important;
		align-content: center !important;
    background-color: #19191a !important;
    margin: 0px 0px 0px 0px;
  }
}
@media (min-width: 450px) and (max-width: 1100px){
  .header{
    background-color: #19191a;
    padding: 10% 10% 10% 10%;
    width: 100%;
    align-items: flex-start;
  }
  .container{
    width: 100%;
    height: 110vh;
  }
  .form-content{
    display: grid !important;
		align-content: center !important;
    padding: 0px 30px 250px 30px;
    margin: 0px 0px 0px 0px;
    background-color: #19191a;
  }
}
@media (min-width: 1100px) and (max-width: 1550px){
  .header{
    background-color: #19191a;
    padding: 5% 5% 5% 5%;
    width: 100%;
    align-items: flex-start;
  }
  .container{
    padding: 0px 0px 0px 0px;
    height: 110vh;
  }
  .form-content{
    display: grid !important;
		align-content: center !important;
    padding: 0px 30px 250px 30px;
    background-color: #19191a;
  }
}
</style>