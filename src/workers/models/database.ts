import {
  Env,
  ScriptCategory,
  ScriptTemplate,
  ScriptRating,
  ScriptUsage,
  ScriptScreenshot,
  ScriptGeneration,
  ScriptListQuery,
  CreateScriptTemplateRequest,
  UpdateScriptTemplateRequest,
  CreateScriptRatingRequest,
  CreateScriptGenerationRequest,
} from '../../types';

export class DatabaseService {
  private db: D1Database;

  constructor(env: Env) {
    this.db = env.DB;
  }

  // 腳本分類相關操作
  async getCategories(): Promise<ScriptCategory[]> {
    const { results } = await this.db.prepare(`
      SELECT * FROM script_categories 
      ORDER BY name ASC
    `).all();
    
    return results as ScriptCategory[];
  }

  async getCategoryById(id: number): Promise<ScriptCategory | null> {
    const result = await this.db.prepare(`
      SELECT * FROM script_categories WHERE id = ?
    `).bind(id).first();
    
    return result as ScriptCategory | null;
  }

  // 腳本模板相關操作
  async getScripts(query: ScriptListQuery = {}): Promise<{
    scripts: ScriptTemplate[];
    total: number;
  }> {
    const {
      page = 1,
      limit = 20,
      category_id,
      status = 'active',
      search,
      sort_by = 'created_at',
      sort_order = 'desc'
    } = query;

    const offset = (page - 1) * limit;
    
    let whereClause = 'WHERE st.status = ?';
    const params: any[] = [status];
    
    if (category_id) {
      whereClause += ' AND st.category_id = ?';
      params.push(category_id);
    }
    
    if (search) {
      whereClause += ' AND (st.name LIKE ? OR st.description LIKE ? OR st.prompt LIKE ?)';
      const searchTerm = `%${search}%`;
      params.push(searchTerm, searchTerm, searchTerm);
    }

    // 獲取腳本列表
    const scriptsQuery = `
      SELECT 
        st.*,
        sc.name as category_name,
        sc.emoji as category_emoji,
        COALESCE(AVG(sr.rating), 0) as average_rating,
        COUNT(sr.id) as rating_count,
        COALESCE(usage_stats.usage_count, 0) as usage_count
      FROM script_templates st
      LEFT JOIN script_categories sc ON st.category_id = sc.id
      LEFT JOIN script_ratings sr ON st.id = sr.script_id
      LEFT JOIN (
        SELECT script_id, COUNT(*) as usage_count 
        FROM script_usage 
        GROUP BY script_id
      ) usage_stats ON st.id = usage_stats.script_id
      ${whereClause}
      GROUP BY st.id
      ORDER BY ${sort_by} ${sort_order.toUpperCase()}
      LIMIT ? OFFSET ?
    `;
    
    params.push(limit, offset);
    
    const { results: scriptsResults } = await this.db.prepare(scriptsQuery)
      .bind(...params)
      .all();

    // 獲取總數
    const countQuery = `
      SELECT COUNT(*) as total 
      FROM script_templates st 
      ${whereClause}
    `;
    
    const countParams = params.slice(0, -2); // 移除 limit 和 offset
    const countResult = await this.db.prepare(countQuery)
      .bind(...countParams)
      .first();

    const scripts = scriptsResults.map((script: any) => ({
      ...script,
      tags: script.tags ? JSON.parse(script.tags) : [],
      average_rating: parseFloat(script.average_rating) || 0,
      rating_count: parseInt(script.rating_count) || 0,
      usage_count: parseInt(script.usage_count) || 0,
    })) as ScriptTemplate[];

    return {
      scripts,
      total: (countResult as any)?.total || 0,
    };
  }

  async getScriptById(id: number): Promise<ScriptTemplate | null> {
    const result = await this.db.prepare(`
      SELECT 
        st.*,
        sc.name as category_name,
        sc.emoji as category_emoji,
        COALESCE(AVG(sr.rating), 0) as average_rating,
        COUNT(sr.id) as rating_count
      FROM script_templates st
      LEFT JOIN script_categories sc ON st.category_id = sc.id
      LEFT JOIN script_ratings sr ON st.id = sr.script_id
      WHERE st.id = ?
      GROUP BY st.id
    `).bind(id).first();

    if (!result) return null;

    const script = result as any;
    return {
      ...script,
      tags: script.tags ? JSON.parse(script.tags) : [],
      average_rating: parseFloat(script.average_rating) || 0,
      rating_count: parseInt(script.rating_count) || 0,
    } as ScriptTemplate;
  }

  async createScript(data: CreateScriptTemplateRequest): Promise<ScriptTemplate> {
    const tagsJson = JSON.stringify(data.tags || []);
    
    const result = await this.db.prepare(`
      INSERT INTO script_templates (
        category_id, name, version, description, prompt, translation, tags, status
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)
      RETURNING *
    `).bind(
      data.category_id,
      data.name,
      data.version || null,
      data.description,
      data.prompt,
      data.translation || null,
      tagsJson,
      data.status || 'active'
    ).first();

    const script = result as any;
    return {
      ...script,
      tags: JSON.parse(script.tags || '[]'),
    } as ScriptTemplate;
  }

