/**
 * Validates GitHub repository URL
 */
export function validateGitHubUrl(url: string): boolean {
  const githubPattern = /^https?:\/\/(www\.)?github\.com\/[\w-]+\/[\w.-]+\/?$/;
  return githubPattern.test(url);
}

/**
 * Extracts repository name from GitHub URL
 */
export function extractRepoName(url: string): string {
  try {
    const match = url.match(/github\.com\/([\w-]+)\/([\w.-]+)/);
    if (match) {
      return match[2].replace(/\.git$/, '');
    }
    return 'app';
  } catch {
    return 'app';
  }
}

/**
 * Formats timestamp to relative time
 */
export function formatRelativeTime(timestamp: Date | string): string {
  const date = new Date(timestamp);
  const now = new Date();
  const seconds = Math.floor((now.getTime() - date.getTime()) / 1000);

  if (seconds < 60) return `${seconds}s ago`;
  if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
  if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`;
  return `${Math.floor(seconds / 86400)}d ago`;
}

/**
 * Formats uptime in seconds to human readable format
 */
export function formatUptime(seconds: number): string {
  if (seconds < 60) return `${seconds}s`;
  if (seconds < 3600) return `${Math.floor(seconds / 60)}m`;
  if (seconds < 86400) return `${Math.floor(seconds / 3600)}h`;
  return `${Math.floor(seconds / 86400)}d ${Math.floor((seconds % 86400) / 3600)}h`;
}

/**
 * Copies text to clipboard
 */
export async function copyToClipboard(text: string): Promise<boolean> {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch (error) {
    console.error('Failed to copy to clipboard:', error);
    return false;
  }
}



