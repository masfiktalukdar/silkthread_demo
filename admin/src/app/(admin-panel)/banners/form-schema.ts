import { z } from "zod";

export const bannerFormSchema = z.object({
  // title: z.string().min(1),
  // details: z.string().optional(),
  // bannerCategory: z.string().optional(),
  type: z.string().min(1),
  image: z
    .array(
      z.instanceof(File).refine((file) => file.size <= 5 * 1024 * 1024, {
        message: "ছবির সাইজ সর্বোচ্চ ৫ মেগাবাইট (5 MB) হতে পারবে",
      })
    )
    .max(1, {
      message: "সর্বোচ্চ ১টি ছবি নির্বাচন করা যাবে",
    })
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
