// Cloudflare Workers 環境類型
export interface Env {
  DB: D1Database;
  BUCKET: R2Bucket;
  CACHE: KVNamespace;
  ENVIRONMENT: string;
  CORS_ORIGIN: string;
  JWT_SECRET: string;
}

// 確保 Cloudflare Workers 類型可用
declare global {
  interface D1Database {
    prepare(query: string): D1PreparedStatement;
  }
  
  interface D1PreparedStatement {
    bind(...values: any[]): D1PreparedStatement;
    first(): Promise<any>;
    all(): Promise<{ results: any[] }>;
    run(): Promise<{ changes?: number }>;
  }
  
  interface R2Bucket {
    get(key: string): Promise<R2Object | null>;
    put(key: string, value: ReadableStream | ArrayBuffer | ArrayBufferView | string | null | undefined, options?: R2PutOptions): Promise<R2Object>;
    delete(key: string): Promise<void>;
  }
  
  interface R2Object {
    body: ReadableStream;
  }
  
  interface R2PutOptions {
    httpMetadata?: {
      contentType?: string;
      contentDisposition?: string;
    };
    customMetadata?: Record<string, string>;
  }
  
  interface KVNamespace {
    get(key: string): Promise<string | null>;
    put(key: string, value: string): Promise<void>;
  }
}

// 腳本分類
export interface ScriptCategory {
  id: number;
  name: string;
  slug: string;
  description?: string;
  emoji?: string;
  created_at: string;
}

// 腳本模板
export interface ScriptTemplate {
  id: number;
  category_id: number;
  name: string;
  version?: string;
  description: string;
  prompt: string;
  translation?: string;
  tags: string[]; // JSON array
  status: 'active' | 'inactive' | 'draft';
  created_at: string;
  updated_at: string;
  // 關聯數據
  category?: ScriptCategory;
  average_rating?: number;
  rating_count?: number;
  usage_count?: number;
}

// 腳本評分
export interface ScriptRating {
  id: number;
  script_id: number;
  user_id: string;
  rating: number; // 1-5
  comment?: string;
  created_at: string;
}

// 腳本使用記錄
export interface ScriptUsage {
  id: number;
  script_id: number;
  user_id: string;
  action: 'view' | 'copy' | 'download' | 'generate';
  metadata?: Record<string, any>; // JSON
  created_at: string;
}

// 腳本截圖
export interface ScriptScreenshot {
  id: number;
  script_id: number;
  filename: string;
  r2_key: string;
  size: number;
  mime_type: string;
  uploaded_by: string;
  created_at: string;
}

// 腳本生成記錄
export interface ScriptGeneration {
  id: number;
  script_id: number;
  user_id: string;
  generated_content: string;
  parameters?: Record<string, any>; // JSON
  created_at: string;
}

// API 響應類型
export interface ApiResponse<T = any> {
  success: boolean;
  message: string;
  data: T | null;
  pagination?: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

// 請求 Schema
export interface CreateScriptTemplateRequest {
  category_id: number;
  name: string;
  version?: string;
  description: string;
  prompt: string;
  translation?: string;
  tags: string[];
  status?: 'active' | 'inactive' | 'draft';
}

export interface UpdateScriptTemplateRequest extends Partial<CreateScriptTemplateRequest> {
  id: number;
}

export interface CreateScriptRatingRequest {
  script_id: number;
  rating: number;
  comment?: string;
}

export interface CreateScriptGenerationRequest {
  script_id: number;
  generated_content: string;
  parameters?: Record<string, any>;
}

// 查詢參數
export interface ScriptListQuery {
  page?: number;
  limit?: number;
  category_id?: number;
  status?: 'active' | 'inactive' | 'draft';
  search?: string;
  sort_by?: 'created_at' | 'updated_at' | 'rating' | 'usage_count';
  sort_order?: 'asc' | 'desc';
}

// 統計數據
export interface ScriptStats {
  total_scripts: number;
  total_categories: number;
  total_ratings: number;
  total_usage: number;
  average_rating: number;
  popular_scripts: ScriptTemplate[];
  recent_activity: {
    date: string;
    views: number;
    copies: number;
    generations: number;
  }[];
}

// 用戶類型 (簡化版)
export interface User {
  id: string;
  username?: string;
  email?: string;
  created_at: string;
}

// JWT Payload
export interface JwtPayload {
  user_id: string;
  username?: string;
  exp: number;
  iat: number;
}

// 圖片存儲相關類型 (優化版 - 移除未使用欄位)
export interface ImageRecord {
  id: number;
  filename: string;
  original_filename: string;
  r2_key: string;
  file_size: number;
  mime_type: string;
  upload_time: string;
  user_id: string;
  description?: string;
  tags?: string[]; // 可選，減少冗餘數據
  source_media?: string; // 可選，減少冗餘數據
  category: 1 | 2 | 3; // 1: 首頁圖, 2: 風格圖, 3: 其他
}

// 圖片上傳請求
export interface UploadImageRequest {
  file: File;
  description?: string;
  tags?: string[];
  source_media?: string;
}

// 圖片列表查詢參數 (優化版)
export interface ImageListQuery {
  page?: number;
  limit?: number;
  user_id?: string;
  tags?: string[]; // 標籤篩選
  source_media?: string; // 來源媒體篩選
  category?: 1 | 2 | 3; // 分類篩選 (主要查詢條件)
  sort_by?: 'upload_time' | 'filename' | 'file_size' | 'original_filename' | 'sort_order';
  sort_order?: 'asc' | 'desc';
}

// 圖片統計數據
export interface ImageStats {
  total_images: number;
  total_size: number;
  images_by_type: {
    mime_type: string;
    count: number;
    total_size: number;
  }[];
  recent_uploads: ImageRecord[];
}
