import { z } from "zod";




// Video schema
const createTrainingVideoSchema = z.object({
  title: z.string().min(1, "Video title is required"),
  description: z.string().optional(),
  videoType: z.enum(["link", "upload"]),
  videoLink: z.string().optional(),
  videoFile: z.any().optional(),
  roles: z.array(z.string()).min(1, "Select at least one role"),
  thumbnail: z.any().optional(),
})
.superRefine((video, ctx) => {
  if (video.videoType === "upload" && !video.videoFile) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: "Video file is required",
      path: ["videoFile"],
    });
  }

  if (video.videoType === "link" && !video.videoLink) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: "Video link is required",
      path: ["videoLink"],
    });
  }
});

// Category schema per language
const categoryLangSchema = z.object({
  title: z.string().min(1, "Category title is required"),
  description: z.string().min(1, "Category description is required"),
  thumbnail: z.any().optional(),
  videos: z.array(createTrainingVideoSchema).min(1, "At least one video is required"),
});

// Main schema
export const createTrainingCategorySchema = z.object({
  orgId: z.string().optional(), // only required if SUPER_ADMIN selects org
  category: z.object({
    en: categoryLangSchema,
    // es: categoryLangSchema,
  }),
});

export const updateCategorySchema = z.object({
  category: z.object({
    en: z.object({
      title: z.string().min(1, "Category title is required"),
      description: z.string().optional(),
      thumbnail: z.any().optional(),
    }),
    es: z.object({
      title: z.string().optional(),
      description: z.string().optional(),
      thumbnail: z.any().optional(),
    }),
  }),
});

// const langSchema = z.object({
//   title: z.string().min(1, "Title is required").optional().or(z.literal("")),
//   description: z.string().optional().or(z.literal("")),
//   thumbnail: z.any().nullable().optional(),
//   videoFile: z.any().nullable().optional(),
//   videoLink: z.string().url().optional().or(z.literal("")),
// });

// export const updateCategoryVideoSchema = z.object({
//   en: langSchema,
//   es: langSchema,
//   roles: z.array(z.string()).min(1, "Select at least one role"),
//   videoType: z.enum(["link", "upload"]),
// });

const langSchema = z.object({
  title: z.string().min(1, "Title is required").optional().or(z.literal("")),
  description: z.string().optional().or(z.literal("")),
  thumbnail: z.any().nullable().optional(),
  videoFile: z.any().nullable().optional(),
  videoLink: z.string().url().optional().or(z.literal("")),
});

// Main schema matching your `useForm` defaultValues
export const updateCategoryVideoSchema = z.object({
  video: z.object({
    en: langSchema,
    es: langSchema,
  }),
  roles: z.array(z.string()).min(1, "Select at least one role"),
  videoType: z.enum(["link", "upload"]),
});

const videoLangSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().optional(),
  thumbnail: z
    .any()
    .nullable()
    .optional(), // file input
  videoType: z.enum(["link", "upload"]),
  videoLink: z.string().optional(),
  videoFile: z
    .any()
    .nullable()
    .optional(), // file input
});

const videoSchema = z.object({
  en: videoLangSchema,
  es: videoLangSchema,
  roles: z.array(z.string()).min(1, "Select at least one role"),
});

export const addVideosSchema = z.object({
  videos: z.array(videoSchema).min(1, "At least one video is required"),
});


const validVideoTypes = [
  "video/mp4",
  "video/webm",
  "video/ogg",
  "video/quicktime",
  "video/x-msvideo",
  "video/x-matroska",
  "video/mpeg",
  "application/x-mpegURL",
  "application/vnd.apple.mpegurl",
];

// Language-specific video data schema
const videoLanguageSchema = z.object({
  title: z.string().optional().default(""),
  description: z.string().optional().default("<p>Enter video description here...</p>"),
  thumbnail: z
    .custom<File | null>()
    .nullable()
    .optional()
    .refine(
      (file) => {
        if (!file) return true;
        return file.type.startsWith("image/");
      },
      { message: "Thumbnail must be an image file" }
    ),
  videoFile: z
    .custom<File | null>()
    .nullable()
    .optional()
    .refine(
      (file) => {
        if (!file) return true;
        return validVideoTypes.includes(file.type);
      },
      { message: "Invalid video file type. Please upload a valid video file." }
    ),
  videoType: z.enum(["upload", "link"]).default("upload"),
  videoLink: z.string().optional().default(""),
});

// Single video schema with cross-field validations
const singleVideoSchema = z
  .object({
    en: videoLanguageSchema,
    es: videoLanguageSchema,
    roles: z.array(z.string()),
  })
  .superRefine((data, ctx) => {
    const enTitle = data.en.title?.trim() || "";
    const esTitle = data.es.title?.trim() || "";
    const hasEnContent = enTitle.length > 0;
    const hasEsContent = esTitle.length > 0;

    // At least one language must have a title
    if (!hasEnContent && !hasEsContent) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Video Title is required",
        path: ["en", "title"],
      });
    }

    // At least one role must be selected
    if (!data.roles || data.roles.length === 0) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "At least one role must be selected",
        path: ["roles"],
      });
    }

    // English validations (only if English has content)
    if (hasEnContent) {
      if (data.en.videoType === "link") {
        if (!data.en.videoLink?.trim()) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: "Video link is required",
            path: ["en", "videoLink"],
          });
        }
      } else if (data.en.videoType === "upload") {
        if (!data.en.videoFile) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: "Video file is required",
            path: ["en", "videoFile"],
          });
        }
      }
    }

    // Spanish validations (only if Spanish has content)
    if (hasEsContent) {
      if (data.es.videoType === "link") {
        if (!data.es.videoLink?.trim()) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: "Spanish video link is required",
            path: ["es", "videoLink"],
          });
        }
      } else if (data.es.videoType === "upload") {
        if (!data.es.videoFile) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: "Spanish video file is required",
            path: ["es", "videoFile"],
          });
        }
      }
    }
  });

// Main form schema
export const addVideosSchema2 = z.object({
  videos: z.array(singleVideoSchema).min(1, "At least one video is required"),
});

export type AddVideosFormData2 = z.infer<typeof addVideosSchema2>;
export type SingleVideoData = z.infer<typeof singleVideoSchema>;
export type VideoLanguageData = z.infer<typeof videoLanguageSchema>;

// Type inferred from schema
export type CategoryFormData = z.infer<typeof createTrainingCategorySchema>;
export type UpdateCategoryFormData = z.infer<typeof updateCategorySchema>;
export type UpdateCategoryVideoFormData = z.infer<typeof updateCategoryVideoSchema>;
