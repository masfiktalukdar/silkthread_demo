import { ContentLayout } from "@/components/admin-panel/content-layout";
import { getOrderWithPagination } from "@/services/order";
import React from "react";
import { OrderTable } from "./table";
import { fileUrlGenerator } from "@/utils/helpers";

export const revalidate = 0;

interface Props {
  searchParams: {
    [key: string]: string | string[] | undefined;
  };
}

export default async function OrdersPage({ searchParams }: Props) {
  const resolvedSearchParams = await Promise.resolve(searchParams);
  const page = Array.isArray(resolvedSearchParams.page)
    ? resolvedSearchParams.page[0]
    : resolvedSearchParams.page || "1";
  const limit = Array.isArray(resolvedSearchParams.limit)
    ? resolvedSearchParams.limit[0]
    : resolvedSearchParams.limit || "10";
  const search = Array.isArray(resolvedSearchParams.search)
    ? resolvedSearchParams.search[0]
    : resolvedSearchParams.search || "";

  const { data } = await getOrderWithPagination(page, limit, search);

  return (
    <ContentLayout title="Order">
      <OrderTable
        data={data.result.map((item) => item)}
        pagination={{
          page: parseInt(page),
          limit: parseInt(limit),
          total: data.pagination.total,
        }}
      />
    </ContentLayout>
  );
}
