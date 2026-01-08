/**
 * GitHub Integration utilities for gist management and star counting
 */

// Extract gist ID from various GitHub gist URL formats
export const extractGistId = (gistUrl) => {
  if (!gistUrl) return null;
  
  try {
    // Handle different gist URL formats:
    // https://gist.github.com/username/gist-id
    // https://gist.github.com/username/gist-id/raw
    // https://gist.github.com/gist-id
    
    const url = new URL(gistUrl);
    const pathParts = url.pathname.split('/').filter(Boolean);
    
    if (pathParts.length >= 2) {
      // Format: /username/gist-id or /username/gist-id/raw
      const gistId = pathParts[1];
      return gistId;
    } else if (pathParts.length === 1) {
      // Format: /gist-id
      return pathParts[0];
    }
    
    return null;
  } catch (error) {
    console.error('Error extracting gist ID:', error);
    return null;
  }
};

// Get clean gist URL (remove /raw suffix)
export const getCleanGistUrl = (gistUrl) => {
  if (!gistUrl) return gistUrl;
  
  try {
    const url = new URL(gistUrl);
    let pathname = url.pathname;
    
    // Remove /raw suffix if present
    if (pathname.endsWith('/raw')) {
      pathname = pathname.slice(0, -4);
    }
    
    return `${url.protocol}//${url.host}${pathname}`;
  } catch (error) {
    console.error('Error cleaning gist URL:', error);
    return gistUrl;
  }
};

// Get gist API URL from gist URL
export const getGistApiUrl = (gistUrl) => {
  const gistId = extractGistId(gistUrl);
  if (!gistId) return null;
  
  return `https://api.github.com/gists/${gistId}`;
};

// Fetch gist star count from GitHub API
export const fetchGistStarCount = async (gistUrl) => {
  try {
    const apiUrl = getGistApiUrl(gistUrl);
    if (!apiUrl) return 0;
    
    const response = await fetch(apiUrl);
    if (!response.ok) {
      console.warn(`Failed to fetch gist data: ${response.status}`);
      return 0;
    }
    
    const gistData = await response.json();
    
    // GitHub API doesn't directly provide star count for gists
    // We'll use forks count as an alternative metric
    return gistData.forks?.length || 0;
  } catch (error) {
    console.error('Error fetching gist star count:', error);
    return 0;
  }
};

// Check if user has starred a gist (requires authentication)
export const checkGistStarStatus = async (gistUrl, accessToken) => {
  try {
    const gistId = extractGistId(gistUrl);
    if (!gistId || !accessToken) return false;
    
    const response = await fetch(`https://api.github.com/gists/${gistId}/star`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Accept': 'application/vnd.github.v3+json'
      }
    });
    
    return response.status === 204; // 204 means starred, 404 means not starred
  } catch (error) {
    console.error('Error checking gist star status:', error);
    return false;
  }
};

// Star a gist (requires authentication)
export const starGist = async (gistUrl, accessToken) => {
  try {
    const gistId = extractGistId(gistUrl);
    if (!gistId || !accessToken) return false;
    
    const response = await fetch(`https://api.github.com/gists/${gistId}/star`, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Accept': 'application/vnd.github.v3+json',
        'Content-Length': '0'
      }
    });
    
    return response.status === 204;
  } catch (error) {
    console.error('Error starring gist:', error);
    return false;
  }
};

// Unstar a gist (requires authentication)
export const unstarGist = async (gistUrl, accessToken) => {
  try {
    const gistId = extractGistId(gistUrl);
    if (!gistId || !accessToken) return false;
    
    const response = await fetch(`https://api.github.com/gists/${gistId}/star`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Accept': 'application/vnd.github.v3+json'
      }
    });
    
    return response.status === 204;
  } catch (error) {
    console.error('Error unstarring gist:', error);
    return false;
  }
};

// Toggle gist star status
export const toggleGistStar = async (gistUrl, accessToken) => {
  try {
    const isStarred = await checkGistStarStatus(gistUrl, accessToken);
    
    if (isStarred) {
      const success = await unstarGist(gistUrl, accessToken);
      return { success, isStarred: !success };
    } else {
      const success = await starGist(gistUrl, accessToken);
      return { success, isStarred: success };
    }
  } catch (error) {
    console.error('Error toggling gist star:', error);
    return { success: false, isStarred: false };
  }
};

// Get gist owner and repo info
export const getGistInfo = (gistUrl) => {
  try {
    const url = new URL(gistUrl);
    const pathParts = url.pathname.split('/').filter(Boolean);
    
    if (pathParts.length >= 2) {
      return {
        owner: pathParts[0],
        gistId: pathParts[1],
        cleanUrl: getCleanGistUrl(gistUrl)
      };
    }
    
    return null;
  } catch (error) {
    console.error('Error getting gist info:', error);
    return null;
  }
};

// Validate gist URL format
export const isValidGistUrl = (url) => {
  try {
    const urlObj = new URL(url);
    return urlObj.hostname === 'gist.github.com' && extractGistId(url) !== null;
  } catch (error) {
    return false;
  }
};

// Get GitHub access token from user data (if available)
export const getGitHubAccessToken = (user) => {
  // This would need to be implemented based on how you store the GitHub token
  // For now, we'll return null since we don't have access to the full OAuth token
  return null;
};

// Batch fetch star counts for multiple gists
export const batchFetchGistStars = async (gistUrls) => {
  const results = {};
  
  // Process in batches to avoid rate limiting
  const batchSize = 5;
  for (let i = 0; i < gistUrls.length; i += batchSize) {
    const batch = gistUrls.slice(i, i + batchSize);
    
    const promises = batch.map(async (url) => {
      const starCount = await fetchGistStarCount(url);
      return { url, starCount };
    });
    
    const batchResults = await Promise.all(promises);
    batchResults.forEach(({ url, starCount }) => {
      results[url] = starCount;
    });
    
    // Add delay between batches to respect rate limits
    if (i + batchSize < gistUrls.length) {
      await new Promise(resolve => setTimeout(resolve, 1000));
    }
  }
  
  return results;
};