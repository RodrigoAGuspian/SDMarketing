<script setup lang="ts">
import HeaderP from '@/components/Header/HeaderP.vue';
import { useRoute, useRouter } from 'vue-router';
import Button from '@/components/ui/button/Button.vue';
import {
  Card,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import type { Modelo } from '@/lib/modelo';
import { doc, getDoc, collection, query, where, getDocs } from 'firebase/firestore';
import LoadingOverlay from '@/components/Loading/LoadingOverlay.vue';
import { db } from '@/utils/firebase';


import { h, onMounted, ref } from 'vue';
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,  
} from '@/components/ui/table';

import {
  FlexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useVueTable,
  type ColumnDef,
} from '@tanstack/vue-table'
import type { Turno } from '@/lib/turno';
import Reporte from '@/components/models/Reporte.vue';

const router = useRouter();
const route = useRoute();
const id = route.params.id as string;

const modelo = ref<Modelo>();
const turnos = ref<Turno[]>([]);
const isLoading = ref(false);


async function fetchModelo() {

  const docRef = doc(db, 'modelos', id);
  const docSnap = await getDoc(docRef);
  if (docSnap.exists()) {
    modelo.value = { id: docSnap.id, ...docSnap.data() } as Modelo;
  } else {
    console.log('No such document!');
  }
}

async function fetchTurnos() {
  const q = query(collection(db, 'turnos'), where('modelo', '==', id));
  const querySnapshot = await getDocs(q);
  turnos.value = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Turno));
}

function getGanancias(ganancias: any){
  let gananciasS = "";
  if (ganancias != null){
    Object.entries(ganancias).map(([key, value]) => (
    gananciasS += key + ": "+ value +"\n"
  ));
  }

  return gananciasS.substring(0, gananciasS.length-1);
}

onMounted(async () => {
  isLoading.value = true;  
  await fetchModelo();
  await fetchTurnos();
  isLoading.value = false;  
});

function goEdit(id: any) {
  router.push('/modelos/edit/' + id);
}

function getNormalDate(date: any){
  return date.seconds * 1000;
}


const columns: ColumnDef<Turno>[] = [

  {
    accessorKey: 'id',
    header: 'ID',
    cell: ({ row }) => h('div', { }, row.getValue('id')),
  },

  {
    header: 'Desde',
    accessorKey: 'desde',
    cell: ({ row }) => h('div', {},  new Date(getNormalDate(row.getValue('desde'))).toLocaleString()),
  },
  {
    header: 'Hasta',
    accessorKey: 'hasta',
    cell: ({ row }) => h('div', {}, getDateHasta(new Date(getNormalDate(row.getValue('hasta'))).toLocaleString())),
  },
  {
    header: 'Ganancias',
    accessorKey: 'ganancias',
    cell: ({ row }) => h('div', {},  getGanancias(row.getValue('ganancias'))),
  },
];

const table = useVueTable({
  get data() {
    return turnos.value;
  },
  columns,
  getCoreRowModel: getCoreRowModel(),
  getPaginationRowModel: getPaginationRowModel(),
  getSortedRowModel: getSortedRowModel(),
  getFilteredRowModel: getFilteredRowModel(),
});

function clickTurno(turno: Turno) {
  router.push('/turnos/' + turno.id);
}


function getDateHasta(hastaDate: string)  {
  let hasta: string = "";
  const inicioDate = new Date(0).toLocaleString();
  if (hastaDate != inicioDate){
    hasta = hastaDate
  }

  return hasta;
}
</script>

<template>

  <loading-overlay :show="isLoading" />

  <HeaderP />
  <nav class="flex justify-between items-center px-6">
    <RouterLink to="/modelos"><Button>Lista de Modelos</Button></RouterLink>
  </nav>

  <section class="flex gap-4 p-6">
    <Card class="w-1/4">
      <CardHeader>
        <CardTitle>
          <h2 class="text-xl font-bold mb-4">Nombre: <span class="font-normal">{{ modelo?.nombre }}</span></h2>
        </CardTitle>
        <h2 class="text-xl font-bold mb-4">Username: <span class="font-normal">{{ modelo?.username }}</span></h2>
        <h2 class="text-xl font-bold mb-4">Jornada: <span class="font-normal">{{ modelo?.jornada }}</span></h2>
        <h2 class="text-xl font-bold mb-4">Plataformas:</h2>
        <ul class="text-xl list-disc list-inside">
          <li v-for="(plataforma, index) in modelo?.plataformas" :key="index" class="ml-4">{{ plataforma }}</li>
        </ul>
      </CardHeader>
      <CardFooter class="flex justify-center gap-2">
        <Button @click="goEdit(modelo?.id)" >Editar modelo</Button>
        <Reporte />
      </CardFooter>
    </Card>

    <Card class="w-3/4">
      <div class="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow v-for="headerGroup in table.getHeaderGroups()" :key="headerGroup.id">
              <TableHead v-for="header in headerGroup.headers" :key="header.id">
                <FlexRender v-if="!header.isPlaceholder" :render="header.column.columnDef.header" :props="header.getContext()" />
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            <template v-if="table.getRowModel().rows?.length">
              <TableRow v-for="row in table.getRowModel().rows" :key="row.id" @click = "clickTurno(row.original)">
                <TableCell v-for="cell in row.getVisibleCells()" :key="cell.id">
                  <FlexRender :render="cell.column.columnDef.cell" :props="cell.getContext()" />
                </TableCell>
              </TableRow>
            </template>
            <TableRow v-else>
              <TableCell :colspan="columns.length" class="h-24 text-center">
                No hay resultados.
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </div>
      <div class="flex items-center justify-end space-x-2 p-4">
        <div class="space-x-2">
          <Button
            variant="outline"
            size="sm"
            :disabled="!table.getCanPreviousPage()"
            @click="table.previousPage()"
          >
            Anterior
          </Button>
          <Button
            variant="outline"
            size="sm"
            :disabled="!table.getCanNextPage()" 
            @click="table.nextPage()"
          >
            Siguiente
          </Button>
        </div>
      </div>
    </Card>
    
  </section>

</template>
