import toolsData from '../data/tools.json';
import { Tool, SortOption } from '../models/types';

// ----------------- Mock Setup -----------------

const mockThemeIcon = { setAttribute: jest.fn() };
const mockToolGrid = { innerHTML: '' };
const mockEmptyState = { classList: { add: jest.fn(), remove: jest.fn() } };
const mockLoadMoreContainer = {
  classList: { add: jest.fn(), remove: jest.fn(), toggle: jest.fn() },
};
const mockTotalToolsEl = { textContent: '' };
const mockPopularToolsEl = { textContent: '' };
const mockRecentToolsEl = { textContent: '' };

const mockCategoryFilters = {
  innerHTML: '',
  querySelectorAll: jest.fn(() => []),
};

// @ts-ignore
document.getElementById = jest.fn((id: string) => {
  switch (id) {
    case 'theme-icon':
      return mockThemeIcon;
    case 'tool-grid':
      return mockToolGrid;
    case 'empty-state':
      return mockEmptyState;
    case 'load-more-container':
      return mockLoadMoreContainer;
    case 'total-tools':
      return mockTotalToolsEl;
    case 'popular-tools':
      return mockPopularToolsEl;
    case 'recent-tools':
      return mockRecentToolsEl;
    case 'category-filters':
      return mockCategoryFilters;
    default:
      return null;
  }
});

// ----------------- Global Test State -----------------

let currentTools: Tool[] = toolsData as Tool[];
let filteredTools: Tool[] = [...currentTools];
let selectedCategory: string = 'All';
let searchQuery: string = '';
let sortBy: SortOption = 'popularity';
let visibleToolsCount: number = 6;
let bookmarkedTools: Set<number> = new Set();

// ----------------- Utility Functions -----------------

function filterAndSortTools(): void {
  let filtered = [...currentTools];

  if (searchQuery) {
    filtered = filtered.filter(
      (tool) =>
        tool.name.toLowerCase().includes(searchQuery) ||
        tool.description.toLowerCase().includes(searchQuery) ||
        tool.category.toLowerCase().includes(searchQuery) ||
        tool.features.some((feature: string) =>
          feature.toLowerCase().includes(searchQuery)
        )
    );
  }

  if (selectedCategory !== 'All') {
    filtered = filtered.filter((tool) => tool.category === selectedCategory);
  }

  switch (sortBy) {
    case 'name':
      filtered.sort((a, b) => a.name.localeCompare(b.name));
      break;
    case 'recent':
      filtered.sort((a, b) => a.lastUpdate.localeCompare(b.lastUpdate));
      break;
    case 'category':
      filtered.sort((a, b) => a.category.localeCompare(b.category));
      break;
    default:
      filtered.sort((a, b) => b.rating - a.rating);
  }

  filteredTools = filtered;
  visibleToolsCount = 6;
}

function updateStats(): void {
  const total = currentTools.length;
  const popular = currentTools.filter((t) => t.rating >= 4.5).length;
  const recent = currentTools.filter(
    (t) => t.lastUpdate.includes('day') || t.lastUpdate.includes('week')
  ).length;

  mockTotalToolsEl.textContent = total.toString();
  mockPopularToolsEl.textContent = popular.toString();
  mockRecentToolsEl.textContent = recent.toString();
}

function setupTheme(): void {
  const saved = localStorage.getItem('theme') || 'light';
  document.body.className = `${saved}-theme`;
  mockThemeIcon.setAttribute(
    'name',
    saved === 'dark' ? 'sunny-outline' : 'moon-outline'
  );
}

function toggleTheme(): void {
  const current = document.body.classList.contains('dark-theme')
    ? 'dark'
    : 'light';
  const next = current === 'dark' ? 'light' : 'dark';
  document.body.className = `${next}-theme`;
  localStorage.setItem('theme', next);
  mockThemeIcon.setAttribute(
    'name',
    next === 'dark' ? 'sunny-outline' : 'moon-outline'
  );
}

