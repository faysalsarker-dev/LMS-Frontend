import { useState, useEffect, useCallback } from 'react';
import type {
  Practice,
  PracticeFormData,
  PracticeFilters,
  PracticesResponse,
  PracticeStats,
  PracticeItem,
} from '@/components/modules/practice/practice.types';

// Mock data for practices
const mockPractices: Practice[] = [
  {
    _id: '1',
    title: 'Basic Pronunciation Drills',
    slug: 'basic-pronunciation-drills',
    description: 'Master the fundamentals of English pronunciation with these essential drills.',
    type: 'pronunciation',
    category: { _id: 'cat1', name: 'English Basics' },
    items: [
      { _id: 'item1', content: 'Hello', pronunciation: 'həˈloʊ', order: 1 },
      { _id: 'item2', content: 'World', pronunciation: 'wɜːrld', order: 2 },
    ],
    difficulty: 'Beginner',
    estimatedTime: '15 mins',
    tags: ['pronunciation', 'basics', 'english'],
    isActive: true,
    createdBy: { _id: 'user1', name: 'John Doe' },
    totalItems: 2,
    usageCount: 150,
    createdAt: '2024-01-15T10:00:00Z',
    updatedAt: '2024-01-20T15:30:00Z',
  },
  {
    _id: '2',
    title: 'Advanced Vocabulary Builder',
    slug: 'advanced-vocabulary-builder',
    description: 'Expand your vocabulary with advanced English words and phrases.',
    type: 'vocabulary',
    category: { _id: 'cat2', name: 'Advanced English' },
    items: [
      { _id: 'item3', content: 'Ephemeral', description: 'Lasting for a very short time', order: 1 },
      { _id: 'item4', content: 'Ubiquitous', description: 'Present everywhere', order: 2 },
      { _id: 'item5', content: 'Serendipity', description: 'Happy accident', order: 3 },
    ],
    difficulty: 'Advanced',
    estimatedTime: '30 mins',
    tags: ['vocabulary', 'advanced', 'words'],
    isActive: true,
    createdBy: { _id: 'user1', name: 'John Doe' },
    totalItems: 3,
    usageCount: 89,
    createdAt: '2024-02-01T09:00:00Z',
    updatedAt: '2024-02-10T11:00:00Z',
  },
  {
    _id: '3',
    title: 'Grammar Essentials Quiz',
    slug: 'grammar-essentials-quiz',
    description: 'Test your understanding of essential grammar rules.',
    type: 'quiz',
    category: { _id: 'cat3', name: 'Grammar' },
    items: [
      { _id: 'item6', content: 'Choose the correct form: He ___ to school.', description: 'goes/go', order: 1 },
      { _id: 'item7', content: 'Identify the verb: The cat sleeps.', description: 'sleeps', order: 2 },
    ],
    difficulty: 'Intermediate',
    estimatedTime: '20 mins',
    tags: ['grammar', 'quiz', 'test'],
    isActive: false,
    createdBy: { _id: 'user2', name: 'Jane Smith' },
    totalItems: 2,
    usageCount: 0,
    createdAt: '2024-02-15T14:00:00Z',
    updatedAt: '2024-02-15T14:00:00Z',
  },
  {
    _id: '4',
    title: 'Daily Conversation Practice',
    slug: 'daily-conversation-practice',
    description: 'Practice everyday conversations with common phrases.',
    type: 'exercise',
    category: { _id: 'cat1', name: 'English Basics' },
    items: [
      { _id: 'item8', content: 'How are you doing today?', pronunciation: 'haʊ ɑːr juː duːɪŋ təˈdeɪ', order: 1 },
      { _id: 'item9', content: 'Nice to meet you!', pronunciation: 'naɪs tuː miːt juː', order: 2 },
    ],
    difficulty: 'Beginner',
    estimatedTime: '10 mins',
    tags: ['conversation', 'daily', 'practice'],
    isActive: true,
    createdBy: { _id: 'user1', name: 'John Doe' },
    totalItems: 2,
    usageCount: 234,
    createdAt: '2024-01-01T08:00:00Z',
    updatedAt: '2024-02-20T10:00:00Z',
  },
  {
    _id: '5',
    title: 'Tense Mastery Exercises',
    slug: 'tense-mastery-exercises',
    description: 'Master all English tenses with comprehensive exercises.',
    type: 'grammar',
    category: { _id: 'cat3', name: 'Grammar' },
    items: [
      { _id: 'item10', content: 'Present Simple', description: 'I work every day', order: 1 },
      { _id: 'item11', content: 'Present Continuous', description: 'I am working now', order: 2 },
      { _id: 'item12', content: 'Past Simple', description: 'I worked yesterday', order: 3 },
      { _id: 'item13', content: 'Future Simple', description: 'I will work tomorrow', order: 4 },
    ],
    difficulty: 'Intermediate',
    estimatedTime: '25 mins',
    tags: ['tenses', 'grammar', 'exercises'],
    isActive: true,
    createdBy: { _id: 'user2', name: 'Jane Smith' },
    totalItems: 4,
    usageCount: 178,
    createdAt: '2024-01-20T12:00:00Z',
    updatedAt: '2024-02-18T09:30:00Z',
  },
];

