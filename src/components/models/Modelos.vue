<script setup lang="ts">
import type {
  ColumnDef,
  ColumnFiltersState,
  SortingState,
  VisibilityState,
} from '@tanstack/vue-table'
import {
  FlexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useVueTable,
} from '@tanstack/vue-table'

import { h, ref, onMounted } from 'vue'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { valueUpdater } from '@/lib/utils'
import { useRouter } from 'vue-router'
import type { Modelo } from '@/lib/modelo'
import { collection, getDocs } from 'firebase/firestore'
import { db } from '@/utils/firebase'
import LoadingOverlay from '../Loading/LoadingOverlay.vue'
import ReporteAll from './ReporteAll.vue'

const router = useRouter();
const isLoading = ref(false);
const modelos = ref<Modelo[]>([]);

const columns: ColumnDef<Modelo>[] = [
  {
    accessorKey: 'id',
    header: 'ID',
    cell: ({ row }) => h('div', { }, row.getValue('id')),
  },
  {
    accessorKey: 'nombre',
    cell: ({ row }) => h('div', {}, row.getValue('nombre')),
  },
  {
    accessorKey: 'username',
    cell: ({ row }) => h('div', {}, row.getValue('username')),
  },
  {
    accessorKey: 'jornada',
    cell: ({ row }) => h('div', {}, row.getValue('jornada')),
  },
]

const sorting = ref<SortingState>([])
const columnFilters = ref<ColumnFiltersState>([])
const columnVisibility = ref<VisibilityState>({})
const rowSelection = ref({})

const table = useVueTable({
  get data() {
    return modelos.value;
  },
  columns,
  getCoreRowModel: getCoreRowModel(),
  getPaginationRowModel: getPaginationRowModel(),
  getSortedRowModel: getSortedRowModel(),
  getFilteredRowModel: getFilteredRowModel(),
  onSortingChange: updaterOrValue => valueUpdater(updaterOrValue, sorting),
  onColumnFiltersChange: updaterOrValue => valueUpdater(updaterOrValue, columnFilters),
  onColumnVisibilityChange: updaterOrValue => valueUpdater(updaterOrValue, columnVisibility),
  onRowSelectionChange: updaterOrValue => valueUpdater(updaterOrValue, rowSelection),
  state: {
    get sorting() { return sorting.value },
    get columnFilters() { return columnFilters.value },
    get columnVisibility() { return columnVisibility.value },
    get rowSelection() { return rowSelection.value },
  },
});

async function fetchModelos() {
  isLoading.value = true;
  const querySnapshot = await getDocs(collection(db, 'modelos'));
  modelos.value = querySnapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data()
  } as Modelo));
  isLoading.value = false;
}

onMounted(async () => {
  
  await fetchModelos();
  
});

function clickModelo(modelo: Modelo) {
  router.push('/modelos/' + modelo.id);
}
</script>

<template>
  <loading-overlay :show="isLoading" />
  <ReporteAll />
  <div class="font-bold2 w-full">
    <div class="font-bold2 flex gap-2 items-center py-4">
      <Input 
        class="font-bold3 max-w-sm"
        placeholder="Filtrar username..."
        :model-value="table.getColumn('username')?.getFilterValue() as string"
        @update:model-value=" table.getColumn('username')?.setFilterValue($event)"
      />
    </div>
    <div class="font-bold3 rounded-md border">
      <Table>
        <TableHeader >
          <TableRow class="font-bold3" v-for="headerGroup in table.getHeaderGroups()" :key="headerGroup.id">
            <TableHead class="font-bold2" v-for="header in headerGroup.headers" :key="header.id">
              <FlexRender v-if="!header.isPlaceholder" :render="header.column.columnDef.header" :props="header.getContext()" />
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          <template v-if="table.getRowModel().rows?.length">
            <TableRow class="font-bold3"
              v-for="row in table.getRowModel().rows"
              :key="row.id"
              @click = "clickModelo(row.original)"
            >
              <TableCell class="font-bold2" v-for="cell in row.getVisibleCells()" :key="cell.id">
                <FlexRender :render="cell.column.columnDef.cell" :props="cell.getContext()" />
              </TableCell>
            </TableRow>
          </template>

          <TableRow v-else>
            <TableCell 
              :colspan="columns.length"
              class="font-bold2 h-24 text-center"
            >
              No hay resultados.
            </TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </div>

    <div class="flex items-center justify-end py-2">
      <div class="space-x-2 flex items-center justify-end py-1">
        <Button class = "button"
          variant="outline"
          size="sm"
          :disabled="!table.getCanPreviousPage()"
          @click="table.previousPage()"
        >
          Anterior
        </Button>
        <Button class = "button"
          variant="outline"
          size="sm"
          :disabled="!table.getCanNextPage()"
          @click="table.nextPage()"
        >
          Siguiente
        </Button>
      </div>
    </div>
  </div>
</template>

<style scoped>
  .font-bold{
    color:#f9db5c;
    font-family: 'Karla', sans-serif;
    font-size: 1.1rem;
  }
  .font-bold2{
    background-color: #19191a;
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
  .button{
    display: flex;
    align-items:  center;
    margin: 5px;
    font-size: 0.8rem;
    padding: 6%;
    background-color: #f9db5c;
    border: solid #a87b05 1px;
    outline: 0;
    cursor: pointer;
    color: #373739;
    border-radius: 5px;
  }
  .button:hover{
    padding: 6%;
    background-color: #f9db5c;
    border: solid 373739 1px;
    color:#373739;
    font-size: 0.8rem;
    transform: translateY(-5%);
  }
</style>