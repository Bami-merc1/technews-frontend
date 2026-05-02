export type Severity = 'critical' | 'high' | 'medium' | 'low' | null

export type Category =
  | 'AI/ML'
  | 'Cybersecurity'
  | 'Software Development'
  | 'Blockchain'
  | 'FinTech & Business'
  | 'Hardware'

export type Audience = 'general' | 'technical' | 'student'

export interface SafetyTip {
  text: string
  isCode?: boolean
}

export interface SafetyGuideStep {
  title: string
  body: string
  command?: string
}

export interface SafetyTips {
  general: { bullets: SafetyTip[]; guide: SafetyGuideStep[] }
  technical: { bullets: SafetyTip[]; guide: SafetyGuideStep[] }
  student: {
    explainer: string
    bullets: SafetyTip[]
    guide: SafetyGuideStep[]
  }
}

export interface Article {
  id: string
  slug: string
  title: string
  summary: string
  body: string
  category: Category
  severity: Severity
  cve_id: string | null
  source_url: string
  source_name: string
  published_at: string
  read_time_minutes: number
  full_story?: string
  raw_content?: string
  has_full_content?: boolean
  safety_tips: SafetyTips | null
  related_articles?: Pick
    Article,
    'id' | 'slug' | 'title' | 'category' | 'published_at'
  >[]
}

export interface ThreatMetrics {
  active_today: number
  critical_this_week: number
  guides_published: number
  resolved_percentage: number
}