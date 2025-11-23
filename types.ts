export enum AppMode {
  GENERATE = 'GENERATE',
  EDIT = 'EDIT'
}

export interface ImageAsset {
  data: string; // Base64 string
  mimeType: string;
}

export interface GenerationResult {
  imageUrl: string | null;
  prompt: string;
  timestamp: number;
}
