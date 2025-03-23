import { db } from '@/db';
import { usersTable } from '@/db/schema';
import { ratelimit } from '@/lib/ratelimit';
import { auth } from '@clerk/nextjs/server';
import { initTRPC, TRPCError } from '@trpc/server';
import { eq } from 'drizzle-orm';
import { cache } from 'react';
import superjson from 'superjson'
export const createTRPCContext = cache(async () => {

    const { userId } = await auth();
    return { clerkUserId: userId }
});
// Avoid exporting the entire t-object
// since it's not very descriptive.
// For instance, the use of a t variable
// is common in i18n libraries.

export type Context = Awaited<ReturnType<typeof createTRPCContext>>

const t = initTRPC.context<Context>().create({
    /**
     * @see https://trpc.io/docs/server/data-transformers
     */
    transformer: superjson,
});
// Base router and procedure helpers
export const createTRPCRouter = t.router;
export const createCallerFactory = t.createCallerFactory;
export const baseProcedure = t.procedure;



export const protectedProcedure = t.procedure.use(async function isAuthenticated(options) {
    const { ctx } = options;
    if (!ctx.clerkUserId) {
        throw new TRPCError({ code: "UNAUTHORIZED" });
    }
    const [user] = await db.select().from(usersTable).where(eq(usersTable.clerkId, ctx.clerkUserId)).limit(1);
    if (!user)
        throw new TRPCError({ code: "UNAUTHORIZED", message: "User Not Found in Database" });


    const { success } = await ratelimit.limit(user.id.toString());
    if (!success) {
        throw new TRPCError({ code: "TOO_MANY_REQUESTS" });
    }

    return options.next({
        ctx: {
            ...ctx,
            user
        }
    });
})