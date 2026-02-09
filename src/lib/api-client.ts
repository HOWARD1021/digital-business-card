import {
  ApiResponse,
  ImageRecord,
  ImageListQuery,
  ImageStats,
} from '../types';

class ApiClient {
  private baseUrl: string;
  private userId: string;

  constructor(baseUrl = '/api', userId = 'anonymous') {
    this.baseUrl = baseUrl;
    this.userId = userId;
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<ApiResponse<T>> {
    const url = `${this.baseUrl}${endpoint}`;

    const response = await fetch(url, {
      headers: {
        'Content-Type': 'application/json',
        'x-user-id': this.userId,
        ...options.headers,
      },
      ...options,
    });

    if (!response.ok) {
      throw new Error(`API request failed: ${response.status} ${response.statusText}`);
    }

    return response.json();
  }

  // 設置用戶 ID
  setUserId(userId: string): void {
    this.userId = userId;
  }

  // 設置 API 基礎 URL
  setBaseUrl(baseUrl: string): void {
    this.baseUrl = baseUrl;
  }

  // ========== 圖片相關方法 ==========

  /**
   * 上傳圖片
   */
  async uploadImage(
    file: File,
    description?: string,
    tags?: string[],
    sourceMedia?: string,
    category?: 1 | 2 | 3
  ): Promise<ImageRecord> {
    const formData = new FormData();
    formData.append('file', file);
    
    if (description) {
      formData.append('description', description);
    }
    
    if (tags && tags.length > 0) {
      formData.append('tags', JSON.stringify(tags));
    }
    
    if (sourceMedia) {
      formData.append('source_media', sourceMedia);
    }
    
    if (category) {
      formData.append('category', category.toString());
    }

    const response = await fetch(`${this.baseUrl}/uploads/image`, {
      method: 'POST',
      headers: {
        'x-user-id': this.userId,
      },
      body: formData,
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || `Upload failed: ${response.status} ${response.statusText}`);
    }

    const result = await response.json();
    if (!result.success) {
      throw new Error(result.message || 'Upload failed');
    }

    return result.data;
  }

  /**
   * 獲取圖片列表
   */
  async getImages(query: ImageListQuery = {}): Promise<{
    images: ImageRecord[];
    total: number;
    pagination?: {
      page: number;
      limit: number;
      total: number;
      totalPages: number;
    };
  }> {
    const searchParams = new URLSearchParams();
    
    if (query.page) searchParams.set('page', query.page.toString());
    if (query.limit) searchParams.set('limit', query.limit.toString());
    if (query.user_id) searchParams.set('user_id', query.user_id);
    if (query.source_media) searchParams.set('source_media', query.source_media);
    if (query.sort_by) searchParams.set('sort_by', query.sort_by);
    if (query.sort_order) searchParams.set('sort_order', query.sort_order);
    if (query.category) searchParams.set('category', query.category.toString());
    if (query.tags && query.tags.length > 0) {
      searchParams.set('tags', query.tags.join(','));
    }

    const response = await this.request<ImageRecord[]>(`/uploads/images?${searchParams.toString()}`);
    
    return {
      images: response.data || [],
      total: response.pagination?.total || 0,
      pagination: response.pagination,
    };
  }

  /**
   * 獲取單張圖片信息
   */
  async getImage(id: number): Promise<ImageRecord> {
    const response = await this.request<ImageRecord>(`/uploads/image/${id}`);
    if (!response.data) {
      throw new Error('Image not found');
    }
    return response.data;
  }

  /**
   * 更新圖片信息
   */
  async updateImage(
    id: number,
    updates: {
      description?: string;
      tags?: string[];
      source_media?: string;
      category?: 1 | 2 | 3;
    }
  ): Promise<ImageRecord> {
    const response = await this.request<ImageRecord>(`/uploads/image/${id}`, {
      method: 'PUT',
      body: JSON.stringify(updates),
    });
    
    if (!response.data) {
      throw new Error('Failed to update image');
    }
    
    return response.data;
  }

  /**
   * 刪除圖片
   */
  async deleteImage(id: number): Promise<void> {
    await this.request(`/uploads/image/${id}`, {
      method: 'DELETE',
    });
  }

  /**
   * 批量刪除圖片
   */
  async deleteImages(ids: number[]): Promise<{ deleted: number; failed: number }> {
    const response = await this.request<{ deleted: number; failed: number }>('/uploads/images', {
      method: 'DELETE',
      body: JSON.stringify({ ids }),
    });
    
    return response.data || { deleted: 0, failed: ids.length };
  }

  /**
   * 獲取圖片統計數據
   */
  async getImageStats(userId?: string): Promise<ImageStats> {
    const searchParams = new URLSearchParams();
    if (userId) searchParams.set('user_id', userId);
    
    const response = await this.request<ImageStats>(`/uploads/stats?${searchParams.toString()}`);
    return response.data || {
      total_images: 0,
      total_size: 0,
      images_by_type: [],
      recent_uploads: [],
    };
  }

  /**
   * 獲取圖片下載 URL
   */
  getImageDownloadUrl(id: number): string {
    return `${this.baseUrl}/uploads/image/${id}/download`;
  }

  /**
   * 下載圖片 (返回 Blob)
   */
  async downloadImage(id: number): Promise<Blob> {
    const response = await fetch(this.getImageDownloadUrl(id), {
      headers: {
        'x-user-id': this.userId,
      },
    });

    if (!response.ok) {
      throw new Error(`Download failed: ${response.status} ${response.statusText}`);
    }

    return response.blob();
  }

  /**
   * 輔助方法：格式化文件大小
   */
  static formatFileSize(bytes: number): string {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  }

  /**
   * 輔助方法：驗證圖片文件類型
   */
  static isValidImageFile(file: File): boolean {
    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
    return allowedTypes.includes(file.type.toLowerCase());
  }

  /**
   * 輔助方法：驗證文件大小
   */
  static isValidFileSize(file: File, maxSizeMB = 10): boolean {
    const maxSizeBytes = maxSizeMB * 1024 * 1024;
    return file.size <= maxSizeBytes;
  }

  // ========== Prompt Gallery 相關方法 ==========

  /**
   * 獲取 Prompts 列表
   */
  async getPrompts(query: {
    page?: number;
    limit?: number;
    category?: string;
    sort?: 'popular' | 'recent' | 'most_used';
    user_id?: string;
  } = {}): Promise<{
    prompts: any[];
    pagination?: {
      page: number;
      limit: number;
      total: number;
      totalPages: number;
    };
  }> {
    const searchParams = new URLSearchParams();

    if (query.page) searchParams.set('page', query.page.toString());
    if (query.limit) searchParams.set('limit', query.limit.toString());
    if (query.category) searchParams.set('category', query.category);
    if (query.sort) searchParams.set('sort', query.sort);
    if (query.user_id) searchParams.set('user_id', query.user_id);

    const response = await this.request<any[]>(`/prompts?${searchParams.toString()}`);

    return {
      prompts: response.data || [],
      pagination: response.pagination,
    };
  }

  /**
   * 獲取單個 Prompt
   */
  async getPrompt(id: number): Promise<any> {
    const response = await this.request<any>(`/prompts/${id}`);
    if (!response.data) {
      throw new Error('Prompt not found');
    }
    return response.data;
  }

  /**
   * 創建新 Prompt
   */
  async createPrompt(data: {
    prompt: string;
    description?: string;
    category?: string;
    image_id?: number;
  }): Promise<any> {
    const response = await this.request<any>('/prompts', {
      method: 'POST',
      body: JSON.stringify(data),
    });

    if (!response.data) {
      throw new Error('Failed to create prompt');
    }

    return response.data;
  }

  /**
   * 收藏/取消收藏 Prompt
   */
  async togglePromptFavorite(id: number): Promise<{ is_favorited: boolean }> {
    const response = await this.request<{ is_favorited: boolean }>(`/prompts/${id}/favorite`, {
      method: 'POST',
    });

    if (!response.data) {
      throw new Error('Failed to toggle favorite');
    }

    return response.data;
  }

  /**
   * 記錄 Prompt 使用
   */
  async recordPromptUse(id: number): Promise<void> {
    await this.request(`/prompts/${id}/use`, {
      method: 'POST',
    });
  }

  /**
   * 刪除 Prompt
   */
  async deletePrompt(id: number): Promise<void> {
    await this.request(`/prompts/${id}`, {
      method: 'DELETE',
    });
  }
}

// 創建默認實例，指向 Cloudflare Workers API
export const apiClient = new ApiClient('http://localhost:8787/api');

// 導出類以便創建自定義實例
export { ApiClient };
