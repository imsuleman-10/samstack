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
    role: "Founder & Lead Engineer",
    jobTitle: "Founder & Lead Software Engineer",
    bio: "Suleman is the founder and lead engineer behind SAMStack Tech, specializing in high-performance cloud architectures, full-stack engineering, and building enterprise-grade web applications that scale.",
    longBio: "Suleman Zaheer is a Computer Science student at the University of Engineering and Technology (UET), Lahore — one of Pakistan's most prestigious engineering universities — and the founder of SAMStack Tech. With deep expertise in Next.js App Router architecture, Firebase, Node.js, TypeScript, and AI-powered systems, Suleman has led the development of multiple production-grade platforms for clients across industries. Originally from Lahore, he built SAMStack Tech with a clear mission: to bridge the gap between cutting-edge technology and practical, scalable software systems, and to mentor the next generation of Pakistani engineers through SAMStack's internship programme.",
    avatarUrl: "/images/image.png",
    skills: ["Next.js", "React", "Node.js", "TypeScript", "Firebase", "Cloud Architecture", "UI/UX Design", "DevOps", "Agentic AI", "System Design", "PostgreSQL", "Docker"],
    specializations: ["Full-Stack Engineering", "Cloud Architecture", "AI Agent Systems", "Enterprise SaaS", "DevOps & CI/CD"],
    education: {
      institution: "University of Engineering and Technology (UET), Lahore",
      degree: "Bachelor of Science",
      field: "Computer Science",
    },
    hometown: "Lahore, Punjab, Pakistan",
    location: "Lahore, Punjab, Pakistan",
    socialLinks: {
      github: "https://github.com/imsuleman-10",
      linkedin: "https://www.linkedin.com/in/suleman-zaheer-mughal",
      website: "https://suleman-zaheer.vercel.app",
    },
    featuredProjects: [
      {
        title: "SAMStack Tech Platform",
        description: "A full-scale enterprise software agency website with an internship programme, certificate verification system, blog engine, and service portfolio — built entirely on Next.js 15 App Router.",
        techStack: ["Next.js 15", "TypeScript", "Firebase Firestore", "Tailwind CSS"],
        link: "https://samstack-tech.vercel.app",
      },
      {
        title: "SAMStack Operator Console",
        description: "A highly secure admin dashboard for managing internship applications, generating PDF credentials, and handling client inquiries in real-time.",
        techStack: ["Next.js", "Firebase", "pdf-lib", "Nodemailer"],
      },
      {
        title: "SamToolbox",
        description: "A versatile suite of developer tools and utilities engineered to streamline common programming tasks and improve daily workflow efficiency.",
        techStack: ["TypeScript", "Next.js", "Tailwind CSS"],
        link: "https://github.com/imsuleman-10/SamToolbox",
      },
      {
        title: "SAM Clinic",
        description: "A comprehensive digital healthcare management platform facilitating patient record handling, appointment scheduling, and clinic operations.",
        techStack: ["React", "Node.js", "PostgreSQL"],
        link: "https://github.com/imsuleman-10/SAM-AI-Clinic",
      },
      {
        title: "SAM College",
        description: "An integrated educational management system designed for academic institutions to manage student enrollment, attendance, and grading securely.",
        techStack: ["PHP", "MySQL", "HTML/CSS"],
        link: "https://github.com/imsuleman-10/sam_college",
      },
    ],
    seoKeywords: [
      "Suleman Zaheer",
      "Suleman Zaheer Mughal",
      "Suleman Zaheer software engineer",
      "Suleman Zaheer developer",
      "Suleman Zaheer Pakistan",
      "Suleman Zaheer Lahore",
      "Suleman Zaheer UET Lahore",
      "Suleman Zaheer UET",
      "Suleman Zaheer SAMStack",
      "Suleman Zaheer SAMStack Tech",
      "Suleman SAMStack founder",
      "SAMStack Tech founder",
      "imsuleman-10 GitHub",
      "imsuleman-10",
      "Suleman Zaheer Next.js developer",
      "Suleman Zaheer full stack engineer",
      "Suleman Zaheer Firebase",
      "Suleman Zaheer TypeScript",
      "Suleman Zaheer AI developer",
      "Pakistani software developer",
      "Next.js developer Pakistan",
      "full stack engineer Lahore",
      "software engineer UET Lahore",
      "internship programme Pakistan software",
    ],
  },
  {
    id: "saqib-javed",
    name: "Saqib Javed",
    givenName: "Saqib",
    familyName: "Javed",
    role: "Frontend Engineer",
    jobTitle: "Frontend Engineer & UI Specialist",
    bio: "Saqib is a Software Engineering student at UCP and SAMStack Tech's frontend engineer, crafting pixel-perfect, high-performance user interfaces with React and modern CSS architectures.",
    longBio: "Saqib Javed is a Software Engineering student at the University of Central Punjab (UCP), Lahore, and a frontend engineer at SAMStack Tech. Originally from Narowal, Punjab, Saqib brings meticulous attention to detail and deep expertise in React component architecture, Tailwind CSS design systems, and modern animation libraries. He is responsible for crafting the client-facing interfaces that define the look, feel, and experience of every product SAMStack delivers — translating complex requirements into intuitive, elegant, and performant user interfaces.",
    avatarUrl: "/saqib-javed-software-engineer-samstack-tech.jpg",
    skills: ["React", "Next.js", "TypeScript", "CSS", "Tailwind CSS", "Figma", "UI/UX Design", "Framer Motion", "JavaScript", "HTML5"],
    specializations: ["Frontend Engineering", "UI/UX Design", "Design Systems", "Component Architecture", "Responsive Interfaces"],
    education: {
      institution: "University of Central Punjab (UCP), Lahore",
      degree: "Bachelor of Science",
      field: "Software Engineering",
    },
    hometown: "Narowal, Punjab, Pakistan",
    location: "Lahore, Punjab, Pakistan",
    socialLinks: {
      github: "https://github.com/",
      linkedin: "https://linkedin.com/",
    },
    featuredProjects: [
      {
        title: "SAMStack Tech UI Design System",
        description: "Architected and implemented the entire dark-luxury design system used across all SAMStack Tech digital products, featuring glassmorphism aesthetics, custom CSS variables, and micro-animations.",
        techStack: ["React", "TypeScript", "Tailwind CSS", "Framer Motion"],
        link: "https://samstack-tech.vercel.app",
      },
    ],
    seoKeywords: [
      "Saqib Javed",
      "Saqib Javed developer",
      "Saqib Javed frontend engineer",
      "Saqib Javed frontend developer",
      "Saqib Javed Pakistan",
      "Saqib Javed Lahore",
      "Saqib Javed SAMStack",
      "Saqib Javed SAMStack Tech",
      "Saqib Javed UCP",
      "Saqib Javed University of Central Punjab",
      "Saqib Javed React developer",
      "Saqib Javed UI developer",
      "Saqib Javed Narowal",
      "frontend developer Lahore",
      "React developer Pakistan",
      "UI developer Lahore Pakistan",
      "UI specialist Pakistan",
      "Tailwind CSS developer Pakistan",
      "frontend engineer SAMStack",
    ],
  },
  {
    id: "syed-abdullah",
    name: "Syed Abdullah",
    givenName: "Syed",
    familyName: "Abdullah",
    role: "Backend Engineer",
    jobTitle: "Backend Engineer & Database Architect",
    bio: "Syed Abdullah is a CS student at UET and SAMStack Tech's backend lead, designing the robust API layers and database architectures that power enterprise-grade applications.",
    longBio: "Syed Abdullah is a Computer Science student at the University of Engineering and Technology (UET), Lahore, and the backend engineering lead at SAMStack Tech. Originally from Sialkot, Punjab, Syed is responsible for designing and implementing the server-side logic, database schemas, and API layers that power SAMStack's enterprise-grade applications. His expertise spans RESTful API design, database optimization, cloud functions, and system reliability engineering — forming the invisible, high-performance backbone behind every client-facing product SAMStack delivers.",
    avatarUrl: "/syed-abdullah-software-engineer-samstack-tech.png",
    skills: ["Node.js", "Express.js", "Firebase", "PostgreSQL", "MongoDB", "REST APIs", "TypeScript", "Cloud Functions", "SQL", "System Design", "GraphQL"],
    specializations: ["Backend Engineering", "Database Architecture", "API Design", "Cloud Infrastructure", "System Reliability"],
    education: {
      institution: "University of Engineering and Technology (UET), Lahore",
      degree: "Bachelor of Science",
      field: "Computer Science",
    },
    hometown: "Sialkot, Punjab, Pakistan",
    location: "Lahore, Punjab, Pakistan",
    socialLinks: {
      github: "https://github.com/",
      linkedin: "https://linkedin.com/",
    },
    featuredProjects: [
      {
        title: "SAMStack Internship API",
        description: "Designed and built the complete backend API infrastructure for SAMStack's internship management system — including application processing, certificate generation pipelines, and real-time data sync.",
        techStack: ["Next.js API Routes", "Firebase Firestore", "Nodemailer", "pdf-lib"],
        link: "https://samstack-tech.vercel.app",
      },
    ],
    seoKeywords: [
      "Syed Abdullah",
      "Syed Abdullah developer",
      "Syed Abdullah backend engineer",
      "Syed Abdullah backend developer",
      "Syed Abdullah Pakistan",
      "Syed Abdullah Lahore",
      "Syed Abdullah SAMStack",
      "Syed Abdullah SAMStack Tech",
      "Syed Abdullah UET",
      "Syed Abdullah UET Lahore",
      "Syed Abdullah Sialkot",
      "Syed Abdullah Node.js developer",
      "Syed Abdullah API developer",
      "Syed Abdullah database engineer",
      "backend developer Lahore",
      "Node.js developer Pakistan",
      "API developer Lahore Pakistan",
      "database engineer Pakistan",
      "backend engineer SAMStack",
      "Firebase backend developer Pakistan",
    ],
  },
];