const mockCategories = [
  { _id: 'cat1', name: 'English Basics' },
  { _id: 'cat2', name: 'Advanced English' },
  { _id: 'cat3', name: 'Grammar' },
  { _id: 'cat4', name: 'Business English' },
  { _id: 'cat5', name: 'Academic Writing' },
];

// Simulated API delay
const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

// Hook to get all practices with filters
export const useGetAllPracticesQuery = (filters: PracticeFilters) => {
  const [data, setData] = useState<PracticesResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const fetchData = useCallback(async () => {
    setIsLoading(true);
    setIsError(false);
    setError(null);

    try {
      await delay(800);

      let filtered = [...mockPractices];

      // Apply search filter
      if (filters.search) {
        const searchLower = filters.search.toLowerCase();
        filtered = filtered.filter(
          (p) =>
            p.title.toLowerCase().includes(searchLower) ||
            p.description?.toLowerCase().includes(searchLower) ||
            p.tags?.some((t) => t.toLowerCase().includes(searchLower))
        );
      }

      // Apply type filter
      if (filters.type) {
        filtered = filtered.filter((p) => p.type === filters.type);
      }

      // Apply difficulty filter
      if (filters.difficulty) {
        filtered = filtered.filter((p) => p.difficulty === filters.difficulty);
      }

      // Apply category filter
      if (filters.category) {
        filtered = filtered.filter((p) => p.category?._id === filters.category);
      }

      // Apply status filter
      if (filters.isActive !== undefined && filters.isActive !== '') {
        filtered = filtered.filter((p) => p.isActive === filters.isActive);
      }

      // Apply sorting
      if (filters.sortBy) {
        filtered.sort((a, b) => {
          const order = filters.sortOrder === 'desc' ? -1 : 1;
          if (filters.sortBy === 'title') {
            return a.title.localeCompare(b.title) * order;
          }
          if (filters.sortBy === 'usageCount') {
            return (a.usageCount - b.usageCount) * order;
          }
          if (filters.sortBy === 'createdAt') {
            return (new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()) * order;
          }
          return 0;
        });
      }

      // Apply pagination
      const page = filters.page || 1;
      const limit = filters.limit || 10;
      const startIndex = (page - 1) * limit;
      const paginatedData = filtered.slice(startIndex, startIndex + limit);

      setData({
        data: paginatedData,
        meta: {
          total: filtered.length,
          page,
          limit,
          totalPages: Math.ceil(filtered.length / limit),
        },
      });
    } catch (err) {
      setIsError(true);
      setError(err as Error);
    } finally {
      setIsLoading(false);
    }
  }, [filters]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return { data, isLoading, isError, error, refetch: fetchData };
};

// Hook to get a single practice by ID
export const useGetPracticeByIdQuery = (id: string) => {
  const [data, setData] = useState<Practice | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const fetchData = useCallback(async () => {
    if (!id) return;

    setIsLoading(true);
    setIsError(false);
    setError(null);

    try {
      await delay(500);
      const practice = mockPractices.find((p) => p._id === id);
      if (!practice) {
        throw new Error('Practice not found');
      }
      setData(practice);
    } catch (err) {
      setIsError(true);
      setError(err as Error);
    } finally {
      setIsLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return { data, isLoading, isError, error, refetch: fetchData };
};

// Hook to get practice stats
export const useGetPracticeStatsQuery = () => {
  const [data, setData] = useState<PracticeStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);

  useEffect(() => {
    const fetchStats = async () => {
      setIsLoading(true);
      try {
        await delay(600);
        const activePractices = mockPractices.filter((p) => p.isActive);
        const totalItems = mockPractices.reduce((sum, p) => sum + p.totalItems, 0);
        const mostUsed = [...mockPractices].sort((a, b) => b.usageCount - a.usageCount)[0];

        setData({
          totalPractices: mockPractices.length,
          activePractices: activePractices.length,
          totalItems,
          mostUsedPractice: mostUsed,
        });
      } catch {
        setIsError(true);
      } finally {
        setIsLoading(false);
      }
    };

    fetchStats();
  }, []);

  return { data, isLoading, isError };
};

// Hook to get categories
export const useGetCategoriesQuery = () => {
  const [data, setData] = useState<typeof mockCategories | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchCategories = async () => {
      await delay(300);
      setData(mockCategories);
      setIsLoading(false);
    };
    fetchCategories();
  }, []);

  return { data, isLoading };
};

// Mutation hooks
export const useCreatePracticeMutation = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [isError, setIsError] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const createPractice = async (formData: PracticeFormData): Promise<Practice> => {
    setIsLoading(true);
    setIsSuccess(false);
    setIsError(false);
    setError(null);

    try {
      await delay(1000);
      const categoryObj = formData.category 
        ? mockCategories.find(c => c._id === formData.category) || { _id: formData.category, name: 'Category' }
        : undefined;
      const newPractice: Practice = {
        _id: `practice_${Date.now()}`,
        slug: formData.title.toLowerCase().replace(/\s+/g, '-'),
        title: formData.title,
        description: formData.description,
        type: formData.type,
        category: categoryObj,
        items: formData.items,
        difficulty: formData.difficulty,
        estimatedTime: formData.estimatedTime,
        tags: formData.tags,
        thumbnail: formData.thumbnail,
        isActive: formData.isActive,
        totalItems: formData.items.length,
        usageCount: 0,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      setIsSuccess(true);
      return newPractice;
    } catch (err) {
      setIsError(true);
      setError(err as Error);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  return { createPractice, isLoading, isSuccess, isError, error };
};

export const useUpdatePracticeMutation = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [isError, setIsError] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const updatePractice = async (id: string, formData: Partial<PracticeFormData>): Promise<Practice> => {
    setIsLoading(true);
    setIsSuccess(false);
    setIsError(false);
    setError(null);

    try {
      await delay(1000);
      const existingPractice = mockPractices.find((p) => p._id === id);
      if (!existingPractice) {
        throw new Error('Practice not found');
      }
      const updatedPractice: Practice = {
        ...existingPractice,
        ...formData,
        updatedAt: new Date().toISOString(),
        totalItems: formData.items?.length ?? existingPractice.totalItems,
      };
      setIsSuccess(true);
      return updatedPractice;
    } catch (err) {
      setIsError(true);
      setError(err as Error);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  return { updatePractice, isLoading, isSuccess, isError, error };
};

export const useDeletePracticeMutation = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [isError, setIsError] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const deletePractice = async (id: string): Promise<void> => {
    setIsLoading(true);
    setIsSuccess(false);
    setIsError(false);
    setError(null);

    try {
      await delay(800);
      const practice = mockPractices.find((p) => p._id === id);
      if (!practice) {
        throw new Error('Practice not found');
      }
      if (practice.usageCount > 0) {
        throw new Error(`Cannot delete practice with ${practice.usageCount} active usages`);
      }
      setIsSuccess(true);
    } catch (err) {
      setIsError(true);
      setError(err as Error);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  return { deletePractice, isLoading, isSuccess, isError, error };
};

export const useAddItemsToPracticeMutation = () => {
  const [isLoading, setIsLoading] = useState(false);

  const addItems = async (practiceId: string, items: PracticeItem[]): Promise<PracticeItem[]> => {
    setIsLoading(true);
    try {
      await delay(500);
      return items.map((item, index) => ({
        ...item,
        _id: `item_${Date.now()}_${index}`,
      }));
    } finally {
      setIsLoading(false);
    }
  };

  return { addItems, isLoading };
};

export const useRemoveItemFromPracticeMutation = () => {
  const [isLoading, setIsLoading] = useState(false);

  const removeItem = async (_practiceId: string, _itemId: string): Promise<void> => {
    setIsLoading(true);
    try {
      await delay(300);
    } finally {
      setIsLoading(false);
    }
  };

  return { removeItem, isLoading };
};

export const useUpdatePracticeItemMutation = () => {
  const [isLoading, setIsLoading] = useState(false);

  const updateItem = async (
    _practiceId: string,
    itemId: string,
    itemData: Partial<PracticeItem>
  ): Promise<PracticeItem> => {
    setIsLoading(true);
    try {
      await delay(300);
      return { ...itemData, _id: itemId } as PracticeItem;
    } finally {
      setIsLoading(false);
    }
  };

  return { updateItem, isLoading };
};

export const useTogglePracticeStatusMutation = () => {
  const [isLoading, setIsLoading] = useState(false);

  const toggleStatus = async (id: string, isActive: boolean): Promise<Practice> => {
    setIsLoading(true);
    try {
      await delay(500);
      const practice = mockPractices.find((p) => p._id === id);
      if (!practice) {
        throw new Error('Practice not found');
      }
      return { ...practice, isActive };
    } finally {
      setIsLoading(false);
    }
  };

  return { toggleStatus, isLoading };
};
