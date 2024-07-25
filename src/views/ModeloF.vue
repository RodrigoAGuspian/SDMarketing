<script lang="ts">
import { defineComponent } from 'vue';
import { collection, addDoc, getDoc, updateDoc, doc, getDocs } from 'firebase/firestore';


import HeaderP from '@/components/Header/HeaderP.vue';
import Button from '@/components/ui/button/Button.vue';
import { db } from '@/utils/firebase';
import { toast } from '@/components/ui/toast';
import Loading from 'vue-loading-overlay';
export default defineComponent({
  components: {
    HeaderP,
    Button,
    Loading
  },
  data() {
    return {
      form: {
        nombre: '',
        username: '',
        jornada: '',
        plataformas: [] as string[]
      },
      id: this.$route.params.id as string,
      selectedPlataforma: '',
      plataformasDisponibles: [] as string[],
      isEditing: false,
      isLoading: false,
    };
  },
  methods: {
    async fetchPlataformas() {
      this.isLoading = true;
      const querySnapshot = await getDocs(collection(db, 'plataformas'));
      this.plataformasDisponibles = querySnapshot.docs.map(doc => doc.data().nombre);
      this.isLoading = false;
    },
    addPlataforma() {
      if (this.selectedPlataforma && !this.form.plataformas.includes(this.selectedPlataforma)) {
        this.form.plataformas.push(this.selectedPlataforma);
        this.selectedPlataforma = '';
      }
    },
    removePlataforma(index: number) {
      this.form.plataformas.splice(index, 1);
    },
    async handleSubmit() {
      this.isLoading = true;
      if (this.isEditing) {
        const docRef = doc(db, 'modelos', this.id);
        await updateDoc(docRef, this.form);
        toast({
          title: 'Se ha editado con éxito',
          description: '',
        });
      } else {
        await addDoc(collection(db, 'modelos'), this.form);
        toast({
          title: 'Se ha guardado con éxito',
          description: '',
        });
      }
      this.isLoading = false;
      this.$router.push('/modelos');
    },
    async fetchModelo() {
      this.isLoading = true;
      const docRef = doc(db, 'modelos', this.id);
      const docSnap = await getDoc(docRef);
      this.isLoading = false;
      if (docSnap.exists()) {
        this.form = docSnap.data() as typeof this.form;
      } else {
        console.log('No such document!');
      }
      this.isLoading = false;
    },
  },
  created() {
    if (this.$route.params.id) {
      this.isEditing = true;
      this.fetchModelo();
    }
    this.fetchPlataformas();
  },
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
    <h1 class="text-2xl font-bold mb-4">{{ isEditing ? 'Editar Modelo' : 'Crear Modelo' }}</h1>
    <form @submit.prevent="handleSubmit" class="space-y-4">
      <div class="form-group">
        <label for="nombre" class="block text-sm font-medium text-gray-700">Nombre:</label>
        <input
          v-model="form.nombre"
          id="nombre"
          type="text"
          class="mt-1 block w-full px-3 py-2 border border-zinc-300 rounded-md shadow-sm focus:outline-none focus:ring-zinc-500 focus:border-zinc-500 sm:text-sm"
        />
      </div>
      <div class="form-group">
        <label for="username" class="block text-sm font-medium text-zinc-700">Username:</label>
        <input
          v-model="form.username"
          id="username"
          type="text"
          class="mt-1 block w-full px-3 py-2 border border-zinc-300 rounded-md shadow-sm focus:outline-none focus:ring-zinc-500 focus:border-zinc-500 sm:text-sm"
        />
      </div>
      <div class="form-group">
        <label for="jornada" class="block text-sm font-medium text-zinc-700">Jornada:</label>
        <select
          v-model="form.jornada"
          id="jornada"
          class="mt-1 block w-full px-3 py-2 border border-zinc-300 rounded-md shadow-sm focus:outline-none focus:ring-zinc-700 focus:border-zinc-500 sm:text-sm"
        >
          <option value="mañana">Mañana</option>
          <option value="tarde">Tarde</option>
          <option value="noche">Noche</option>
        </select>
      </div>
      <div class="form-group">
        <label for="plataformas" class="block text-sm font-medium text-zinc-700">Plataformas:</label>
        <select v-model="selectedPlataforma" @change="addPlataforma" class="mt-1 block w-full px-3 py-2 border border-zinc-300 rounded-md shadow-sm focus:outline-none focus:ring-zinc-500 focus:border-zinc-500 sm:text-sm">
          <option disabled value="">Selecciona una plataforma</option>
          <option v-for="plataforma in plataformasDisponibles" :key="plataforma">{{ plataforma }}</option>
        </select>
        <ul class="list-disc list-inside mt-2">
          <li v-for="(plataforma, index) in form.plataformas" :key="index" class="ml-4 flex justify-between items-center">
            {{ plataforma }}
            <button type="button" @click="removePlataforma(index)" class="text-red-500 hover:text-red-700">Eliminar</button>
          </li>
        </ul>
      </div>
      <Button type="submit" class="mt-6 w-full ">{{ isEditing ? 'Actualizar Modelo' : 'Crear Modelo' }}</Button>
    </form>
  </div>
</template>
