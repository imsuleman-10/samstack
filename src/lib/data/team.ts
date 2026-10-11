export interface TeamMember {
  id: string;
  name: string;
  givenName: string;
  familyName: string;
  role: string;
  jobTitle: string;
  bio: string;
  longBio: string;
  avatarUrl: string;
  skills: string[];
  specializations: string[];
  education: {
    institution: string;
    degree: string;
    field: string;
  };
  hometown: string;
  location: string;
  socialLinks: {
    linkedin?: string;
    github?: string;
    twitter?: string;
    website?: string;
  };
  featuredProjects?: {
    title: string;
    description: string;
    techStack?: string[];
    link?: string;
  }[];
  seoKeywords: string[];
}

export const teamData: TeamMember[] = [
  {
    id: "suleman-zaheer",
    name: "Suleman Zaheer",
    givenName: "Suleman",
    familyName: "Zaheer",
    role: "Founder & Full-Stack Architect",
    jobTitle: "Founder & Full-Stack Architect",
    bio: "Suleman Zaheer is a Full-Stack Software Engineer and the founder of SAMStack Tech. He specializes in designing modern Next.js applications, scalable APIs, and cloud deployments.",
    longBio: "Suleman Zaheer is a Full-Stack Software Engineer and the founder of SAMStack Tech, headquartered in Lahore, Pakistan. Studying Computer Science at the University of Engineering and Technology (UET) Lahore, Suleman has built high-performance web applications and backend systems for businesses and startups. His core expertise includes the modern React and Next.js ecosystem, TypeScript, Node.js API engineering, database design with PostgreSQL and Firebase, and cloud deployments on Vercel and AWS. As lead engineer, he collaborates directly with founders and teams to deliver production-ready software systems with clean architecture and reliable execution.",
    avatarUrl: "/suleman-zaheer-software-engineer-samstack-tech.jpeg",
    skills: [
      "Next.js & React", "TypeScript", "Node.js & Express", "PostgreSQL & Firebase",
      "REST & GraphQL APIs", "Tailwind CSS", "Docker & CI/CD", "System Architecture",
      "Git & GitHub", "State Management & Performance"
    ],
    specializations: [
      "Full-Stack Web Development", "Next.js Architecture", "API Design & Integration", 
      "Cloud Deployment & DevOps", "Database Architecture"
    ],
    education: {
      institution: "University of Engineering and Technology (UET), Lahore",
      degree: "Bachelor of Science",
      field: "Computer Science",
    },
    hometown: "Lahore, Punjab, Pakistan",
    location: "Lahore, Pakistan (Serving Clients Globally)",
    socialLinks: {
      github: "https://github.com/imsuleman-10",
      linkedin: "https://www.linkedin.com/in/suleman-zaheer-mughal",
      website: "https://suleman-zaheer.vercel.app",
    },
    featuredProjects: [
      {
        title: "SAMStack Platform",
        description: "A secure multi-tenant platform managing real-time data synchronization, automated document generation via cloud functions, and administrative workflows.",
        techStack: ["Next.js", "TypeScript", "Firebase", "Tailwind CSS"],
        link: "https://samstack-tech.vercel.app",
      },
      {
        title: "Clinical Workflow & Triage Portal",
        description: "A healthcare triage web platform designed to streamline patient intake and clinical pathing with responsive UI and secure record management.",
        techStack: ["React", "Node.js", "PostgreSQL", "REST APIs"],
        link: "https://github.com/imsuleman-10/SAM-AI-Clinic",
      },
      {
        title: "Financial Analytics & Portfolio Dashboard",
        description: "A high-performance dashboard displaying real-time financial metrics and analytics with low-latency client updates.",
        techStack: ["Next.js", "TypeScript", "Chart.js", "Tailwind CSS"],
      }
    ],
    seoKeywords: [
      "Suleman Zaheer", "Suleman Zaheer Mughal", "Suleman Zaheer software engineer", 
      "Suleman Zaheer SAMStack Tech", "Suleman Zaheer web developer", "Next.js developer Lahore", 
      "Full Stack developer Pakistan", "imsuleman-10", "Suleman Zaheer UET"
    ],
  },
  {
    id: "saqib-javed",
    name: "Saqib Javed",
    givenName: "Saqib",
    familyName: "Javed",
    role: "Senior Frontend Engineer",
    jobTitle: "Senior Frontend Engineer & UI/UX Specialist",
    bio: "Saqib engineers pixel-perfect, high-performance client interfaces. He specializes in advanced React patterns, Tailwind CSS design systems, and WebGL/Framer micro-animations.",
    longBio: "Saqib Javed is a Senior Frontend Engineer at SAMStack Tech, bringing an unparalleled level of polish, performance, and accessibility to enterprise web applications. Based in Lahore and pursuing Software Engineering at the University of Central Punjab (UCP), Saqib operates at the cutting edge of UI engineering. He is an expert in bridging the gap between high-end Figma designs and strict, performant React code. His deep understanding of the browser rendering pipeline, Core Web Vitals optimization, and state management (Zustand, React Query) ensures that SAMStack's applications not only look stunning but deliver sub-second interactions globally.",
    avatarUrl: "/saqib-javed-software-engineer-samstack-tech.jpg",
    skills: ["React 19", "Next.js", "Advanced Tailwind CSS", "Framer Motion & WebGL", "TypeScript", "Zustand & React Query", "Figma to Code", "Core Web Vitals Optimization", "Accessibility (a11y)"],
    specializations: ["Frontend Architecture", "Design Systems Development", "Performance Optimization", "Micro-animations", "Responsive Enterprise UIs"],
    education: {
      institution: "University of Central Punjab (UCP), Lahore",
      degree: "Bachelor of Science",
      field: "Software Engineering",
    },
    hometown: "Narowal, Punjab, Pakistan",
    location: "Lahore, Pakistan",
    socialLinks: {
      github: "https://github.com/",
      linkedin: "https://linkedin.com/",
    },
    featuredProjects: [
      {
        title: "SAMStack Global Design System",
        description: "Architected a highly reusable, headless UI component library with strict Tailwind design tokens, enabling rapid development of complex SaaS dashboards.",
        techStack: ["React", "TypeScript", "Tailwind CSS", "Storybook", "Framer Motion"],
        link: "https://samstack-tech.vercel.app",
      },
    ],
    seoKeywords: [
      "Saqib Javed", "Saqib Javed frontend engineer", "Senior React Developer Lahore", 
      "Saqib Javed SAMStack Tech", "Tailwind CSS Expert Pakistan", "Framer Motion Developer Pakistan",
      "UI/UX Engineer Lahore", "Hire Frontend Developer Pakistan", "Next.js UI Specialist"
    ],
  },
  {
    id: "syed-abdullah",
    name: "Syed Abdullah",
    givenName: "Syed",
    familyName: "Abdullah",
    role: "Senior Backend Engineer",
    jobTitle: "Senior Backend Engineer & Database Architect",
    bio: "Syed Abdullah is a backend powerhouse specializing in distributed systems, microservices, and database optimization for high-throughput enterprise applications.",
    longBio: "Syed Abdullah is the Senior Backend Engineer at SAMStack Tech and a Computer Science student at UET Lahore. He is the mastermind behind the robust, scalable, and highly secure API layers that power SAMStack's enterprise solutions. Syed's engineering philosophy revolves around ACID compliance, event-driven architectures, and zero-trust security models. He excels in designing complex PostgreSQL schemas, implementing Redis caching layers for sub-millisecond response times, and orchestrating microservices via Docker and Kubernetes. When international clients demand backends that process thousands of transactions per second without dropping a single payload, Syed delivers.",
    avatarUrl: "/syed-abdullah-software-engineer-samstack-tech.webp",
    skills: ["Node.js (NestJS/Express)", "PostgreSQL (Advanced Indexing)", "MongoDB Aggregations", "Redis Caching", "Docker & Kubernetes", "GraphQL & REST API Design", "Microservices Architecture", "OAuth2 & JWT Security"],
    specializations: ["Distributed Systems", "Database Optimization", "High-Throughput APIs", "Cloud Infrastructure", "System Reliability Engineering (SRE)"],
    education: {
      institution: "University of Engineering and Technology (UET), Lahore",
      degree: "Bachelor of Science",
      field: "Computer Science",
    },
    hometown: "Sialkot, Punjab, Pakistan",
    location: "Lahore, Pakistan",
    socialLinks: {
      github: "https://github.com/",
      linkedin: "https://linkedin.com/",
    },
    featuredProjects: [
      {
        title: "Enterprise Event Streaming API",
        description: "Built a high-throughput event ingestion API capable of processing 10k+ requests per second utilizing Node.js worker threads and Kafka.",
        techStack: ["Node.js", "Kafka", "PostgreSQL", "Docker"],
      },
    ],
    seoKeywords: [
      "Syed Abdullah", "Syed Abdullah backend engineer", "Senior Node.js Developer Lahore",
      "Database Architect Pakistan", "Syed Abdullah SAMStack Tech", "Hire Backend Engineer Pakistan",
      "Microservices Developer Pakistan", "PostgreSQL Expert Lahore", "Distributed Systems Engineer Pakistan"
    ],
  },
];
