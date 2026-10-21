import { UserRole } from '../services/permission-service';

export interface HelpArticle {
  id: string
  title: string
  summary: string
  keywords: string[]
  minRole?: Exclude<UserRole, 'funcionario'>
}

export interface HelpCategory {
  id: string
  title: string
  description: string
  icon: string
  articles: HelpArticle[]
}
