<script lang='ts'>
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


import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import LoadingOverlay from '../Loading/LoadingOverlay.vue';
import type { Turno } from '@/lib/turno';
import type { Modelo } from '@/lib/modelo';
import { useToast } from 'vue-toast-notification';
import 'vue-toast-notification/dist/theme-sugar.css';

const $toast = useToast();

export default {

  components: {
    Button,
    Input,
    LoadingOverlay,
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
    Label
  },

  data() {
    return {
      startDateInput: '',
      endDateInput: '',
      turnos: [] as Turno[],
      totalHoras: 0,
      totalGanancias: 0,
      turnosConDetalles: [] as { turno: Turno; horasTrabajadas: number; gananciasTotales: number }[],
      isLoading: false,
      modelo: {} as Modelo,
    };
  },
  
  methods: {
    async fetchTurnos() {
      const modeloId = this.$route.params.id as string;
      const startDate = new Date(this.startDateInput);
      const endDate = new Date(this.endDateInput);
      startDate.setHours(24, 0, 0, 0);
      endDate.setHours(47, 59, 59, 999);
      const startTimestamp = Timestamp.fromDate(startDate);
      const endTimestamp = Timestamp.fromDate(endDate);
      const q = query(
        collection(db, 'turnos'),
        where('desde', '>=', startTimestamp),
        where('hasta', '<=', endTimestamp),
        where('modelo', '==', modeloId),
        
      );
      const querySnapshot = await getDocs(q);
      this.turnos = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Turno));
      await this.calculateReport();
    },
    async calculateReport() {
      const modeloId = this.$route.params.id as string;
      this.isLoading = true;
      const docRef = doc(db, 'modelos', modeloId);
      const docSnap = await getDoc(docRef);
      this.modelo = { id: docSnap.id, ...docSnap.data() } as Modelo;

      this.totalHoras = 0;
      this.totalGanancias = 0;
      this.turnosConDetalles = [];
      
      this.turnos.forEach(turno => {
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
          this.totalHoras += horasTrabajadas;
          this.totalGanancias += gananciasTurno;

          this.turnosConDetalles.push({
            turno,
            horasTrabajadas,
            gananciasTotales: gananciasTurno,
          });

        }catch(e){}
      });

      this.generatePDFReport();
      this.isLoading = false;
      $toast.success('Se ha generado el reporte con éxito.');
    },
    generatePDFReport() {
      
      const doc = new jsPDF();
      doc.text("Reporte de Turnos", 10, 10);

      // Datos de la modelo
      //const modelo = turnosConDetalles.value[0]?.turno.modelo; // Asumiendo que todos los turnos pertenecen al mismo modelo
      doc.text(`Nombre: ${this.modelo.nombre}`, 10, 20);
      doc.text(`Username: ${this.modelo.username}`, 10, 30);
      doc.text(`Jornada: ${this.modelo.jornada}`, 10, 40);
      doc.text(`Plataformas: ${this.modelo.plataformas.join(', ')}`, 10, 50);

      // Tabla de turnos
      const tableColumn = ["ID", "Desde", "Hasta", "Horas Trabajadas", "Ganancias Totales"];
      const tableRows: any[] = [];

      this.turnosConDetalles.forEach(turnoDetalle => {
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
            doc.text(`Total Horas Trabajadas: ${this.totalHoras.toFixed(2)}`, 10, finalY + 10);
            doc.text(`Total Ganancias: ${this.totalGanancias.toFixed(2)}`, 10, finalY + 20);
          }
        }
      });
      
      doc.save("reporte_turnos.pdf");

    },
  },
};
</script>

<template>
  <Dialog>
    <loading-overlay :show="isLoading" />
    <DialogTrigger as-child>
      <Button class="button" variant="outline">
        Generar Reporte
      </Button>
    </DialogTrigger>
    <DialogContent class="font-bold2 sm:max-w-[425px]">
      <DialogHeader>
        <DialogTitle class="font-bold">Reporte de Turnos</DialogTitle>
        <DialogDescription class="font-bold2">
          Selecciona el rango de fechas y el modelo para ver el reporte de turnos.
        </DialogDescription>
      </DialogHeader>
      <div class=" font-bold2 grid gap-4 py-4">
        <div class="font-bold2 grid grid-cols-4 items-center gap-4">
          <Label for="startDate" class="text-right">
            Fecha Inicio
          </Label>
          <Input id="startDate" type="date" v-model="startDateInput" class="font-bold3 col-span-3" />
        </div>
        <div class="grid grid-cols-4 items-center gap-4">
          <Label for="endDate" class="text-right">
            Fecha Fin
          </Label>
          <Input id="endDate" type="date" v-model="endDateInput" class="font-bold3 col-span-3" />
        </div>
      </div>
      <Button class="button" @click="fetchTurnos">Generar Reporte</Button>
    </DialogContent>
  </Dialog>
</template>

<style scoped>
  .font-bold{
    color:#f9db5c ;
    font-family: 'Karla', sans-serif ;
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
.button{
    align-items:  center;
    padding: 0.5% 1.5% 0.5% 1.5%;
    font-size: 0.9rem;
    background-color: #f9db5c;
    border: solid #a87b05 1px;
    outline: 0;
    cursor: pointer;
    color: #373739;
    border-radius: 5px;
}
.button:hover{
    background-color: #f9db5c;
    padding: 0.5% 1.5% 0.5% 1.5%;
    border: solid 373739 1px;
    color:#373739;
    font-size: 0.9rem;
    transform: translateY(-5%);
  }
</style>