export interface TaskStep {
  title: string;
  detail: string;
}

export interface Task {
  id: string;
  title: string;
  scope: string;
  criteria: string;
  difficulty?: 'Beginner' | 'Intermediate' | 'Advanced';
  estimatedTime?: string;
  skills?: string[];
  steps?: TaskStep[];
  deliverables?: string[];
  tips?: string[];
}

export interface DetailedTask extends Task {
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  estimatedTime: string;
  skills: string[];
  steps: TaskStep[];
  deliverables: string[];
  tips: string[];
}

export interface TrackInfo {
  id: 'PYTHON' | 'UI_UX' | 'CPP' | 'WEB_DEV' | 'REACT' | 'NEXT_JS' | 'MERN';
  title: string;
  desc: string;
  tasks: Task[];
}

export const tracks: Record<string, TrackInfo> = {
  PYTHON: {
    id: 'PYTHON',
    title: 'Python Development & Engineering',
    desc: 'Intermediate Python engineering focusing on CLI automation, data processing, REST API integration, and object-oriented architecture.',
    tasks: [
      {
        id: 'PY-01',
        title: 'Data Cleaning & Automated CSV Analyzer CLI',
        scope: 'Build an interactive command-line application that reads real-world CSV datasets, cleans missing or malformed records, and computes summary statistics.',
        criteria: 'Use argparse or interactive prompts, handle file I/O exceptions gracefully, output summary metrics to console, and export a cleaned JSON/CSV report.'
      },
      {
        id: 'PY-02',
        title: 'Interactive Financial Expense Tracker & Visualizer',
        scope: 'Develop a personal finance and expense manager that tracks income, categories, dates, and expenditures with persistent local storage.',
        criteria: 'Use JSON or SQLite for data persistence, implement category-wise budget thresholds, search/filter by date ranges, and display formatted spending breakdowns.'
      },
      {
        id: 'PY-03',
        title: 'Automated Web Scraper & Intelligence Extractor',
        scope: 'Build a robust web scraper using requests and BeautifulSoup to extract structured product, article, or market data from a public website.',
        criteria: 'Implement pagination traversal, custom user-agent headers, robust error handling, rate limiting (polite scraping), and export structured records to Excel/CSV.'
      },
      {
        id: 'PY-04',
        title: 'REST API Client & Weather Analytics Service',
        scope: 'Connect to a public REST API (e.g. OpenWeather or GitHub API) to build a multi-city weather or repository analytics intelligence tool.',
        criteria: 'Support CLI query flags, implement response caching to prevent rate-limit throttling, handle HTTP status codes (404, 429, 500), and format output in tables.'
      },
      {
        id: 'PY-05',
        title: 'Object-Oriented Enterprise Inventory & Billing System',
        scope: 'Design a comprehensive OOP-based inventory and billing engine with modular classes for Products, Inventory, Customers, and Orders.',
        criteria: 'Demonstrate inheritance, encapsulation, transaction logging, invoice generation, and automated unit test cases using unittest or pytest.'
      }
    ]
  },
  UI_UX: {
    id: 'UI_UX',
    title: 'UI/UX Product Design & Prototyping',
    desc: 'Professional UI/UX workflows including atomic design systems, user journeys, high-fidelity app interfaces, and interactive prototyping.',
    tasks: [
      {
        id: 'UI-01',
        title: 'Atomic Design System & Component Library in Figma',
        scope: 'Create a comprehensive design system in Figma incorporating color tokens, typography scales, spacing grids, and elevation shadows.',
        criteria: 'Include atomic UI components (Buttons, Inputs, Badges, Cards, Modals) with Auto-Layout, variant states (Default, Hover, Active, Disabled), and responsive constraints.'
      },
      {
        id: 'UI-02',
        title: 'User Journey Flow & Low-Fidelity SaaS Wireframes',
        scope: 'Map out end-to-end user flows and low-fidelity wireframes for a modern SaaS web app or mobile booking platform.',
        criteria: 'Design at least 4 wireframe screens (Onboarding, Authentication, Main Feed/Dashboard, Detail & Checkout) with clear visual hierarchy and UX annotations.'
      },
      {
        id: 'UI-03',
        title: 'High-Fidelity Mobile App UI with Glassmorphism & Micro-Styling',
        scope: 'Transform wireframes into modern, high-fidelity mobile UI screens following iOS Human Interface or Google Material 3 guidelines.',
        criteria: 'Use curated color harmonies, custom SVG icons, accessible contrast ratios (WCAG AA), responsive cards, and realistic content data (no Lorem Ipsum).'
      },
      {
        id: 'UI-04',
        title: 'Advanced Interactive Prototyping & Smart Animate Transitions',
        scope: 'Build a fully interactive, clickable prototype in Figma showcasing seamless user journeys.',
        criteria: 'Utilize Smart Animate for screen transitions, interactive dropdowns, sticky headers, slide-over sheets, and stateful hover/press interactions.'
      },
      {
        id: 'UI-05',
        title: 'Usability Testing Plan & Comprehensive Design Portfolio Case Study',
        scope: 'Conduct usability evaluation with heuristic guidelines and assemble a presentation case study deck.',
        criteria: 'Document problem statement, user personas, wireframe iterations, final high-fidelity showcase, and design rationale ready for Behance or portfolio presentation.'
      }
    ]
  },
  CPP: {
    id: 'CPP',
    title: 'C++ Systems & Software Engineering',
    desc: 'Core software engineering concepts with C++ including memory management, pointers, OOP, file serialization, and polymorphic architecture.',
    tasks: [
      {
        id: 'CP-01',
        title: 'Robust Student Records & Grade Evaluation CLI',
        scope: 'Develop a robust console application managing student records, grade calculations, and GPA distribution.',
        criteria: 'Utilize structured records (struct/enum), input validation to prevent buffer overflows, dynamic grading scales, and tabular console formatting.'
      },
      {
        id: 'CP-02',
        title: 'Banking & Multi-Account Transaction Management System',
        scope: 'Build an object-oriented banking simulation handling multiple account types (Savings, Checking, Business).',
        criteria: 'Implement inheritance, encapsulation with private balances, interest calculation, transaction history logging, and exception handling for overdrafts.'
      },
      {
        id: 'CP-03',
        title: 'Custom Dynamic Array (Vector) & Linked List from Scratch',
        scope: 'Implement custom container classes (e.g., dynamic resizing array or doubly linked list) without relying on STL containers.',
        criteria: 'Manage dynamic memory manually with new and delete, implement copy constructors, destructors (Rule of Three), and pointer manipulation with zero memory leaks.'
      },
      {
        id: 'CP-04',
        title: 'File-Based Database & Persistent Serialization Engine',
        scope: 'Create a persistent file storage engine for an inventory or employee catalog using C++ fstream.',
        criteria: 'Read/write binary or structured data, implement fast record lookup by ID, update existing records in-place, and handle corrupted file scenarios gracefully.'
      },
      {
        id: 'CP-05',
        title: 'Polymorphic Game Simulation & Design Pattern Engine',
        scope: 'Build a turn-based strategy or RPG battle engine showcasing polymorphism and abstract classes.',
        criteria: 'Define an abstract Character base class with pure virtual functions, derived classes (Warrior, Mage, Archer), dynamic dispatch, and combat event logs.'
      }
    ]
  },
  WEB_DEV: {
    id: 'WEB_DEV',
    title: 'Modern Web Development (HTML5 / CSS3 / JavaScript)',
    desc: 'Building modern responsive web interfaces with semantic HTML5, advanced CSS layouts (Grid/Flexbox), and vanilla JavaScript DOM architecture.',
    tasks: [
      {
        id: 'WD-01',
        title: 'Modern Responsive SaaS Landing Page with Semantic HTML5 & CSS',
        scope: 'Build a high-converting, responsive landing page for a modern tech product using pure HTML5 and modern CSS (Flexbox & CSS Grid).',
        criteria: 'Include sticky responsive navigation with mobile hamburger toggle, hero section with gradient accents, feature comparison grid, testimonial cards, and footer.'
      },
      {
        id: 'WD-02',
        title: 'Dynamic Habit & Task Tracker with Vanilla JS DOM Manipulation',
        scope: 'Create a productivity task and habit manager with local persistence and dynamic DOM rendering.',
        criteria: 'Support CRUD operations (add, edit, mark complete, delete), category filtering, search, and state synchronization with localStorage.'
      },
      {
        id: 'WD-03',
        title: 'Multi-Step Form with Comprehensive Regex Validation & Dark Mode',
        scope: 'Build an interactive multi-step registration wizard with progressive validation and instant visual feedback.',
        criteria: 'Implement custom regex validation for email, phone, and strong passwords, progress bar indicators, step navigation, and smooth dark/light theme switching.'
      },
      {
        id: 'WD-04',
        title: 'API-Driven Movie & Media Explorer with Debounced Search',
        scope: 'Develop a responsive web application consuming a public REST API (e.g., TMDB, OMDB, or Unsplash) using Fetch API and async/await.',
        criteria: 'Implement debounced search input, category filtering pills, loading skeletons, modal dialogs for item details, and error notification banners.'
      },
      {
        id: 'WD-05',
        title: 'Interactive Drag-and-Drop Kanban Board',
        scope: 'Build a modular Kanban project board with draggable cards across workflow columns (To Do, In Progress, Review, Done).',
        criteria: 'Use HTML5 Drag and Drop API or mouse event handlers, support task priority tagging, card creation modals, and state persistence in localStorage.'
      }
    ]
  },
  REACT: {
    id: 'REACT',
    title: 'React.js Frontend Development',
    desc: 'Advanced React development including component composition, custom hooks, Context API state management, and API-driven application architecture.',
    tasks: [
      {
        id: 'RE-01',
        title: 'Component-Driven Interactive Task & Project Board',
        scope: 'Build a modular task management board featuring reusable atomic components and clean props architecture.',
        criteria: 'Decompose UI into reusable components (TaskCard, Badge, Column), implement custom hooks for state, and support tag filtering.'
      },
      {
        id: 'RE-02',
        title: 'E-Commerce Catalog & Shopping Cart with Context API',
        scope: 'Build a full-featured e-commerce storefront with product filtering, cart drawer, and order summary.',
        criteria: 'Manage global cart state using React useContext and useReducer, calculate subtotal/taxes/shipping dynamically, and implement persistent cart items.'
      },
      {
        id: 'RE-03',
        title: 'Real-Time Weather & Geolocation Forecast Dashboard',
        scope: 'Develop a weather intelligence dashboard fetching forecast data via OpenWeather API with geolocation detection.',
        criteria: 'Support search with autocomplete, toggle between Celsius and Fahrenheit, display 5-day forecast cards, and handle network errors with retry triggers.'
      },
      {
        id: 'RE-04',
        title: 'Authenticated Note-Taking & Markdown Workspace',
        scope: 'Create a split-screen markdown editor and live preview workspace with tags and search.',
        criteria: 'Implement live Markdown preview rendering, auto-saving drafts to localStorage, search filter by title or tag, and export notes as .md or .txt.'
      },
      {
        id: 'RE-05',
        title: 'Analytics & Metrics Dashboard with Interactive Visualizations',
        scope: 'Construct an executive analytics dashboard displaying key business metrics, performance indicators, and data charts.',
        criteria: 'Integrate charting (e.g., Recharts or Chart.js), date range filtering, responsive stat cards with trend indicators, and export summary to CSV.'
      }
    ]
  },
  NEXT_JS: {
    id: 'NEXT_JS',
    title: 'Next.js App Router & Full-Stack Web Development',
    desc: 'Production-level Next.js applications featuring App Router, Server Components (RSC), Server Actions, Middleware authentication, and Core Web Vitals.',
    tasks: [
      {
        id: 'NX-01',
        title: 'Content Hub & Tech Blog with Next.js App Router',
        scope: 'Build a modern developer blog and documentation portal utilizing Next.js App Router, dynamic routes ([slug]), and nested layouts.',
        criteria: 'Implement dynamic routing, generate dynamic metadata for SEO, render markdown content, and create an automated table of contents.'
      },
      {
        id: 'NX-02',
        title: 'Interactive Product Explorer with Server & Client Components',
        scope: 'Architect an e-commerce or directory browser maximizing the React Server Components (RSC) paradigm.',
        criteria: 'Fetch catalog data on the server with streaming Suspense boundaries, implement client-side interactive search/filters using URL searchParams, and show loading skeletons.'
      },
      {
        id: 'NX-03',
        title: 'Full-Stack Feedback & Booking Portal with Server Actions',
        scope: 'Build a full-stack booking or inquiry system with Next.js Server Actions and schema validation.',
        criteria: 'Execute mutations via Server Actions, perform server-side validation with instant error messages, optimistic UI updates, and toast notifications.'
      },
      {
        id: 'NX-04',
        title: 'Role-Protected User Dashboard with Middleware & Route Handlers',
        scope: 'Implement route protection and API handlers for a multi-role web platform using Next.js Middleware.',
        criteria: 'Protect private routes (/dashboard, /settings), verify session tokens in Next.js middleware, build Next.js API route handlers with proper status codes, and handle redirection flows.'
      },
      {
        id: 'NX-05',
        title: 'Production-Grade Next.js Web App with Caching & Performance Optimization',
        scope: 'Optimize a complete multi-page Next.js web application for maximum Core Web Vitals performance.',
        criteria: 'Leverage next/image with responsive sizes, next/font for zero layout shifts, implement ISR (Incremental Static Regeneration) or dynamic caching tags, and score 90+ on Lighthouse.'
      }
    ]
  },
  MERN: {
    id: 'MERN',
    title: 'MERN Stack Engineering (MongoDB / Express / React / Node.js)',
    desc: 'Full-stack engineering connecting React frontends with Node/Express RESTful APIs, MongoDB Mongoose data models, JWT authentication, and cloud deployment.',
    tasks: [
      {
        id: 'ME-01',
        title: 'Architectural RESTful API with Express, Mongoose & Schema Validation',
        scope: 'Build a production-structured backend API with modular controllers, routes, middleware, and Mongoose schemas.',
        criteria: 'Implement full CRUD operations, schema validation, centralized error-handling middleware, and environment configuration with dotenv.'
      },
      {
        id: 'ME-02',
        title: 'Secure JWT Authentication & Role-Based Access Control (RBAC)',
        scope: 'Create an enterprise authentication system with password hashing, JWT tokens, and role authorization.',
        criteria: 'Use bcrypt for salt-hashing, issue HTTP-only cookie JWTs, build role protection middleware (e.g., Admin vs Intern), and implement password reset token logic.'
      },
      {
        id: 'ME-03',
        title: 'Full-Stack Collaborative Project Workspace',
        scope: 'Connect a React frontend to the Express/MongoDB backend for a team collaboration or issue tracking tool.',
        criteria: 'Implement stateful API integration with Axios/Fetch, handle loading and error states, sync comments or status updates, and support pagination.'
      },
      {
        id: 'ME-04',
        title: 'Cloud Media Upload & Document Processing Pipeline',
        scope: 'Integrate cloud file storage (Cloudinary or AWS S3) with Express using Multer for user avatar and document uploads.',
        criteria: 'Validate file size/MIME types, upload streams to cloud storage, store secure URLs in MongoDB, and display preview and download capabilities in React.'
      },
      {
        id: 'ME-05',
        title: 'Production-Ready Full-Stack Deployment with Security Hardening',
        scope: 'Prepare and deploy the complete MERN stack application with enterprise-grade security and monitoring.',
        criteria: 'Implement Helmet HTTP security headers, CORS origin restrictions, Express rate-limiting, MongoDB indexes for query performance, and deployment configurations.'
      }
    ]
  }
};

