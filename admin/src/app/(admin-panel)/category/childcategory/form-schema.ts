import { z } from "zod";

export const childCategoryFormSchema = z.object({
  name: z.string().min(1),
  viewType: z.string().optional(),
  subCategoryRef: z.string().nonempty("Subcategory is required"),

  image: z
    .array(
      z.instanceof(File).refine((file) => file.size <= 5 * 1024 * 1024, {
        message: "ছবির সাইজ সর্বোচ্চ ৫ মেগাবাইট (5 MB) হতে পারবে",
      })
    )
    .optional()
    .default([]),
  bannerImage: z
    .array(
      z.instanceof(File).refine((file) => file.size <= 5 * 1024 * 1024, {
        message: "ছবির সাইজ সর্বোচ্চ ৫ মেগাবাইট (5 MB) হতে পারবে",
      })
    )
    .optional()
    .default([]),
});

export const dropZoneConfig = {
  accept: {
    "image/*": [".jpg", ".jpeg", ".png", "webp"],
  },
  maxFiles: 1,
  maxSize: 1024 * 1024 * 5,
  multiple: false,
};
