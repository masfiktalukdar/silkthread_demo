"use client";
import { deleteCartProduct } from "@/services/cart";
import { useRouter } from "next/navigation";
import { RiDeleteBin6Line } from "react-icons/ri";
import { toast } from "react-toastify";

const CartDelete = ({ cardId }: { cardId: string }) => {
  const router = useRouter();
  const handleDelete = async () => {
    try {
      await deleteCartProduct(cardId);
      router.refresh();
      toast.success("Deleted cart");
    } catch (err) {
      console.error("Failed to  delete cart", err);
      toast.error("Failed to  delete cart.");
    }
  };

  return (
    <button
      onClick={handleDelete}
      title="Remove item"
      className="w-8 h-8 flex items-center justify-center rounded-lg text-red-400 hover:text-red-600 hover:bg-red-50 transition-all duration-200 cursor-pointer border border-transparent hover:border-red-100"
    >
      <RiDeleteBin6Line className="w-4 h-4" />
    </button>
  );
};

export default CartDelete;
