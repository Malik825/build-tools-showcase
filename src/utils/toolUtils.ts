import toolsData from '../data/tools.json';
import { Tool } from '../models/types';

export function toggleBookmark(
  toolId: number,
  button: HTMLElement,
  bookmarkedTools: Set<number>
): void {
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

  localStorage.setItem('bookmarkedTools', JSON.stringify([...bookmarkedTools]));
}
document.addEventListener('DOMContentLoaded', () => {
  const headerTop = document.getElementById('header');
  if (!headerTop) return;

  const handleScroll = () => {
    headerTop.classList.toggle('scrolled', window.scrollY > 120);
  };

  // Run once on load in case the page is already scrolled
  handleScroll();

  window.addEventListener('scroll', handleScroll);
});

const toolInfoText = document.getElementById('tool-info-text');

// Safely fetch a tool by ID
function getToolById(toolId: number): Tool | undefined {
  return (toolsData as Tool[]).find((t) => t.id === toolId);
}

// Renders a tool card
function createToolCard(tool: Tool): HTMLElement {
  const card = document.createElement('div');
  card.classList.add('tool-card-details');
  card.setAttribute('data-color', tool.color);

  card.innerHTML = `
    <div class="tool-header">
      <div class="tool-info">
        <div class="tool-details">
          <h3>${tool.name}</h3>
          <div class="tool-meta">
            <div class="rating">
              <ion-icon name="star" class="star-icon"></ion-icon>
              <span>${tool.rating}</span>
            </div>
            <div class="downloads">
              <ion-icon name="download-outline" class="download-icon"></ion-icon>
              <span>${tool.downloads}</span>
            </div>
            <div class="last-update">
              <ion-icon name="time-outline" class="update-icon"></ion-icon>
              <span>${tool.lastUpdate}</span>
            </div>
            <div>
             
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="tool-features">
      <h4>Features</h4>
      <ul>${tool.features.map((feature) => `<li>${feature}</li>`).join('')}</ul>
    </div>
    <div class="tool-description">
      <p>${tool.description}</p>
    </div>
    <div class="close-icon" role="button" tabindex="0">
      <ion-icon name="close-outline"></ion-icon>
    </div>
  `;

  return card;
}

export function showToolInfo(toolId: number): void {
  const tool = getToolById(toolId);
  if (!tool || !toolInfoText) return;

  toolInfoText.classList.add('active');
  toolInfoText.innerHTML = ''; // Clear any existing tool info

  const card = createToolCard(tool);
  toolInfoText.appendChild(card);
}

export function closeToolInfo(): void {
  if (!toolInfoText) return;
  toolInfoText.classList.remove('active');
  toolInfoText.innerHTML = ''; // Clean up DOM
}

// Centralized event delegation for close and try buttons
document.addEventListener('click', (e) => {
  const target = e.target as HTMLElement;

  // Close button
  if (target.closest('.close-icon')) {
    closeToolInfo();
  }

  // Try button
  const tryButton = target.closest('.try-btn') as HTMLElement;
  if (tryButton && tryButton.dataset.toolId) {
    const toolId = parseInt(tryButton.dataset.toolId, 10);
    tryTool(toolId);
  }
});

// Dummy tryTool implementation (should be replaced)

export function tryTool(toolId: number): void {
  const tool = (toolsData as Tool[]).find((t) => t.id === toolId);
  if (tool && tool.tryLink) {
    window.open(tool.tryLink, '_blank');
  }
}

export function loadBookmarks(): Set<number> {
  const saved = localStorage.getItem('bookmarkedTools');
  if (saved) {
    try {
      const bookmarks = JSON.parse(saved);
      return new Set(bookmarks);
    } catch (e) {
      return new Set();
    }
  }
  return new Set();
}
alert;
