const OpenAI = require('openai');

// Using third-party AI API (OpenAI-compatible)
const openai = new OpenAI({
  apiKey: process.env.AI_API_KEY,
  baseURL: process.env.AI_BASE_URL || 'https://api.a4f.co/v1',
  defaultHeaders: {
    'Content-Type': 'application/json',
  },
});

/**
 * Analyzes repository structure and provides insights
 */
async function analyzeRepository(structure) {
  try {
    const prompt = `Analyze this repository structure and provide insights:

Repository Structure:
${JSON.stringify(structure, null, 2)}

Please provide:
1. Primary programming language(s)
2. Framework/technology stack detected
3. Key dependencies identified
4. Recommended deployment strategy
5. Estimated resource requirements (CPU/RAM)

Format your response as JSON with keys: language, framework, dependencies, deploymentStrategy, resources`;

    const response = await openai.chat.completions.create({
      model: process.env.AI_MODEL || 'provider-1/qwen2.5-coder-32b-instruct',
      messages: [
        {
          role: 'system',
          content: 'You are an expert DevOps engineer specializing in analyzing codebases and recommending optimal deployment strategies. Provide concise, actionable insights in JSON format.'
        },
        {
          role: 'user',
          content: prompt
        }
      ],
      temperature: 0.7,
      max_tokens: 1000
    });

    const content = response.choices[0].message.content;
    
    // Try to parse JSON response
    try {
      return JSON.parse(content);
    } catch {
      // If not valid JSON, return structured fallback
      return {
        language: structure.language || 'Unknown',
        framework: 'Detected from analysis',
        dependencies: structure.dependencies || [],
        deploymentStrategy: content,
        resources: { cpu: '1 core', memory: '512MB' }
      };
    }
  } catch (error) {
    console.error('OpenAI API Error:', error.message);
    console.error('Error details:', error.response?.data || error);
    throw new Error(`Failed to analyze repository: ${error.message}`);
  }
}

/**
 * Generates optimized Dockerfile based on analysis
 */
async function generateDockerfile(analysis, repoStructure) {
  try {
    const prompt = `Generate a production-ready, optimized Dockerfile for this application:

Language: ${analysis.language}
Framework: ${analysis.framework}
Dependencies: ${JSON.stringify(analysis.dependencies)}
Repository Structure: ${JSON.stringify(repoStructure, null, 2)}

Requirements:
- Use multi-stage builds if applicable
- Optimize for layer caching
- Use official base images
- Set appropriate working directory
- Expose necessary ports
- Use non-root user for security
- Include health checks if applicable
- Optimize image size

Provide ONLY the Dockerfile content without any explanation or markdown formatting.`;

    const response = await openai.chat.completions.create({
      model: process.env.AI_MODEL || 'provider-1/qwen2.5-coder-32b-instruct',
      messages: [
        {
          role: 'system',
          content: 'You are an expert DevOps engineer specializing in containerization and Docker optimization. Generate production-ready Dockerfiles following best practices for security, performance, and size optimization.'
        },
        {
          role: 'user',
          content: prompt
        }
      ],
      temperature: 0.7,
      max_tokens: 1500
    });

    let dockerfile = response.choices[0].message.content.trim();
    
    // Remove markdown code blocks if present
    dockerfile = dockerfile.replace(/```dockerfile\n?/g, '').replace(/```\n?/g, '');
    
    return dockerfile;
  } catch (error) {
    console.error('OpenAI API Error:', error.message);
    console.error('Error details:', error.response?.data || error);
    throw new Error(`Failed to generate Dockerfile: ${error.message}`);
  }
}

/**
 * Generates CI/CD configuration (bonus feature)
 */
async function generateCIConfig(analysis, platform = 'github-actions') {
  try {
    const prompt = `Generate a CI/CD configuration for ${platform} for this application:

Language: ${analysis.language}
Framework: ${analysis.framework}

Include:
- Build steps
- Testing
- Docker image building
- Deployment trigger

Provide ONLY the configuration file content.`;

    const response = await openai.chat.completions.create({
      model: process.env.AI_MODEL || 'provider-1/qwen2.5-coder-32b-instruct',
      messages: [
        {
          role: 'system',
          content: 'You are a DevOps expert. Generate clean, production-ready CI/CD configurations.'
        },
        {
          role: 'user',
          content: prompt
        }
      ],
      temperature: 0.7,
      max_tokens: 1000
    });

    return response.choices[0].message.content.trim();
  } catch (error) {
    console.error('OpenAI API Error:', error.message);
    throw new Error(`Failed to generate CI/CD config: ${error.message}`);
  }
}

module.exports = {
  analyzeRepository,
  generateDockerfile,
  generateCIConfig
};


