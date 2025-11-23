export enum AppMode {
  GENERATE = 'GENERATE',
  EDIT = 'EDIT'
}

export type AspectRatio = '1:1' | '16:9' | '9:16' | '4:3' | '3:4';

export interface ImageAsset {
  data: string; // Base64 string
  mimeType: string;
}

export interface GenerationResult {
  imageUrl: string | null;
  prompt: string;
  timestamp: number;
}

export interface HistoryItem {
  id: string;
  imageUrl: string;
  prompt: string;
  timestamp: number;
  mode: AppMode;
  aspectRatio?: AspectRatio;
}