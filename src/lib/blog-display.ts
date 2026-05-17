import type { Lang } from './routes';

const formatters: Record<Lang, Intl.DateTimeFormat> = {
  'pt-br': new Intl.DateTimeFormat('pt-BR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }),
  en: new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }),
};

export function formatBlogDate(value: Date, lang: Lang): string {
  return formatters[lang].format(value);
}
