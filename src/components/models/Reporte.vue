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
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { toast } from '../ui/toast';



const startDateInput = ref('');
const endDateInput = ref('');
const turnos = ref<Turno[]>([]);
const totalHoras = ref(0);
const totalGanancias = ref(0);
const turnosConDetalles = ref<{ turno: Turno; horasTrabajadas: number; gananciasTotales: number }[]>([]);
import Loading from 'vue-loading-overlay';
const route = useRoute();
const modeloId = route.params.id as string;
let isLoading = false;
let modelo = {} as Modelo;
const fetchTurnos = async () => {

  const startDate = new Date(startDateInput.value);
  const endDate = new Date(endDateInput.value);
  

  console.log("Estoy aqui", startDate, endDate);
  startDate.setHours(24, 0, 0, 0);
  endDate.setHours(47, 59, 59, 999);
  const startTimestamp = Timestamp.fromDate(startDate);
  const endTimestamp = Timestamp.fromDate(endDate);
  console.log("Estoy aqui", startTimestamp.toDate(), endTimestamp.toDate());
  
  const q = query(
    collection(db, 'turnos'),
    where('desde', '>=', startTimestamp),
    where('hasta', '<=', endTimestamp),
    where('modelo', '==', modeloId),
    
  );
  
  const querySnapshot = await getDocs(q);
  turnos.value = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Turno));
  console.log("Estoy aqui", turnos.value);
  calculateReport();
};

const calculateReport = async () => {
  isLoading = true;
  const docRef = doc(db, 'modelos', modeloId);
  const docSnap = await getDoc(docRef);
  modelo = { id: docSnap.id, ...docSnap.data() } as Modelo;

  totalHoras.value = 0;
  totalGanancias.value = 0;
  turnosConDetalles.value = [];
  
  turnos.value.forEach(turno => {
    try{
      let horasTrabajadas = (turno.hasta.seconds - turno.desde.seconds) / 3600;
      let gananciasTurno = 0;
      try {
        if (turno.ganancias != null){
          gananciasTurno = Object.values(turno.ganancias).reduce((acc: number, curr: number) => acc + curr, 0);
        }
      } catch (error) {}

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

    }catch(e){}
  });

  generatePDFReport();
  isLoading = false;
  toast({
          title: 'Se ha generado el reporte con éxito',
          description: '',
        });
};

const generatePDFReport = () => {

  
  const doc = new jsPDF();
  doc.text("Reporte de Turnos", 10, 10);

  // Datos de la modelo
  //const modelo = turnosConDetalles.value[0]?.turno.modelo; // Asumiendo que todos los turnos pertenecen al mismo modelo
  doc.text(`Nombre: ${modelo.nombre}`, 10, 20);
  doc.text(`Username: ${modelo.username}`, 10, 30);
  doc.text(`Jornada: ${modelo.jornada}`, 10, 40);
  doc.text(`Plataformas: ${modelo.plataformas.join(', ')}`, 10, 50);

  // Tabla de turnos
  const tableColumn = ["ID", "Desde", "Hasta", "Horas Trabajadas", "Ganancias Totales"];
  const tableRows: any[] = [];

  turnosConDetalles.value.forEach(turnoDetalle => {
    const turnoData = [
      turnoDetalle.turno.id,
      new Date(turnoDetalle.turno.desde.seconds * 1000).toLocaleString(),
      new Date(turnoDetalle.turno.hasta.seconds * 1000).toLocaleString(),
      turnoDetalle.horasTrabajadas.toFixed(2),
      turnoDetalle.gananciasTotales.toFixed(2),
    ];
    tableRows.push(turnoData);
  });

  autoTable(doc, {
    head: [tableColumn],
    body: tableRows,
    startY: 60,
    didDrawPage: (data) => {
      if (data.cursor) {
        const finalY = data.cursor.y;
        doc.text(`Total Horas Trabajadas: ${totalHoras.value.toFixed(2)}`, 10, finalY + 10);
        doc.text(`Total Ganancias: ${totalGanancias.value.toFixed(2)}`, 10, finalY + 20);
      }
    }
  });
  
  doc.save("reporte_turnos.pdf");
  
};
</script>

<template>
  <loading v-model:active="isLoading"
                :can-cancel="false"
                :is-full-page="true"/>
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
          <Input id="startDate" type="date" v-model="startDateInput" class="col-span-3" />
        </div>
        <div class="grid grid-cols-4 items-center gap-4">
          <Label for="endDate" class="text-right">
            Fecha Fin
          </Label>
          <Input id="endDate" type="date" v-model="endDateInput" class="col-span-3" />
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
