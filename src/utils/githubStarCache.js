/**
 * GitHub Star Cache System
 * Fetches and caches GitHub gist stars locally until page refresh
 */

const CACHE_KEY = 'vinsmoke_github_stars';
const CACHE_DURATION = 30 * 60 * 1000; // 30 minutes

class GitHubStarCache {
  constructor() {
    this.cache = new Map();
    this.loadFromStorage();
  }

  // Load cached data from localStorage
  loadFromStorage() {
    try {
      const stored = localStorage.getItem(CACHE_KEY);
      if (stored) {
        const data = JSON.parse(stored);
        // Check if cache is still valid
        if (Date.now() - data.timestamp < CACHE_DURATION) {
          this.cache = new Map(data.entries);
        } else {
          // Clear expired cache
          localStorage.removeItem(CACHE_KEY);
        }
      }
    } catch (error) {
      console.error('Error loading GitHub star cache:', error);
    }
  }

  // Save cache to localStorage
  saveToStorage() {
    try {
      const data = {
        timestamp: Date.now(),
        entries: Array.from(this.cache.entries())
      };
      localStorage.setItem(CACHE_KEY, JSON.stringify(data));
    } catch (error) {
      console.error('Error saving GitHub star cache:', error);
    }
  }

  // Extract gist ID from URL
  extractGistId(gistUrl) {
    if (!gistUrl) return null;
    
    try {
      const url = new URL(gistUrl);
      const pathParts = url.pathname.split('/').filter(Boolean);
      
      if (pathParts.length >= 2) {
        return pathParts[1]; // username/gist-id format
      }
      return null;
    } catch (error) {
      return null;
    }
  }

  // Get cached star count
  getCachedStars(gistUrl) {
    return this.cache.get(gistUrl) || 0;
  }

  // Check if URL is cached
  isCached(gistUrl) {
    return this.cache.has(gistUrl);
  }

  // Fetch star count from GitHub API
  async fetchStarCount(gistUrl) {
    const gistId = this.extractGistId(gistUrl);
    if (!gistId) return 0;

    try {
      const response = await fetch(`https://api.github.com/gists/${gistId}`);
      if (!response.ok) {
        console.warn(`Failed to fetch gist data: ${response.status}`);
        return 0;
      }

      const gistData = await response.json();
      
      // GitHub API doesn't provide star count for gists directly
      // We'll use forks count as an alternative metric
      const starCount = gistData.forks?.length || 0;
      
      // Cache the result
      this.cache.set(gistUrl, starCount);
      this.saveToStorage();
      
      return starCount;
    } catch (error) {
      console.error('Error fetching gist star count:', error);
      return 0;
    }
  }

  // Batch fetch star counts for multiple gists
  async batchFetchStars(gistUrls) {
    const results = {};
    const uncachedUrls = gistUrls.filter(url => !this.isCached(url));
    
    // Return cached results immediately
    gistUrls.forEach(url => {
      if (this.isCached(url)) {
        results[url] = this.getCachedStars(url);
      }
    });

    // Fetch uncached URLs in batches to respect rate limits
    if (uncachedUrls.length > 0) {
      const batchSize = 5;
      for (let i = 0; i < uncachedUrls.length; i += batchSize) {
        const batch = uncachedUrls.slice(i, i + batchSize);
        
        const promises = batch.map(async (url) => {
          const starCount = await this.fetchStarCount(url);
          return { url, starCount };
        });
        
        const batchResults = await Promise.all(promises);
        batchResults.forEach(({ url, starCount }) => {
          results[url] = starCount;
        });
        
        // Add delay between batches to respect rate limits
        if (i + batchSize < uncachedUrls.length) {
          await new Promise(resolve => setTimeout(resolve, 1000));
        }
      }
    }

    return results;
  }

  // Clear all cached data
  clearCache() {
    this.cache.clear();
    localStorage.removeItem(CACHE_KEY);
  }

  // Get cache statistics
  getCacheStats() {
    return {
      size: this.cache.size,
      urls: Array.from(this.cache.keys()),
      lastUpdated: this.getLastUpdated()
    };
  }

  // Get last updated timestamp
  getLastUpdated() {
    try {
      const stored = localStorage.getItem(CACHE_KEY);
      if (stored) {
        const data = JSON.parse(stored);
        return new Date(data.timestamp);
      }
    } catch (error) {
      return null;
    }
    return null;
  }
}

// Create singleton instance
const githubStarCache = new GitHubStarCache();

export default githubStarCache;

// Export utility functions
export const {
  getCachedStars,
  isCached,
  fetchStarCount,
  batchFetchStars,
  clearCache,
  getCacheStats
} = githubStarCache;