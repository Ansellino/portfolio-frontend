<script setup lang="ts">
import { computed, ref } from 'vue';
import {
  FlexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useVueTable,
  type ColumnDef,
  type SortingState,
  type ColumnFiltersState,
  type Updater,
} from '@tanstack/vue-table';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableEmpty,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

const props = defineProps<{
  columns: ColumnDef<any, unknown>[];
  data: any[];
  searchKey?: string;
  searchPlaceholder?: string;
}>();

const sorting = ref<SortingState>([]);
const columnFilters = ref<ColumnFiltersState>([]);

function applyUpdater<T>(updater: Updater<T>, current: T): T {
  return typeof updater === 'function' ? (updater as (value: T) => T)(current) : updater;
}

const table = useVueTable({
  get data() {
    return props.data;
  },
  get columns() {
    return props.columns;
  },
  state: {
    get sorting() {
      return sorting.value;
    },
    get columnFilters() {
      return columnFilters.value;
    },
  },
  onSortingChange: (updater) => {
    sorting.value = applyUpdater(updater, sorting.value);
  },
  onColumnFiltersChange: (updater) => {
    columnFilters.value = applyUpdater(updater, columnFilters.value);
  },
  getCoreRowModel: getCoreRowModel(),
  getSortedRowModel: getSortedRowModel(),
  getFilteredRowModel: getFilteredRowModel(),
  getPaginationRowModel: getPaginationRowModel(),
});

const searchValue = computed({
  get: () => {
    if (!props.searchKey) return '';
    const current = table.getColumn(props.searchKey)?.getFilterValue();
    return (current as string) ?? '';
  },
  set: (value: string) => {
    if (!props.searchKey) return;
    table.getColumn(props.searchKey)?.setFilterValue(value);
  },
});
</script>

<template>
  <div class="space-y-4">
    <Input
      v-if="searchKey"
      v-model="searchValue"
      :placeholder="searchPlaceholder ?? `Search ${searchKey}...`"
      class="max-w-sm"
    />

    <div class="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow v-for="headerGroup in table.getHeaderGroups()" :key="headerGroup.id">
            <TableHead v-for="header in headerGroup.headers" :key="header.id">
              <FlexRender
                v-if="!header.isPlaceholder"
                :render="header.column.columnDef.header"
                :props="header.getContext()"
              />
            </TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          <template v-if="table.getRowModel().rows.length">
            <TableRow v-for="row in table.getRowModel().rows" :key="row.id">
              <TableCell v-for="cell in row.getVisibleCells()" :key="cell.id">
                <FlexRender :render="cell.column.columnDef.cell" :props="cell.getContext()" />
              </TableCell>
            </TableRow>
          </template>
          <TableEmpty v-else :colspan="columns.length">No results found.</TableEmpty>
        </TableBody>
      </Table>
    </div>

    <div class="flex items-center justify-between">
      <p class="text-sm text-muted-foreground">
        Page {{ table.getState().pagination.pageIndex + 1 }} of {{ table.getPageCount() || 1 }}
      </p>
      <div class="flex gap-2">
        <Button variant="outline" size="sm" :disabled="!table.getCanPreviousPage()" @click="table.previousPage()">
          Previous
        </Button>
        <Button variant="outline" size="sm" :disabled="!table.getCanNextPage()" @click="table.nextPage()">
          Next
        </Button>
      </div>
    </div>
  </div>
</template>
