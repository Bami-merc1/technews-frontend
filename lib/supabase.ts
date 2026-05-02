import { createClient } from '@supabase/supabase-js'
import type { Article, Category, ThreatMetrics } from './types'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

export async function getLatestArticles(limit = 20): Promise<Article[]> {
  const { data, error } = await supabase
    .from('articles')
    .select('*')
    .order('published_at', { ascending: false })
    .limit(limit)
  if (error) throw error
  return data ?? []
}

export async function getArticleBySlug(slug: string): Promise<Article | null> {
  const { data, error } = await supabase
    .from('articles')
    .select('*')
    .eq('slug', slug)
    .single()
  if (error) return null
  return data
}

export async function getArticlesByCategory(
  category: Category,
  limit = 20,
  offset = 0
): Promise<Article[]> {
  const { data, error } = await supabase
    .from('articles')
    .select('*')
    .eq('category', category)
    .order('published_at', { ascending: false })
    .range(offset, offset + limit - 1)
  if (error) throw error
  return data ?? []
}

export async function searchArticles(query: string): Promise<Article[]> {
  const { data, error } = await supabase
    .from('articles')
    .select('*')
    .textSearch('title', query, { type: 'websearch' })
    .order('published_at', { ascending: false })
    .limit(30)
  if (error) throw error
  return data ?? []
}

export async function getCriticalThreats(): Promise<Article[]> {
  const { data, error } = await supabase
    .from('articles')
    .select('*')
    .eq('category', 'Cybersecurity')
    .in('severity', ['critical', 'high'])
    .order('published_at', { ascending: false })
    .limit(10)
  if (error) throw error
  return data ?? []
}

export async function getRelatedArticles(
  currentSlug: string,
  category: Category,
  limit = 4
): Promise<Article[]> {
  const { data, error } = await supabase
    .from('articles')
    .select('id, slug, title, category, published_at')
    .eq('category', category)
    .neq('slug', currentSlug)
    .order('published_at', { ascending: false })
    .limit(limit)
  if (error) throw error
  return data ?? []
}

export async function getThreatMetrics(): Promise<ThreatMetrics> {
  const { data, error } = await supabase
    .from('threat_metrics')
    .select('*')
    .single()
  if (error) {
    return {
      active_today: 0,
      critical_this_week: 0,
      guides_published: 0,
      resolved_percentage: 0,
    }
  }
  return data
}