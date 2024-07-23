<script setup lang="ts">
import { ref } from 'vue';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { collection, query, where, getDocs, Timestamp, doc, getDoc } from 'firebase/firestore';
import { db } from '@/utils/firebase';
import type { Turno } from '@/lib/turno';
import { useRoute, useRouter } from 'vue-router';
import type { Modelo } from '@/lib/modelo';


const startDate = ref(new Date());
const endDate = ref(new Date());
const turnos = ref<Turno[]>([]);
const totalHoras = ref(0);
const totalGanancias = ref(0);
const turnosConDetalles = ref<{ turno: Turno; horasTrabajadas: number; gananciasTotales: number }[]>([]);

const route = useRoute();
const modeloId = route.params.id as string;
const fetchTurnos = async () => {
  startDate.value.setHours(0, 0, 0, 0);
  endDate.value.setHours(23, 59, 59, 999);
  const startTimestamp = Timestamp.fromDate(startDate.value);
  const endTimestamp = Timestamp.fromDate(endDate.value);
  console.log("Estoy aqui", startTimestamp.toDate(), endTimestamp.toDate());
  
  const q = query(
    collection(db, 'turnos'),
    where('desde', '>=', startTimestamp),
    where('hasta', '<=', endTimestamp),
    where('modelo', '==', modeloId),
    
  );
  
  const querySnapshot = await getDocs(q);
  turnos.value = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Turno));
  calculateReport();
};

const calculateReport = async () => {
  
  const docRef = doc(db, 'modelos', modeloId);
  const docSnap = await getDoc(docRef);
  const modelo = { id: docSnap.id, ...docSnap.data() } as Modelo;
  
  turnos.value.forEach(turno => {
    try{

      totalHoras.value = 0;
      totalGanancias.value = 0;
      turnosConDetalles.value = [];
      
      
      let horasTrabajadas = (turno.hasta.seconds - turno.desde.seconds) / 3600;
      const gananciasTurno = Object.values(turno.ganancias).reduce((acc: number, curr: number) => acc + curr, 0);
      if (horasTrabajadas < 0){
        horasTrabajadas = 0;
      }
      totalHoras.value += horasTrabajadas;
      totalGanancias.value += gananciasTurno;

      turnosConDetalles.value.push({
        turno,
        horasTrabajadas,
        gananciasTotales: gananciasTurno,
      });

    }catch(e){
    }
  });
};
</script>

<template>
  <Dialog >
    <DialogTrigger as-child>
      <Button variant="outline">
        Generar Reporte
      </Button>
    </DialogTrigger>
    <DialogContent class="sm:max-w-[425px]">
      <DialogHeader>
        <DialogTitle>Reporte de Turnos</DialogTitle>
        <DialogDescription>
          Selecciona el rango de fechas y el modelo para ver el reporte de turnos.
        </DialogDescription>
      </DialogHeader>
      <div class="grid gap-4 py-4">
        <div class="grid grid-cols-4 items-center gap-4">
          <Label for="startDate" class="text-right">
            Fecha Inicio
          </Label>
          <Input id="startDate" type="date" v-model="startDate.valueOf" class="col-span-3" />
        </div>
        <div class="grid grid-cols-4 items-center gap-4">
          <Label for="endDate" class="text-right">
            Fecha Fin
          </Label>
          <Input id="endDate" type="date" v-model="endDate.valueOf" class="col-span-3" />
        </div>
      </div>
      <Button @click="fetchTurnos">Generar Reporte</Button>
      <div v-if="turnosConDetalles.length > 0" class="mt-4">
        <h3 class="text-lg font-bold">Reporte</h3>
        <ul>
          <li v-for="detalle in turnosConDetalles" :key="detalle.turno.id">
            <p>Turno ID: {{ detalle.turno.id }}</p>
            <p>Horas Trabajadas: {{ detalle.horasTrabajadas.toFixed(2) }} horas</p>
            <p>Ganancias: {{ detalle.gananciasTotales }} USD</p>
          </li>
        </ul>
        <p class="mt-4 font-bold">Total Horas: {{ totalHoras.toFixed(2) }} horas</p>
        <p class="font-bold">Total Ganancias: {{ totalGanancias }} USD</p>
      </div>
    </DialogContent>
  </Dialog>
</template>
