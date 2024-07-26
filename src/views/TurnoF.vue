<script lang="ts">
import { defineComponent } from 'vue';
import { collection, getDoc, updateDoc, doc, getDocs, deleteDoc, Timestamp } from 'firebase/firestore';
import { db } from '@/utils/firebase';
import HeaderP from '@/components/Header/HeaderP.vue';
import Button from '@/components/ui/button/Button.vue';
import LoadingOverlay from '@/components/Loading/LoadingOverlay.vue';

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
import { useToast } from 'vue-toast-notification';
import 'vue-toast-notification/dist/theme-sugar.css';


const $toast = useToast();

export default defineComponent({
  components: {
    HeaderP,
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
    LoadingOverlay
  },
  data() {
    return {
      form: {
        desde: '',
        hasta: '',
        ganancias: {} as { [key: string]: number },
        modelo: ''
      },
      id: this.$route.params.id as string,
      plataformasDisponibles: [] as string[],
      isEditing: false,
      isLoading: false,
    };
  },
  methods: {
    async fetchPlataformas() {
      const querySnapshot = await getDocs(collection(db, 'plataformas'));
      this.plataformasDisponibles = querySnapshot.docs.map(doc => doc.data().nombre);
    },
    async fetchTurno() {
      const docRef = doc(db, 'turnos', this.id);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        const data = docSnap.data();
        this.form = {
          desde: this.convertTimestampToDatetimeLocal(data.desde),
          hasta: this.convertTimestampToDatetimeLocal(data.hasta),
          ganancias: data.ganancias || {},
          modelo: data.modelo || ''
        };
      } else {
        console.log('No such document!');
      }
      this.isLoading = false;
    },
    convertTimestampToDatetimeLocal(timestamp: any) {
      const date = new Date(timestamp.seconds * 1000 + timestamp.nanoseconds / 1000000);
      return date.toISOString().slice(0, 16);
    },
    async handleSubmit() {
      this.isLoading = true;
      const docRef = doc(db, 'turnos', this.id);
      await updateDoc(docRef, {
        ...this.form,
        finalizado: true,
        desde: this.convertDatetimeLocalToTimestamp(this.form.desde),
        hasta: this.convertDatetimeLocalToTimestamp(this.form.hasta),
      });

      $toast.success('Se ha guardado el turno.');

      this.$router.push('/modelos');

      this.isLoading = false;
    },
    convertDatetimeLocalToTimestamp(datetimeLocal: any) {
      return Timestamp.fromDate(new Date(datetimeLocal));
    },
    async handleDelete() {
      this.isLoading = true;
      const docRef = doc(db, 'turnos', this.id);
      await deleteDoc(docRef);
      this.isLoading = false;
      $toast.success('Se ha eliminado el turno.');
      this.$router.push('/modelos');
      
      
    },
  },
  created() {
    this.isLoading = true;
    if (this.$route.params.id) {
      this.isEditing = true;
      this.fetchTurno();
    }
    this.fetchPlataformas();
    this.isLoading = false;
  },
});
</script>



<template>
  <loading-overlay :show="isLoading" />
  <HeaderP />
  <nav class="flex justify-between items-center px-6 py-4 ">
    <RouterLink to="/modelos">
      <Button>Lista de Modelos</Button>
    </RouterLink>
  </nav>
  <form @submit.prevent="handleSubmit" class="max-w-lg mx-auto p-6 bg-white shadow-md rounded">
    <div class="mb-4">
      <label class="block text-gray-700 text-sm font-bold mb-2">Desde:</label>
      <input v-model="form.desde" type="datetime-local" class="w-full px-3 py-2 border rounded" />
    </div>
    <div class="mb-4">
      <label class="block text-gray-700 text-sm font-bold mb-2">Hasta:</label>
      <input v-model="form.hasta" type="datetime-local" class="w-full px-3 py-2 border rounded" />
    </div>
    <div class="mb-4">
      <label class="block text-gray-700 text-sm font-bold mb-2">Ganancias:</label>
      <div v-for="plataforma in plataformasDisponibles" :key="plataforma" class="mb-2">
        <label class="block text-gray-600">{{ plataforma }}:</label>
        <input v-model="form.ganancias[plataforma]" type="number" class="w-full px-3 py-2 border rounded" />
      </div>
    </div>
    <div class="mb-4">
      <label class="block text-gray-700 text-sm font-bold mb-2">Modelo:</label>
      <input v-model="form.modelo" type="text" class="w-full px-3 py-2 border rounded" readonly>
    </div>
    <div class="flex justify-between items-center">
      <Button class="" type="submit">Actualizar</Button>
      <AlertDialog>
        <AlertDialogTrigger as-child>
          <Button class="bg-red-500 text-white px-4 py-2 rounded" variant="outline">Eliminar</Button>
        </AlertDialogTrigger>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>¿Estás seguro?</AlertDialogTitle>
            <AlertDialogDescription>
              Esta acción no se puede deshacer. Esto eliminará permanentemente el turno.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction @click="handleDelete">Continuar</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  </form>
</template>

