const simpleGit = require('simple-git');
const fs = require('fs').promises;
const path = require('path');
const os = require('os');

const GITHUB_URL_REGEX = /https?:\/\/(?:www\.)?github\.com\/[\w.-]+\/[\w.-]+(?:\.git)?/i;

function normalizeRepoUrl(input) {
  if (!input) return null;
  const match = String(input).trim().match(GITHUB_URL_REGEX);
  if (!match) return null;
  let url = match[0];
  url = url.replace(/[\s"'`]+$/, '');
  url = url.replace(/[),.;]+$/, '');
  return url;
}

/**
 * Clones a GitHub repository to a temporary directory
 */
async function cloneRepository(repoUrl) {
  try {
    const normalizedRepoUrl = normalizeRepoUrl(repoUrl);
    if (!normalizedRepoUrl || !validateGitHubUrl(normalizedRepoUrl)) {
      throw new Error('Invalid GitHub repository URL');
    }

    // Create temp directory
    const tempDir = path.join(os.tmpdir(), `repo-${Date.now()}`);
    await fs.mkdir(tempDir, { recursive: true });

    console.log(`Cloning ${normalizedRepoUrl} to ${tempDir}...`);
    
    // Configure git to not prompt for credentials and handle public repos
    const git = simpleGit({
      config: [
        'credential.helper=',  // Disable credential helper
        'url.https://.insteadOf=git://',  // Use HTTPS instead of Git protocol
      ]
    });
    
    // Clone with specific options for public repos
    await git.clone(normalizedRepoUrl, tempDir, [
      '--depth', '1',
      '--single-branch',
      '--no-tags'
    ]);

    return tempDir;
  } catch (error) {
    console.error('GitHub clone error:', error.message);
    throw new Error(`Failed to clone repository: ${error.message}`);
  }
}

/**
 * Analyzes repository structure and detects tech stack
 */
async function analyzeStructure(repoPath) {
  try {
    const structure = {
      files: [],
      language: null,
      framework: null,
      dependencies: [],
      hasDockerfile: false,
      fileCount: 0,
      directories: []
    };

    // Read directory contents
    await scanDirectory(repoPath, repoPath, structure);

    // Detect language and framework
    detectTechStack(structure);

    return structure;
  } catch (error) {
    console.error('Structure analysis error:', error.message);
    throw new Error(`Failed to analyze repository structure: ${error.message}`);
  }
}

/**
 * Recursively scans directory
 */
async function scanDirectory(basePath, currentPath, structure, depth = 0) {
  if (depth > 3) return; // Limit depth to avoid excessive scanning

  const items = await fs.readdir(currentPath, { withFileTypes: true });

  for (const item of items) {
    // Skip node_modules, .git, and other common ignore patterns
    if (shouldIgnore(item.name)) continue;

    const fullPath = path.join(currentPath, item.name);
    const relativePath = path.relative(basePath, fullPath);

    if (item.isDirectory()) {
      structure.directories.push(relativePath);
      await scanDirectory(basePath, fullPath, structure, depth + 1);
    } else {
      structure.files.push(relativePath);
      structure.fileCount++;

      // Check for important files
      if (item.name === 'Dockerfile') {
        structure.hasDockerfile = true;
      }
    }
  }
}

/**
 * Detects programming language and framework from files
 */
function detectTechStack(structure) {
  const files = structure.files;

  // Detect language
  if (files.some(f => f.includes('package.json'))) {
    structure.language = 'JavaScript/Node.js';
    
    // Detect Node.js framework
    if (files.some(f => f.includes('next.config'))) {
      structure.framework = 'Next.js';
    } else if (files.some(f => f.includes('nuxt.config'))) {
      structure.framework = 'Nuxt.js';
    } else if (files.some(f => f.includes('angular.json'))) {
      structure.framework = 'Angular';
    } else if (files.some(f => f.includes('vue.config'))) {
      structure.framework = 'Vue.js';
    } else if (files.some(f => f.match(/\.(jsx|tsx)$/))) {
      structure.framework = 'React';
    } else if (files.some(f => f.includes('server.js') || f.includes('app.js'))) {
      structure.framework = 'Express/Node.js';
    }
    
    structure.dependencies.push('Node.js', 'npm/yarn');
  } else if (files.some(f => f.includes('requirements.txt') || f.includes('Pipfile'))) {
    structure.language = 'Python';
    
    if (files.some(f => f.includes('manage.py'))) {
      structure.framework = 'Django';
    } else if (files.some(f => f.includes('app.py') || f.includes('wsgi.py'))) {
      structure.framework = 'Flask';
    } else if (files.some(f => f.includes('main.py'))) {
      structure.framework = 'FastAPI';
    }
    
    structure.dependencies.push('pip', 'Python 3.x');
  } else if (files.some(f => f.includes('go.mod'))) {
    structure.language = 'Go';
    structure.framework = 'Go';
    structure.dependencies.push('Go modules');
  } else if (files.some(f => f.includes('Cargo.toml'))) {
    structure.language = 'Rust';
    structure.framework = 'Rust';
    structure.dependencies.push('Cargo');
  } else if (files.some(f => f.includes('pom.xml') || f.includes('build.gradle'))) {
    structure.language = 'Java';
    structure.framework = 'Spring/Java';
    structure.dependencies.push('Maven/Gradle');
  } else if (files.some(f => f.includes('composer.json'))) {
    structure.language = 'PHP';
    structure.framework = 'PHP';
    structure.dependencies.push('Composer');
  } else if (files.some(f => f.includes('Gemfile'))) {
    structure.language = 'Ruby';
    structure.framework = 'Ruby on Rails';
    structure.dependencies.push('Bundler');
  }
}

/**
 * Determines if a file/directory should be ignored
 */
function shouldIgnore(name) {
  const ignorePatterns = [
    'node_modules',
    '.git',
    '.next',
    '.nuxt',
    'dist',
    'build',
    '__pycache__',
    '.pytest_cache',
    'venv',
    'env',
    '.env',
    'target',
    '.idea',
    '.vscode',
    'coverage'
  ];

  return ignorePatterns.some(pattern => name.includes(pattern));
}

/**
 * Cleans up temporary repository directory
 */
async function cleanupRepository(repoPath) {
  try {
    await fs.rm(repoPath, { recursive: true, force: true });
    console.log(`Cleaned up temporary directory: ${repoPath}`);
  } catch (error) {
    console.error(`Failed to cleanup ${repoPath}:`, error.message);
  }
}

/**
 * Validates GitHub URL
 */
function validateGitHubUrl(url) {
  const githubPattern = /^https?:\/\/(www\.)?github\.com\/[\w-]+\/[\w.-]+(?:\.git)?\/?$/i;
  return githubPattern.test(url);
}

module.exports = {
  cloneRepository,
  analyzeStructure,
  cleanupRepository,
  validateGitHubUrl,
  normalizeRepoUrl
};
