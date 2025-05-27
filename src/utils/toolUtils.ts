import toolsData from '../data/tools.json';
import { Tool } from '../models/types';

export function toggleBookmark(toolId: number, button: HTMLElement, bookmarkedTools: Set<number>): void {
  const icon = button.querySelector('ion-icon');

  if (bookmarkedTools.has(toolId)) {
/*************  ✨ Windsurf Command ⭐  *************/
  /**
   * Creates an instance of ToolCard.
   * @param {HTMLElement} toolGrid - The HTMLElement that will contain the rendered tools.
   * @param {Set<number>} bookmarkedTools - A set of IDs of tools that are currently bookmarked.
   */
/*******  3d9b1501-9aef-41ea-b2cf-ecdc4ce359a8  *******/    bookmarkedTools.delete(toolId);
    button.classList.remove('active');
    if (icon) icon.setAttribute('name', 'bookmark-outline');
  } else {
    bookmarkedTools.add(toolId);
    button.classList.add('active');
    if (icon) icon.setAttribute('name', 'bookmark');
  }

  localStorage.setItem('bookmarkedTools', JSON.stringify([...bookmarkedTools]));
}

export function showToolInfo(toolId: number): void {
  const tool = (toolsData as Tool[]).find((t) => t.id === toolId);
  if (tool) {
    alert(
      `${tool.name}\n\nCategory: ${tool.category}\nRating: ${tool.rating}/5\nDownloads: ${tool.downloads}\nLast Update: ${tool.lastUpdate}\n\nFeatures:\n• ${tool.features.join(
        '\n• '
      )}\n\n${tool.description}`
    );
  }
}

export function tryTool(toolId: number): void {
  const tool = (toolsData as Tool[]).find((t) => t.id === toolId);
  if (tool) {
    alert(`Opening ${tool.name}...\n\nThis would typically redirect to the tool's official website or documentation.`);
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