export const normalizeTrackKey = (rawKey?: string | null): string => {
  if (!rawKey) return 'WEB_DEV';
  const cleaned = rawKey.trim().toUpperCase().replace(/[\s\-\/]+/g, '_');
  if (tracks[cleaned]) return cleaned;
  if (cleaned.includes('PYTHON')) return 'PYTHON';
  if (cleaned.includes('UI') || cleaned.includes('UX')) return 'UI_UX';
  if (cleaned.includes('CPP') || cleaned.includes('C++')) return 'CPP';
  if (cleaned.includes('NEXT')) return 'NEXT_JS';
  if (cleaned.includes('REACT') || cleaned.includes('FRONTEND')) return 'REACT';
  if (cleaned.includes('MERN') || cleaned.includes('BACKEND')) return 'MERN';
  if (cleaned.includes('WEB')) return 'WEB_DEV';
  return tracks[cleaned] ? cleaned : 'WEB_DEV';
};

export const getTrackTitle = (trackKey: string): string => {
  const norm = normalizeTrackKey(trackKey);
  return tracks[norm]?.title || tracks[trackKey]?.title || trackKey || 'Web Development';
};

export const getTrackDesc = (trackKey: string): string => {
  const norm = normalizeTrackKey(trackKey);
  return tracks[norm]?.desc || tracks[trackKey]?.desc || '';
};

