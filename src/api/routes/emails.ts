import { Hono } from "hono";
import { db } from "../db";
import { emailsTable } from "../db/schema";
import { and, eq } from "drizzle-orm";
import { zValidator } from "@hono/zod-validator";
import { z } from "zod";
import authMiddleware from "../middleware/auth";

const app = new Hono()
  .use(authMiddleware)
  .get("/", async (c) => {
    const userId = c.get("user").id;
    const emails = await db
      .select()
      .from(emailsTable)
      .where(eq(emailsTable.userId, userId));
    return c.json(emails);
  })
  .post(
    "/delete",
    zValidator("form", z.object({ id: z.string() })),
    async (c) => {
      const userId = c.get("user").id;
      const emailId = c.req.valid("form").id;
      const email = await db
        .delete(emailsTable)
        .where(and(eq(emailsTable.userId, userId), eq(emailsTable.id, emailId)))
        .returning();

      if (!email) {
        return c.notFound();
      }
    },
  );

export default app;
