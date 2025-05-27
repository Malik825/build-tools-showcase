import './style.scss';
import toolsData from './data/tools.json';

interface Tool {
  id: number;
  name: string;
  description: string;
  category: string;
  rating: number;
  downloads: string;
  lastUpdate: string;
  features: string[];
  color: string;
  icon: string;
}

let currentTools: Tool[] = toolsData;
let filteredTools: Tool[] = toolsData;
let selectedCategory: string = "All";
let searchQuery: string = "";
let sortBy: string = "popularity";
let visibleToolsCount: number = 6;
let bookmarkedTools: Set<number> = new Set();

const themeToggle = document.getElementById('theme-toggle') as HTMLButtonElement;
const themeIcon = document.getElementById('theme-icon') as HTMLElement;
const filterToggle = document.getElementById('filter-toggle') as HTMLButtonElement;
const filterPanel = document.getElementById('filter-panel') as HTMLElement;
const searchInput = document.getElementById('search-input') as HTMLInputElement;
const mobileSearchInput = document.getElementById('mobile-search-input') as HTMLInputElement;
const categoryFilters = document.getElementById('category-filters') as HTMLElement;
const sortSelect = document.getElementById('sort-select') as HTMLSelectElement;
const toolGrid = document.getElementById('tool-grid') as HTMLElement;
const loadMoreBtn = document.getElementById('load-more-btn') as HTMLButtonElement;
const loadMoreContainer = document.getElementById('load-more-container') as HTMLElement;
const emptyState = document.getElementById('empty-state') as HTMLElement;
const totalToolsEl = document.getElementById('total-tools') as HTMLElement;
const popularToolsEl = document.getElementById('popular-tools') as HTMLElement;
const recentToolsEl = document.getElementById('recent-tools') as HTMLElement;

function init(): void {
  setupTheme();
  setupEventListeners();
  setupCategoryFilters();
  updateStats();
  renderTools();
}

function setupTheme(): void {
  const savedTheme = localStorage.getItem('theme') || 'light';
  document.body.className = `${savedTheme}-theme`;
  updateThemeIcon(savedTheme);
}

function toggleTheme(): void {
  const currentTheme = document.body.classList.contains('dark-theme') ? 'dark' : 'light';
  const newTheme = currentTheme === 'light' ? 'dark' : 'light';
  
  document.body.className = `${newTheme}-theme`;
  localStorage.setItem('theme', newTheme);
  updateThemeIcon(newTheme);
}

function updateThemeIcon(theme: string): void {
  themeIcon.setAttribute('name', theme === 'light' ? 'moon-outline' : 'sunny-outline');
}

function setupEventListeners(): void {
  themeToggle.addEventListener('click', toggleTheme);
  
  filterToggle.addEventListener('click', () => {
    filterPanel.classList.toggle('hidden');
  });
  
  searchInput.addEventListener('input', (e) => {
    const target = e.target as HTMLInputElement;
    handleSearch(target.value);
  });
  
  mobileSearchInput.addEventListener('input', (e) => {
    const target = e.target as HTMLInputElement;
    handleSearch(target.value);
  });
  
  sortSelect.addEventListener('change', (e) => {
    const target = e.target as HTMLSelectElement;
    handleSortChange(target.value);
  });
  
  loadMoreBtn.addEventListener('click', handleLoadMore);
}

function setupCategoryFilters(): void {
  const categories = ["All", ...Array.from(new Set(toolsData.map(tool => tool.category)))];
  
  categoryFilters.innerHTML = categories.map(category => `
    <button class="filter-badge ${category === selectedCategory ? 'active' : ''}" 
            data-category="${category}">
      ${category}
    </button>
  `).join('');
  
  categoryFilters.addEventListener('click', (e) => {
    const target = e.target as HTMLElement;
    if (target.classList.contains('filter-badge')) {
      const category = target.getAttribute('data-category') || 'All';
      handleCategoryChange(category);
    }
  });
}

function handleSearch(query: string): void {
  searchQuery = query.toLowerCase();
  if (searchInput.value !== query) searchInput.value = query;
  if (mobileSearchInput.value !== query) mobileSearchInput.value = query;
  
  filterAndSortTools();
  renderTools();
}

function handleCategoryChange(category: string): void {
  selectedCategory = category;
  
  categoryFilters.querySelectorAll('.filter-badge').forEach(badge => {
    badge.classList.toggle('active', badge.getAttribute('data-category') === category);
  });
  
  filterAndSortTools();
  renderTools();
}

function handleSortChange(sort: string): void {
  sortBy = sort;
  filterAndSortTools();
  renderTools();
}

function filterAndSortTools(): void {
  let filtered = toolsData;
  
  if (searchQuery) {
    filtered = filtered.filter(tool =>
      tool.name.toLowerCase().includes(searchQuery) ||
      tool.description.toLowerCase().includes(searchQuery) ||
      tool.category.toLowerCase().includes(searchQuery) ||
      tool.features.some(feature => feature.toLowerCase().includes(searchQuery))
    );
  }
  
  if (selectedCategory !== "All") {
    filtered = filtered.filter(tool => tool.category === selectedCategory);
  }
  
  switch (sortBy) {
    case "name":
      filtered.sort((a, b) => a.name.localeCompare(b.name));
      break;
    case "recent":
      filtered.sort((a, b) => {
        const aRecent = a.lastUpdate.includes("day") ? 1 : a.lastUpdate.includes("week") ? 2 : 3;
        const bRecent = b.lastUpdate.includes("day") ? 1 : b.lastUpdate.includes("week") ? 2 : 3;
        return aRecent - bRecent;
      });
      break;
    case "category":
      filtered.sort((a, b) => a.category.localeCompare(b.category));
      break;
    case "popularity":
    default:
      filtered.sort((a, b) => b.rating - a.rating);
      break;
  }
  
  filteredTools = filtered;
}

