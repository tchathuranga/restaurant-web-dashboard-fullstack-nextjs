// Prisma throws P2025 when an update/delete targets a row that does not exist
export function isNotFound(error: unknown): boolean {
  return (error as { code?: string })?.code === 'P2025';
}
