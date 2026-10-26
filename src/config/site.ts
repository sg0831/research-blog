export const siteConfig = {
  title: {
    ko: '승균의 연구노트',
    en: "Seungkyun's Research Notes",
  },
  description: {
    ko: '논문을 읽고, 질문을 떠올리고, 배운 것을 다음 연구로 연결하며 성장합니다.',
    en: 'Notes that connect papers, questions, and lessons to the next piece of research.',
  },
  author: 'Seungkyun Jeong',
  timeZone: 'Asia/Seoul',
  postsPerPage: 10,
} as const;

export type Language = 'ko' | 'en';
export const defaultLanguage: Language = 'en';
export const languages: Language[] = [defaultLanguage, 'ko'];