function handleLoadMore(): void {
  visibleToolsCount += 6;
  renderTools();
}

function updateStats(): void {
  const totalTools = toolsData.length;
  const popularTools = toolsData.filter(tool => tool.rating >= 4.5).length;
  const recentTools = toolsData.filter(tool => 
    tool.lastUpdate.includes("day") || tool.lastUpdate.includes("week")
  ).length;
  
  totalToolsEl.textContent = totalTools.toString();
  popularToolsEl.textContent = popularTools.toString();
  recentToolsEl.textContent = recentTools.toString();
}

function renderTools(): void {
  const visibleTools = filteredTools.slice(0, visibleToolsCount);
  const hasMoreTools = visibleToolsCount < filteredTools.length;
  
  if (visibleTools.length === 0) {
    toolGrid.innerHTML = '';
    emptyState.classList.remove('hidden');
    loadMoreContainer.classList.add('hidden');
    return;
  }
  
  emptyState.classList.add('hidden');
  loadMoreContainer.classList.toggle('hidden', !hasMoreTools);
  
  toolGrid.innerHTML = visibleTools.map((tool, index) => createToolCard(tool, index)).join('');
  
  toolGrid.addEventListener('click', handleToolCardClick);
}

function createToolCard(tool: Tool, index: number): string {
  const isBookmarked = bookmarkedTools.has(tool.id);
  const animationDelay = (index * 0.1).toFixed(1);
  
  return `
    <div class="tool-card" data-color="${tool.color}" style="animation-delay: ${animationDelay}s">
      <div class="tool-header">
        <div class="tool-info">
          <div class="tool-icon">
            <ion-icon name="${tool.icon}"></ion-icon>
          </div>
          <div class="tool-details">
            <h3>${tool.name}</h3>
            <div class="tool-meta">
              <span class="category-badge">${tool.category}</span>
              <div class="rating">
                <ion-icon name="star" class="star-icon"></ion-icon>
                <span>${tool.rating}</span>
              </div>
            </div>
          </div>
        </div>
        <button class="bookmark-btn ${isBookmarked ? 'active' : ''}" data-tool-id="${tool.id}">
          <ion-icon name="${isBookmarked ? 'bookmark' : 'bookmark-outline'}"></ion-icon>
        </button>
      </div>
      
      <p class="tool-description">${tool.description}</p>
      
      <div class="tool-features">
        ${tool.features.map(feature => `<span class="feature-badge">${feature}</span>`).join('')}
      </div>
      
      <div class="tool-footer">
        <div class="tool-stats">
          <div class="tool-stat">
            <ion-icon name="download-outline"></ion-icon>
            <span>${tool.downloads}</span>
          </div>
          <div class="tool-stat">
            <ion-icon name="time-outline"></ion-icon>
            <span>${tool.lastUpdate}</span>
          </div>
        </div>
        <div class="tool-actions">
          <button class="info-btn" data-tool-id="${tool.id}">
            <ion-icon name="information-circle-outline"></ion-icon>
          </button>
          <button class="try-btn" data-tool-id="${tool.id}">
            <span>Try Now</span>
            <ion-icon name="arrow-forward-outline"></ion-icon>
          </button>
        </div>
      </div>
    </div>
  `;
}

function handleToolCardClick(e: Event): void {
  const target = e.target as HTMLElement;
  const button = target.closest('button');
  
  if (!button) return;
  
  const toolId = parseInt(button.getAttribute('data-tool-id') || '0');
  
  if (button.classList.contains('bookmark-btn')) {
    toggleBookmark(toolId, button);
  } else if (button.classList.contains('info-btn')) {
    showToolInfo(toolId);
  } else if (button.classList.contains('try-btn')) {
    tryTool(toolId);
  }
}

function toggleBookmark(toolId: number, button: HTMLElement): void {
  const icon = button.querySelector('ion-icon');
  
  if (bookmarkedTools.has(toolId)) {
    bookmarkedTools.delete(toolId);
    button.classList.remove('active');
    if (icon) icon.setAttribute('name', 'bookmark-outline');
  } else {
    bookmarkedTools.add(toolId);
    button.classList.add('active');
    if (icon) icon.setAttribute('name', 'bookmark');
  }
  
  localStorage.setItem('bookmarkedTools', JSON.stringify(Array.from(bookmarkedTools)));
}

function showToolInfo(toolId: number): void {
  const tool = toolsData.find(t => t.id === toolId);
  if (tool) {
    alert(`${tool.name}\n\nCategory: ${tool.category}\nRating: ${tool.rating}/5\nDownloads: ${tool.downloads}\nLast Update: ${tool.lastUpdate}\n\nFeatures:\n• ${tool.features.join('\n• ')}\n\n${tool.description}`);
  }
}

function tryTool(toolId: number): void {
  const tool = toolsData.find(t => t.id === toolId);
  if (tool) {
    alert(`Opening ${tool.name}...\n\nThis would typically redirect to the tool's official website or documentation.`);
  }
}

function loadBookmarks(): void {
  const saved = localStorage.getItem('bookmarkedTools');
  if (saved) {
    try {
      const bookmarks = JSON.parse(saved);
      bookmarkedTools = new Set(bookmarks);
    } catch (e) {
      bookmarkedTools = new Set();
    }
  }
}

document.addEventListener('DOMContentLoaded', () => {
  loadBookmarks();
  init();
});