  async updateScript(id: number, data: Partial<UpdateScriptTemplateRequest>): Promise<ScriptTemplate | null> {
    const updates: string[] = [];
    const params: any[] = [];

    Object.entries(data).forEach(([key, value]) => {
      if (value !== undefined && key !== 'id') {
        if (key === 'tags') {
          updates.push(`${key} = ?`);
          params.push(JSON.stringify(value));
        } else {
          updates.push(`${key} = ?`);
          params.push(value);
        }
      }
    });

    if (updates.length === 0) {
      return this.getScriptById(id);
    }

    updates.push('updated_at = CURRENT_TIMESTAMP');
    params.push(id);

    await this.db.prepare(`
      UPDATE script_templates 
      SET ${updates.join(', ')}
      WHERE id = ?
    `).bind(...params).run();

    return this.getScriptById(id);
  }

  async deleteScript(id: number): Promise<boolean> {
    const result = await this.db.prepare(`
      DELETE FROM script_templates WHERE id = ?
    `).bind(id).run();

    return (result.changes || 0) > 0;
  }

  // 評分相關操作
  async createRating(data: CreateScriptRatingRequest, userId: string): Promise<ScriptRating> {
    const result = await this.db.prepare(`
      INSERT OR REPLACE INTO script_ratings (script_id, user_id, rating, comment)
      VALUES (?, ?, ?, ?)
      RETURNING *
    `).bind(data.script_id, userId, data.rating, data.comment || null).first();

    return result as ScriptRating;
  }

  async getScriptRatings(scriptId: number, page = 1, limit = 10): Promise<{
    ratings: ScriptRating[];
    total: number;
  }> {
    const offset = (page - 1) * limit;

    const { results } = await this.db.prepare(`
      SELECT * FROM script_ratings 
      WHERE script_id = ? 
      ORDER BY created_at DESC
      LIMIT ? OFFSET ?
    `).bind(scriptId, limit, offset).all();

    const countResult = await this.db.prepare(`
      SELECT COUNT(*) as total FROM script_ratings WHERE script_id = ?
    `).bind(scriptId).first();

    return {
      ratings: results as ScriptRating[],
      total: (countResult as any)?.total || 0,
    };
  }

  // 使用統計相關操作
  async recordUsage(scriptId: number, userId: string, action: string, metadata?: any): Promise<void> {
    await this.db.prepare(`
      INSERT INTO script_usage (script_id, user_id, action, metadata)
      VALUES (?, ?, ?, ?)
    `).bind(
      scriptId,
      userId,
      action,
      metadata ? JSON.stringify(metadata) : null
    ).run();
  }

  // 截圖相關操作
  async createScreenshot(data: {
    script_id: number;
    filename: string;
    r2_key: string;
    size: number;
    mime_type: string;
    uploaded_by: string;
  }): Promise<ScriptScreenshot> {
    const result = await this.db.prepare(`
      INSERT INTO script_screenshots (script_id, filename, r2_key, size, mime_type, uploaded_by)
      VALUES (?, ?, ?, ?, ?, ?)
      RETURNING *
    `).bind(
      data.script_id,
      data.filename,
      data.r2_key,
      data.size,
      data.mime_type,
      data.uploaded_by
    ).first();

    return result as ScriptScreenshot;
  }

  async getScriptScreenshots(scriptId: number): Promise<ScriptScreenshot[]> {
    const { results } = await this.db.prepare(`
      SELECT * FROM script_screenshots 
      WHERE script_id = ? 
      ORDER BY created_at DESC
    `).bind(scriptId).all();

    return results as ScriptScreenshot[];
  }

  async deleteScreenshot(id: number): Promise<ScriptScreenshot | null> {
    const screenshot = await this.db.prepare(`
      SELECT * FROM script_screenshots WHERE id = ?
    `).bind(id).first() as ScriptScreenshot | null;

    if (screenshot) {
      await this.db.prepare(`
        DELETE FROM script_screenshots WHERE id = ?
      `).bind(id).run();
    }

    return screenshot;
  }

  // 生成記錄相關操作
  async createGeneration(data: CreateScriptGenerationRequest, userId: string): Promise<ScriptGeneration> {
    const result = await this.db.prepare(`
      INSERT INTO script_generations (script_id, user_id, generated_content, parameters)
      VALUES (?, ?, ?, ?)
      RETURNING *
    `).bind(
      data.script_id,
      userId,
      data.generated_content,
      data.parameters ? JSON.stringify(data.parameters) : null
    ).first();

    return result as ScriptGeneration;
  }

  async getScriptGenerations(scriptId: number, page = 1, limit = 10): Promise<{
    generations: ScriptGeneration[];
    total: number;
  }> {
    const offset = (page - 1) * limit;

    const { results } = await this.db.prepare(`
      SELECT * FROM script_generations 
      WHERE script_id = ? 
      ORDER BY created_at DESC
      LIMIT ? OFFSET ?
    `).bind(scriptId, limit, offset).all();

    const countResult = await this.db.prepare(`
      SELECT COUNT(*) as total FROM script_generations WHERE script_id = ?
    `).bind(scriptId).first();

    return {
      generations: results as ScriptGeneration[],
      total: (countResult as any)?.total || 0,
    };
  }
}
