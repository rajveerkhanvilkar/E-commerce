// Temporary mock Prisma client until we fix the generation issue
export const prisma = {
  user: {
    findUnique: async () => null,
    findMany: async () => [],
    create: async () => null,
    update: async () => null,
  },
  product: {
    findUnique: async () => null,
    findMany: async () => [],
    create: async () => null,
    update: async () => null,
    delete: async () => null,
    count: async () => 0,
  },
  category: {
    findUnique: async () => null,
    findMany: async () => [],
  },
  cartItem: {
    findUnique: async () => null,
    findMany: async () => [],
    create: async () => null,
    update: async () => null,
    delete: async () => null,
    deleteMany: async () => null,
  },
  order: {
    findUnique: async () => null,
    findMany: async () => [],
    create: async () => null,
    update: async () => null,
  },
  $disconnect: async () => { },
}
