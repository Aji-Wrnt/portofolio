export const profileData = {
  name: "Falah Aji Wiranata",
  title: "Undergraduate Computer Science Student",
  specialization: "Software Engineering | Backend & AI/ML Enthusiast",
  about: "Computer Science (Software Engineering) student at BINUS University Bekasi with a strong interest in backend development and AI/ML integration. Enjoys algorithmic problem-solving, building backend APIs, and connecting intelligent features into practical web applications.",
  phone: "+62 813-8210-2541",
  email: "falahajinata00@gmail.com",
  github: "https://github.com/Aji-Wrnt",       
  linkedin: "https://www.linkedin.com/in/falah-aji-wiranata-9416bb289", 
  avatarUrl: "/Profile/Provile.jpeg"
};

export const skillsData = {
  "Programming": ["C", "Java", "Python", "JavaScript", "SQL", "HTML", "CSS"],
  "Backend": ["Express.js", "Node.js", "RESTful API", "Microservices", "Flask"],
  "Frontend": ["React.js", "Bootstrap", "HTML5 / Modern CSS", "Vite"],
  "Database": ["MySQL", "PostgreSQL"],
  "Tools": ["Docker", "Git & GitHub", "Postman", "VS Code", "pgAdmin 4", "Katalon Studio v11", "Android Studio", "Eclipse", "XAMPP", "Cisco Packet Tracer"],
  "Soft Skills": ["Problem Solving", "System Architecture Design", "Team Leadership", "Analytical Thinking", "Time Management"]
};

export const projectsData = [
  {
    id: 1, //done
    title: "Auth & Identity (IAM) Microservice",
    languages: ["Node.js", "Express.js", "PostgreSQL", "JavaScript", "JWT (RS256)", "Zod", "Argon2"],
    images: [
      "/Project/AuthIdentity/RegistAcc.png",
      "/Project/AuthIdentity/Login.png",
      "/Project/AuthIdentity/QueryCheck.png",
      "/Project/AuthIdentity/ResetPass.png",
      "/Project/AuthIdentity/NewPass.png"
    ],
    description: "An autonomous Identity & Access Management (IAM) microservice built for an on-demand construction platform. It provides stateless authentication using asymmetric RS256 JWT, Argon2id password hashing, and single-use Refresh Token Rotation (RTR) backed by PostgreSQL.",
    github: "https://github.com/Aji-Wrnt/auth_identity_service"
  },
  {
    id: 2, //don
    title: "Fake News Detection & MLOps Pipeline",
    languages: ["Python", "Scikit-Learn", "Flask", "Docker", "NLP", "Pandas"],
    images: [
      "/Project/FakeNewsDet/True.png",
      "/Project/FakeNewsDet/Fake.png"
    ],
    description: "An end-to-end Machine Learning and NLP system that classifies news articles into real or fake using TF-IDF and Logistic Regression. Features a Flask REST API, an interactive web UI, and full containerization with Docker.",
    github: "https://github.com/Aji-Wrnt/fake-news-detection-mlops"
  },
  {
    id: 3, //don
    title: "3Furniture Visualizer & Estimator Service",
    languages: ["React", "Three.js", "WebRTC", "Node.js", "Express.js", "PostgreSQL", "Docker"],
    images: [
      "/Project/FurnitureVisual/ConfigurasiCustom.png",
      "/Project/FurnitureVisual/QueryCheck.png",
      "/Project/FurnitureVisual/etalase.jpeg",
      "/Project/FurnitureVisual/runVisualMobile.jpeg"
    ],
    description: "An interactive 3D and WebAR parametric furniture configurator that allows users to customize physical dimensions and materials in real time, view models directly in their room via camera passthrough, and calculate automated manufacturing costs (BOM/RAB). Built with Three.js, React, Node.js, and PostgreSQL.",
    github: "https://github.com/Aji-Wrnt/furniture-visualizer-estimator-service"
  },
  {
    id: 4, //don
    title: "AI Wall Paint Visualizer & Material Estimation Engine",
    languages: ["FastAPI", "PyTorch", "FastSAM", "OpenCV", "Docker", "Flutter"],
    images: [
      "/Project/PaintWall/PostmanTest.png",
      "/Project/PaintWall/ProcessVisual.jpeg",
      "/Project/PaintWall/ResultVisual.jpeg"
    ],
    description: "An AI-powered computer vision microservice that simulates realistic wall repainting from room photos using FastSAM, preserving natural textures and lighting while automating paint requirements and labor cost estimation.",
    github: "https://github.com/Aji-Wrnt/wall_paint_visualizer_service"
  },
  {
    id: 5, // done
    title: "Play Store Review Rating Benchmark (NLP & Deep Learning)",
    languages: ["Python", "TensorFlow", "Scikit-Learn", "NLTK", "Word2Vec", "SMOTE"],
    images: [
      "/Project/NlpSentimen/WithoutImbalance.png",
      "/Project/NlpSentimen/ImbalanceResult.png"
    ],
    description: "An end-to-end NLP and machine learning pipeline that predicts Google Play Store user ratings (1-5 stars) from text reviews. It benchmarks TF-IDF vs. Word2Vec embeddings across traditional ML models (Logistic Regression, Random Forest) and Deep Learning (LSTM), complete with SMOTE class imbalance mitigation.",
    github: "https://github.com/Aji-Wrnt/nlp_sentiment_rating_benchmark"
  }
];

