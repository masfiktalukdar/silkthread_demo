"use client";

import React from "react";
import {
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Label } from "@radix-ui/react-label";
import { Card } from "@/components/ui/card";
import { TOrder } from "@/types/shared";
import { columns } from "./columns";
import { DataTablePagination } from "@/components/ui/data-table-pagination";

import { Input } from "@/components/ui/input";
import { Search, X } from "lucide-react";

interface Props {
  data: TOrder[];
  pagination: {
    page: number;
    limit: number;
    total: number;
  };
}

export const OrderTable: React.FC<Props> = ({ data, pagination }) => {
  const [searchTerm, setSearchTerm] = React.useState("");

  const filteredData = React.useMemo(() => {
    if (!searchTerm.trim()) return data;
    const term = searchTerm.toLowerCase().trim();
    return data.filter((order) => {
      const orderId = String(order.orderId || order._id || "").toLowerCase();
      const customerName = String(
        order.customerName || (order.userRef as any)?.name || ""
      ).toLowerCase();
      const phone = String(
        order.customerPhone || order.customerAltPhone || (order.userRef as any)?.phone || ""
      ).toLowerCase();
      const address = String(order.customerAddress || order.customerCity || "").toLowerCase();
      const status = String(order.status || "").toLowerCase();
      const paymentMethod = String(order.paymentMethod || "").toLowerCase();
      const products = (order.products || [])
        .map((p: any) => String(p.productRef?.name || p.name || "").toLowerCase())
        .join(" ");

      return (
        orderId.includes(term) ||
        customerName.includes(term) ||
        phone.includes(term) ||
        address.includes(term) ||
        status.includes(term) ||
        paymentMethod.includes(term) ||
        products.includes(term)
      );
    });
  }, [data, searchTerm]);

  const table = useReactTable({
    data: filteredData,
    columns,
    getCoreRowModel: getCoreRowModel(),
    manualPagination: true,
    pageCount: Math.ceil(pagination.total / pagination.limit),
    state: {
      pagination: {
        pageIndex: pagination.page - 1,
        pageSize: pagination.limit,
      },
    },
  });

  return (
    <Card className="m-6 rounded-lg w-full">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 p-4 border-b border-gray-100">
        <div>
          <Label className="text-xl font-bold tracking-tight text-gray-800">Order List</Label>
          <p className="text-xs text-muted-foreground mt-0.5">
            Total {pagination.total} orders {searchTerm && `• ${filteredData.length} matching search`}
          </p>
        </div>
        <div className="relative w-full sm:w-80 md:w-96">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 h-4 w-4 pointer-events-none" />
          <Input
            placeholder="Search Order ID, Customer, Phone, Product..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-9 pr-9 h-10 text-sm bg-gray-50/50 hover:bg-white focus:bg-white transition-colors border-gray-200 focus:border-[#FF6C0C] rounded-[2px]"
          />
          {searchTerm && (
            <button
              type="button"
              onClick={() => setSearchTerm("")}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-700 p-1 rounded-full cursor-pointer"
              aria-label="Clear search"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>
      </div>
      
      <div className="border rounded-lg mx-4 mb-4">
        <div className="max-h-[1000px] overflow-auto">
          <Table className="w-auto min-w-full">
            <TableHeader className="sticky top-0 z-10">
              {table.getHeaderGroups().map((headerGroup) => (
                <TableRow key={headerGroup.id}>
                  {headerGroup.headers.map((header) => {
                    return (
                      <TableHead
                        key={header.id}
                        className={
                          (header.column.columnDef.meta as any)?.align
                            ? "h-10 text-white bg-primary whitespace-nowrap text-" +
                              (header.column.columnDef.meta as any)?.align
                            : "h-10 text-white bg-primary whitespace-nowrap"
                        }
                      >
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

            <TableBody>
              {table.getRowModel().rows?.length ? (
                table.getRowModel().rows.map((row) => (
                  <TableRow key={row.id}>
                    {row.getVisibleCells().map((cell) => {
                      return (
                        <TableCell
                          key={cell.id}
                          className={
                            (cell.column.columnDef.meta as any)?.align
                              ? "py-2 whitespace-nowrap text-" +
                                (cell.column.columnDef.meta as any)?.align
                              : "py-2 whitespace-nowrap"
                          }
                        >
                          {flexRender(
                            cell.column.columnDef.cell,
                            cell.getContext()
                          )}
                        </TableCell>
                      );
                    })}
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell
                    colSpan={columns.length}
                    className="h-24 text-center"
                  >
                    No results.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </div>

      <DataTablePagination table={table} />
    </Card>
  );
};