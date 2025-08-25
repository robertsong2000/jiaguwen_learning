import axios, { AxiosInstance, AxiosResponse } from 'axios';
import { 
  Character, 
  ApiResponse, 
  PaginatedResponse, 
  FilterConfig,
  UserProfile,
  LearningProgress,
  Achievement,
  Course,
  Lesson,
  Quiz,
  QuizScore
} from '../store/types';

// API Client configuration
const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

class ApiClient {
  private client: AxiosInstance;

  constructor() {
    this.client = axios.create({
      baseURL: API_BASE_URL,
      timeout: 10000,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    // Request interceptor to add auth token
    this.client.interceptors.request.use(
      (config) => {
        const token = localStorage.getItem('token');
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      },
      (error) => Promise.reject(error)
    );

    // Response interceptor for error handling
    this.client.interceptors.response.use(
      (response) => response,
      async (error) => {
        if (error.response?.status === 401) {
          // Try to refresh token
          const refreshToken = localStorage.getItem('refreshToken');
          if (refreshToken) {
            try {
              const response = await this.client.post('/auth/refresh', {
                refreshToken,
              });
              const { token } = response.data;
              localStorage.setItem('token', token);
              
              // Retry original request
              error.config.headers.Authorization = `Bearer ${token}`;
              return this.client.request(error.config);
            } catch (refreshError) {
              // Refresh failed, logout user
              localStorage.removeItem('token');
              localStorage.removeItem('refreshToken');
              window.location.href = '/login';
            }
          } else {
            // No refresh token, redirect to login
            window.location.href = '/login';
          }
        }
        return Promise.reject(error);
      }
    );
  }

  async get<T>(url: string, params?: any): Promise<AxiosResponse<ApiResponse<T>>> {
    return this.client.get(url, { params });
  }

  async post<T>(url: string, data?: any): Promise<AxiosResponse<ApiResponse<T>>> {
    return this.client.post(url, data);
  }

  async put<T>(url: string, data?: any): Promise<AxiosResponse<ApiResponse<T>>> {
    return this.client.put(url, data);
  }

  async delete<T>(url: string): Promise<AxiosResponse<ApiResponse<T>>> {
    return this.client.delete(url);
  }
}

const apiClient = new ApiClient();

// Character API
export const characterAPI = {
  getCharacters: (params?: { page?: number; limit?: number; filters?: FilterConfig }) =>
    apiClient.get<PaginatedResponse<Character>>('/characters', params),
  
  getCharacterById: (id: string) =>
    apiClient.get<Character>(`/characters/${id}`),
  
  searchCharacters: (query: string) =>
    apiClient.get<Character[]>('/characters/search', { q: query }),
  
  favoriteCharacter: (characterId: string) =>
    apiClient.post('/characters/favorite', { characterId }),
  
  unfavoriteCharacter: (characterId: string) =>
    apiClient.delete(`/characters/favorite/${characterId}`),
};

// Auth API
export const authAPI = {
  login: (credentials: { email: string; password: string }) =>
    apiClient.post<{ user: UserProfile; progress: LearningProgress; token: string; refreshToken: string }>('/auth/login', credentials),
  
  register: (userData: { username: string; email: string; password: string; displayName: string }) =>
    apiClient.post<{ user: UserProfile; progress: LearningProgress; token: string; refreshToken: string }>('/auth/register', userData),
  
  refresh: (refreshToken: string) =>
    apiClient.post<{ token: string }>('/auth/refresh', { refreshToken }),
  
  logout: () =>
    apiClient.post('/auth/logout'),
};

// User API
export const userAPI = {
  getProfile: () =>
    apiClient.get<{ profile: UserProfile; progress: LearningProgress }>('/auth/profile'),
  
  updateProfile: (profileData: Partial<UserProfile>) =>
    apiClient.put<UserProfile>('/users/profile', profileData),
  
  updateProgress: (progressData: Partial<LearningProgress>) =>
    apiClient.post<LearningProgress>('/progress', progressData),
  
  getAchievements: () =>
    apiClient.get<Achievement[]>('/users/achievements'),
};

// Learning API
export const learningAPI = {
  getCourses: () =>
    apiClient.get<Course[]>('/courses'),
  
  getCourseById: (id: string) =>
    apiClient.get<Course>(`/courses/${id}`),
  
  getLessonById: (id: string) =>
    apiClient.get<Lesson>(`/lessons/${id}`),
  
  markLessonComplete: (lessonId: string) =>
    apiClient.post('/progress/lesson', { lessonId }),
  
  getBookmarks: () =>
    apiClient.get<string[]>('/users/bookmarks'),
  
  addBookmark: (characterId: string) =>
    apiClient.post('/users/bookmarks', { characterId }),
  
  removeBookmark: (characterId: string) =>
    apiClient.delete(`/users/bookmarks/${characterId}`),
};

// Practice API
export const practiceAPI = {
  getQuiz: (type: 'recognition' | 'writing' | 'meaning', difficulty?: 'easy' | 'medium' | 'hard') =>
    apiClient.get<Quiz>(`/practice/${type}`, { difficulty }),
  
  submitQuiz: (quizId: string, answers: { questionId: string; answer: string }[]) =>
    apiClient.post<QuizScore>('/practice/submit', { quizId, answers }),
  
  getStatistics: () =>
    apiClient.get<any>('/practice/stats'),
  
  getPracticeHistory: () =>
    apiClient.get<QuizScore[]>('/practice/history'),
};

export default apiClient;