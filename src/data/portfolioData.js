export const profileData = {
  name: "Falah Aji Wiranata",
  title: "Undergraduate Computer Science Student",
  specialization: "Software Engineering | Backend & AI/ML Enthusiast",
  about: "Computer Science (Software Engineering) student at BINUS University Bekasi with a strong interest in backend development and AI/ML integration. Enjoys algorithmic problem-solving, building backend APIs, and connecting intelligent features into practical web applications.",
  phone: "+62 813-8210-2541",
  email: "falahajinata00@gmail.com",
  github: "https://github.com/Aji-Wrnt",       
  linkedin: "https://www.linkedin.com/in/falah-aji-wiranata-9416bb289", 
  avatarUrl: "../../public/Profile/Provile.jpeg"
};

export const skillsData = {
  "Programming": ["C", "Java", "Python", "JavaScript", "SQL", "HTML", "CSS"],
  "Backend": ["Express.js", "Node.js", "RESTful API", "Microservices"],
  "Frontend": ["React.js", "Bootstrap", "HTML5 / Modern CSS", "Vite"],
  "Database": ["MySQL", "PostgreSQL"],
  "Tools": ["Docker", "Git & GitHub", "Postman", "VS Code", "Android Studio", "Eclipse", "XAMPP", "Cisco Packet Tracer"],
  "Soft Skills": ["Problem Solving", "System Architecture Design", "Team Leadership", "Analytical Thinking", "Time Management"]
};

export const projectsData = [
  {
    id: 1,
    title: "Healthcare System Monitoring",
    languages: ["React", "Express.js", "MySQL", "Docker"],
    image: "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=600&auto=format&fit=crop&q=80",
    description: "Sistem monitoring kesehatan terpadu dengan autentikasi pengguna, logging catatan medis, serta containerized environment dengan Docker Compose.",
    github: "https://github.com"
  },
  {
    id: 2,
    title: "Fake News Prediction API",
    languages: ["Python", "FastAPI", "Docker", "Machine Learning"],
    image: "https://images.unsplash.com/photo-1504711434969-e33886168f5c?w=600&auto=format&fit=crop&q=80",
    description: "Sistem pendeteksi berita palsu menggunakan NLP dan model klasifikasi Machine Learning yang di-deploy dengan REST API berskala di dalam Docker container.",
    github: "https://github.com"
  },
  {
    id: 3,
    title: "Construction Platform & Recipe Calculator",
    languages: ["Express.js", "MySQL", "JavaScript"],
    image: "https://images.unsplash.com/photo-1541888946425-d0fbb186c5f7?w=600&auto=format&fit=crop&q=80",
    description: "Platform manajemen proyek konstruksi dengan fitur RBAC middleware, log harian mandor, dan kalkulator resep formula cat otomatis.",
    github: "https://github.com"
  },
  {
    id: 4,
    title: "Dynamic Fraud Detection (GNN)",
    languages: ["Python", "PyTorch Geometric", "NetworkX"],
    image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=600&auto=format&fit=crop&q=80",
    description: "Riset dan implementasi Graph Neural Networks untuk mendeteksi transaksi anomali dan fraud secara dinamis pada struktur jaringan.",
    github: "https://github.com"
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