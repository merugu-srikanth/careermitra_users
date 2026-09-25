export const SKILLUP_CATEGORIES = [
  "All Categories",
  "Web Development",
  "Full Stack Development",
  "Programming",
  "Data Analytics",
  "Data Science",
  "Artificial Intelligence",
  "Machine Learning",
  "Cloud Computing",
  "Cyber Security",
  "Digital Marketing",
  "Communication Skills",
  "Aptitude & Reasoning",
  "Interview Preparation",
  "Career Skills",
];

export const SKILLUP_LEVELS = ["All Levels", "Beginner", "Intermediate", "Advanced"];

export const SKILLUPS_DATA = [
  {
    id: "skill-python-programming",
    slug: "python-programming",
    title: "Python Programming & Problem Solving",
    category: "Programming",
    level: "Beginner",
    duration: "6 Weeks",
    rating: 4.9,
    learnersCount: "18.4k",
    badge: "Most Popular",
    icon: "🐍",
    description: "Master Python fundamentals, OOPs, data structures, and algorithmic problem-solving to build real-world applications.",
    overview:
      "Python is the world's most versatile and in-demand programming language. This comprehensive SkillUp takes you from the absolute basics of variables and conditionals up through object-oriented design, file handling, libraries, and competitive coding fundamentals. Ideal for aspiring software engineers, data analysts, and automation developers.",
    whatYouWillLearn: [
      "Master core Python syntax, variables, data types, and control flow structures.",
      "Understand Object-Oriented Programming (Classes, Inheritance, Polymorphism, Encapsulation).",
      "Work with built-in data structures: Lists, Dictionaries, Sets, and Tuples.",
      "Handle exceptions gracefully, file I/O operations, and JSON serialization.",
      "Solve 50+ DSA coding problems with optimal time and space complexity.",
      "Automate repetitive tasks and fetch web APIs using requests and BeautifulSoup."
    ],
    skillsCovered: ["Python 3", "Data Structures", "OOP Concepts", "Algorithms", "Debugging", "File Handling", "API Integration"],
    topics: [
      {
        title: "Module 1: Getting Started & Syntax",
        description: "Variables, primitive data types, operators, input/output formatting, and logical conditions."
      },
      {
        title: "Module 2: Collections & Data Structures",
        description: "Deep dive into lists, tuples, dictionaries, sets, list comprehensions, and nested collections."
      },
      {
        title: "Module 3: Functions & Modular Programming",
        description: "Lambda functions, scope, recursion, decorators, generators, and package structuring."
      },
      {
        title: "Module 4: Object-Oriented Architecture",
        description: "Creating classes, constructors, inheritance hierarchies, abstract methods, and encapsulation."
      },
      {
        title: "Module 5: Practical Problem Solving & Projects",
        description: "Real-world file processing, API consumer script, and automated web scraper."
      }
    ],
    practicalActivities: [
      "Building a Command-Line Expense Tracker with Persistent Storage",
      "Automated Weather Forecaster fetching live OpenWeather API data",
      "Web Scraper for Price Tracking with Email Alerts",
      "50+ LeetCode-style algorithm challenges with unit tests"
    ],
    careerRelevance: {
      roles: ["Python Developer", "Software Engineer", "Automation Engineer", "Junior Data Analyst"],
      avgSalary: "₹4.5 LPA - ₹10 LPA",
      industryDemand: "High Demand across IT, FinTech, E-commerce, and EdTech."
    },
    prerequisites: "No prior programming experience required. Basic computer literacy.",
    provider: "CareerMitra Skill Hub & Industry Mentors"
  },
  {
    id: "skill-web-dev-fundamentals",
    slug: "web-development-fundamentals",
    title: "Modern Web Development (HTML, CSS & JS)",
    category: "Web Development",
    level: "Beginner",
    duration: "8 Weeks",
    rating: 4.8,
    learnersCount: "24.1k",
    badge: "Bestseller",
    icon: "🌐",
    description: "Learn modern HTML5, CSS3, Flexbox/Grid, and JavaScript ES6+ to build beautiful, responsive websites from scratch.",
    overview:
      "Kickstart your tech career by building the web. You'll master modern semantic HTML5, fluid layouts with CSS Grid and Flexbox, captivating micro-animations, and dynamic frontend logic using vanilla JavaScript ES6+ and DOM manipulation.",
    whatYouWillLearn: [
      "Construct accessible, SEO-optimized web markup with HTML5 semantic elements.",
      "Design mobile-first responsive layouts using CSS3 Flexbox and CSS Grid.",
      "Master JavaScript essentials: ES6 syntax, array methods, async/await, and Fetch API.",
      "Manipulate DOM nodes dynamically and handle complex user events.",
      "Deploy responsive web projects live on GitHub Pages and Netlify."
    ],
    skillsCovered: ["HTML5", "CSS3", "JavaScript (ES6+)", "Responsive Design", "Flexbox & Grid", "DOM Manipulation", "Git & GitHub"],
    topics: [
      {
        title: "Module 1: Semantic HTML5 & Modern Layouts",
        description: "Semantic elements, forms, audio/video embeds, SEO metadata, and web accessibility standards."
      },
      {
        title: "Module 2: Advanced CSS3 & Responsive Design",
        description: "Flexbox deep dive, CSS Grid layouts, media queries, CSS variables, and keyframe animations."
      },
      {
        title: "Module 3: JavaScript Programming Core",
        description: "Data types, loops, higher-order functions (map, filter, reduce), closures, and scopes."
      },
      {
        title: "Module 4: Dynamic UI & Asynchronous JS",
        description: "Event listeners, DOM tree mutation, Promises, Async/Await, and REST API integration."
      }
    ],
    practicalActivities: [
      "Modern Portfolio Website with Dark Mode Toggle",
      "Interactive Kanban Board with Drag and Drop",
      "Live Crypto & Currency Converter using REST APIs",
      "Interactive Quiz App with LocalStorage scoring"
    ],
    careerRelevance: {
      roles: ["Frontend Developer", "Web Designer", "UI Developer", "Junior Web Engineer"],
      avgSalary: "₹4.0 LPA - ₹9 LPA",
      industryDemand: "Universal demand across every digital company and agency."
    },
    prerequisites: "Basic understanding of computers and web browsers.",
    provider: "CareerMitra Frontend Guild"
  },
  {
    id: "skill-fullstack-mern",
    slug: "full-stack-development-mern",
    title: "Full Stack Development (MERN Stack)",
    category: "Full Stack Development",
    level: "Intermediate",
    duration: "12 Weeks",
    rating: 4.9,
    learnersCount: "15.7k",
    badge: "Career Booster",
    icon: "⚡",
    description: "Build scalable, production-ready web apps with MongoDB, Express.js, React.js, and Node.js with JWT authentication.",
    overview:
      "Become a complete Full Stack Developer capable of building end-to-end web applications from database schemas to interactive client-side interfaces. This course covers state management, RESTful APIs, secure authentication, database indexing, and cloud deployment.",
    whatYouWillLearn: [
      "Build high-performance single-page apps using React, Hooks, and Context API.",
      "Design robust backend RESTful architectures with Node.js and Express.",
      "Model data, query, and perform aggregation pipelines in MongoDB with Mongoose.",
      "Implement secure JWT authentication, password hashing with bcrypt, and role-based authorization.",
      "Deploy full stack applications on cloud servers with CI/CD integration."
    ],
    skillsCovered: ["React.js", "Node.js", "Express.js", "MongoDB", "REST APIs", "JWT Auth", "Tailwind CSS", "Cloud Deployment"],
    topics: [
      {
        title: "Module 1: React & Modern Client Architecture",
        description: "Component hierarchy, React Hooks (useState, useEffect, useMemo), custom hooks, and React Router."
      },
      {
        title: "Module 2: Server-Side Engineering with Node & Express",
        description: "Express routing, middleware architecture, error handling pipelines, and request validation."
      },
      {
        title: "Module 3: Database Modeling with MongoDB & Mongoose",
        description: "Schema design, indexing, CRUD operations, aggregation pipelines, and relational references."
      },
      {
        title: "Module 4: Security & Authentication",
        description: "JWT access tokens, refresh tokens, cookie security, CORS, and sanitization."
      },
      {
        title: "Module 5: Capstone Full Stack Deployment",
        description: "Docker basics, environment configs, Render/Vercel deployment, and monitoring."
      }
    ],
    practicalActivities: [
      "E-Commerce Platform with Payment Gateway & Cart Management",
      "Real-time Collaborative Chat Application with WebSockets",
      "Social Networking API with Authentication & Image Uploads",
      "Task Management SaaS with Role-Based Access Control"
    ],
    careerRelevance: {
      roles: ["Full Stack Developer", "MERN Stack Engineer", "Backend Developer", "Product Engineer"],
      avgSalary: "₹6.0 LPA - ₹14 LPA",
      industryDemand: "One of the most widely hired skill profiles in tech startups and MNCs."
    },
    prerequisites: "Proficiency in JavaScript (ES6) and basic HTML/CSS.",
    provider: "CareerMitra Fullstack Academy"
  },
  {
    id: "skill-data-analytics",
    slug: "data-analytics-sql-powerbi",
    title: "Data Analytics (Excel, SQL & PowerBI)",
    category: "Data Analytics",
    level: "Beginner",
    duration: "8 Weeks",
    rating: 4.8,
    learnersCount: "21.3k",
    badge: "High Growth",
    icon: "📊",
    description: "Transform raw data into actionable business intelligence using Advanced Excel, complex SQL queries, and PowerBI dashboards.",
    overview:
      "Data is the new oil. In this SkillUp, you will learn how to clean messy business datasets, execute analytical SQL queries (joins, window functions, CTEs), and craft interactive executive dashboards in Microsoft PowerBI.",
    whatYouWillLearn: [
      "Master Advanced Excel: Pivot Tables, VLOOKUP, XLOOKUP, INDEX/MATCH, and Power Query.",
      "Write complex SQL queries using JOINs, Subqueries, CTEs, and Window Functions.",
      "Build dynamic PowerBI dashboards with DAX measures and interactive drill-downs.",
      "Perform exploratory data analysis (EDA) to uncover trends and actionable business insights.",
      "Translate raw metrics into impactful executive data presentations."
    ],
    skillsCovered: ["SQL (PostgreSQL/MySQL)", "Microsoft PowerBI", "Advanced Excel", "DAX", "Data Cleaning", "Data Visualization", "Business Intelligence"],
    topics: [
      {
        title: "Module 1: Advanced Excel for Analysts",
        description: "Formulas, nested functions, Pivot tables, data validation, and conditional formatting rules."
      },
      {
        title: "Module 2: Relational Databases & SQL Mastery",
        description: "SELECT, filtering, GROUP BY, multiple table JOINs, subqueries, and window functions (RANK, ROW_NUMBER)."
      },
      {
        title: "Module 3: PowerBI Data Modeling & DAX",
        description: "Star schema design, relationships, calculated columns, DAX measures (CALCULATE, FILTER, DATESYTD)."
      },
      {
        title: "Module 4: Business Dashboard Design & Storytelling",
        description: "KPI cards, interactive slicers, custom tooltips, chart selection principles, and publishing."
      }
    ],
    practicalActivities: [
      "E-commerce Sales Performance & Cohort Retention Dashboard in PowerBI",
      "Banking Fraud Detection & Customer Churn Analysis using SQL",
      "Supply Chain Logistics Optimization Report in Excel",
      "Interactive HR Attrition Analysis Dashboard with automated insights"
    ],
    careerRelevance: {
      roles: ["Data Analyst", "Business Analyst", "BI Developer", "Operations Analyst"],
      avgSalary: "₹5.0 LPA - ₹11 LPA",
      industryDemand: "Extremely high demand across Banking, Retail, Healthcare, and Tech."
    },
    prerequisites: "Basic arithmetic and comfort working with spreadsheets.",
    provider: "CareerMitra Analytics Wing"
  },
  {
    id: "skill-data-science-ml",
    slug: "data-science-machine-learning",
    title: "Data Science & Machine Learning with Python",
    category: "Data Science",
    level: "Intermediate",
    duration: "10 Weeks",
    rating: 4.9,
    learnersCount: "13.2k",
    badge: "Trending",
    icon: "🔬",
    description: "Master NumPy, Pandas, Scikit-Learn, statistical modeling, and ML algorithms to predict outcomes and discover patterns.",
    overview:
      "Deep dive into the core foundations of Data Science and Machine Learning. Gain hands-on expertise in mathematical modeling, data wrangling with Pandas, exploratory data visualization, and building predictive models using regression, classification, and clustering algorithms.",
    whatYouWillLearn: [
      "Manipulate large numerical datasets with NumPy arrays and Pandas DataFrames.",
      "Visualize intricate patterns with Matplotlib, Seaborn, and Plotly.",
      "Understand core mathematical foundations: Linear Algebra, Probability, and Statistics.",
      "Train, evaluate, and fine-tune regression, classification, and clustering ML models.",
      "Apply feature engineering, dimensionality reduction (PCA), and hyperparameter tuning."
    ],
    skillsCovered: ["Python", "Pandas", "NumPy", "Scikit-Learn", "Matplotlib & Seaborn", "Statistical Modeling", "Machine Learning", "Jupyter"],
    topics: [
      {
        title: "Module 1: Data Wrangling & Analysis with NumPy/Pandas",
        description: "Vectorized operations, data cleaning, handling missing values, merging datasets, and time-series."
      },
      {
        title: "Module 2: Exploratory Data Visualization",
        description: "Statistical distributions, correlation matrices, heatmaps, pairplots, and interactive charts."
      },
      {
        title: "Module 3: Supervised Learning (Regression & Classification)",
        description: "Linear/Logistic Regression, Decision Trees, Random Forests, Gradient Boosting (XGBoost), and SVM."
      },
      {
        title: "Module 4: Unsupervised Learning & Model Optimization",
        description: "K-Means clustering, PCA, cross-validation, precision/recall tradeoff, ROC-AUC curves, and GridSearchCV."
      }
    ],
    practicalActivities: [
      "House Price Prediction Model with Multi-variable Regression",
      "Customer Credit Default Classifier with XGBoost & Feature Importance",
      "Customer Segmentation System using K-Means Clustering",
      "End-to-End ML Pipeline deployed with Streamlit UI"
    ],
    careerRelevance: {
      roles: ["Data Scientist", "Machine Learning Engineer", "Predictive Modeler", "Research Analyst"],
      avgSalary: "₹7.0 LPA - ₹16 LPA",
      industryDemand: "Top-tier compensation and high growth in every tech ecosystem."
    },
    prerequisites: "Basic Python programming and high school math/statistics.",
    provider: "CareerMitra AI & Science Guild"
  },
  {
    id: "skill-generative-ai",
    slug: "artificial-intelligence-generative-ai",
    title: "Artificial Intelligence & Generative AI",
    category: "Artificial Intelligence",
    level: "Intermediate",
    duration: "8 Weeks",
    rating: 5.0,
    learnersCount: "16.8k",
    badge: "Next Gen",
    icon: "🤖",
    description: "Build next-gen AI applications with LLMs, Prompt Engineering, LangChain, OpenAI APIs, and Retrieval-Augmented Generation (RAG).",
    overview:
      "Generative AI is reshaping the global economy. This future-ready SkillUp teaches you how to leverage Large Language Models (LLMs), write high-precision prompt templates, build conversational AI agents with LangChain, and implement RAG systems with vector databases like ChromaDB and Pinecone.",
    whatYouWillLearn: [
      "Understand LLM architectures, tokens, temperature, and embedding vectors.",
      "Master Advanced Prompt Engineering techniques (Few-shot, Chain-of-Thought, ReAct).",
      "Build autonomous AI agents and chains using LangChain and LlamaIndex.",
      "Implement Retrieval-Augmented Generation (RAG) over private documents using Vector DBs.",
      "Fine-tune prompts and deploy functional AI chatbots and copilot tools."
    ],
    skillsCovered: ["Generative AI", "LLMs", "LangChain", "Vector Databases", "Prompt Engineering", "OpenAI / Claude APIs", "RAG Systems"],
    topics: [
      {
        title: "Module 1: Foundations of LLMs & Generative Models",
        description: "Transformer models, tokenization, embeddings, context windows, and foundational principles."
      },
      {
        title: "Module 2: Advanced Prompt Engineering & Evaluation",
        description: "Zero-shot, few-shot prompting, system prompts, structured JSON outputs, and guardrails."
      },
      {
        title: "Module 3: LangChain & RAG Architecture",
        description: "Document loaders, text splitters, vector embeddings, similarity search, and retrieval pipelines."
      },
      {
        title: "Module 4: Multi-Agent Systems & Tools",
        description: "Tool calling, web search integration, SQL querying agents, and memory persistence."
      }
    ],
    practicalActivities: [
      "Enterprise Document Q&A Bot with RAG and Source Citations",
      "Autonomous AI Research Agent that browses the web and drafts reports",
      "AI Code Reviewer & Unit Test Generator Copilot",
      "Custom Customer Support Chatbot with Persona Voice"
    ],
    careerRelevance: {
      roles: ["AI Engineer", "GenAI Developer", "Prompt Engineer", "AI Solutions Architect"],
      avgSalary: "₹8.0 LPA - ₹20 LPA",
      industryDemand: "Skyrocketing demand across every Fortune 500 and tech enterprise."
    },
    prerequisites: "Intermediate Python programming skills.",
    provider: "CareerMitra AI Labs"
  },
  {
    id: "skill-machine-learning-ops",
    slug: "machine-learning-engineering",
    title: "Applied Machine Learning & Deep Learning",
    category: "Machine Learning",
    level: "Advanced",
    duration: "10 Weeks",
    rating: 4.8,
    learnersCount: "9.4k",
    badge: "Advanced",
    icon: "🧠",
    description: "Master Deep Learning architectures, Neural Networks with PyTorch, Convolutional Networks (CNNs), and ML model deployment.",
    overview:
      "Take your ML expertise to the frontier of Deep Learning. Build and train multi-layer perceptrons, Computer Vision models with CNNs, and sequence models using PyTorch. Learn model serialization and deployment with FastAPI.",
    whatYouWillLearn: [
      "Understand gradient descent, backpropagation, and loss function optimization.",
      "Build custom neural network architectures using PyTorch and PyTorch Lightning.",
      "Implement Computer Vision models (CNNs, Transfer Learning with ResNet/YOLO).",
      "Process natural language text with RNNs, LSTMs, and Self-Attention mechanisms.",
      "Package models into low-latency inference APIs with FastAPI and Docker."
    ],
    skillsCovered: ["PyTorch", "Deep Learning", "Neural Networks", "Computer Vision (CNN)", "NLP", "Transfer Learning", "FastAPI"],
    topics: [
      {
        title: "Module 1: Neural Networks Foundations",
        description: "Perceptrons, activation functions (ReLU, Sigmoid, Softmax), forward & backpropagation."
      },
      {
        title: "Module 2: PyTorch Deep Dive",
        description: "Tensors, autograd, Dataset/DataLoader classes, custom training loops, and GPU acceleration."
      },
      {
        title: "Module 3: Computer Vision & Transfer Learning",
        description: "Convolutional layers, pooling, data augmentation, pretrained models (VGG, ResNet, EfficientNet)."
      },
      {
        title: "Module 4: Deployment & Model Serving",
        description: "Exporting to ONNX, building REST API endpoints with FastAPI, and batch inference."
      }
    ],
    practicalActivities: [
      "Medical Image Classifier (X-Ray Pneumonia Detection) with Transfer Learning",
      "Real-time Object Detection using YOLO and OpenCV",
      "Sentiment Analysis Engine for Financial News with PyTorch",
      "FastAPI Model Serving containerized with Docker"
    ],
    careerRelevance: {
      roles: ["Machine Learning Engineer", "Computer Vision Engineer", "Deep Learning Researcher"],
      avgSalary: "₹9.0 LPA - ₹22 LPA",
      industryDemand: "High specialization demand in autonomous systems, healthcare, and robotics."
    },
    prerequisites: "Good foundation in Python and Data Science basics.",
    provider: "CareerMitra ML Institute"
  },
  {
    id: "skill-cloud-aws-azure",
    slug: "cloud-computing-aws-devops",
    title: "Cloud Computing & DevOps (AWS, Docker, K8s)",
    category: "Cloud Computing",
    level: "Intermediate",
    duration: "8 Weeks",
    rating: 4.9,
    learnersCount: "14.6k",
    badge: "High Demand",
    icon: "☁️",
    description: "Master Amazon Web Services (AWS), containerization with Docker, CI/CD pipelines, and cloud architecture fundamentals.",
    overview:
      "The entire modern software stack lives in the cloud. Master core AWS cloud services (EC2, S3, RDS, Lambda, VPC, IAM), containerize microservices with Docker, and construct automated GitHub Actions CI/CD deployment pipelines.",
    whatYouWillLearn: [
      "Architect highly available, secure infrastructure on AWS (EC2, S3, RDS, VPC).",
      "Build serverless applications with AWS Lambda and API Gateway.",
      "Containerize microservices using Docker and manage multi-container apps with Docker Compose.",
      "Construct automated Continuous Integration & Continuous Deployment (CI/CD) pipelines.",
      "Prepare thoroughly for AWS Certified Cloud Practitioner / Solutions Architect exams."
    ],
    skillsCovered: ["AWS (EC2, S3, RDS, Lambda)", "Docker", "CI/CD (GitHub Actions)", "Linux Shell", "Kubernetes Basics", "Cloud Security", "Infrastructure as Code"],
    topics: [
      {
        title: "Module 1: AWS Core Compute & Storage",
        description: "EC2 instances, security groups, key pairs, S3 bucket policies, and EBS block storage."
      },
      {
        title: "Module 2: Networking, Databases & Serverless",
        description: "VPC architecture, subnets, internet gateways, AWS RDS (Postgres/MySQL), and AWS Lambda."
      },
      {
        title: "Module 3: Containerization with Docker",
        description: "Dockerfiles, image layers, port binding, volumes, and multi-service docker-compose setups."
      },
      {
        title: "Module 4: DevOps & Automated CI/CD",
        description: "Automated linting/testing workflows, Docker Hub pushing, and automated EC2 deployment."
      }
    ],
    practicalActivities: [
      "Deploying High-Availability Load-Balanced Web App across Multi-AZs on AWS",
      "Containerizing a 3-Tier Full Stack Application with Docker & Compose",
      "Serverless Image Resizer & Thumbnail Generator with AWS S3 + Lambda",
      "End-to-End GitHub Actions Pipeline with Automated Testing & Staging Deploy"
    ],
    careerRelevance: {
      roles: ["Cloud Engineer", "DevOps Engineer", "AWS Solutions Architect", "Site Reliability Engineer"],
      avgSalary: "₹6.5 LPA - ₹15 LPA",
      industryDemand: "Critical requirement across all SaaS and cloud-first tech organizations."
    },
    prerequisites: "Basic Linux command-line familiarity and general networking concepts.",
    provider: "CareerMitra Cloud Practitioners Guild"
  },
  {
    id: "skill-cyber-security",
    slug: "cyber-security-ethical-hacking",
    title: "Cyber Security & Ethical Hacking Essentials",
    category: "Cyber Security",
    level: "Beginner",
    duration: "8 Weeks",
    rating: 4.8,
    learnersCount: "11.9k",
    badge: "Security Core",
    icon: "🛡️",
    description: "Learn network security, vulnerability scanning, OWASP Top 10 web vulnerabilities, cryptography, and defense tactics.",
    overview:
      "Protect digital infrastructures against cyber threats. Understand network protocols with Wireshark and Nmap, identify OWASP Top 10 vulnerabilities (SQL Injection, XSS, CSRF), master symmetric/asymmetric encryption, and learn incident response.",
    whatYouWillLearn: [
      "Understand TCP/IP, OSI layers, packet sniffing, and network analysis with Wireshark.",
      "Perform port scanning, service enumeration, and vulnerability assessment with Nmap.",
      "Identify and exploit OWASP Top 10 web vulnerabilities in simulated lab environments.",
      "Master cryptographic fundamentals: AES, RSA, Hashing, SSL/TLS certificates.",
      "Implement endpoint security, firewalls, and Security Operations Center (SOC) fundamentals."
    ],
    skillsCovered: ["Ethical Hacking", "OWASP Top 10", "Network Security", "Nmap & Wireshark", "Burp Suite", "Cryptography", "SOC Analysis"],
    topics: [
      {
        title: "Module 1: Networking Foundations & Reconnaissance",
        description: "TCP 3-way handshake, DNS, port scanning, OS fingerprinting, and Nmap scripting."
      },
      {
        title: "Module 2: Web Application Security (OWASP Top 10)",
        description: "SQLi, Cross-Site Scripting (XSS), IDOR, Broken Authentication, and Burp Suite proxying."
      },
      {
        title: "Module 3: Cryptography & Secure Communications",
        description: "Public/Private key pairs, SHA-256 hashing, SSL handshakes, and token authentication."
      },
      {
        title: "Module 4: Defensive Security & Incident Response",
        description: "SIEM log analysis, firewall rules, intrusion detection systems (IDS), and compliance."
      }
    ],
    practicalActivities: [
      "Vulnerability Assessment & Penetration Testing Report on vulnerable web app",
      "Network Traffic Analysis & Malware Beacon Detection with Wireshark",
      "Burp Suite Web Security Lab: Exploiting and Patching SQLi & XSS",
      "Simulated Phishing Analysis and Endpoint Hardening Benchmark"
    ],
    careerRelevance: {
      roles: ["Cyber Security Analyst", "SOC Analyst", "Junior Penetration Tester", "Information Security Officer"],
      avgSalary: "₹5.5 LPA - ₹13 LPA",
      industryDemand: "Huge talent shortage worldwide across government, banking, and defense."
    },
    prerequisites: "Basic understanding of operating systems and networking.",
    provider: "CareerMitra Cyber Defense Academy"
  },
  {
    id: "skill-digital-marketing",
    slug: "digital-marketing-seo-growth",
    title: "Digital Marketing, SEO & Performance Growth",
    category: "Digital Marketing",
    level: "Beginner",
    duration: "6 Weeks",
    rating: 4.7,
    learnersCount: "17.5k",
    badge: "Growth Engine",
    icon: "📈",
    description: "Drive organic traffic and paid growth with Search Engine Optimization (SEO), Google Ads, Meta Ads, and Content Marketing.",
    overview:
      "Become a data-driven growth marketer. Learn keyword research, on-page and technical SEO, campaign creation on Google Ads and Meta Ads Manager, email funnel automation, and web analytics with Google Analytics 4 (GA4).",
    whatYouWillLearn: [
      "Conduct in-depth keyword research and competitor analysis with SEMrush/Ahrefs.",
      "Execute On-Page, Off-Page, and Technical SEO strategies to rank on Google Page 1.",
      "Run high-ROI paid ad campaigns on Google Search, Display, and Meta (Instagram/Facebook).",
      "Build high-converting email lead nurture sequences and copywriting funnels.",
      "Measure conversion metrics, ROAS, and user attribution using Google Analytics 4."
    ],
    skillsCovered: ["Search Engine Optimization (SEO)", "Google Ads", "Meta Ads Manager", "Google Analytics 4 (GA4)", "Content Strategy", "Email Marketing", "Copywriting"],
    topics: [
      {
        title: "Module 1: SEO Mastery & Search Algorithms",
        description: "Search intent, keyword research, meta tags, schema markup, Core Web Vitals, and backlink building."
      },
      {
        title: "Module 2: Paid Ads & Performance Marketing",
        description: "Google Search Ads, bidding strategies, Meta ad creative optimization, and retargeting."
      },
      {
        title: "Module 3: Content Marketing & Copywriting",
        description: "Headline formulas, landing page sales copy, social media calendar planning, and storytelling."
      },
      {
        title: "Module 4: Analytics, Conversion Optimization & Attribution",
        description: "GA4 event tracking, UTM parameters, funnel drop-off analysis, and A/B split testing."
      }
    ],
    practicalActivities: [
      "Complete On-Page & Technical SEO Audit of a Live E-commerce Website",
      "Designing and Launching a Live Google Search & Meta Ad Campaign Simulation",
      "Full Email Nurture Sequence with 5 Automations and High-Converting Copy",
      "GA4 Custom Dashboard with Conversion Funnel & ROI Tracking"
    ],
    careerRelevance: {
      roles: ["Digital Marketing Specialist", "SEO Executive", "Performance Marketer", "Growth Associate"],
      avgSalary: "₹4.0 LPA - ₹9.5 LPA",
      industryDemand: "High demand across every consumer brand, B2B enterprise, and agency."
    },
    prerequisites: "No technical prerequisites. Strong enthusiasm for marketing and content.",
    provider: "CareerMitra Growth Institute"
  },
  {
    id: "skill-communication-skills",
    slug: "communication-skills-workplace",
    title: "Professional Communication & Business English",
    category: "Communication Skills",
    level: "Beginner",
    duration: "4 Weeks",
    rating: 4.9,
    learnersCount: "29.8k",
    badge: "Essential",
    icon: "🗣️",
    description: "Elevate your verbal clarity, business email etiquette, presentation storytelling, and public speaking confidence.",
    overview:
      "Strong communication is the #1 superpower in career advancement. Learn to articulate complex technical ideas clearly, write crisp executive emails, command room attention in presentations, and master cross-functional collaboration.",
    whatYouWillLearn: [
      "Communicate with clarity, confidence, and appropriate vocal modulation.",
      "Write concise, professional emails, memos, and executive summaries.",
      "Deliver engaging presentations with structured storytelling and persuasive visual aids.",
      "Master active listening, constructive feedback, and conflict resolution.",
      "Overcome public speaking anxiety and participate effectively in group discussions."
    ],
    skillsCovered: ["Business Communication", "Public Speaking", "Email Writing", "Presentation Storytelling", "Active Listening", "Negotiation", "Cross-functional Teamwork"],
    topics: [
      {
        title: "Module 1: Verbal Fluency & Articulation",
        description: "Tone, pacing, pronunciation clarity, eliminating filler words, and body language."
      },
      {
        title: "Module 2: Professional Written Communication",
        description: "Email structure, subject lines that get opened, Slack/Teams etiquette, and clarity."
      },
      {
        title: "Module 3: High-Impact Presentations & Pitches",
        description: "The 3-act presentation structure, slide design minimalism, and handling live Q&A."
      },
      {
        title: "Module 4: Interpersonal Influence & Difficult Conversations",
        description: "Assertive communication, receiving feedback, and negotiating deadlines respectfully."
      }
    ],
    practicalActivities: [
      "3-Minute Live Video Presentation with Peer & Mentor Critique",
      "Rewriting 10 Complex Workplace Emails into Crisp Executive Messages",
      "Group Discussion & Panel Simulation on Contemporary Business Case Study",
      "Conflict Resolution Role-play with Actionable Outcome Matrix"
    ],
    careerRelevance: {
      roles: ["Management Trainee", "Client Relations Executive", "Project Lead", "All Professional Roles"],
      avgSalary: "Accelerates promotion velocity and leadership selection across all industries.",
      industryDemand: "Universal requirement ranked in the top 3 attributes by hiring managers."
    },
    prerequisites: "None. Open to students and professionals of all backgrounds.",
    provider: "CareerMitra Leadership Academy"
  },
  {
    id: "skill-aptitude-reasoning",
    slug: "aptitude-reasoning-placement-exams",
    title: "Quantitative Aptitude & Logical Reasoning",
    category: "Aptitude & Reasoning",
    level: "All Levels",
    duration: "6 Weeks",
    rating: 4.9,
    learnersCount: "35.2k",
    badge: "Must-Have",
    icon: "🧩",
    description: "Master quantitative tricks, data interpretation, and logical puzzles for campus placements, SSC, Bank & Govt exams.",
    overview:
      "Clear the first screening hurdle in campus placements and competitive exams. Learn Vedic math shortcuts, time-saving calculation tricks, speed arithmetic, logical deduction, seating arrangements, and data interpretation charts.",
    whatYouWillLearn: [
      "Solve Quantitative Aptitude questions with speed techniques and mental math tricks.",
      "Crack Logical Reasoning puzzles, syllogisms, blood relations, and seating arrangements.",
      "Analyze complex Data Interpretation graphs (Bar, Pie, Radar, Table matrices).",
      "Master Verbal Reasoning: Reading comprehension, sentence correction, and analogies.",
      // "Attempt timed mock tests simulating TCS NQT, Infosys, Capgemini, SSC, and Banking exams."
    ],
    skillsCovered: ["Quantitative Aptitude", "Logical Reasoning", "Data Interpretation", "Vedic Math Shortcuts", "Syllogisms", "Speed Math", "Test Strategy"],
    topics: [
      {
        title: "Module 1: Number Systems & Speed Math",
        description: "Percentages, profit & loss, ratio & proportions, averages, and quick calculation tricks."
      },
      {
        title: "Module 2: Time, Speed, Distance & Work",
        description: "Pipes & cisterns, trains, boats & streams, work-rate formulas, and permutations/combinations."
      },
      {
        title: "Module 3: Logical & Analytical Reasoning",
        description: "Linear/Circular seating, coding-decoding, blood relations, direction sense, and syllogisms."
      },
      {
        title: "Module 4: Data Interpretation & Mock Test Drills",
        description: "Bar graphs, pie charts, missing data tables, caselets, and full-length timed assessments."
      }
    ],
    practicalActivities: [
      "1,000+ Curated Practice Questions with Step-by-Step Video Solutions",
      "10 Full-Length Timed Mock Tests simulating Top MNC & Govt Exam Patterns",
      "Speed Math Daily 15-minute Blitz Challenges",
      "Personalized Weak-Area Diagnostic Report"
    ],
    careerRelevance: {
      roles: ["Campus Placement Aspirants", "Govt Exam Candidates (SSC/Bank/RRB)", "IT Entry-Level Roles"],
      avgSalary: "Enables qualifying for top tier service & product hiring drives (₹4 LPA - ₹12 LPA).",
      industryDemand: "Mandatory qualification test for 90%+ corporate and PSU hiring."
    },
    prerequisites: "High school basic arithmetic.",
    provider: "CareerMitra Exam Prep Cell"
  },
  {
    id: "skill-interview-prep",
    slug: "interview-preparation-mastery",
    title: "Complete Interview Preparation Mastery (Tech & HR)",
    category: "Interview Preparation",
    level: "All Levels",
    duration: "4 Weeks",
    rating: 5.0,
    learnersCount: "22.4k",
    badge: "Placement Ready",
    icon: "🎯",
    description: "Crack technical interviews, behavioral HR rounds, STAR method storytelling, and salary negotiation strategies.",
    overview:
      "Transform your interview nerves into unshakeable confidence. Master the STAR framework for answering behavioral questions, tackle technical system design discussions, handle curveball situational prompts, and negotiate top-of-band salary packages.",
    whatYouWillLearn: [
      "Craft compelling 'Tell me about yourself' and 'Why should we hire you' narratives.",
      "Apply the STAR (Situation, Task, Action, Result) method to answer any behavioral question.",
      "Navigate technical rounds with structured whiteboard problem-solving frameworks.",
      "Ask smart, high-signal questions at the end of the interview that impress hiring managers.",
      "Confidently negotiate compensation packages, bonuses, and joining dates."
    ],
    skillsCovered: ["Behavioral Interviews (STAR)", "HR Round Mastery", "Technical Interview Framework", "Salary Negotiation", "Mock Interviews", "Body Language & Presence"],
    topics: [
      {
        title: "Module 1: The Winning Self-Introduction & Story Bank",
        description: "Creating your personal pitch, hook, identifying core career stories, and elevator pitches."
      },
      {
        title: "Module 2: Behavioral & Situational Questions Mastery",
        description: "Overcoming weaknesses, handling failure questions, leadership examples, and teamwork scenarios."
      },
      {
        title: "Module 3: Technical Round Communication",
        description: "Clarifying problem statements, thinking out loud, pseudocode walkthroughs, and edge cases."
      },
      {
        title: "Module 4: Offer Negotiation & Closing",
        description: "Benchmarking compensation, counter-offer tactics, non-monetary perks, and professional signing."
      }
    ],
    practicalActivities: [
      "AI-Powered Video Mock Interview with Instant Feedback on Pace and Sentiment",
      "1-on-1 Peer Mock Interview Sessions with Standard Grading Rubric",
      "Personalized Story Bank Worksheet Covering 15 Key Behavioral Prompts",
      "Salary Negotiation Script & Scenario Simulation"
    ],
    careerRelevance: {
      roles: ["Software Engineer", "Analyst", "Product Manager", "All Job Seekers"],
      avgSalary: "Significantly increases interview conversion rates and final offer packages by 20-35%.",
      industryDemand: "Directly determines your hiring success rate."
    },
    prerequisites: "Resume draft or basic project portfolio.",
    provider: "CareerMitra Placement Cell"
  },
  {
    id: "skill-career-skills",
    slug: "career-skills-resume-linkedin",
    title: "Career Accelerator: Resume, LinkedIn & Networking",
    category: "Career Skills",
    level: "Beginner",
    duration: "3 Weeks",
    rating: 4.9,
    learnersCount: "31.7k",
    badge: "Fast Track",
    icon: "🚀",
    description: "Build an ATS-optimized 90+ score resume, optimize your LinkedIn profile to attract recruiters, and network effectively.",
    overview:
      "Stand out in a crowded job market. Learn the secrets of ATS (Applicant Tracking Systems), build a high-scoring single-page resume with impact metrics, optimize your LinkedIn profile for recruiter search algorithms, and conduct cold outreach that gets replies.",
    whatYouWillLearn: [
      "Construct an ATS-compliant resume that passes recruiter screening filters.",
      "Quantify your project experience using the XYZ formula (Accomplished [X], measured by [Y], by doing [Z]).",
      "Optimize your LinkedIn headline, 'About' summary, experience, and skill endorsements.",
      "Execute warm networking and cold outreach strategies on LinkedIn and email.",
      "Build a digital portfolio and personal brand that attracts inbound job leads."
    ],
    skillsCovered: ["ATS Resume Building", "LinkedIn Optimization", "Personal Branding", "Cold Outreach", "Portfolio Building", "Job Search Strategy", "Agile Fundamentals"],
    topics: [
      {
        title: "Module 1: The ATS-Proof Resume Architecture",
        description: "Formatting standards, action verbs, keyword alignment, removing fluff, and metric quantification."
      },
      {
        title: "Module 2: LinkedIn Profile Optimization",
        description: "Search algorithm indexing, compelling headlines, banner design, featured section, and creator mode."
      },
      {
        title: "Module 3: Strategic Outreach & Referral Generation",
        description: "Finding hiring managers, crafting high-response DMs, email follow-ups, and building genuine mentor relationships."
      },
      {
        title: "Module 4: Agile Workplace Fundamentals",
        description: "Scrum ceremonies, Jira basics, Git workflows, and thriving in modern collaborative teams."
      }
    ],
    practicalActivities: [
      "Complete ATS Resume Review with 90+ Score Benchmark Guarantee",
      "Full LinkedIn Profile Makeover with Custom Banner & Headline Copy",
      "Sending 5 Verified Networking Messages using Tested High-Response Templates",
      "Creating a Single-Link Digital Portfolio Hub"
    ],
    careerRelevance: {
      roles: ["All Students & Professionals Seeking Internships or Full-Time Careers"],
      avgSalary: "Triples profile visibility and recruiter inbound inquiries.",
      industryDemand: "Essential career acceleration toolkit for every modern candidate."
    },
    prerequisites: "None.",
    provider: "CareerMitra Career Coaching Guild"
  }
];
