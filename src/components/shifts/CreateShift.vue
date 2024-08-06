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

<template >
<Toaster />
<loading-overlay :show="isLoading" />
<AlertDialog >
    <AlertDialogTrigger as-child>
      <Button class = "button1 mb-6 mt-20" variant="outline">
        Iniciar Turno
      </Button>
    </AlertDialogTrigger>
    <AlertDialogContent>
      <AlertDialogHeader>
        <AlertDialogTitle class="font-bold">Iniciar Turno</AlertDialogTitle>
        <AlertDialogDescription class = "font-bold2">
          <Select v-model="selectedUsername">
            <SelectTrigger class = "font-bold3">
              <SelectValue placeholder="Buscar por username..." />
            </SelectTrigger>
            <SelectContent>
              <div class="relative w-full items-center">
                <Input id="search" v-model="searchQuery" @input="searchModels" type="text" placeholder="Buscar por username..." class="font-bold3 pl-10 w-full" />
                <span class="font-bold2 absolute start-0 inset-y-0 flex items-center justify-center px-2">
                  <Search class="font-bold2 size-6 text-muted-foreground" />
                </span>
              </div>
              <SelectGroup class = "font-bold2">
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
        <AlertDialogCancel class = "font-bold3">Cancelar</AlertDialogCancel>
        <AlertDialogAction class="sesion" @click="iniciarTurno()">Iniciar</AlertDialogAction>
      </AlertDialogFooter>
    </AlertDialogContent>
</AlertDialog>
</template>

<style scoped>
  .header{
      background-color: #19191a;
    }
    .button{
      display: flex;
      align-items:  center;
      font-size: 1.2rem;
      padding: 4px 30px 4px 30px;
      background-color: #19191a;
      border: solid #a87b05 2px;
      outline: 0;
      cursor: pointer;
      color: #f9db5c;
      border-radius: 25px;
  }
  .button:hover{
      padding: 4px 30px 4px 30px;
      background-color: #373739;
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
    background-color: #373739;
    border: none;
    color:#f9db5c;
    font-family: 'Karla', sans-serif;
    font-size: 1rem;
  }
  .font-bold3{
    color:#f9db5c;
    background-color: #373739;
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
    font-size: 1.1rem;
    border-radius: 5px;
  }
  .sesion:hover{
    background-color: #f9db5c;
    border: solid 373739 1px;
    color:#373739;
    font-size: 1.1rem;
    transform: translateY(-5%);
  }

  @media (max-width: 450px) {
    .button1{
      display: flex;
      align-items:  center;
      font-size: 3.2rem;
      padding: 55px 135px 55px 135px;
      background-color: #19191a;
      border: solid #a87b05 2px;
      outline: 0;
      cursor: pointer;
      color: #f9db5c;
      border-radius: 25px;
  }
  .button1:hover{
      padding: 5px 30px 5px 30px;
      background-color: #19191a;
      border: solid 373739 1px;
      color:#f9db5c;
      box-shadow: 3px 3px 5px #a87b05;
      transform: translateY(-3%);
  }
}
  @media (min-width: 450px) and (max-width: 1100px) {
    .button1{
      display: flex;
      align-items:  center;
      font-size: 3.5rem;
      padding: 55px 135px 55px 135px;
      background-color: #19191a;
      border: solid #a87b05 2px;
      outline: 0;
      cursor: pointer;
      color: #f9db5c;
      border-radius: 25px;
  }
  .button1:hover{
      padding: 55px 135px 55px 135px;
      background-color: #19191a;
      border: solid 373739 1px;
      color:#f9db5c;
      box-shadow: 3px 3px 5px #a87b05;
      transform: translateY(-3%);
  }
}
  @media (min-width: 1100px) and (max-width: 1550px) {
    .button1{
      display: flex;
      align-items:  center;
      font-size: 2rem;
      padding: 35px 100px 35px 100px;
      background-color: #19191a;
      border: solid #a87b05 2px;
      outline: 0;
      cursor: pointer;
      color: #f9db5c;
      border-radius: 25px;
  }
  .button1:hover{
      padding: 35px 100px 35px 100px;
      background-color: #19191a;
      border: solid 373739 1px;
      color:#f9db5c;
      box-shadow: 3px 3px 5px #a87b05;
      transform: translateY(-3%);
  }

  }
</style>