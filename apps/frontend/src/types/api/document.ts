import { User } from 'types/auth';

export type Document = {
  id: number;
  createdAt: string;
  updatedAt: string;
  title: string;
  description?: string;
  summary?: string;
  url: string;
  user: User;
};

export type GetDocumentsResponse = {
  data: Document[];
  page: number;
  pageSize: number;
  totalPages: number;
};
export type CreateDocument = Omit<
  Document,
  'id' | 'createdAt' | 'updatedAt' | 'url' | 'user'
> & { file: File };
export type UpdateDocument = Partial<CreateDocument>;