export const certificatesData = [
  { 
    id: 1,
    title: "Excellent Achievement in SASC Mentoring Program BINUS University", 
    issuer: "Binus University", 
    year: "2026",
    images: [
      "/Sertiv/SertifMentor.png"
    ],
    desc: "Awarded an academic scholarship for exceptional contribution in mentoring 7 junior students across core foundational subjects, including Algorithm & Programming, Linear Algebra, and Discrete Mathematics."
  },
  { 
    id: 2,
    title: "The Complete Full-Stack Web Development Bootcamp Udemy · Dr. Angela Yu · 62 Total Hours", 
    issuer: "Udemy", 
    year: "2026",
    images: [
      "/Sertiv/SertifFullstackUdemy.jpg"
    ],
    desc: "Comprehensive hands-on training covering front-end and back-end development. Built full-stack applications using JavaScript, Node.js, Express.js, RESTful APIs, and relational databases."
  },
  { 
    id: 3,
    title: "Introduction to Cloud", 
    issuer: "Cognitive Class", 
    year: "2026",
    images: [
      "/Sertiv/SertifIBM.png"
    ],
    desc: "Earned IBM certification in Introduction to Cloud, mastering core cloud infrastructure, virtualization, and networking security controls. Skilled in cloud-native paradigms, including containerization, microservices, and elastic resource allocation."
  },
  { 
    id: 4,
    title: "Event Committee Member - Company Visit to Krom Bank", 
    issuer: "HIMTI BINUS University (Bekasi Campus)", 
    year: "2025",
    images: [
      "/Sertiv/CompanyVisitKrom1.png",
      "/Sertiv/CompanyVisitKrom2.png"
    ],
    desc: "Contributed as a committee member for a company visit to Krom Bank hosted by HIMTI BINUS Bekasi. Supported event preparation and helped manage logistics and flow on-site during the event."
  },
  { 
    id: 5,
    title: "PBP Division Staff - TECHNO 2025", 
    issuer: "HIMTI BINUS University", 
    year: "2025",
    images: [
      "/Sertiv/SertifPBP.png"
    ],
    desc: "Served as PBP (Pengenalan Bahasa Pemrograman) Division Staff in TECHNO 2025 hosted by HIMTI BINUS University. Assisted in coordinating and executing programming orientation sessions for incoming Computer Science freshmen."
  },
  { 
    id: 6,
    title: "Staff of Registration Division - HILET 2025", 
    issuer: "HIMTI BINUS University", 
    year: "2025",
    images: [
      "/Sertiv/SertifHilet.png"
    ],
    desc: "Served as Registration Division Staff for HILET 2026, overseeing participant verification and onboarding operations. Optimized check-in efficiency and supported logistics to maintain a smooth event flow across the multi-day program."
  }
];


// { 
//     id: 1,
//     title: "Algorithm & Programming in C", 
//     issuer: "Binus University", 
//     year: "2026",
//     images: [
//       "https://images.unsplash.com/photo-1589330694653-ded6df03f754?w=600&auto=format&fit=crop&q=80"
//     ],
//     desc: "Sertifikasi keahlian algoritma dasar, pointer, alokasi memori dinamis, dan struktur data menggunakan bahasa C."
//   },
//   { 
//     id: 2,
//     title: "Introduction to Cloud & Web Track", 
//     issuer: "Cognitive Class & Udemy", 
//     year: "2026",
//     images: [
//       "/Sertiv/SertifIBM.png",
//       "/Sertiv/SertifFullstackUdemy.jpg"
//     ],
//     desc: "Earned IBM certification in Introduction to Cloud, mastering core cloud infrastructure, virtualization, and networking security controls. Skilled in cloud-native paradigms, including containerization, microservices, and elastic resource allocation."
//   },