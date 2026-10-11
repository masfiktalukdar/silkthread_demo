import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast, useToast } from "@/components/ui/use-toast";
import {
  createSteadfastOrder,
  sendOrderToPathao,
  sendOrderToSteadfast,
} from "@/services/courier";
import { SteadfastOrderPayload, TOrder } from "@/types/shared";
import { fileUrlGenerator, makeBDPrice, makePrice } from "@/utils/helpers";
import Image from "next/image";
import { ColumnDef } from "@tanstack/react-table";
import React, { useRef } from "react";
import { deleteOrderAction, UpdateOrderStatus } from "./actions";
import { useReactToPrint } from "react-to-print";
import PrintInvoice from "@/components/invoice/page";
import { Printer } from "lucide-react";
import { upperCase } from "lodash";
import { confirmation } from "@/components/modals/confirm-modal";

export const orderStatuses = [
  { key: "InOrder", name: "In Order" },
  { key: "Hold", name: "Hold" },
  { key: "Cancelled", name: "Cancelled" },
  { key: "PartialDelivered", name: "Partial Delivered" },
  { key: "Delivered", name: "Delivered" },
  { key: "DeliveredPending", name: "Delivered Pending" },
  { key: "OrderPlaced", name: "Order Placed" },
];

export const columns: ColumnDef<TOrder>[] = [
  {
    header: "SL",
    cell: ({ row }) => row.index + 1,
  },
  {
    header: "Order ID",
    accessorKey: "orderId",
  },
  {
    header: "Products",
    cell: ({ row }) => {
      const { products } = row.original;
      return (
        <div className="min-w-[220px] max-w-[280px] flex flex-col gap-2.5">
          {products?.map((item, index) => {
            const firstImage =
              Array.isArray(item?.productRef?.images) && item.productRef.images.length > 0
                ? item.productRef.images[0]
                : null;
            const imageSrc = fileUrlGenerator(item?.productRef?.thumbnailImage || firstImage);

            return (
              <div
                key={index}
                className="p-2.5 border border-gray-200 rounded-[2px] bg-white flex items-center gap-3 shadow-2xs"
              >
                <div className="relative w-14 h-14 shrink-0 rounded-[2px] overflow-hidden border border-gray-200 bg-gray-50">
                  <Image
                    src={imageSrc}
                    alt={item?.productRef?.name || "Product image"}
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="flex-1 min-w-0 text-xs">
                  <p className="font-semibold text-gray-900 leading-tight truncate">
                    {item?.productRef?.name || "Product"}
                  </p>
                  <p className="text-gray-600 mt-1">
                    <span className="font-bold text-[#FF6C0C]">৳{item?.productRef?.price || 0}</span>{" "}
                    × <span className="font-bold text-gray-900">{item?.quantity || 1}</span>
                  </p>
                  <div className="flex items-center gap-2 text-[11px] text-gray-500 mt-0.5">
                    {item?.inventoryRef?.name && item?.inventoryRef?.name !== "N/A" && (
                      <span>Color: <strong className="text-gray-700">{upperCase(item?.inventoryRef?.name)}</strong></span>
                    )}
                    <span>Size: <strong className="text-gray-700">{item?.inventoryRef?.level ? upperCase(item?.inventoryRef?.level) : "N/A"}</strong></span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      );
    },
  },
  {
    header: "Subtotal Price",
    accessorKey: "subTotalPrice",
    cell: ({ row }) => {
      return (
        <div className="min-w-[120px]">
          {row.original.subTotalPrice &&
            makeBDPrice(row.original.subTotalPrice)}
        </div>
      );
    },
  },
  {
    header: "Coupon Code",
    cell: ({ row }) => {
      return (
        <div>
          {row.original.couponRef?.code || "N/A"}
        </div>
      );
    },

  },
  {
    header: "Coupon Discount",
    accessorKey: "couponDiscount",
    cell: ({ row }) => {
      return (
        <div>
          {row.original.couponDiscount &&
            makeBDPrice(row.original.couponDiscount)}
        </div>
      );
    },
  },
  {
    header: "Shipping Cost",
    accessorKey: "shippingCost",
    cell: ({ row }) => {
      return (
        <div className="min-w-[120px]">
          {row.original.shippingCost && makeBDPrice(row.original.shippingCost)}
        </div>
      );
    },
  },
  {
    header: "Total Price",
    accessorKey: "totalPrice",
    cell: ({ row }) => {
      return (
        <div className="min-w-[120px]">
          {row.original.totalPrice && makeBDPrice(row.original.totalPrice)}
        </div>
      );
    },
  },
  {
    header: "Payment Method",
    accessorKey: "paymentMethod",
    cell: ({ row }) => {
      const method = row.original.paymentMethod;
      return (
        <div className="flex flex-col">
          <span>{method}</span>
          {method === "MobileBanking" && (
            <>
              <span className="mt-1">Provider: {row.original.mobileBankingProvider || "N/A"}</span>
              <span className="mt-1">Number: {row.original.mobileNumber || "N/A"}</span>
            </>
          )}
        </div>
      );
    },
  },
  // {
  //   header: "User Info",
  //   cell: ({ row }) => {
  //     return (
  //       <div>
  //         <div className="flex justify-between items-center gap-2">
  //           <p>Name: </p>
  //           <p>{row.original.userRef?.name}</p>
  //         </div>
  //         <div className="flex justify-between items-center gap-2">
  //           <p>Phone: </p>
  //           <p>{row.original.userRef?.phone}</p>
  //         </div>
  //         <div className="flex justify-between items-center gap-2">
  //           <p>Email: </p>
  //           <p>{row.original.userRef?.email}</p>
  //         </div>
  //         {row.original.userRef?.isFistOrder && <div>First Order</div>}
  //       </div>
  //     );
  //   },
  // },
  {
    header: "Customer Info",
    cell: ({ row }) => {
      return (
        <div>
          <div className="flex justify-between items-center gap-2">
            <p>Name: </p>
            <p>{row.original.customerName}</p>
          </div>
          <div className="flex justify-between items-center gap-2">
            <p>Phone: </p>
            <p>{row.original.customerPhone}</p>
          </div>
          <div className="flex justify-between items-center gap-2">
            <p>Email: </p>
            <p>{row.original.customerEmail}</p>
          </div>
          <div className="flex justify-between items-center gap-2">
            <p>Address: </p>
            <p>{row.original.customerCity},</p>
            <p>{row.original.customerAddress}</p>
          </div>
        </div>
      );
    },
  },
  {
    header: "Order Status",
    accessorKey: "status",
    cell: ({ row }) => {
      console.log(
        row.original.status,
        "row from order status...........54461411321321321321321"
      );
      const rowStatus = orderStatuses.find((r) => {
        return r.key === row?.original?.status;
      });
      return <div>{rowStatus?.name || "N/A"}</div>;
    },
  },
  {
    header: "Action",
    cell: ({ row }) => {
      const [loading, setLoading] = React.useState(false);
      const { toast } = useToast();
      const currentStatus = row.original.status;
      const orderId = row.original._id;

      const handleStatusChange = async (newStatus: string) => {
        if (newStatus === currentStatus) return;

        setLoading(true);
        try {
          if (orderId) {
            const res = await UpdateOrderStatus(orderId, newStatus);
            if (res.success) {
              toast({
                title: "Success",
                description: `Order status updated to ${newStatus}`,
              });
            }
          }
        } catch (error) {
          toast({
            variant: "destructive",
            title: "Error",
            description: "Failed to update order status",
          });
        } finally {
          setLoading(false);
        }
      };

      return (
        <div>
          <Select
            disabled={loading}
            defaultValue={currentStatus}
            onValueChange={handleStatusChange}
          >
            <SelectTrigger className="w-[160px]">
              <SelectValue placeholder="Update status" />
            </SelectTrigger>
            <SelectContent>
              {orderStatuses.map((status) => (
                <SelectItem key={status.key} value={String(status.key)}>
                  {status.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      );
    },
  },
  {
    header: "Courier",
    cell: ({ row }) => {
      const order = row.original;
      const [loadingCourier, setLoadingCourier] = React.useState<string | null>(null);
      const [currentOrder, setCurrentOrder] = React.useState(order);
      const { toast } = useToast();

      const handleSendToCourier = async (courierName: "pathao" | "steadfast") => {
        setLoadingCourier(courierName);
        try {
          let response;
          if (courierName === "pathao") {
            response = await sendOrderToPathao(order.orderId);
          } else {
            response = await sendOrderToSteadfast(order.orderId);
          }

          if (response && response.success) {
            const cid = response.consignment_id || response.data?.consignment_id;
            toast({
              title: "Courier Dispatched",
              description: `Submitted to ${courierName === "pathao" ? "Pathao" : "Steadfast"} (CID: ${cid})`,
            });
            setCurrentOrder((prev) => ({
              ...prev,
              courierName,
              consignmentId: String(cid),
              courierStatus: response.data?.order_status || response.data?.status || "Pending",
            }));
          } else {
            throw new Error(response?.message || "Failed to submit to courier");
          }
        } catch (error: any) {
          toast({
            title: "Courier Dispatch Failed",
            variant: "destructive",
            description: error.message || "An error occurred while submitting to courier",
          });
        } finally {
          setLoadingCourier(null);
        }
      };

      if (currentOrder.consignmentId) {
        const isPathao = currentOrder.courierName === "pathao";
        const trackingLink = isPathao
          ? `https://merchant.pathao.com/tracking?consignment_id=${currentOrder.consignmentId}`
          : `https://steadfast.com.bd/t/${currentOrder.consignmentId}`;

        return (
          <div className="flex flex-col gap-1 text-xs min-w-[130px]">
            <span
              className={`inline-flex items-center gap-1 font-bold px-2 py-0.5 rounded-full w-fit ${
                isPathao
                  ? "bg-red-50 text-red-700 border border-red-200"
                  : "bg-emerald-50 text-emerald-700 border border-emerald-200"
              }`}
            >
              <span className={`w-1.5 h-1.5 rounded-full ${isPathao ? "bg-red-500" : "bg-emerald-600"}`} />
              {isPathao ? "Pathao" : "Steadfast"}
            </span>
            <div className="text-[11px] text-gray-600 font-mono">
              CID: <span className="font-bold select-all">{currentOrder.consignmentId}</span>
            </div>
            {currentOrder.courierStatus && (
              <span className="text-[10px] text-gray-500 uppercase font-semibold">
                {currentOrder.courierStatus.replace(/_/g, " ")}
              </span>
            )}
            <a
              href={trackingLink}
              target="_blank"
              rel="noopener noreferrer"
              className="text-[11px] text-blue-600 hover:underline font-medium inline-flex items-center gap-1"
            >
              Track Live ↗
            </a>
          </div>
        );
      }

      return (
        <div className="flex flex-col gap-1.5 min-w-[100px]">
          <Button
            size="sm"
            className="h-7 text-xs bg-emerald-600 hover:bg-emerald-700 text-white"
            loading={loadingCourier === "steadfast"}
            onClick={() => handleSendToCourier("steadfast")}
          >
            Steadfast
          </Button>
          <Button
            size="sm"
            className="h-7 text-xs bg-[#E23744] hover:bg-[#c92e3a] text-white"
            loading={loadingCourier === "pathao"}
            onClick={() => handleSendToCourier("pathao")}
          >
            Pathao
          </Button>
        </div>
      );
    },
  },
  {
    header: "Invoice",
    cell: ({ row }) => {
      const orderData = row.original;

      const printerRef = useRef(null);

      const handlePrinter = useReactToPrint({
        content: () => printerRef.current,
      });
      return (
        <div>
          <Button onClick={handlePrinter}>
            {/* <PrinterCheck /> */}
            <Printer />
          </Button>
          {/* Print Invoice */}
          <div className="hidden">
            {orderData && (
              <PrintInvoice ref={printerRef} orderData={orderData} />
            )}
          </div>
        </div>
      );
    },
  },
  {
    header: "Action",
    cell: ({ row }) => {
      const [deleting, setDeleting] = React.useState(false);
      const [loading, setLoading] = React.useState(false);
      const { _id } = row.original;

      const handleDeleteClick = async () => {
        if (await confirmation("Are you sure you want to delete this order?")) {
          setDeleting(true);
          try {
            const deleted = await deleteOrderAction(String(_id));
            if (deleted) {
              toast({
                title: "Order deleted successfully",
                variant: "default",

              });
              window.location.reload();
            }
          } catch (error: any) {
            toast({
              title: "Cannot delete order",
              description: error.message,
              variant: "destructive",
            });
          } finally {
            setDeleting(false);
          }
        }
      };



      return (
        <div>
          <Button
            loading={deleting}
            onClick={handleDeleteClick}
            variant="destructive"
          >
            Delete
          </Button>
        </div>
      );
    },
  }


];
function fetchOrders() {
  throw new Error("Function not implemented.");
}

