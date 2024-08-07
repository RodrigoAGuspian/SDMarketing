<script lang="ts">
import { defineComponent } from 'vue';
import { collection, addDoc, getDoc, updateDoc, doc, getDocs } from 'firebase/firestore';
import HeaderP from '@/components/Header/HeaderP.vue';
import Button from '@/components/ui/button/Button.vue';
import { db } from '@/utils/firebase';
import LoadingOverlay from '@/components/Loading/LoadingOverlay.vue';
import { useToast } from 'vue-toast-notification';
import 'vue-toast-notification/dist/theme-sugar.css';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from '@/components/ui/select'
const $toast = useToast();

export default defineComponent({
  components: {
    HeaderP,
    Button,
    LoadingOverlay,
    Input,
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectLabel,
    SelectTrigger,
    SelectValue
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
      console.log("Plataforma: ", this.selectedPlataforma);
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
  <nav class="flex justify-between items-center px-6">
    <RouterLink to="/modelos"><Button>Lista de Modelos</Button></RouterLink>
  </nav>
  <div class="container mx-auto p-4">
    <h1 class="text-2xl font-bold mb-4">{{ isEditing ? 'Editar Modelo' : 'Crear Modelo' }}</h1>
    <form @submit.prevent="handleSubmit" class="space-y-4">
      <div class="form-group">
        <label for="nombre" class="block text-sm font-medium">Nombre:</label>
        <Input
          v-model="form.nombre"
          id="nombre"
          type="text"
          class="mt-1 block w-full px-3 py-2 sm:text-sm"
        />
      </div>
      <div class="form-group">
        <label for="username" class="block text-sm font-medium">Username:</label>
        <Input
          v-model="form.username"
          id="username"
          type="text"
          class="mt-1 block w-full px-3 py-2 sm:text-sm"
        />
      </div>
      <div class="form-group">
        <Select id="jornada" v-model="form.jornada">
          <SelectTrigger>
            <SelectValue placeholder="Seleccione una Jornada" />
          </SelectTrigger>
          <SelectContent >
            <SelectGroup>
              <SelectLabel>Jornada</SelectLabel>
              <SelectItem value="Mañana">
                Mañana
              </SelectItem>
              <SelectItem value="Tarde">
                Tarde
              </SelectItem>
              <SelectItem value="Noche">
                Noche
              </SelectItem>
            </SelectGroup>
          </SelectContent>
        </Select>
      </div>
      <div class="form-group">
        <Select id="Plataformas" v-model="selectedPlataforma" @update:modelValue="addPlataforma">
          <SelectTrigger >
            <SelectValue placeholder="Seleccione una Plataformas" />
          </SelectTrigger>
          <SelectContent >
            <SelectGroup>
              <SelectLabel>Plataformas</SelectLabel>
              <SelectItem v-for="plataforma in plataformasDisponibles" :key="plataforma" :value=plataforma>{{ plataforma }}</SelectItem>

            </SelectGroup>
          </SelectContent>
        </Select>

        <ul class="list-disc list-inside mt-2">
          <li v-for="(plataforma, index) in form.plataformas" :key="index" class="flex justify-between items-center">
            {{ plataforma }}
            <button type="button" @click="removePlataforma(index)" class="text-red-500 hover:text-red-700">Eliminar</button>
          </li>
        </ul>
      </div>
      <Button type="submit" class="mt-6 w-full ">{{ isEditing ? 'Actualizar Modelo' : 'Crear Modelo' }}</Button>
    </form>
  </div>
</template>
