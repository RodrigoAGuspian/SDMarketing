<script lang="ts">
import { defineComponent } from 'vue';
import { collection, addDoc, getDoc, updateDoc, doc, getDocs } from 'firebase/firestore';
import HeaderP from '@/components/Header/HeaderP.vue';
import Button from '@/components/ui/button/Button.vue';
import { db } from '@/utils/firebase';
import LoadingOverlay from '@/components/Loading/LoadingOverlay.vue';
import { useToast } from 'vue-toast-notification';
import 'vue-toast-notification/dist/theme-sugar.css';

const $toast = useToast();

export default defineComponent({
  components: {
    HeaderP,
    Button,
    LoadingOverlay
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
        $toast.success('Se ha editado con éxito');
      } else {
        await addDoc(collection(db, 'modelos'), this.form);
        $toast.success('Se ha guardado con éxito');
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
  <loading-overlay :show="isLoading" />
  <HeaderP />
  <nav class="seccion2 flex justify-between items-center px-6">
    <RouterLink to="/modelos"><Button class="button">Lista de Modelos</Button></RouterLink>
  </nav>
  <div class="container mx-auto p-4">
    <h1 class="text-2xl font-bold mb-4">{{ isEditing ? 'Editar Modelo' : 'Crear Modelo' }}</h1>
    <form @submit.prevent="handleSubmit" class="space-y-4">
      <div class="form-group">
        <label for="nombre" class="font-bold block text-sm font-medium text-gray-700">Nombre:</label>
        <input
          v-model="form.nombre"
          id="nombre"
          type="text"
          class="font-bold3 mt-1 block w-full px-3 py-2 border border-zinc-300 rounded-md shadow-sm focus:outline-none focus:ring-zinc-500 focus:border-zinc-500 sm:text-sm"
        />
      </div>
      <div class="form-group">
        <label for="username" class="font-bold block text-sm font-medium text-zinc-700">Username:</label>
        <input
          v-model="form.username"
          id="username"
          type="text"
          class="font-bold3 mt-1 block w-full px-3 py-2 border border-zinc-300 rounded-md shadow-sm focus:outline-none focus:ring-zinc-500 focus:border-zinc-500 sm:text-sm"
        />
      </div>
      <div class="form-group">
        <label for="jornada" class="font-bold block text-sm font-medium text-zinc-700">Jornada:</label>
        <select
          v-model="form.jornada"
          id="jornada"
          class="font-bold3 mt-1 block w-full px-3 py-2 border border-zinc-300 rounded-md shadow-sm focus:outline-none focus:ring-zinc-700 focus:border-zinc-500 sm:text-sm"
        >
          <option value="mañana">Mañana</option>
          <option value="tarde">Tarde</option>
          <option value="noche">Noche</option>
        </select>
      </div>
      <div class="form-group">
        <label for="plataformas" class="font-bold block text-sm font-medium text-zinc-700">Plataformas:</label>
        <select v-model="selectedPlataforma" @change="addPlataforma" class="font-bold3 mt-1 block w-full px-3 py-2 border border-zinc-300 rounded-md shadow-sm focus:outline-none focus:ring-zinc-500 focus:border-zinc-500 sm:text-sm">
          <option disabled value="">Selecciona una plataforma</option>
          <option v-for="plataforma in plataformasDisponibles" :key="plataforma">{{ plataforma }}</option>
        </select>
        <ul class="list-disc list-inside mt-2">
          <li v-for="(plataforma, index) in form.plataformas" :key="index" class="ml-4 flex justify-between items-center">
            {{ plataforma }}
            <button type="button" @click="removePlataforma(index)" class="font-bold2 text-red-500 hover:text-red-700">Eliminar</button>
          </li>
        </ul>
      </div>
      <Button type="submit" class="button2 mt-6 w-full ">{{ isEditing ? 'Actualizar Modelo' : 'Crear Modelo' }}</Button>
    </form>
  </div>
</template>

<style scoped>
  .button{
    align-items:  center;
    margin: 5px;
    padding: 3px 10px 3px 10px;
    font-size: 1rem;
    background-color: #f9db5c ;
    border: solid #a87b05 1px ;
    outline: 0;
    cursor: pointer;
    color: #373739;
    border-radius: 5px;
  }
  .button2{
    align-items:  center;
    margin: 5px;
    padding: 3px 10px 3px 10px;
    font-size: 1rem;
    background-color: #f9db5c ;
    border: solid #a87b05 1px ;
    outline: 0;
    cursor: pointer;
    color: #373739;
    border-radius: 25px;
  }
  .font-bold{
    color:#f9db5c ;
    font-family: 'Karla', sans-serif ;
    font-size: 1.1rem;
  }
  .font-bold2{
    background-color: #2f2f2f;
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
@media (max-width: 450px){
  .container{
    background-color: #19191a;
    width: 170%;
    height: 145vh;
    margin:0px 0px 0px 0px;
  }
  .seccion2{
    background-color: #19191a;
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
  .seccion2{
    background-color: #19191a;
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
  .seccion2{
    background-color: #19191a;
    width: 100%;
  }
}
</style>