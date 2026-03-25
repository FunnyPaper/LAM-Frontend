export type PaginatedMetadataDto = {
  page: number;
  limit: number;
  totalItems: number;
  totalPages: number;
}

export type Paginated<T> = {
  data: T[],
  metadata: PaginatedMetadataDto
}