function renderTools(): void {
  const visible = filteredTools.slice(0, visibleToolsCount);
  const hasMore = visibleToolsCount < filteredTools.length;

  if (visible.length === 0) {
    mockToolGrid.innerHTML = '';
    mockEmptyState.classList.remove('hidden');
    mockLoadMoreContainer.classList.add('hidden');
    return;
  }

  mockEmptyState.classList.add('hidden');
  mockLoadMoreContainer.classList.toggle('hidden', !hasMore);

  mockToolGrid.innerHTML = visible
    .map((t) => `<div class="tool-card">${t.name}</div>`)
    .join('');
}

function toggleBookmark(id: number) {
  if (bookmarkedTools.has(id)) {
    bookmarkedTools.delete(id);
  } else {
    bookmarkedTools.add(id);
  }
}

// ----------------- Tests -----------------

describe('Tool Showcase App Tests', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    currentTools = toolsData as Tool[];
    filteredTools = [...currentTools];
    selectedCategory = 'All';
    searchQuery = '';
    sortBy = 'popularity';
    visibleToolsCount = 6;
    bookmarkedTools = new Set();
  });

  describe('Theme', () => {
    beforeEach(() => {
      document.body.className = '';

      const localStorageMock = (() => {
        let store: Record<string, string> = {};

        return {
          getItem: jest.fn((key: string) => store[key] || null),
          setItem: jest.fn((key: string, value: string) => {
            store[key] = value;
          }),
          clear: jest.fn(() => {
            store = {};
          }),
        };
      })();

      Object.defineProperty(window, 'localStorage', {
        value: localStorageMock,
        writable: true,
      });
    });

    test('applies saved theme', () => {
      (localStorage.getItem as jest.Mock).mockReturnValue('dark');
      setupTheme();
      expect(document.body.className).toBe('dark-theme');
      expect(mockThemeIcon.setAttribute).toHaveBeenCalledWith(
        'name',
        'sunny-outline'
      );
    });

    test('toggles between light and dark', () => {
      document.body.classList.add('light-theme');
      toggleTheme();
      expect(document.body.className).toBe('dark-theme');
      toggleTheme();
      expect(document.body.className).toBe('light-theme');
      expect(localStorage.setItem).toHaveBeenCalledWith('theme', 'dark');
      expect(localStorage.setItem).toHaveBeenCalledWith('theme', 'light');
    });
  });

  describe('Filtering and Sorting', () => {
    test('filters by search query', () => {
      searchQuery = 'webpack';
      filterAndSortTools();
      expect(
        filteredTools.some((t) => t.name.toLowerCase().includes('webpack'))
      ).toBe(true);
    });

    test('filters by category', () => {
      selectedCategory = 'Bundlers';
      filterAndSortTools();
      expect(filteredTools.every((t) => t.category === 'Bundlers')).toBe(true);
    });

    test('sorts by name', () => {
      sortBy = 'name';
      filterAndSortTools();
      expect(filteredTools[0].name <= filteredTools[1].name).toBe(true);
    });
  });

  describe('Rendering', () => {
    test('renders tools to DOM', () => {
      renderTools();
      expect(mockToolGrid.innerHTML).toContain('Webpack');
    });

    test('shows empty state with no tools', () => {
      filteredTools = [];
      renderTools();
      expect(mockToolGrid.innerHTML).toBe('');
      expect(mockEmptyState.classList.remove).toHaveBeenCalledWith('hidden');
    });
  });

  describe('Statistics', () => {
    test('displays correct counts', () => {
      updateStats();
      expect(mockTotalToolsEl.textContent).toBe(currentTools.length.toString());
      expect(mockPopularToolsEl.textContent).toMatch(/^\d+$/);
      expect(mockRecentToolsEl.textContent).toMatch(/^\d+$/);
    });
  });

  describe('Bookmarks', () => {
    test('toggle adds/removes tool', () => {
      toggleBookmark(1);
      expect(bookmarkedTools.has(1)).toBe(true);
      toggleBookmark(1);
      expect(bookmarkedTools.has(1)).toBe(false);
    });
  });
});
