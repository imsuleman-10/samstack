/**
 * Social Links Utilities
 * Handles validation, extraction, and URL normalization across the SAMStack platform.
 */

export interface SocialLinksMap {
  linkedin?: string;
  github?: string;
  instagram?: string;
  portfolio?: string;
  twitter?: string;
  [key: string]: string | undefined;
}

/**
 * Checks if a string has actual content (not empty, not just whitespace, not undefined/null).
 */
function isValidContent(val: unknown): boolean {
  if (typeof val !== 'string') return false;
  const trimmed = val.trim();
  return (
    trimmed.length > 0 &&
    trimmed !== 'undefined' &&
    trimmed !== 'null' &&
    trimmed !== '[object Object]'
  );
}

/**
 * Checks whether ANY social link exists for a user / intern profile.
 * Even a SINGLE link (Instagram, LinkedIn, GitHub, Portfolio, Twitter, etc.) is considered COMPLETE.
 */
export function hasAnySocialLink(user: any, intern?: any): boolean {
  if (!user && !intern) return false;

  const checkObj = (obj: any): boolean => {
    if (!obj) return false;
    if (typeof obj === 'string') {
      try {
        const parsed = JSON.parse(obj);
        return checkObj(parsed);
      } catch {
        return isValidContent(obj);
      }
    }
    if (typeof obj === 'object') {
      return Object.values(obj).some(v => isValidContent(v));
    }
    return false;
  };

  // 1. Nested maps
  if (checkObj(user?.social_links)) return true;
  if (checkObj(user?.socialLinks)) return true;
  if (checkObj(intern?.social_links)) return true;
  if (checkObj(intern?.socialLinks)) return true;

  // 2. Direct properties on user or intern
  const candidates = [
    user?.instagram,
    user?.instagram_url,
    user?.linkedin,
    user?.linkedin_url,
    user?.github,
    user?.github_url,
    user?.portfolio,
    user?.portfolio_url,
    user?.twitter,
    user?.twitter_url,
    intern?.instagram,
    intern?.instagram_url,
    intern?.linkedin,
    intern?.linkedin_url,
    intern?.github,
    intern?.github_url,
    intern?.portfolio,
    intern?.portfolio_url,
    intern?.twitter,
    intern?.twitter_url,
  ];

  return candidates.some(isValidContent);
}

/**
 * Normalizes user input for social platforms.
 * Handles inputs like "@handle", "instagram.com/handle", or full URLs.
 */
export function normalizeSocialUrl(platform: 'instagram' | 'github' | 'linkedin' | 'portfolio' | 'twitter', value: string): string {
  let val = (value || '').trim();
  if (!val) return '';

  // Remove leading @
  if (val.startsWith('@')) {
    val = val.substring(1).trim();
  }

  // Already has protocol
  if (val.startsWith('http://') || val.startsWith('https://')) {
    return val;
  }

  switch (platform) {
    case 'instagram':
      if (val.includes('instagram.com/')) {
        return `https://${val.replace(/^\/\//, '')}`;
      }
      return `https://instagram.com/${val}`;

    case 'github':
      if (val.includes('github.com/')) {
        return `https://${val.replace(/^\/\//, '')}`;
      }
      return `https://github.com/${val}`;

    case 'linkedin':
      if (val.includes('linkedin.com/')) {
        return `https://${val.replace(/^\/\//, '')}`;
      }
      return `https://linkedin.com/in/${val}`;

    case 'twitter':
      if (val.includes('twitter.com/') || val.includes('x.com/')) {
        return `https://${val.replace(/^\/\//, '')}`;
      }
      return `https://x.com/${val}`;

    case 'portfolio':
    default:
      return `https://${val}`;
  }
}
