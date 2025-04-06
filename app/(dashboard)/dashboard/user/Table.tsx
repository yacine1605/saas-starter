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
import { User } from "@/lib/db/schema";
import { Pen, Trash2, X } from "lucide-react";
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
export interface UserProps {
  id: number;
  name: string;
  email: string;
  commune: string;
  ilot: string;
  phone: string;
  adresse: string;
  username: string;
  createdAt: Date;
  action?: any;
}
const Facture_Utilisatuer_Comp = ({
  UserQuery,
}: {
  UserQuery: UserProps[];
}) => {
  const [data, setData] = useState<any>(UserQuery);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [globalFilter, setGlobalFilter] = useState("");

  const [editState, setEditState] = useState<number | null>(null);
  const [savedData, setSavedData] = useState<any>();
  const defaultColumn: Partial<ColumnDef<User>> = {
    cell: ({ getValue, row: { index }, column: { id }, table }) => {
      const initialValue: any = getValue();
      // We need to keep and update the state of the cell normally
      const [value, setValue] = useState<string>(initialValue);

      // When the input is blurred, we'll call our table meta's updateData function
      const onBlur = () => {
        table.options.meta?.updateData(index, id, value);
      };
      const onClick = () => {
        console.log(value);
      };

      // If the initialValue is changed external, sync it up with our state
      useEffect(() => {
        setValue(initialValue);
      }, [initialValue]);
      return editState === index ? (
        <input
          className="flex items-center p-0 w-28"
          value={value as string}
          onChange={(e) => setValue(e.target.value)}
          onBlur={onBlur}
        />
      ) : (
        <div className="m-0 p-0">{value}</div>
      );
    },
  };
  const handelEdit = (id: number | null, values: any) => {
    setSavedData(values);
    setEditState(id);
  };
  const SendEdit = async (values: {
    id: string;
    name: string;
    email: string;
    commune: string;
    ilot: string;
    phone: string;
    adresse: string;
    username: string;
  }): Promise<void> => {
    try {
      const res = await fetch(`/api/utilisateur/${values.id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: values.name,
          phone: values.phone,
          email: values.email,
          commune: values.commune,
          adresse: values.adresse,
          ilot: values.ilot,
          username: values.username,
        }),
      });

      if (!res.ok) {
        throw new Error("Failed to editing user");
      }
      console.log(values);
    } catch (error) {
      alert("something wrong");
    }
  };
  const SendDelete = async (values: string): Promise<void> => {
    try {
      const res = await fetch(`/api/utilisateur/${values}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!res.ok) {
        throw new Error("Failed to delete utilisateur");
      }
      console.log(values);
    } catch (error) {
      alert("something wrong");
    }
  };

  const handleCancelClick = (): void => {
    setEditState(null);
  };
  const columns: any = useMemo<ColumnDef<UserProps>[]>(
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
            accessorFn: (row) => row.name,
            id: "nom",
            filterFn: "fuzzy",
            sortingFn: fuzzySort,
            header: ({ column }) => (
              <DataTableColumnHeader column={column} title="Nom" />
            ),
            footer: (props) => props.column.id,
          },
          {
            accessorFn: (row) => row.email,
            id: "email",
            filterFn: "fuzzy",
            sortingFn: fuzzySort,
            header: ({ column }) => (
              <DataTableColumnHeader column={column} title="Email" />
            ),

            footer: (props) => props.column.id,
          },
          {
            accessorFn: (row) => row.commune,
            id: "commune",
            filterFn: "fuzzy",
            sortingFn: fuzzySort,
            header: ({ column }) => (
              <DataTableColumnHeader column={column} title="Commune" />
            ),
            footer: (props) => props.column.id,
          },
          {
            accessorFn: (row) => row.ilot,
            id: "ilot",
            filterFn: "fuzzy",
            sortingFn: fuzzySort,
            header: ({ column }) => (
              <DataTableColumnHeader column={column} title="Ilot" />
            ),
            footer: (props) => props.column.id,
          },
          {
            accessorFn: (row) => row.adresse,
            id: "adresse",
            filterFn: "fuzzy",
            sortingFn: fuzzySort,
            header: ({ column }) => (
              <DataTableColumnHeader column={column} title="Adresse" />
            ),
            footer: (props) => props.column.id,
          },
          {
            accessorFn: (row) => row.username,
            id: "code_client",
            filterFn: "fuzzy",
            sortingFn: fuzzySort,
            header: ({ column }) => (
              <DataTableColumnHeader column={column} title="Code client" />
            ),
            footer: (props) => props.column.id,
          },
          {
            accessorFn: (row) => row.phone,
            id: "phone",
            filterFn: "fuzzy",
            sortingFn: fuzzySort,
            header: ({ column }) => (
              <DataTableColumnHeader column={column} title="Téléphone" />
            ),
            footer: (props) => props.column.id,
          },
        ],
      },
      {
        header: ``,
        id: "action",
        columns: [
          {
            accessorFn: (row) => row.action,
            id: "action",
            header: () => <span>Action</span>,
            footer: (props) => props.column.id,
            cell: (props) => {
              return editState === props.row.index ? (
                <div
                  className=" lg:flex lg:justify-between lg:items-center gap-3"
                  key={props.row.id}
                >
                  <button className="p-2 text-green-500   border-stone-300  border">
                    <Pen onClick={() => SendEdit(props.row.original)} />
                  </button>

                  <button
                    onClick={() => handleCancelClick()}
                    className="p-2 text-red-600  border-stone-300 cursor-pointer border"
                  >
                    <X />
                  </button>
                </div>
              ) : (
                <div className="gap-1" key={props.row.id}>
                  <button
                    onClick={() => SendDelete(props.row.original.id)}
                    className="p-2 m-1 text-red-600 border-stone-300  border cursor-pointer  shadow-sm "
                  >
                    <Trash2 />
                  </button>
                  <button
                    onClick={() =>
                      handelEdit(props.row.index, props.row.original)
                    }
                    className="p-2 m-1 text-green-800 border-stone-300 border cursor-pointer shadow-sm"
                  >
                    <Pen />
                  </button>
                </div>
              );
            },
          },
        ],
      },
    ],
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [editState]
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
    defaultColumn,
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
