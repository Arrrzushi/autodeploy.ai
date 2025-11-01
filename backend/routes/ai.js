const express = require('express');
const router = express.Router();
const { prisma } = require('../prisma/client');
const crypto = require('crypto');
const githubService = require('../services/github');
const openaiService = require('../services/openai');

const hasDB = !!process.env.DATABASE_URL;

/**
 * POST /api/analyze-repo
 * Analyzes a GitHub repository and generates insights
 */
router.post('/analyze-repo', async (req, res) => {
  let repoPath = null;

  try {
    const { repoUrl, models } = req.body;

    if (!repoUrl) {
      return res.status(400).json({ error: 'Repository URL is required' });
    }

    // Validate GitHub URL
    if (!githubService.validateGitHubUrl(repoUrl)) {
      return res.status(400).json({ error: 'Invalid GitHub URL format' });
    }

    console.log(`Analyzing repository: ${repoUrl}`);

    // Clone repository
    repoPath = await githubService.cloneRepository(repoUrl);

    // Analyze structure
    const structure = await githubService.analyzeStructure(repoPath);

    // Get AI analysis (single or multi-model)
    let analysis = null;
    if (Array.isArray(models) && models.length > 0) {
      const results = await openaiService.analyzeRepositoryMulti(structure, models);
      analysis = { multi: results };
    } else {
      analysis = await openaiService.analyzeRepository(structure);
    }

    // Combine results
    const result = {
      repoUrl,
      structure,
      analysis,
      timestamp: new Date()
    };

    res.json(result);

    // Cleanup in background
    if (repoPath) {
      githubService.cleanupRepository(repoPath).catch(console.error);
    }
  } catch (error) {
    console.error('Error analyzing repository:', error);
    
    // Cleanup on error
    if (repoPath) {
      githubService.cleanupRepository(repoPath).catch(console.error);
    }

    res.status(500).json({ 
      error: 'Failed to analyze repository',
      details: error.message 
    });
  }
});

/**
 * POST /api/generate-dockerfile
 * Generates an optimized Dockerfile based on analysis
 */
router.post('/generate-dockerfile', async (req, res) => {
  try {
    const { analysis, structure, repoUrl, models } = req.body;

    if (!analysis || !structure) {
      return res.status(400).json({ 
        error: 'Analysis and structure data are required' 
      });
    }

    console.log(`Generating Dockerfile for ${analysis.language}`);

    // Generate Dockerfile using AI (single or multi-model)
    let dockerfile = null;
    let compare = null;
    if (Array.isArray(models) && models.length > 0) {
      compare = await openaiService.generateDockerfileMulti(analysis, structure, models);
      // Choose first successful as primary output
      const firstOk = compare.find(r => r.ok && r.dockerfile);
      dockerfile = firstOk?.dockerfile || '';
    } else {
      dockerfile = await openaiService.generateDockerfile(analysis, structure);
    }

    // Save project to database if available
    let project = { id: `local-${crypto.randomUUID()}` };
    if (hasDB) {
      project = await prisma.project.create({
        data: {
          id: crypto.randomUUID(),
          repoUrl: repoUrl || 'unknown',
          analysis: analysis,
          dockerfile: dockerfile
        }
      });
    }

    res.json({
      projectId: project.id,
      dockerfile,
      compare,
      timestamp: new Date()
    });
  } catch (error) {
    console.error('Error generating Dockerfile:', error);
    res.status(500).json({ 
      error: 'Failed to generate Dockerfile',
      details: error.message 
    });
  }
});

/**
 * POST /api/chat
 * Generic chat endpoint for a selected model
 */
router.post('/chat', async (req, res) => {
  try {
    const { model, messages } = req.body || {};
    if (!Array.isArray(messages) || messages.length === 0) {
      return res.status(400).json({ error: 'messages[] is required' });
    }

    const reply = await openaiService.chat(model, messages);
    res.json({ model: model || process.env.AI_MODEL, reply });
  } catch (error) {
    console.error('Error in chat endpoint:', error);
    res.status(500).json({ 
      error: 'Chat failed',
      details: error.message 
    });
  }
});

/**
 * GET /api/projects/:id
 * Retrieves a specific project
 */
router.get('/projects/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const project = await prisma.project.findUnique({
      where: { id },
      include: {
        deployments: {
          orderBy: { createdAt: 'desc' }
        }
      }
    });

    if (!project) {
      return res.status(404).json({ error: 'Project not found' });
    }

    res.json(project);
  } catch (error) {
    console.error('Error fetching project:', error);
    res.status(500).json({ 
      error: 'Failed to fetch project',
      details: error.message 
    });
  }
});

/**
 * GET /api/projects
 * Lists all projects
 */
router.get('/projects', async (req, res) => {
  try {
    const projects = await prisma.project.findMany({
      orderBy: { createdAt: 'desc' },
      take: 50,
      include: {
        deployments: {
          orderBy: { createdAt: 'desc' },
          take: 1
        }
      }
    });

    res.json(projects);
  } catch (error) {
    console.error('Error fetching projects:', error);
    res.status(500).json({ 
      error: 'Failed to fetch projects',
      details: error.message 
    });
  }
});

module.exports = router;


