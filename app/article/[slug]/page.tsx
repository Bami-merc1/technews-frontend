import { notFound } from 'next/navigation'
import { getArticleBySlug, getRelatedArticles } from '@/lib/supabase'
import { Article } from '@/lib/types'
import ArticleClient from './ArticleClient'

export default async function ArticlePage({
  params,
}: {
  params: { slug: string }
}) {
  let article: Article | null = null
  let relatedArticles: Article[] = []

  try {
    article = await getArticleBySlug(params.slug)
    if (article) {
      relatedArticles = await getRelatedArticles(params.slug, article.category, 3)
    }
  } catch (error) {
    console.error('Failed to fetch article:', error)
  }

  if (!article) notFound()

  return <ArticleClient article={article!} relatedArticles={relatedArticles} />
}