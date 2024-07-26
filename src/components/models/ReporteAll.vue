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
        isLoading: false,
        modelos: ref<Modelo[]>([]),
        modeloHorasGanancias: [] as { modelo: Modelo; horasTrabajadas: number; gananciasTotales: number }[],

    };
  },
  methods: {
    async fetchTurnos() {
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
      );
      const querySnapshot = await getDocs(q);
      this.turnos = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Turno));

      await this.calculateReport();
    },
    async calculateReport() {

        const horasTurnoCompleto:  { [key: string]: any } = {};
        const gananciasTurnoCompleto:  { [key: string]: any } = {};
        this.modeloHorasGanancias = [];

        const querySnapshot = await getDocs(collection(db, 'modelos'));
        this.modelos = querySnapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
        } as Modelo));

        

        this.totalHoras = 0;
        this.totalGanancias = 0;

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

            if (!horasTurnoCompleto[turno.modelo]){
                horasTurnoCompleto[turno.modelo] = 0
            }

            if (!gananciasTurnoCompleto[turno.modelo]){
                gananciasTurnoCompleto[turno.modelo] = 0
            }
            horasTurnoCompleto[turno.modelo] += horasTrabajadas;
            gananciasTurnoCompleto[turno.modelo] += gananciasTurno;
            

            }catch(e){}
        });

        this.modelos.forEach(item => {
            this.modeloHorasGanancias.push({
                modelo: item,
                horasTrabajadas: horasTurnoCompleto[item.id],
                gananciasTotales: gananciasTurnoCompleto[item.id],
                
            });

        });

        this.generatePDFReport();
        this.isLoading = false;
        $toast.success('Se ha generado el reporte con éxito.');
    },

    generatePDFReport() {

        const startDate = new Date(this.startDateInput);
        const endDate = new Date(this.endDateInput);
        startDate.setHours(24, 0, 0, 0);
        endDate.setHours(47, 59, 59, 999);
      
        const doc = new jsPDF();
        doc.text("Reporte de Turnos", 10, 10);

        // Datos de la modelo
        //const modelo = turnosConDetalles.value[0]?.turno.modelo; // Asumiendo que todos los turnos pertenecen al mismo modelo
        doc.text(`Desde: ${startDate.toLocaleDateString()}`, 10, 20);
        doc.text(`Hasta: ${endDate.toLocaleDateString()}`, 10, 30);

        // Tabla de turnos
        const tableColumn = ["Modelo", "Username", "Horas Trabajadas", "Ganancias Totales"];
        const tableRows: any[] = [];

        this.modeloHorasGanancias.forEach(turnoDetalle => {
        const turnoData = [
            turnoDetalle.modelo.nombre,
            turnoDetalle.modelo.username,
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

    <Dialog >
        <loading-overlay :show="isLoading" />
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
        </DialogContent>
    </Dialog>

</template>