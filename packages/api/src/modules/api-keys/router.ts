import { Hono } from "hono";
import * as z from "zod";

import { eq, and } from "@workspace/db";
import { apiKey, type SelectApiKey } from "@workspace/db/schema";
import { db } from "@workspace/db/server";
import { generateId } from "@workspace/shared/utils";

import { enforceAuth, validate } from "../../middleware";

const createApiKeySchema = z.object({
  provider: z.enum(["openai", "anthropic", "google"]),
  key: z.string().min(1),
  label: z.string().min(1).max(100),
});

const deleteApiKeySchema = z.object({
  id: z.string().min(1),
});

const maskKey = (key: string): string => {
  if (key.length <= 8) return "****";
  return `${key.slice(0, 4)}...${key.slice(-4)}`;
};

export const apiKeysRouter = new Hono()
  .use(enforceAuth)
  .get("/", async (c) => {
    const userId = c.var.user.id;

    const keys = await db.query.apiKey.findMany({
      where: eq(apiKey.userId, userId),
    });

    return c.json(
      keys.map((k: SelectApiKey) => ({
        id: k.id,
        provider: k.provider,
        label: k.label,
        maskedKey: maskKey(k.encryptedKey),
        createdAt: k.createdAt,
      })),
    );
  })
  .post("/", validate("json", createApiKeySchema), async (c) => {
    const userId = c.var.user.id;
    const { provider, key, label } = c.req.valid("json");

    const newKey = await db
      .insert(apiKey)
      .values({
        id: generateId(),
        userId,
        provider,
        encryptedKey: key,
        label,
      })
      .returning();

    return c.json(
      {
        id: newKey[0]!.id,
        provider: newKey[0]!.provider,
        label: newKey[0]!.label,
        maskedKey: maskKey(key),
        createdAt: newKey[0]!.createdAt,
      },
      201,
    );
  })
  .post("/delete", validate("json", deleteApiKeySchema), async (c) => {
    const userId = c.var.user.id;
    const { id } = c.req.valid("json");

    await db
      .delete(apiKey)
      .where(and(eq(apiKey.id, id), eq(apiKey.userId, userId)));

    return c.json({ success: true });
  });
