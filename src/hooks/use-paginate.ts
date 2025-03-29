interface Cursor {
  id: string;
  updatedAt: Date;
}

interface PaginatedResult<T> {
  items: T[];
  nextCursor: Cursor | null;
}

export const paginate = <T extends { id: string; updatedAt: Date }>(
  data: T[],
  limit: number
): PaginatedResult<T> => {
  const hasMore = data.length > limit;
  const items = hasMore ? data.slice(0, -1) : data;

  const lastItem = items[items.length - 1];
  const nextCursor = hasMore
    ? {
        id: lastItem.id,
        updatedAt: lastItem.updatedAt,
      }
    : null;

  return { items, nextCursor };
};