export const getTrackTasks = (trackKey: string): Task[] => {
  const norm = normalizeTrackKey(trackKey);
  return tracks[norm]?.tasks || tracks[trackKey]?.tasks || tracks['WEB_DEV']?.tasks || [];
};

export function getDetailedTask(task: Task, trackKey?: string): DetailedTask {
  const normTrack = normalizeTrackKey(trackKey || (task as any).track_id);
  const isUiUx = normTrack === 'UI_UX' || task.id.startsWith('UI');
  const isPython = normTrack === 'PYTHON' || task.id.startsWith('PY');
  const isCpp = normTrack === 'CPP' || task.id.startsWith('CP');
  const isReact = normTrack === 'REACT' || task.id.startsWith('RE');
  const isNext = normTrack === 'NEXT_JS' || task.id.startsWith('NX');
  const isMern = normTrack === 'MERN' || task.id.startsWith('ME');

  const numMatch = task.id.match(/\d+/);
  const taskNumber = numMatch ? parseInt(numMatch[0], 10) : 1;

  const difficulty: 'Beginner' | 'Intermediate' | 'Advanced' = 
    task.difficulty || (taskNumber <= 2 ? 'Beginner' : taskNumber <= 4 ? 'Intermediate' : 'Advanced');

  const estimatedTime = task.estimatedTime || (taskNumber <= 2 ? '2 - 3 Hours' : taskNumber <= 4 ? '3 - 5 Hours' : '5 - 8 Hours');

  let defaultSkills: string[] = ['Problem Solving', 'Git', 'Clean Architecture'];
  if (isUiUx) defaultSkills = ['Figma', 'UI/UX Design', 'Wireframing', 'Color Theory', 'Prototyping'];
  else if (isPython) defaultSkills = ['Python 3', 'OOP', 'Data Structures', 'File Handling'];
  else if (isCpp) defaultSkills = ['C++', 'Memory Management', 'Pointers', 'OOP', 'Algorithms'];
  else if (isReact) defaultSkills = ['React.js', 'Hooks', 'State Management', 'Components', 'JSX'];
  else if (isNext) defaultSkills = ['Next.js', 'App Router', 'Server Components', 'Routing', 'TypeScript'];
  else if (isMern) defaultSkills = ['MongoDB', 'Express.js', 'React.js', 'Node.js', 'REST APIs'];
  else defaultSkills = ['HTML5', 'CSS3', 'JavaScript', 'Responsive Web Design', 'Flexbox'];

  const skills = task.skills && task.skills.length > 0 ? task.skills : defaultSkills;

  const defaultSteps: TaskStep[] = [
    {
      title: 'Step 1: Environment & Project Setup',
      detail: isUiUx
        ? 'Create a new project file in Figma. Set up your artboards / frames (Mobile: 375px or Desktop: 1440px) and enable the layout grid system.'
        : 'Create a new project directory on your machine. Initialize git with `git init`. Create the required project structure and install any necessary dependencies.'
    },
    {
      title: 'Step 2: Core Feature Implementation',
      detail: `${task.scope} Ensure code/design structure is modular, properly indented, and follows standard industry conventions.`
    },
    {
      title: 'Step 3: Verification & Acceptance Check',
      detail: `${task.criteria} Test thoroughly against edge cases, verify responsive layout, and check for any syntax or console errors.`
    },
    {
      title: 'Step 4: Documentation & Final Deliverable Preparation',
      detail: isUiUx
        ? 'Organize your Figma frames, label layers logically, set up prototype interactions, and set file share permissions to "Anyone with the link can view".'
        : 'Write a comprehensive README.md with project title, features, setup instructions, and screenshots. Commit your code with clean commit messages and push to a public GitHub repository.'
    }
  ];

  const steps = task.steps && task.steps.length > 0 ? task.steps : defaultSteps;

  const defaultDeliverables: string[] = isUiUx
    ? [
        'Public Figma file link (set share permissions to "Anyone with the link can view")',
        'Organized design frames with clear layer naming and component hierarchy',
        'Interactive prototype showcasing the user flow between screens',
        'Brief presentation note explaining color palette and typography choices'
      ]
    : [
        'Public GitHub repository URL containing all source code and assets',
        'Comprehensive README.md with project overview, feature list, and screenshots',
        'Clean, modular code with comments explaining core logic',
        'Optional: Live deployment link (Vercel, Netlify, or GitHub Pages) for bonus points'
      ];

  const deliverables = task.deliverables && task.deliverables.length > 0 ? task.deliverables : defaultDeliverables;

  const defaultTips: string[] = [
    'Always double-check that your GitHub repository or Figma file is publicly accessible so mentors can evaluate it without requesting access.',
    'Include clear screenshots or a GIF demonstration in your README.md to make your submission stand out.',
    'Write clean, readable code and follow naming conventions (camelCase or kebab-case).',
    'Mentor reviews usually evaluate both functionality and code readability/presentation.'
  ];

  const tips = task.tips && task.tips.length > 0 ? task.tips : defaultTips;

  return {
    ...task,
    difficulty,
    estimatedTime,
    skills,
    steps,
    deliverables,
    tips
  };
}

