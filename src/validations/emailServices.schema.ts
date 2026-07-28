import { z } from "zod";

export const EmailProvider = {
  SENDGRID: "SENDGRID",
  MAILGUN: "MAILGUN",
  SMTP: "SMTP",
} as const;

// SMTP config
export const smtpConfigFrontendSchema = z.object({
  host: z.string().min(1, { message: "SMTP host is required" }),
  port: z.number().min(1, { message: "SMTP port must be greater than 0" }),
  username: z.string().min(1, { message: "SMTP username is required" }),
  password: z.string().min(1, { message: "SMTP password is required" }),
  secure: z.boolean().default(false),
});

export const setupEmailConfigFrontendSchema = z
  .object({
    provider: z.enum(["SENDGRID", "MAILGUN", "SMTP"], {
      message: "Email provider is required",
    }),

    sendgridConfig: z
      .object({
        apiKey: z.string().min(1, { message: "SendGrid API key is required" }),
        verifiedSender: z
          .string()
          .email({ message: "Invalid verified sender email" }),
      })
      .optional(),

    mailgunConfig: z
      .object({
        apiKey: z.string().min(1, { message: "Mailgun API key is required" }),
        domain: z.string().min(1, { message: "Mailgun domain is required" }),
        region: z.enum(["US", "EU"]).default("US"),
      })
      .optional(),

    smtpConfig: smtpConfigFrontendSchema.optional(),

    senderInfo: z
      .object({
        fromEmail: z.string().email({ message: "Invalid from email" }).optional(),
        fromName: z.string().min(1, { message: "From name is required" }).optional(),
        replyToEmail: z
          .string()
          .email({ message: "Invalid reply-to email" })
          .optional(),
        supportEmail: z
          .string()
          .email({ message: "Invalid support email" })
          .optional(),
      })
      .optional(),

    settings: z
      .object({
        enableEmailTracking: z.boolean().default(true),
        enableClickTracking: z.boolean().default(true),
        enableOpenTracking: z.boolean().default(true),
        unsubscribeUrl: z
          .string()
          .url({ message: "Invalid unsubscribe URL" })
          .optional(),
        footerText: z.string().optional(),
      })
      .optional(),

    rateLimits: z
      .object({
        dailyLimit: z.number().min(1, { message: "Daily limit must be at least 1" }).default(1000),
        hourlyLimit: z.number().min(1, { message: "Hourly limit must be at least 1" }).default(100),
      })
      .optional(),

    isActive: z.boolean().default(true),
  })
  .superRefine((data, ctx) => {
    if (data.provider === "SENDGRID" && !data.sendgridConfig) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "SendGrid configuration is required when provider is SENDGRID",
        path: ["sendgridConfig"],
      });
    }

    if (data.provider === "MAILGUN" && !data.mailgunConfig) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Mailgun configuration is required when provider is MAILGUN",
        path: ["mailgunConfig"],
      });
    }

    if (data.provider === "SMTP" && !data.smtpConfig) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "SMTP configuration is required when provider is SMTP",
        path: ["smtpConfig"],
      });
    }
  });
