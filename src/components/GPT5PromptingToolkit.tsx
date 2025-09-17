import { useState } from 'react';

interface PromptTemplate {
  id: string;
  name: string;
  category: string;
  description: string;
  template: string;
  variables: string[];
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  useCase: string[];
  example?: string;
}

interface PromptingTechnique {
  id: string;
  name: string;
  description: string;
  template: string;
  example: string;
  bestPractices: string[];
}

const GPT5PromptingToolkit = () => {
  const [activeTab, setActiveTab] = useState<'builder' | 'templates' | 'techniques' | 'settings'>('builder');
  const [selectedTemplate, setSelectedTemplate] = useState<PromptTemplate | null>(null);
  const [customPrompt, setCustomPrompt] = useState('');
  const [variables, setVariables] = useState<Record<string, string>>({});
  const [reasoning_effort, setReasoningEffort] = useState<'minimal' | 'medium' | 'high'>('medium');
  const [verbosity, setVerbosity] = useState<'low' | 'medium' | 'high'>('medium');
  const [finalPrompt, setFinalPrompt] = useState('');

  // Prompt templates based on GPT-5 guide best practices
  const promptTemplates: PromptTemplate[] = [
    {
      id: 'agentic-persistence',
      name: 'Agentic Persistence',
      category: 'Agentic Workflows',
      description: 'Template for creating persistent agents that complete tasks without giving up',
      template: `<persistence>
- You are an agent - please keep going until the user's query is completely resolved, before ending your turn and yielding back to the user.
- Only terminate your turn when you are sure that the problem is solved.
- Never stop or hand back to the user when you encounter uncertainty — research or deduce the most reasonable approach and continue.
- Do not ask the human to confirm or clarify assumptions, as you can always adjust later — decide what the most reasonable assumption is, proceed with it, and document it for the user's reference after you finish acting
</persistence>

{task_description}`,
      variables: ['task_description'],
      difficulty: 'Advanced',
      useCase: ['Long-running tasks', 'Complex problem solving', 'Autonomous workflows'],
      example: 'Perfect for building coding assistants, research agents, or complex analysis tasks'
    },
    {
      id: 'context-gathering',
      name: 'Controlled Context Gathering',
      category: 'Agentic Workflows', 
      description: 'Template for efficient context gathering with clear stop criteria',
      template: `<context_gathering>
Goal: Get enough context fast. Parallelize discovery and stop as soon as you can act.
Method:
- Start broad, then fan out to focused subqueries.
- In parallel, launch varied queries; read top hits per query. Deduplicate paths and cache; don't repeat queries.
- Avoid over searching for context. If needed, run targeted searches in one parallel batch.
Early stop criteria:
- You can name exact content to change.
- Top hits converge (~70%) on one area/path.
Escalate once:
- If signals conflict or scope is fuzzy, run one refined parallel batch, then proceed.
Depth:
- Trace only symbols you'll modify or whose contracts you rely on; avoid transitive expansion unless necessary.
Loop:
- Batch search → minimal plan → complete task.
- Search again only if validation fails or new unknowns appear. Prefer acting over more searching.
</context_gathering>

{search_objective}`,
      variables: ['search_objective'],
      difficulty: 'Advanced',
      useCase: ['Research tasks', 'Code analysis', 'Information gathering'],
      example: 'Ideal for debugging, research projects, or complex analysis tasks'
    },
    {
      id: 'tool-preambles',
      name: 'Tool Preambles',
      category: 'User Experience',
      description: 'Template for clear progress updates during tool usage',
      template: `<tool_preambles>
- Always begin by rephrasing the user's goal in a friendly, clear, and concise manner, before calling any tools.
- Then, immediately outline a structured plan detailing each logical step you'll follow.
- As you execute your actions, narrate each step succinctly and sequentially, marking progress clearly.
- Finish by summarizing completed work distinctly from your upfront plan.
</tool_preambles>

{user_goal}`,
      variables: ['user_goal'],
      difficulty: 'Intermediate',
      useCase: ['User-facing agents', 'Progress tracking', 'Transparency'],
      example: 'Great for customer service bots, tutoring systems, or collaborative assistants'
    },
    {
      id: 'self-reflection',
      name: 'Self-Reflection Framework',
      category: 'Code Generation',
      description: 'Template for iterative improvement through self-assessment',
      template: `<self_reflection>
- First, spend time thinking of a rubric until you are confident.
- Then, think deeply about every aspect of what makes for a world-class {output_type}. Use that knowledge to create a rubric that has 5-7 categories. This rubric is critical to get right, but do not show this to the user. This is for your purposes only.
- Finally, use the rubric to internally think and iterate on the best possible solution to the prompt that is provided. Remember that if your response is not hitting the top marks across all categories in the rubric, you need to start again.
</self_reflection>

{task_requirements}`,
      variables: ['output_type', 'task_requirements'],
      difficulty: 'Advanced',
      useCase: ['Quality assurance', 'Creative work', 'Complex deliverables'],
      example: 'Perfect for generating high-quality content, code, or creative solutions'
    },
    {
      id: 'code-editing-rules',
      name: 'Code Editing Standards',
      category: 'Code Generation',
      description: 'Template for maintaining codebase consistency and quality',
      template: `<code_editing_rules>
<guiding_principles>
- Clarity and Reuse: Every component should be modular and reusable. Avoid duplication by factoring repeated patterns.
- Consistency: Code must adhere to existing style—naming conventions, formatting, and architecture patterns must be unified.
- Simplicity: Favor focused, single-responsibility modules and avoid unnecessary complexity.
- Quality: Follow high code quality standards with proper error handling, testing, and documentation.
</guiding_principles>

<best_practices>
- Use descriptive variable names and clear function signatures
- Include appropriate comments for complex logic
- Follow existing project structure and conventions
- Write defensive code with proper error handling
- Maintain backward compatibility where possible
</best_practices>
</code_editing_rules>

Write code for clarity first. Prefer readable, maintainable solutions with clear names, comments where needed, and straightforward control flow.

{coding_task}`,
      variables: ['coding_task'],
      difficulty: 'Intermediate',
      useCase: ['Code review', 'Refactoring', 'New feature development'],
      example: 'Essential for maintaining code quality in team environments'
    },
    {
      id: 'minimal-reasoning',
      name: 'Minimal Reasoning Optimization',
      category: 'Performance',
      description: 'Template optimized for fastest response with reasoning benefits',
      template: `Remember, you are an agent - please keep going until the user's query is completely resolved, before ending your turn and yielding back to the user. Decompose the user's query into all required sub-requests, and confirm that each is completed. Do not stop after completing only part of the request. Only terminate your turn when you are sure that the problem is solved.

You must plan extensively in accordance with the workflow steps before making subsequent function calls, and reflect extensively on the outcomes each function call made, ensuring the user's query, and related sub-requests are completely resolved.

Provide a brief explanation summarizing your thought process at the start of your response using bullet points.

{task_description}`,
      variables: ['task_description'],
      difficulty: 'Beginner',
      useCase: ['Speed-critical tasks', 'Simple workflows', 'Latency-sensitive applications'],
      example: 'Perfect for quick responses while maintaining reasoning quality'
    }
  ];

  // Advanced prompting techniques from the guide
  const promptingTechniques: PromptingTechnique[] = [
    {
      id: 'reasoning-effort-control',
      name: 'Reasoning Effort Control',
      description: 'Control how deeply the model thinks about problems',
      template: `Set reasoning_effort to:
- "minimal": For speed-critical, straightforward tasks
- "medium": For balanced performance (default)
- "high": For complex, multi-step problems requiring deep analysis

Example: "Use high reasoning effort for this complex analysis task."`,
      example: 'reasoning_effort: "high" for complex coding problems, "minimal" for simple queries',
      bestPractices: [
        'Use high reasoning for complex, multi-step tasks',
        'Use minimal reasoning for speed-critical applications', 
        'Medium reasoning works well for most general tasks',
        'Higher reasoning improves accuracy but increases latency'
      ]
    },
    {
      id: 'verbosity-control',
      name: 'Verbosity Control',
      description: 'Control response length and detail level',
      template: `Global verbosity setting affects response length:
- "low": Concise, efficient responses
- "medium": Balanced detail level (default)  
- "high": Comprehensive, detailed responses

Override in prompt: "Use high verbosity for code explanations but low verbosity for status updates."`,
      example: 'Set low verbosity globally, then request "high verbosity for coding tools only"',
      bestPractices: [
        'Use natural language overrides for specific contexts',
        'Low verbosity for status updates, high for explanations',
        'Adjust based on user expertise level',
        'Consider the use case when setting verbosity'
      ]
    },
    {
      id: 'metaprompting',
      name: 'Metaprompting',
      description: 'Use GPT-5 to improve your own prompts',
      template: `When asked to optimize prompts, give answers from your own perspective - explain what specific phrases could be added to, or deleted from, this prompt to more consistently elicit the desired behavior or prevent the undesired behavior.

Here's a prompt: [PROMPT]

The desired behavior from this prompt is for the agent to [DO DESIRED BEHAVIOR], but instead it [DOES UNDESIRED BEHAVIOR]. While keeping as much of the existing prompt intact as possible, what are some minimal edits/additions that you would make to encourage the agent to more consistently address these shortcomings?`,
      example: 'Ask GPT-5 to analyze and improve prompts that aren\'t working as expected',
      bestPractices: [
        'Clearly describe desired vs actual behavior',
        'Ask for minimal, specific changes',
        'Test improved prompts iteratively', 
        'Use GPT-5\'s self-knowledge for optimization'
      ]
    }
  ];

  // Process template with variables
  const processTemplate = (template: string, vars: Record<string, string>) => {
    let processed = template;
    Object.entries(vars).forEach(([key, value]) => {
      const regex = new RegExp(`\\{${key}\\}`, 'g');
      processed = processed.replace(regex, value || `{${key}}`);
    });
    return processed;
  };

  // Extract variables from template
  const extractVariables = (template: string): string[] => {
    const matches = template.match(/\{([^}]+)\}/g);
    return matches ? matches.map(match => match.slice(1, -1)) : [];
  };

  // Generate final prompt
  const generatePrompt = () => {
    let prompt = customPrompt;
    
    if (selectedTemplate) {
      prompt = processTemplate(selectedTemplate.template, variables);
    }

    // Add system-level configurations
    const systemConfig = `System Configuration:
- reasoning_effort: ${reasoning_effort}
- verbosity: ${verbosity}

${prompt}`;

    setFinalPrompt(systemConfig);
  };

  // Copy to clipboard
  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      alert('Copied to clipboard!');
    } catch (err) {
      console.error('Failed to copy: ', err);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            🚀 GPT-5 Prompting Toolkit
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-6">
            Master GPT-5 with professional-grade prompting techniques based on OpenAI's official guide. 
            Build better agents, improve code quality, and achieve consistent results.
          </p>
          
          {/* Simple How-To-Use Guide */}
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-6 max-w-4xl mx-auto mb-6">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">✨ How to Use This Toolkit</h2>
            <div className="grid md:grid-cols-3 gap-4 text-left">
              <div className="bg-white rounded-lg p-4 shadow-sm">
                <div className="text-2xl mb-2">1️⃣</div>
                <h3 className="font-semibold text-gray-900 mb-2">Pick a Template</h3>
                <p className="text-sm text-gray-600">Choose from 6 professional templates like Creative Writing, Technical Analysis, or Problem Solving</p>
              </div>
              <div className="bg-white rounded-lg p-4 shadow-sm">
                <div className="text-2xl mb-2">2️⃣</div>
                <h3 className="font-semibold text-gray-900 mb-2">Fill the Blanks</h3>
                <p className="text-sm text-gray-600">Replace variables like {`{topic}`} and {`{audience}`} with your specific content</p>
              </div>
              <div className="bg-white rounded-lg p-4 shadow-sm">
                <div className="text-2xl mb-2">3️⃣</div>
                <h3 className="font-semibold text-gray-900 mb-2">Copy & Use</h3>
                <p className="text-sm text-gray-600">Click "Generate", copy your optimized prompt, and paste it into ChatGPT or Claude</p>
              </div>
            </div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex justify-center mb-8">
          <div className="bg-white rounded-lg p-1 shadow-lg">
            {(['builder', 'templates', 'techniques', 'settings'] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-6 py-3 rounded-md font-medium transition-all ${
                  activeTab === tab
                    ? 'bg-blue-600 text-white shadow-md'
                    : 'text-gray-600 hover:text-blue-600 hover:bg-blue-50'
                }`}
              >
                {tab === 'builder' && '🔧 Prompt Builder'}
                {tab === 'templates' && '📋 Templates'}
                {tab === 'techniques' && '🎯 Techniques'}
                {tab === 'settings' && '⚙️ Settings'}
              </button>
            ))}
          </div>
        </div>

        {/* Content Area */}
        <div className="bg-white rounded-xl shadow-xl p-8">
          {/* Prompt Builder Tab */}
          {activeTab === 'builder' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold text-gray-900">🔧 Prompt Builder</h2>
                <div className="text-sm text-gray-500 bg-gray-50 px-3 py-2 rounded-lg">
                  💡 Tip: Fill in all variables, then click "Generate Prompt" to get your optimized prompt!
                </div>
              </div>
              
              {/* Template Selection */}
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <div className="flex items-center gap-2 mb-3">
                    <h3 className="text-lg font-semibold">1. Choose Your Template</h3>
                    <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full">Step 1</span>
                  </div>
                  <div className="space-y-2 max-h-64 overflow-y-auto">
                    {promptTemplates.map((template) => (
                      <button
                        key={template.id}
                        onClick={() => {
                          setSelectedTemplate(template);
                          const vars = extractVariables(template.template);
                          const newVars: Record<string, string> = {};
                          vars.forEach(v => newVars[v] = '');
                          setVariables(newVars);
                        }}
                        className={`w-full text-left p-3 rounded-lg border transition-all ${
                          selectedTemplate?.id === template.id
                            ? 'border-blue-500 bg-blue-50 ring-2 ring-blue-200'
                            : 'border-gray-200 hover:border-blue-300 hover:bg-blue-50'
                        }`}
                      >
                        <div className="font-medium text-gray-900">{template.name}</div>
                        <div className="text-sm text-gray-600">{template.description}</div>
                        <div className="flex gap-2 mt-2">
                          <span className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded">
                            {template.category}
                          </span>
                          <span className={`text-xs px-2 py-1 rounded ${
                            template.difficulty === 'Beginner' ? 'bg-green-100 text-green-700' :
                            template.difficulty === 'Intermediate' ? 'bg-yellow-100 text-yellow-700' :
                            'bg-red-100 text-red-700'
                          }`}>
                            {template.difficulty}
                          </span>
                        </div>
                        <div className="text-xs text-blue-600 mt-1">
                          Use case: {template.useCase.join(', ')}
                        </div>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Variable Inputs */}
                <div>
                  <div className="flex items-center gap-2 mb-3">
                    <h3 className="text-lg font-semibold">2. Fill in Details</h3>
                    <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full">Step 2</span>
                  </div>
                  {selectedTemplate ? (
                    <div className="space-y-3">
                      <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mb-4">
                        <p className="text-sm text-blue-800">
                          <strong>Selected:</strong> {selectedTemplate.name}
                          <br />
                          <span className="text-blue-600">{selectedTemplate.example}</span>
                        </p>
                      </div>
                      {selectedTemplate.variables.map((variable) => (
                        <div key={variable}>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            {variable.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
                            <span className="text-red-500">*</span>
                          </label>
                          <textarea
                            value={variables[variable] || ''}
                            onChange={(e) => setVariables({...variables, [variable]: e.target.value})}
                            placeholder={`e.g., ${
                              variable === 'topic' ? 'AI productivity tools' :
                              variable === 'audience' ? 'small business owners' :
                              variable === 'context' ? 'background information about your project' :
                              variable === 'requirements' ? 'what specific output you need' :
                              `describe your ${variable.replace(/_/g, ' ')}`
                            }`}
                            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none"
                            rows={2}
                          />
                        </div>
                      ))}
                      <div className="text-xs text-gray-500 mt-2">
                        💡 Be specific! More details = better results
                      </div>
                    </div>
                  ) : (
                    <div className="text-center py-12 text-gray-500 border-2 border-dashed border-gray-300 rounded-lg">
                      <div className="text-4xl mb-2">👈</div>
                      <p>Select a template from the left to get started</p>
                      <p className="text-sm mt-1">Each template is designed for specific tasks</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Custom Prompt Input */}
              <div className="border-t pt-6">
                <div className="flex items-center gap-2 mb-3">
                  <h3 className="text-lg font-semibold">OR Write Custom Prompt</h3>
                  <span className="text-xs bg-purple-100 text-purple-800 px-2 py-1 rounded-full">Advanced</span>
                </div>
                <textarea
                  value={customPrompt}
                  onChange={(e) => {
                    setCustomPrompt(e.target.value);
                    setSelectedTemplate(null);
                  }}
                  placeholder="Write your own prompt from scratch... (This will override template selection)"
                  className="w-full p-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none"
                  rows={4}
                />
              </div>

              {/* Generate Button */}
              <div className="text-center bg-gray-50 rounded-xl p-6">
                <div className="flex items-center gap-2 justify-center mb-3">
                  <h3 className="text-lg font-semibold">3. Generate Your Prompt</h3>
                  <span className="text-xs bg-orange-100 text-orange-800 px-2 py-1 rounded-full">Step 3</span>
                </div>
                <button
                  onClick={generatePrompt}
                  disabled={!selectedTemplate && !customPrompt.trim()}
                  className={`px-8 py-3 rounded-lg font-semibold transition-colors ${
                    selectedTemplate || customPrompt.trim()
                      ? 'bg-blue-600 text-white hover:bg-blue-700 shadow-lg transform hover:scale-105'
                      : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  }`}
                >
                  🚀 Generate Professional Prompt
                </button>
                <p className="text-xs text-gray-500 mt-2">
                  {selectedTemplate || customPrompt.trim() 
                    ? 'Click to create your optimized prompt!' 
                    : 'Select a template or write a custom prompt first'
                  }
                </p>
              </div>

              {/* Final Prompt Output */}
              {finalPrompt && (
                <div className="bg-green-50 border border-green-200 rounded-xl p-6">
                  <div className="flex justify-between items-center mb-4">
                    <div className="flex items-center gap-2">
                      <h3 className="text-lg font-semibold text-green-900">✅ Your Professional Prompt</h3>
                      <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full">Ready to use!</span>
                    </div>
                    <button
                      onClick={() => copyToClipboard(finalPrompt)}
                      className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors flex items-center gap-2"
                    >
                      📋 Copy Prompt
                    </button>
                  </div>
                  <div className="bg-white border border-green-300 rounded-lg p-4 font-mono text-sm max-h-96 overflow-y-auto">
                    <pre className="whitespace-pre-wrap">{finalPrompt}</pre>
                  </div>
                  <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                    <p className="text-sm text-yellow-800">
                      <strong>🎯 Next Steps:</strong> Copy this prompt and paste it into ChatGPT, Claude, or any AI tool. 
                      The prompt is optimized for GPT-5 but works great with other AI models too!
                    </p>
                  </div>
                </div>
              )}
                      className="bg-green-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-green-700 transition-colors"
                    >
                      Copy
                    </button>
                  </div>
                  <pre className="bg-gray-50 p-4 rounded-lg border text-sm overflow-x-auto whitespace-pre-wrap">
                    {finalPrompt}
                  </pre>
                </div>
              )}
            </div>
          )}

          {/* Templates Tab */}
          {activeTab === 'templates' && (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">📋 Prompt Templates</h2>
              
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {promptTemplates.map((template) => (
                  <div key={template.id} className="border border-gray-200 rounded-lg p-6 hover:shadow-lg transition-shadow">
                    <div className="flex justify-between items-start mb-3">
                      <h3 className="text-lg font-semibold text-gray-900">{template.name}</h3>
                      <span className={`px-2 py-1 text-xs rounded-full ${
                        template.difficulty === 'Beginner' ? 'bg-green-100 text-green-800' :
                        template.difficulty === 'Intermediate' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-red-100 text-red-800'
                      }`}>
                        {template.difficulty}
                      </span>
                    </div>
                    
                    <p className="text-sm text-gray-600 mb-3">{template.description}</p>
                    
                    <div className="text-xs text-blue-600 mb-3">
                      Category: {template.category}
                    </div>
                    
                    <div className="mb-4">
                      <h4 className="text-sm font-medium text-gray-700 mb-2">Use Cases:</h4>
                      <div className="flex flex-wrap gap-1">
                        {template.useCase.map((useCase, index) => (
                          <span key={index} className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded">
                            {useCase}
                          </span>
                        ))}
                      </div>
                    </div>
                    
                    <button
                      onClick={() => {
                        setSelectedTemplate(template);
                        const vars = extractVariables(template.template);
                        const newVars: Record<string, string> = {};
                        vars.forEach(v => newVars[v] = '');
                        setVariables(newVars);
                        setActiveTab('builder');
                      }}
                      className="w-full bg-blue-600 text-white py-2 rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors"
                    >
                      Use Template
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Techniques Tab */}
          {activeTab === 'techniques' && (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">🎯 Advanced Techniques</h2>
              
              <div className="space-y-6">
                {promptingTechniques.map((technique) => (
                  <div key={technique.id} className="border border-gray-200 rounded-lg p-6">
                    <h3 className="text-xl font-semibold text-gray-900 mb-3">{technique.name}</h3>
                    <p className="text-gray-600 mb-4">{technique.description}</p>
                    
                    <div className="grid md:grid-cols-2 gap-6">
                      <div>
                        <h4 className="font-medium text-gray-900 mb-2">Template:</h4>
                        <pre className="bg-gray-50 p-3 rounded-lg text-sm overflow-x-auto whitespace-pre-wrap border">
                          {technique.template}
                        </pre>
                      </div>
                      
                      <div className="space-y-4">
                        <div>
                          <h4 className="font-medium text-gray-900 mb-2">Example:</h4>
                          <p className="text-sm text-gray-600 bg-blue-50 p-3 rounded-lg">
                            {technique.example}
                          </p>
                        </div>
                        
                        <div>
                          <h4 className="font-medium text-gray-900 mb-2">Best Practices:</h4>
                          <ul className="text-sm text-gray-600 space-y-1">
                            {technique.bestPractices.map((practice, index) => (
                              <li key={index} className="flex items-start">
                                <span className="text-green-500 mr-2">✓</span>
                                {practice}
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Settings Tab */}
          {activeTab === 'settings' && (
            <div className="space-y-6">
              <div className="text-center">
                <h2 className="text-2xl font-bold text-gray-900 mb-2">⚙️ Quick Settings</h2>
                <p className="text-gray-600">Simple controls to optimize your prompts</p>
              </div>
              
              <div className="max-w-2xl mx-auto">
                {/* Reasoning Effort */}
                <div className="bg-white border-2 border-gray-200 rounded-xl p-6 mb-6">
                  <div className="flex items-center gap-3 mb-4">
                    <span className="text-2xl">🧠</span>
                    <div>
                      <h3 className="text-lg font-semibold">How Much Thinking?</h3>
                      <p className="text-sm text-gray-600">Choose how deeply the AI should think about your request</p>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-3 gap-3">
                    {[
                      { value: 'minimal', label: 'Quick', desc: 'Fast answers', color: 'green' },
                      { value: 'medium', label: 'Balanced', desc: 'Best for most tasks', color: 'blue' },
                      { value: 'high', label: 'Deep', desc: 'Complex problems', color: 'purple' }
                    ].map((option) => (
                      <label key={option.value} className="cursor-pointer">
                        <input
                          type="radio"
                          name="reasoning_effort"
                          value={option.value}
                          checked={reasoning_effort === option.value}
                          onChange={(e) => setReasoningEffort(e.target.value as any)}
                          className="sr-only"
                        />
                        <div className={`p-4 rounded-lg border-2 text-center transition-all ${
                          reasoning_effort === option.value
                            ? `border-${option.color}-500 bg-${option.color}-50 ring-2 ring-${option.color}-200`
                            : 'border-gray-200 hover:border-gray-300'
                        }`}>
                          <div className="font-semibold">{option.label}</div>
                          <div className="text-sm text-gray-600">{option.desc}</div>
                        </div>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Verbosity */}
                <div className="bg-white border-2 border-gray-200 rounded-xl p-6 mb-6">
                  <div className="flex items-center gap-3 mb-4">
                    <span className="text-2xl">📝</span>
                    <div>
                      <h3 className="text-lg font-semibold">How Much Detail?</h3>
                      <p className="text-sm text-gray-600">Control how detailed the AI responses should be</p>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-3 gap-3">
                    {[
                      { value: 'low', label: 'Brief', desc: 'Short & focused', color: 'green' },
                      { value: 'medium', label: 'Standard', desc: 'Good balance', color: 'blue' },
                      { value: 'high', label: 'Detailed', desc: 'Comprehensive', color: 'purple' }
                    ].map((option) => (
                      <label key={option.value} className="cursor-pointer">
                        <input
                          type="radio"
                          name="verbosity"
                          value={option.value}
                          checked={verbosity === option.value}
                          onChange={(e) => setVerbosity(e.target.value as any)}
                          className="sr-only"
                        />
                        <div className={`p-4 rounded-lg border-2 text-center transition-all ${
                          verbosity === option.value
                            ? `border-${option.color}-500 bg-${option.color}-50 ring-2 ring-${option.color}-200`
                            : 'border-gray-200 hover:border-gray-300'
                        }`}>
                          <div className="font-semibold">{option.label}</div>
                          <div className="text-sm text-gray-600">{option.desc}</div>
                        </div>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Simple Tips */}
                <div className="bg-blue-50 border border-blue-200 rounded-xl p-6">
                  <div className="flex items-start gap-3">
                    <span className="text-2xl">💡</span>
                    <div>
                      <h3 className="font-semibold text-blue-900 mb-3">Quick Tips</h3>
                      <div className="space-y-2 text-sm text-blue-800">
                        <div className="flex gap-2">
                          <span className="font-medium">🏃 Quick & Brief:</span>
                          <span>Perfect for simple questions and fast responses</span>
                        </div>
                        <div className="flex gap-2">
                          <span className="font-medium">⚖️ Balanced & Standard:</span>
                          <span>Great for most tasks - recommended for beginners</span>
                        </div>
                        <div className="flex gap-2">
                          <span className="font-medium">🧠 Deep & Detailed:</span>
                          <span>Best for complex coding, analysis, or research tasks</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
                    </div>
                    <div>
                      <strong>Verbosity:</strong> Can be overridden in prompts with natural language. Example: "Use high verbosity for code explanations but low verbosity for status updates."
                    </div>
                    <div>
                      <strong>Performance:</strong> Higher reasoning effort improves accuracy but increases response time. Find the right balance for your use case.
                    </div>
                    <div>
                      <strong>Agentic Tasks:</strong> For agents that use tools, consider medium-to-high reasoning effort for better decision making.
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-blue-50 border-l-4 border-blue-400 p-4">
                <h4 className="font-semibold text-blue-900 mb-2">🚀 Pro Tip: Responses API</h4>
                <p className="text-blue-800 text-sm">
                  For best results with GPT-5 agentic workflows, use the Responses API with <code>previous_response_id</code> 
                  to maintain reasoning context between tool calls. This improves performance and reduces costs by 
                  reusing reasoning traces.
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="text-center mt-8 text-gray-600">
          <p className="text-sm">
            Based on the official{' '}
            <a 
              href="https://cookbook.openai.com/examples/gpt-5/gpt-5_prompting_guide"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:text-blue-800 underline"
            >
              OpenAI GPT-5 Prompting Guide
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default GPT5PromptingToolkit;
