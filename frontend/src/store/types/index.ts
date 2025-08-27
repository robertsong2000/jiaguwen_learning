// Character types
export interface Character {
  _id: string;
  oracleForm: string;
  modernForm: string;
  pronunciation: string;
  meaning: string;
  etymology: string;
  imageUrl: string;
  hasImage?: boolean;
  imageAlt?: string;
  strokeOrder: string[];
  difficulty: number;
  category: string;
  relatedCharacters: string[];
  historicalContext: string;
  tags?: string[];
  viewCount?: number;
  favoriteCount?: number;
  isFavorited?: boolean;
  isBookmarked?: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface FilterConfig {
  category?: string;
  difficulty?: number[];
  searchQuery?: string;
}

// User types
export interface UserProfile {
  _id: string;
  username: string;
  email: string;
  profile: {
    displayName: string;
    avatar: string;
    bio: string;
    studyGoal: string;
  };
}

export interface LearningProgress {
  level: number;
  experience: number;
  studiedCharacters: string[];
  completedLessons: string[];
  currentStreak: number;
  longestStreak: number;
}

export interface Achievement {
  _id: string;
  title: string;
  description: string;
  iconUrl: string;
  unlockedAt?: string;
}

// Learning types
export interface Lesson {
  _id: string;
  title: string;
  description: string;
  courseId: string;
  order: number;
  content: {
    characters: string[];
    explanation: string;
    examples: string[];
    culturalNote: string;
  };
  exercises: Exercise[];
  estimatedTime: number;
  prerequisites: string[];
  difficulty: number;
}

export interface Exercise {
  type: 'recognition' | 'writing' | 'meaning';
  question: string;
  options: string[];
  correctAnswer: string;
}

export interface Course {
  _id: string;
  title: string;
  description: string;
  lessons: string[];
  difficulty: number;
  estimatedHours: number;
}

// Practice types
export interface Quiz {
  _id: string;
  type: 'recognition' | 'writing' | 'meaning';
  questions: QuizQuestion[];
  timeLimit?: number;
}

export interface QuizQuestion {
  id: string;
  character: Character;
  type: 'recognition' | 'writing' | 'meaning';
  question: string;
  options: string[];
  correctAnswer: string;
}

export interface QuizScore {
  quizId: string;
  score: number;
  totalQuestions: number;
  completedAt: string;
  timeSpent: number;
}

export interface PracticeStats {
  totalPractices: number;
  averageScore: number;
  strongCategories: string[];
  weakCategories: string[];
  practiceHistory: QuizScore[];
}

// API Response types
export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
  error?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

// 匹配后端实际返回的字符列表结构
export interface CharacterApiResponse {
  characters: Character[];
  pagination: {
    currentPage: number;
    totalPages: number;
    totalCount: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
}

// State types
export interface CharacterState {
  list: Character[];
  selected: Character | null;
  loading: boolean;
  error: string | null;
  filters: FilterConfig;
  pagination: {
    page: number;
    limit: number;
    total: number;
  };
}

export interface UserState {
  profile: UserProfile | null;
  progress: LearningProgress | null;
  achievements: Achievement[];
  isAuthenticated: boolean;
  loading: boolean;
  error: string | null;
}

export interface LearningState {
  currentLesson: Lesson | null;
  completedLessons: string[];
  bookmarks: string[];
  courses: Course[];
  loading: boolean;
  error: string | null;
}

export interface PracticeState {
  currentQuiz: Quiz | null;
  scores: QuizScore[];
  statistics: PracticeStats | null;
  loading: boolean;
  error: string | null;
}

export interface RootState {
  characters: CharacterState;
  user: UserState;
  learning: LearningState;
  practice: PracticeState;
}