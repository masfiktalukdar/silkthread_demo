import { ContentLayout } from "@/components/admin-panel/content-layout";
import { getAllUser } from "@/services/auth";
import React from "react";
import { StaffTable } from "./table";

export const dynamic = "force-dynamic";

export default async function StaffsPage() {
  const res = await getAllUser().catch(() => ({ data: [] }));
  const data = res?.data || [];
  return (
    <ContentLayout title="Staffs">
      <StaffTable data={data} />
    </ContentLayout>
  );
}
