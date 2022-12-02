import { File } from '../File';

export interface FileRepository {
  exists(fileId: string): Promise<boolean>;
  search(path: string): Promise<File>;
  save(file: File): Promise<void>;
  saveBulk(files: File[]): Promise<void>;
}
