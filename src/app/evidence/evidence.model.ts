export type Format = "png" | "jpg" | "pdf";

export interface Evidence {
  file_name: string;
  size: string;
  format: Format;
  userId: string;
  subjectId: string;
}
