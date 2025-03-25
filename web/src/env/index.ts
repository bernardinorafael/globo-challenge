import { z } from "zod"

const envSchema = z.object({
  VITE_SERVER_URL: z.string().url(),
  VITE_VERIFY_SITE_KEY: z.string(),
  VITE_VERIFY_SECRET_KEY: z.string(),
})

const _env = envSchema.safeParse(import.meta.env)

if (!_env.success) {
  console.error("❌ Invalid environment variables:", _env.error.format())
  throw new Error("Invalid environment variables.")
}

export const env = _env.data
