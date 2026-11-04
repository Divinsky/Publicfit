// Cloudflare adapter config for PublicFit.
// No R2 bucket: the demo uses no ISR/revalidation, so the default dummy
// caches are enough (avoids needing an R2 bucket binding at deploy time).
import { defineCloudflareConfig } from "@opennextjs/cloudflare/config";

export default defineCloudflareConfig();
