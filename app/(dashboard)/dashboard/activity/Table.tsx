"use client";
import React from "react";
import { useEffect, useState, useRef, useCallback, useMemo } from "react"; //import moment from "moment";
import {
  Column,
  ColumnDef,
  useReactTable,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  flexRender,
  FilterFn,
  SortingFn,
  sortingFns,
  ColumnFiltersState,
  getSortedRowModel,
  getFacetedRowModel,
  getFacetedUniqueValues,
  getFacetedMinMaxValues,
  SortingState,
  VisibilityState,
} from "@tanstack/react-table";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../../../../components/ui/table";

import { compareItems, rankItem } from "@tanstack/match-sorter-utils";

import {
  DataTableColumnHeader,
  DataTablePagination,
  DataTableToolbar,
} from "./DataTable";
import { Badge } from "@/components/ui/badge";
const fuzzyFilter: FilterFn<any> = (row, columnId, value, addMeta) => {
  // Rank the item
  const itemRank = rankItem(row.getValue(columnId), value);

  // Store the itemRank info
  addMeta({
    itemRank,
  });

  // Return if the item should be filtered in/out
  return itemRank.passed;
};
const fuzzySort: SortingFn<any> = (rowA, rowB, columnId) => {
  let dir = 0;

  // Only sort by rank if the column has ranking information
  if (rowA.columnFiltersMeta[columnId]) {
    dir = compareItems(
      rowA.columnFiltersMeta[columnId]?.itemRank!,
      rowB.columnFiltersMeta[columnId]?.itemRank!
    );
  }

  // Provide an alphanumeric fallback for when the item ranks are equal
  return dir === 0 ? sortingFns.alphanumeric(rowA, rowB, columnId) : dir;
};
const Facture_Utilisatuer_Comp = ({ FacturesQuery }: any) => {
  const [data, setData] = useState<any>(FacturesQuery);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [globalFilter, setGlobalFilter] = useState("");
  const columns: any = useMemo<ColumnDef<any>[]>(
    () => [
      {
        id: "Informations",
        footer: (props) => props.column.id,
        columns: [
          {
            accessorFn: (row) => row.id,
            id: "id",
            filterFn: "fuzzy",
            sortingFn: fuzzySort,
            header: ({ column }) => (
              <DataTableColumnHeader column={column} title="id" />
            ),
            footer: (props) => props.column.id,
          },
          {
            accessorFn: (row) => row.date,
            id: "date",
            filterFn: "fuzzy",
            sortingFn: fuzzySort,
            header: ({ column }) => (
              <DataTableColumnHeader column={column} title="Date" />
            ),
            footer: (props) => props.column.id,
          },
          {
            accessorFn: (row) => row.status,
            id: "status",
            filterFn: "fuzzy",
            sortingFn: fuzzySort,
            header: ({ column }) => (
              <DataTableColumnHeader column={column} title="Status" />
            ),
            cell(props) {
              if (props.row.original.status === "non payé") {
                return (
                  <Badge className="bg-red-500" variant="default">
                    Non Payé
                  </Badge>
                );
              } else {
                return <Badge variant="default">Payé</Badge>;
              }
            },
            footer: (props) => props.column.id,
          },
          {
            accessorFn: (row) => row.num_avis,
            id: "num_avis",
            filterFn: "fuzzy",
            sortingFn: fuzzySort,
            header: ({ column }) => (
              <DataTableColumnHeader column={column} title="Numéro d'avis" />
            ),
            footer: (props) => props.column.id,
          },
          {
            accessorFn: (row) => row.montant,
            id: "montant",
            filterFn: "fuzzy",
            sortingFn: fuzzySort,
            header: () => <p>Montant</p>,
            cell: (props) => (
              <p>
                {props.cell.getValue()}
                {""}
                <span className="gap-1">DA</span>
              </p>
            ),
            footer: (props) => props.column.id,
          },
        ],
      },
    ],
    []
  );
  function useSkipper() {
    const shouldSkipRef = useRef(true);
    const shouldSkip = shouldSkipRef.current;

    // Wrap a function with this to skip a pagination reset temporarily
    const skip = useCallback(() => {
      shouldSkipRef.current = false;
    }, []);

    useEffect(() => {
      shouldSkipRef.current = true;
    });

    return [shouldSkip, skip] as const;
  }
  const [sorting, setSorting] = useState<SortingState>([]);
  const [rowSelection, setRowSelection] = useState({});
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
  const [autoResetPageIndex, skipAutoResetPageIndex] = useSkipper();
  const table = useReactTable({
    data,
    columns,
    filterFns: {
      fuzzy: fuzzyFilter,
    },
    state: {
      columnFilters,
      globalFilter,
      sorting,
      columnVisibility,
      rowSelection,
    },
    onColumnFiltersChange: setColumnFilters,
    onGlobalFilterChange: setGlobalFilter,
    globalFilterFn: fuzzyFilter,
    onSortingChange: setSorting,
    onColumnVisibilityChange: setColumnVisibility,

    onRowSelectionChange: setRowSelection,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFacetedRowModel: getFacetedRowModel(),
    getFacetedUniqueValues: getFacetedUniqueValues(),
    getFacetedMinMaxValues: getFacetedMinMaxValues(),
    autoResetPageIndex,
    meta: {
      updateData: (rowIndex: number, columnId: string, value: unknown) => {
        // Skip age index reset until after next rerender
        skipAutoResetPageIndex();
        setData((old: any) =>
          old.map((row: any, index: any) => {
            if (index === rowIndex) {
              return {
                ...old[rowIndex]!,
                [columnId]: value,
              };
            }
            return row;
          })
        );
      },
    },
  });

  return (
    <div>
      <div className="m-4">
        {" "}
        <DataTableToolbar table={table} />
      </div>
      <div className="border-gray-300 border rounded-t-2xl">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id}>
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                    </TableHead>
                  );
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody className="bg-gray-300">
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id} className="w-32">
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className=" text-center col-span-3 "
                >
                  Pas de résultats.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <DataTablePagination table={table} />
    </div>
  );
};
export default Facture_Utilisatuer_Comp;
