import React, { useState, useEffect, useRef } from 'react';
import { 
  Terminal, Folder, FileText, Send, 
  ExternalLink, Mail, Phone, Minus, Square, 
  Award, CheckCircle, ChevronDown, ChevronUp, 
  Code2, User, ZoomIn, Image as ImageIcon
} from 'lucide-react';
import { profileData, skillsData, projectsData, certificatesData } from './data/portfolioData';

export default function App() {
  const [activeTab, setActiveTab] = useState("ALL");
  const [expandedProject, setExpandedProject] = useState(null);
  const [selectedCert, setSelectedCert] = useState(certificatesData[0] || null);
  const [activeCertImgIndex, setActiveCertImgIndex] = useState(0);
  const [isCvOpen, setIsCvOpen] = useState(false);
  const [previewImage, setPreviewImage] = useState(null);
  const [time, setTime] = useState("");
  const [contactForm, setContactForm] = useState({ name: "", email: "", message: "" });
  const [sentAlert, setSentAlert] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");

  // Helper untuk mengekstrak array gambar dari item sertifikat/pengalaman (kompatibel image & images)
  const getCertImages = (cert) => {
    if (!cert) return [];
    if (Array.isArray(cert.images) && cert.images.length > 0) return cert.images;
    if (cert.image) return [cert.image];
    return [];
  };

  // Retro features state: Active Section tracking, CRT overlay, Start menu
  const [activeSection, setActiveSection] = useState("profile");
  const [crtEnabled, setCrtEnabled] = useState(true);
  const [isStartMenuOpen, setIsStartMenuOpen] = useState(false);

  // Esc dan Arrow keys listener untuk navigasi modal overlay
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        setIsCvOpen(false);
        setPreviewImage(null);
        setIsStartMenuOpen(false);
      } else if (previewImage && previewImage.images && previewImage.images.length > 1) {
        if (e.key === 'ArrowLeft') {
          const newIdx = (previewImage.currentIndex - 1 + previewImage.images.length) % previewImage.images.length;
          setPreviewImage((prev) => ({
            ...prev,
            url: prev.images[newIdx],
            currentIndex: newIdx,
          }));
        } else if (e.key === 'ArrowRight') {
          const newIdx = (previewImage.currentIndex + 1) % previewImage.images.length;
          setPreviewImage((prev) => ({
            ...prev,
            url: prev.images[newIdx],
            currentIndex: newIdx,
          }));
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [previewImage]);

  // Ref untuk mengunci pergantian activeSection saat animasi scroll berlangsung
  const isScrollingRef = useRef(false);
  const scrollTimeoutRef = useRef(null);

  // Ref dan state untuk menyamakan ukuran foto profil 1:1 dan sejajar persis dengan huruf F (atas) dan kotak About (bawah)
  const profileFlexRef = useRef(null);
  const firstLetterRef = useRef(null);
  const aboutBoxRef = useRef(null);
  const [photoMetrics, setPhotoMetrics] = useState({ size: null, top: 0 });
  const photoMetricsRef = useRef({ size: null, top: 0 });

  useEffect(() => {
    let animFrame = null;

    const updateProfileMetrics = () => {
      // Pada layar mobile (< 768px), gunakan ukuran default responsif
      if (window.innerWidth < 768) {
        if (photoMetricsRef.current.size !== null || photoMetricsRef.current.top !== 0) {
          photoMetricsRef.current = { size: null, top: 0 };
          setPhotoMetrics({ size: null, top: 0 });
        }
        return;
      }

      if (!profileFlexRef.current || !firstLetterRef.current || !aboutBoxRef.current) return;

      const parentRect = profileFlexRef.current.getBoundingClientRect();
      const letterRect = firstLetterRef.current.getBoundingClientRect();
      const aboutRect = aboutBoxRef.current.getBoundingClientRect();

      // Dapatkan offset piksel dari bounding box huruf 'F' ke baris piksel tinta teratas dari huruf 'F'
      let glyphOffset = 3;
      try {
        const style = window.getComputedStyle(firstLetterRef.current);
        const fontSize = parseFloat(style.fontSize) || 30;
        const canvas = document.createElement('canvas');
        const size = Math.ceil(fontSize * 2);
        canvas.width = size;
        canvas.height = size;
        const ctx = canvas.getContext('2d', { willReadFrequently: true });
        if (ctx) {
          ctx.font = `${style.fontWeight} ${style.fontSize} ${style.fontFamily}`;
          ctx.textBaseline = 'top';
          ctx.fillStyle = '#000000';
          ctx.fillText('F', 4, 0);
          const imgData = ctx.getImageData(0, 0, size, size).data;
          for (let y = 0; y < size; y++) {
            for (let x = 0; x < size; x++) {
              if (imgData[(y * size + x) * 4 + 3] > 40) {
                glyphOffset = y;
                break;
              }
            }
            if (glyphOffset !== 3) break;
          }
        }
      } catch {
        glyphOffset = 3;
      }

      // Posisi visual puncak huruf 'F' (puncak tinta huruf F)
      const visualLetterFTop = letterRect.top + glyphOffset;

      // Batas garis luar bawah kotak About Us
      const aboutBoxBottom = aboutRect.bottom;

      // Margin-top agar sisi atas kotak foto sejajar persis dengan garis atas huruf 'F' (aman 0 - 16px)
      const rawTop = visualLetterFTop - parentRect.top;
      const targetTop = Math.min(16, Math.max(0, Math.round(rawTop)));

      // Ukuran sisi kotak (1:1 aspect ratio) agar sisi bawah kotak foto sejajar persis dengan garis bawah kotak About Us
      // Dibatasi ketat antara 130px dan 170px agar proporsional dan tidak terjadi runaway size
      const rawSize = aboutBoxBottom - visualLetterFTop;
      const targetSize = Math.min(170, Math.max(130, Math.round(rawSize)));

      const curr = photoMetricsRef.current;
      if (Math.abs((curr.size || 0) - targetSize) > 1 || Math.abs((curr.top || 0) - targetTop) > 1) {
        photoMetricsRef.current = { size: targetSize, top: targetTop };
        setPhotoMetrics({ size: targetSize, top: targetTop });
      }
    };

    updateProfileMetrics();

    if (document.fonts?.ready) {
      document.fonts.ready.then(() => {
        cancelAnimationFrame(animFrame);
        animFrame = requestAnimationFrame(updateProfileMetrics);
      });
    }

    const handleResize = () => {
      cancelAnimationFrame(animFrame);
      animFrame = requestAnimationFrame(updateProfileMetrics);
    };

    window.addEventListener('resize', handleResize);

    return () => {
      cancelAnimationFrame(animFrame);
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  // Jam digital real-time
  useEffect(() => {
    const updateClock = () => {
      const now = new Date();
      setTime(now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
    };
    updateClock();
    const timer = setInterval(updateClock, 1000);
    return () => clearInterval(timer);
  }, []);

  // Deteksi posisi scroll untuk mengaktifkan tab aplikasi di taskbar
  useEffect(() => {
    const sectionIds = ['profile', 'skills', 'projects', 'certificates', 'contact'];
    const handleScroll = () => {
      if (isScrollingRef.current) return;

      // Jika user sudah berada di paling bawah halaman, selalu aktifkan 'contact'
      const isAtBottom = window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 70;
      if (isAtBottom) {
        setActiveSection('contact');
        return;
      }

      const scrollPosition = window.scrollY + 180;
      for (let i = sectionIds.length - 1; i >= 0; i--) {
        const el = document.getElementById(sectionIds[i]);
        if (el && el.offsetTop <= scrollPosition) {
          setActiveSection(sectionIds[i]);
          break;
        }
      }
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollTo = (id) => {
    setActiveSection(id);
    isScrollingRef.current = true;
    if (scrollTimeoutRef.current) clearTimeout(scrollTimeoutRef.current);

    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }

    // Lepaskan lock setelah animasi smooth scroll selesai (~850ms)
    scrollTimeoutRef.current = setTimeout(() => {
      isScrollingRef.current = false;
      const isAtBottom = window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 70;
      if (isAtBottom || id === 'contact') {
        setActiveSection('contact');
      }
    }, 850);
  };

  const taskbarApps = [
    { id: 'profile', name: 'Profile.exe', title: 'Profile & About', icon: User },
    { id: 'skills', name: 'Skill.dll', title: 'Skills Registry', icon: Code2 },
    { id: 'projects', name: 'Projects.exe', title: 'Projects Explorer', icon: Folder },
    { id: 'certificates', name: 'Experience.exe', title: 'Experience & Credentials', icon: Award },
    { id: 'contact', name: 'Contact.exe', title: 'Contact Messenger', icon: Mail },
  ];

  const handleSend = async (e) => {
    e.preventDefault();
    if (!contactForm.name || !contactForm.email || !contactForm.message) return;

    setIsSubmitting(true);
    setSubmitError("");

    try {
      // Mengirim langsung ke inbox email falahajinata00@gmail.com via Web3Forms API
      const response = await fetch("https://api.web3forms.com/submit", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({
          // Masukkan Access Key gratis dari https://web3forms.com/ di bawah ini:
          access_key: "ae0c36dc-6993-42a2-a93c-40e489ac703d",
          name: contactForm.name,
          email: contactForm.email,
          message: contactForm.message,
          subject: `Portfolio Inquiry from ${contactForm.name}`,
        }),
      });

      const result = await response.json();
      if (result.success) {
        setSentAlert(true);
        setContactForm({ name: "", email: "", message: "" });
      } else {
        setSubmitError("Gagal mengirim pesan. Silakan hubungi langsung via WhatsApp atau Email.");
      }
    } catch (err) {
      setSubmitError("Terjadi kendala jaringan. Silakan hubungi via WhatsApp atau Email.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const tabCategories = ["ALL", ...Object.keys(skillsData)];

  return (
    <div className="min-h-screen bg-retro-bg text-black font-sans pb-16 pt-4 sm:pt-6 px-3 sm:px-6 relative">
      
      {/* ================= MAIN SCROLLABLE CONTENT ================= */}
      <main className="max-w-4xl mx-auto space-y-8 mt-2">

        {/* SECTION 1: PROFILE & ABOUT */}
        <section 
          id="profile" 
          className="group scroll-mt-6 bg-retro-gray retro-box-raised p-1 transition-all"
        >
          <div className="px-2 py-1 flex items-center justify-between font-bold text-xs sm:text-sm select-none transition-colors duration-150 bg-[#7b7b7b] text-gray-200 group-hover:bg-gradient-to-r group-hover:from-retro-blue group-hover:to-retro-blue-light group-hover:text-white">
            <div className="flex items-center gap-2">
              <User className="w-4 h-4" />
              <span>Profile.exe</span>
            </div>
            <div className="flex items-center gap-1">
              <button className="retro-btn w-4 h-4 flex items-center justify-center text-[10px] text-black" aria-label="Minimize"><Minus size={10} /></button>
              <button className="retro-btn w-4 h-4 flex items-center justify-center text-[10px] text-black" aria-label="Maximize"><Square size={9} /></button>
              <button className="retro-btn w-4 h-4 flex items-center justify-center text-[10px] text-black font-bold" aria-label="Close">✕</button>
            </div>
          </div>

          <div className="p-4 sm:p-6 bg-retro-gray">
            <div ref={profileFlexRef} className="flex flex-col md:flex-row gap-6 items-center md:items-start">
              {/* Foto Profil Retro */}
              <div 
                style={photoMetrics.size ? { 
                  width: `${photoMetrics.size}px`, 
                  height: `${photoMetrics.size}px`,
                  marginTop: `${photoMetrics.top}px`
                } : undefined}
                className="w-36 h-36 md:w-36 md:h-36 aspect-square bg-white retro-box-sunken p-1.5 flex-shrink-0"
              >
                <img 
                  src={profileData.avatarUrl} 
                  alt={profileData.name} 
                  className="w-full h-full object-cover border border-black/40"
                />
              </div>

              {/* Bio & Intro */}
              <div className="flex-1 text-center md:text-left space-y-3 min-w-0">
                <div className="space-y-3">
                  <div>
                    <h1 className="text-2xl sm:text-3xl font-bold tracking-wider uppercase font-mono leading-none">
                      <span ref={firstLetterRef}>F</span>alah Aji Wiranata
                    </h1>
                    <p className="text-xs sm:text-sm font-semibold text-blue-900 font-mono mt-1">
                      {profileData.title} • {profileData.specialization}
                    </p>
                  </div>

                  <div 
                    ref={aboutBoxRef}
                    className="text-xs sm:text-sm text-gray-800 leading-relaxed retro-box-sunken p-3 bg-[#fffffa]"
                  >
                    {profileData.about}
                  </div>
                </div>

                {/* View CV Button */}
                <div className="pt-1 flex flex-wrap gap-2 justify-center md:justify-start">
                  {/* View CV Button */}
                  <button 
                    onClick={() => setIsCvOpen(true)}
                    className="retro-btn px-4 py-1.5 font-bold text-xs sm:text-sm flex items-center gap-2 bg-[#d4d0c8] active:translate-y-0.5"
                  >
                    <FileText className="w-4 h-4 text-red-700" />
                    <span>View CV Document</span>
                  </button>

                  {/* GitHub Profile Button */}
                  <a
                    href={profileData.github}
                    target="_blank"
                    rel="noreferrer"
                    className="retro-btn px-3.5 py-1.5 font-bold text-xs sm:text-sm flex items-center gap-2 bg-[#d4d0c8] text-black no-underline active:translate-y-0.5 hover:bg-gray-200"
                  >
                    <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                      <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z"/>
                    </svg>
                    <span>GitHub</span>
                    <ExternalLink size={12} className="text-gray-600" />
                  </a>

                  {/* LinkedIn Profile Button */}
                  <a
                    href={profileData.linkedin}
                    target="_blank"
                    rel="noreferrer"
                    className="retro-btn px-3.5 py-1.5 font-bold text-xs sm:text-sm flex items-center gap-2 bg-[#d4d0c8] text-black no-underline active:translate-y-0.5 hover:bg-gray-200"
                  >
                    <svg className="w-4 h-4 fill-[#0077b5]" viewBox="0 0 24 24">
                      <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
                    </svg>
                    <span>LinkedIn</span>
                    <ExternalLink size={12} className="text-gray-600" />
                  </a>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* SECTION 2: HARD & SOFT SKILLS (DENGAN TAB "ALL") */}
        <section 
          id="skills" 
          className="group scroll-mt-6 bg-retro-gray retro-box-raised p-1 transition-all"
        >
          <div className="px-2 py-1 flex items-center justify-between font-bold text-xs sm:text-sm select-none transition-colors duration-150 bg-[#7b7b7b] text-gray-200 group-hover:bg-gradient-to-r group-hover:from-retro-blue group-hover:to-retro-blue-light group-hover:text-white">
            <div className="flex items-center gap-2">
              <Code2 className="w-4 h-4" />
              <span>Skill.dll</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-1">
                <button className="retro-btn w-4 h-4 flex items-center justify-center text-[10px] text-black" aria-label="Minimize"><Minus size={10} /></button>
                <button className="retro-btn w-4 h-4 flex items-center justify-center text-[10px] text-black" aria-label="Maximize"><Square size={9} /></button>
                <button className="retro-btn w-4 h-4 flex items-center justify-center text-[10px] text-black font-bold" aria-label="Close">✕</button>
              </div>
            </div>
          </div>

          <div className="p-4 sm:p-6 bg-retro-gray">
            {/* Retro Tabs */}
            <div className="flex flex-wrap gap-1 border-b-2 border-retro-dark mb-4">
              {tabCategories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setActiveTab(cat)}
                  className={`px-3 py-1.5 text-xs sm:text-sm font-semibold border-t-2 border-l-2 border-r-2 ${
                    activeTab === cat 
                      ? 'bg-retro-gray -mb-0.5 border-white border-r-black border-b-0 font-bold font-mono text-blue-950' 
                      : 'bg-[#b0b0b0] border-[#808080] opacity-80'
                  }`}
                >
                  {cat === "ALL" ? "★ ALL SKILLS" : cat}
                </button>
              ))}
            </div>

            {/* Container Konten Skills */}
            <div className="bg-[#fffffa] p-4 retro-box-sunken space-y-5 max-h-[500px] overflow-y-auto">
              {activeTab === "ALL" ? (
                Object.entries(skillsData).map(([category, items]) => (
                  <div key={category} className="space-y-2">
                    <div className="bg-retro-gray border border-black/40 px-2 py-0.5 text-xs font-mono font-bold text-blue-950 flex items-center gap-1.5">
                      <span className="w-2 h-2 bg-retro-blue inline-block"></span>
                      <span>{category.toUpperCase()}</span>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {items.map((skill, index) => (
                        <div key={index} className="flex items-center justify-between p-2 border border-gray-300 bg-white">
                          <span className="text-xs font-mono font-bold text-gray-800">{skill}</span>
                          <div className="flex gap-0.5">
                            {[1, 2, 3, 4, 5].map((seg) => (
                              <div key={seg} className="w-2.5 h-2.5 bg-retro-blue border border-black/40"></div>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))
              ) : (
                <div className="space-y-2">
                  <div className="bg-retro-gray border border-black/40 px-2 py-0.5 text-xs font-mono font-bold text-blue-950 flex items-center gap-1.5">
                    <span className="w-2 h-2 bg-retro-blue inline-block"></span>
                    <span>{activeTab.toUpperCase()}</span>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {skillsData[activeTab].map((skill, index) => (
                      <div key={index} className="flex items-center justify-between p-2 border border-gray-300 bg-white">
                        <span className="text-xs font-mono font-bold text-gray-800">{skill}</span>
                        <div className="flex gap-0.5">
                          {[1, 2, 3, 4, 5].map((seg) => (
                            <div key={seg} className="w-2.5 h-2.5 bg-retro-blue border border-black/40"></div>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </section>

        {/* SECTION 3: PROJECTS (DENGAN PREVIEW TAMPILAN PROYEK) */}
        <section 
          id="projects" 
          className="group scroll-mt-6 bg-retro-gray retro-box-raised p-1 transition-all"
        >
          <div className="px-2 py-1 flex items-center justify-between font-bold text-xs sm:text-sm select-none transition-colors duration-150 bg-[#7b7b7b] text-gray-200 group-hover:bg-gradient-to-r group-hover:from-retro-blue group-hover:to-retro-blue-light group-hover:text-white">
            <div className="flex items-center gap-2">
              <Folder className="w-4 h-4 text-yellow-300" />
              <span>Projects.exe</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-1">
                <button className="retro-btn w-4 h-4 flex items-center justify-center text-[10px] text-black" aria-label="Minimize"><Minus size={10} /></button>
                <button className="retro-btn w-4 h-4 flex items-center justify-center text-[10px] text-black" aria-label="Maximize"><Square size={9} /></button>
                <button className="retro-btn w-4 h-4 flex items-center justify-center text-[10px] text-black font-bold" aria-label="Close">✕</button>
              </div>
            </div>
          </div>

          <div className="p-4 sm:p-6 bg-retro-gray">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {projectsData.map((project) => (
                <div key={project.id} className="bg-retro-gray retro-box-raised p-3 flex flex-col justify-between">
                  <div>
                    {/* Project Header Bar */}
                    <div className="bg-retro-blue text-white px-2 py-1 text-xs font-bold font-mono mb-2 truncate">
                      {project.title}
                    </div>

                    {/* Preview Gambar / Halaman Proyek (Dapat diklik untuk melihat ukuran asli tanpa potongan) */}
                    {project.image && (
                      <div 
                        onClick={() => setPreviewImage({ 
                          url: project.image, 
                          title: `${project.title.replace(/\s+/g, '_')}.bmp`, 
                          subtitle: `Project: ${project.title}` 
                        })}
                        className="bg-black/10 border border-black p-1 mb-2.5 cursor-pointer group/img relative overflow-hidden"
                        title="Klik untuk melihat gambar ukuran asli tanpa terpotong"
                      >
                        <img 
                          src={project.image} 
                          alt={project.title} 
                          className="w-full h-32 object-cover border border-gray-400 group-hover/img:brightness-105 transition-all"
                        />
                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover/img:opacity-100 flex items-center justify-center transition-opacity text-white text-[11px] font-mono font-bold gap-1.5 backdrop-blur-[0.5px]">
                          <ZoomIn size={14} />
                          <span>View Full Size</span>
                        </div>
                      </div>
                    )}

                    {/* Tech Badges */}
                    <div className="flex flex-wrap gap-1 mb-3">
                      {project.languages.map((tech, i) => (
                        <span key={i} className="text-[10px] bg-white border border-black px-1.5 py-0.5 font-mono">
                          [{tech}]
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Button More Details */}
                  <div>
                    <button
                      onClick={() => setExpandedProject(expandedProject === project.id ? null : project.id)}
                      className="retro-btn w-full py-1 text-xs font-bold flex items-center justify-center gap-1 mb-2"
                    >
                      <span>{expandedProject === project.id ? "Hide Details" : "More Details"}</span>
                      {expandedProject === project.id ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                    </button>

                    {/* Expandable Details Container */}
                    {expandedProject === project.id && (
                      <div className="bg-[#fffffa] p-2.5 retro-box-sunken text-xs space-y-2.5 mb-2">
                        <p className="text-gray-800 leading-normal">{project.description}</p>
                        <a
                          href={project.github}
                          target="_blank"
                          rel="noreferrer"
                          className="retro-btn py-1.5 px-3 flex items-center justify-center gap-2 text-xs font-bold text-black no-underline block hover:bg-gray-200"
                        >
                          <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
                            <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z"/>
                          </svg>
                          <span>Direct Link to GitHub Repo</span>
                          <ExternalLink className="w-3 h-3" />
                        </a>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* SECTION 4: EXPERIENCE & CREDENTIALS (ORGANIZATIONAL EXPERIENCE & CERTIFICATES) */}
        <section 
          id="certificates" 
          className="group scroll-mt-6 bg-retro-gray retro-box-raised p-1 transition-all"
        >
          <div className="px-2 py-1 flex items-center justify-between font-bold text-xs sm:text-sm select-none transition-colors duration-150 bg-[#7b7b7b] text-gray-200 group-hover:bg-gradient-to-r group-hover:from-retro-blue group-hover:to-retro-blue-light group-hover:text-white">
            <div className="flex items-center gap-2">
              <Award className="w-4 h-4 text-amber-300" />
              <span>Experience.exe</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-1">
                <button className="retro-btn w-4 h-4 flex items-center justify-center text-[10px] text-black" aria-label="Minimize"><Minus size={10} /></button>
                <button className="retro-btn w-4 h-4 flex items-center justify-center text-[10px] text-black" aria-label="Maximize"><Square size={9} /></button>
                <button className="retro-btn w-4 h-4 flex items-center justify-center text-[10px] text-black font-bold" aria-label="Close">✕</button>
              </div>
            </div>
          </div>

          <div className="p-4 sm:p-6 bg-retro-gray flex flex-col md:flex-row gap-4">
            {/* Daftar Sertifikat (Kiri) */}
            <div className="w-full md:w-5/12 space-y-2 bg-[#fffffa] p-2.5 retro-box-sunken max-h-80 overflow-y-auto">
              <span className="text-[11px] font-bold text-gray-600 block uppercase font-mono mb-1">Daftar Dokumen:</span>
              {certificatesData.map((cert) => {
                const certImgs = getCertImages(cert);
                return (
                  <div 
                    key={cert.id}
                    onClick={() => {
                      setSelectedCert(cert);
                      setActiveCertImgIndex(0);
                    }}
                    className={`p-2 border cursor-pointer text-xs transition-colors ${
                      selectedCert?.id === cert.id 
                        ? 'bg-retro-blue text-white border-black font-bold' 
                        : 'bg-white hover:bg-gray-100 text-black border-gray-300'
                    }`}
                  >
                    <div className="flex items-center justify-between gap-1.5">
                      <div className="flex items-center gap-1.5 min-w-0">
                        <CheckCircle size={14} className={selectedCert?.id === cert.id ? "text-yellow-300 flex-shrink-0" : "text-green-700 flex-shrink-0"} />
                        <span className="truncate">{cert.title}</span>
                      </div>
                      {certImgs.length > 1 && (
                        <span className={`text-[9px] font-mono px-1 py-0.2 border flex-shrink-0 ${
                          selectedCert?.id === cert.id
                            ? 'bg-yellow-300 text-black border-black font-bold'
                            : 'bg-yellow-100 text-yellow-800 border-yellow-500'
                        }`}>
                          {certImgs.length} Photos
                        </span>
                      )}
                    </div>
                    <div className="text-[10px] opacity-80 mt-1">{cert.issuer} • {cert.year}</div>
                  </div>
                );
              })}
            </div>

            {/* Display Dokumen Langsung (Kanan) */}
            {selectedCert && (() => {
              const certImages = getCertImages(selectedCert);
              const currentCertImg = certImages[activeCertImgIndex] || certImages[0] || "";

              return (
                <div className="w-full md:w-7/12 bg-white retro-box-sunken p-3 flex flex-col justify-between">
                  <div>
                    {/* Viewport Foto Utama */}
                    <div className="relative mb-2.5">
                      <div 
                        onClick={() => setPreviewImage({ 
                          url: currentCertImg, 
                          title: `${selectedCert.title.replace(/\s+/g, '_')}.bmp`, 
                          subtitle: `${selectedCert.title} • Verified by ${selectedCert.issuer} (${selectedCert.year})`,
                          images: certImages,
                          currentIndex: activeCertImgIndex
                        })}
                        className="border-2 border-black p-1 bg-[#1a1a1a] cursor-pointer group/cert relative overflow-hidden"
                        title="Klik untuk melihat foto/sertifikat ukuran asli tanpa terpotong"
                      >
                        <img 
                          src={currentCertImg} 
                          alt={selectedCert.title} 
                          className="w-full h-48 object-cover border border-gray-500 group-hover/cert:brightness-105 transition-all"
                        />
                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover/cert:opacity-100 flex items-center justify-center transition-opacity text-white text-[11px] font-mono font-bold gap-1.5 backdrop-blur-[0.5px]">
                          <ZoomIn size={15} />
                          <span>Click to View Full Size</span>
                        </div>

                        {/* Indikator Jumlah Foto jika lebih dari 1 */}
                        {certImages.length > 1 && (
                          <div className="absolute top-2 right-2 bg-black/80 text-yellow-300 text-[10px] font-mono font-bold px-2 py-0.5 border border-yellow-400/50 shadow select-none flex items-center gap-1">
                            <ImageIcon size={11} />
                            <span>{activeCertImgIndex + 1} / {certImages.length}</span>
                          </div>
                        )}
                      </div>

                      {/* Tombol Slide Prev / Next jika lebih dari 1 foto */}
                      {certImages.length > 1 && (
                        <>
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              setActiveCertImgIndex((prev) => (prev - 1 + certImages.length) % certImages.length);
                            }}
                            className="retro-btn absolute left-2 top-1/2 -translate-y-1/2 w-6 h-7 flex items-center justify-center font-bold text-xs text-black bg-[#d4d0c8] shadow-md z-10 hover:bg-white active:translate-y-[-46%]"
                            title="Foto Sebelumnya"
                            aria-label="Previous Photo"
                          >
                            ◀
                          </button>
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              setActiveCertImgIndex((prev) => (prev + 1) % certImages.length);
                            }}
                            className="retro-btn absolute right-2 top-1/2 -translate-y-1/2 w-6 h-7 flex items-center justify-center font-bold text-xs text-black bg-[#d4d0c8] shadow-md z-10 hover:bg-white active:translate-y-[-46%]"
                            title="Foto Selanjutnya"
                            aria-label="Next Photo"
                          >
                            ▶
                          </button>
                        </>
                      )}

                      {/* Thumbnail Filmstrip Bar jika lebih dari 1 foto */}
                      {certImages.length > 1 && (
                        <div className="flex items-center gap-1.5 mt-1.5 p-1 bg-retro-gray retro-box-sunken overflow-x-auto">
                          <span className="text-[10px] font-mono font-bold text-gray-700 px-1 whitespace-nowrap">
                            Evidence:
                          </span>
                          <div className="flex gap-1.5">
                            {certImages.map((imgUrl, idx) => (
                              <button
                                key={idx}
                                type="button"
                                onClick={() => setActiveCertImgIndex(idx)}
                                className={`relative w-12 h-9 flex-shrink-0 border transition-all overflow-hidden ${
                                  activeCertImgIndex === idx 
                                    ? 'border-retro-blue ring-2 ring-blue-500 scale-105 z-10' 
                                    : 'border-gray-500 opacity-60 hover:opacity-100'
                                }`}
                                title={`Buka foto ke-${idx + 1}`}
                              >
                                <img src={imgUrl} alt={`Thumbnail ${idx + 1}`} className="w-full h-full object-cover" />
                                <span className="absolute bottom-0 right-0 bg-black/80 text-[8px] text-white px-0.5 font-mono">
                                  #{idx + 1}
                                </span>
                              </button>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>

                    <h3 className="font-bold text-sm font-mono text-gray-900">{selectedCert.title}</h3>
                    <p className="text-xs text-gray-600 mt-1 leading-relaxed">{selectedCert.desc}</p>
                  </div>

                  <div className="text-right pt-2 border-t border-gray-200 mt-3 flex items-center justify-between flex-wrap gap-2">
                    <button
                      onClick={() => setPreviewImage({ 
                        url: currentCertImg, 
                        title: `${selectedCert.title.replace(/\s+/g, '_')}.bmp`, 
                        subtitle: `${selectedCert.title} • Verified by ${selectedCert.issuer} (${selectedCert.year})`,
                        images: certImages,
                        currentIndex: activeCertImgIndex
                      })}
                      className="retro-btn px-2.5 py-1 text-[11px] font-mono font-bold flex items-center gap-1.5 active:translate-y-0.5 hover:bg-gray-200 text-black"
                    >
                      <ZoomIn size={13} />
                      <span>View Full Size</span>
                    </button>
                    <span className="text-[11px] text-gray-500 font-mono">Issued & Verified by: {selectedCert.issuer}</span>
                  </div>
                </div>
              );
            })()}
          </div>
        </section>

        {/* SECTION 5: CONTACT SECTION (DIRECT KOSONGAN WA, EMAIL & INBOX FORM) */}
        <section 
          id="contact" 
          className="group scroll-mt-6 bg-retro-gray retro-box-raised p-1 transition-all"
        >
          <div className="px-2 py-1 flex items-center justify-between font-bold text-xs sm:text-sm select-none transition-colors duration-150 bg-[#7b7b7b] text-gray-200 group-hover:bg-gradient-to-r group-hover:from-retro-blue group-hover:to-retro-blue-light group-hover:text-white">
            <div className="flex items-center gap-2">
              <Mail className="w-4 h-4 text-red-300" />
              <span>Contact.exe</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-1">
                <button className="retro-btn w-4 h-4 flex items-center justify-center text-[10px] text-black" aria-label="Minimize"><Minus size={10} /></button>
                <button className="retro-btn w-4 h-4 flex items-center justify-center text-[10px] text-black" aria-label="Maximize"><Square size={9} /></button>
                <button className="retro-btn w-4 h-4 flex items-center justify-center text-[10px] text-black font-bold" aria-label="Close">✕</button>
              </div>
            </div>
          </div>

          <div className="p-4 sm:p-6 bg-retro-gray">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              
              {/* Info Kontak Kiri (Direct WhatsApp & Gmail Kosongan) */}
              <div className="space-y-4">
                <div>
                  <h2 className="text-2xl font-bold font-mono tracking-tight text-red-700">Contact</h2>
                  <p className="text-xs text-gray-700 mt-2 leading-relaxed">
                    Whether you have an open engineering role, a software project in mind, or want to discuss technical architecture, feel free to reach out.
                  </p>
                </div>

                <div className="space-y-3 pt-2">
                  {/* Link WhatsApp Kosongan */}
                  <a 
                    href="https://wa.me/6281382102541" 
                    target="_blank" 
                    rel="noreferrer"
                    className="flex items-center gap-3 p-2 bg-white retro-box-sunken group hover:bg-green-50 transition-colors no-underline text-black block"
                  >
                    <div className="retro-btn p-2 group-hover:bg-green-600 group-hover:text-white transition-colors">
                      <Phone className="w-4 h-4 text-red-600 group-hover:text-white" />
                    </div>
                    <div>
                      <div className="text-[10px] text-gray-500 font-bold uppercase font-mono flex items-center gap-1">
                        <span>PHONE / WHATSAPP</span>
                        <ExternalLink size={10} className="text-gray-400" />
                      </div>
                      <div className="text-xs font-mono font-bold">{profileData.phone}</div>
                    </div>
                  </a>

                  {/* Link Gmail Kosongan */}
                  <a 
                    href={`mailto:${profileData.email}`} 
                    className="flex items-center gap-3 p-2 bg-white retro-box-sunken group hover:bg-blue-50 transition-colors no-underline text-black block"
                  >
                    <div className="retro-btn p-2 group-hover:bg-blue-600 group-hover:text-white transition-colors">
                      <Mail className="w-4 h-4 text-red-600 group-hover:text-white" />
                    </div>
                    <div>
                      <div className="text-[10px] text-gray-500 font-bold uppercase font-mono flex items-center gap-1">
                        <span>EMAIL DIRECTLY</span>
                        <ExternalLink size={10} className="text-gray-400" />
                      </div>
                      <div className="text-xs font-mono font-bold truncate">{profileData.email}</div>
                    </div>
                  </a>
                </div>
              </div>

              {/* Form Pesan Langsung */}
              <form onSubmit={handleSend} className="space-y-3">
                <div>
                  <label className="block text-xs font-bold mb-1 font-mono">Your Name / Company *</label>
                  <input
                    type="text"
                    required
                    value={contactForm.name}
                    onChange={(e) => setContactForm({ ...contactForm, name: e.target.value })}
                    placeholder="e.g. Recruiter / Company"
                    className="w-full p-2 text-xs bg-white retro-box-sunken outline-none font-mono"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold mb-1 font-mono">Email Address *</label>
                  <input
                    type="email"
                    required
                    value={contactForm.email}
                    onChange={(e) => setContactForm({ ...contactForm, email: e.target.value })}
                    placeholder="e.g. recruiter@company.com"
                    className="w-full p-2 text-xs bg-white retro-box-sunken outline-none font-mono"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold mb-1 font-mono">Message *</label>
                  <textarea
                    rows={4}
                    required
                    value={contactForm.message}
                    onChange={(e) => setContactForm({ ...contactForm, message: e.target.value })}
                    placeholder="Tell me about the role, project, or collaboration..."
                    className="w-full p-2 text-xs bg-white retro-box-sunken outline-none font-mono resize-none"
                  ></textarea>
                </div>

                {submitError && (
                  <div className="text-xs text-red-600 font-mono bg-red-100 p-1.5 border border-red-400">
                    {submitError}
                  </div>
                )}

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="retro-btn w-full py-2 bg-[#d92323] text-white font-bold text-xs flex items-center justify-center gap-2 hover:bg-red-700 active:translate-y-0.5 disabled:opacity-50"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>{isSubmitting ? "Dispatching Message..." : "Send Message"}</span>
                </button>
              </form>

            </div>
          </div>
        </section>

      </main>

      {/* ================= MODAL OVERLAY: CV VIEWER ================= */}
      {isCvOpen && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-3">
          <div className="bg-retro-gray retro-box-raised w-full max-w-2xl max-h-[88vh] flex flex-col p-1">
            <div className="bg-gradient-to-r from-retro-blue to-retro-blue-light text-white px-2 py-1 flex items-center justify-between font-bold text-xs sm:text-sm select-none">
              <div className="flex items-center gap-2">
                <FileText className="w-4 h-4" />
                <span className="truncate">Curriculum_Vitae_Document_Viewer.pdf</span>
              </div>
              <div className="flex items-center gap-1">
                <button className="retro-btn w-4 h-4 flex items-center justify-center text-[10px] text-black" aria-label="Minimize"><Minus size={10} /></button>
                <button className="retro-btn w-4 h-4 flex items-center justify-center text-[10px] text-black" aria-label="Maximize"><Square size={9} /></button>
                <button 
                  onClick={() => setIsCvOpen(false)} 
                  className="retro-btn w-4 h-4 flex items-center justify-center text-black font-bold text-xs"
                  aria-label="Close"
                >
                  ✕
                </button>
              </div>
            </div>

            <div className="p-4 sm:p-6 bg-white retro-box-sunken overflow-y-auto flex-1 font-serif text-xs sm:text-sm leading-relaxed space-y-4 m-2">
              <div className="border-b-2 border-black pb-2 text-center">
                <h2 className="text-xl font-bold uppercase tracking-wider">{profileData.name}</h2>
                <p className="text-xs font-mono">{profileData.email} | {profileData.phone}</p>
                <p className="text-xs italic font-sans">{profileData.title} • {profileData.specialization}</p>
              </div>

              <div>
                <h3 className="font-bold text-xs border-b border-gray-400 mb-1 font-sans">SUMMARY</h3>
                <p className="text-xs leading-relaxed">{profileData.about}</p>
              </div>

              <div>
                <h3 className="font-bold text-xs border-b border-gray-400 mb-1 font-sans">TECHNICAL PROFICIENCY</h3>
                <p className="text-xs"><strong>Languages:</strong> C, Java, Python, JavaScript, SQL</p>
                <p className="text-xs"><strong>Backend & Systems:</strong> Express.js, Docker, RESTful APIs, MySQL, RBAC Auth</p>
              </div>

              <div>
                <h3 className="font-bold text-xs border-b border-gray-400 mb-1 font-sans">KEY PROJECTS</h3>
                {projectsData.map(p => (
                  <div key={p.id} className="text-xs mb-2">
                    <p className="font-bold font-sans">{p.title} ({p.languages.join(", ")})</p>
                    <p className="text-gray-700">{p.description}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="p-2 flex justify-end gap-2 bg-retro-gray border-t border-gray-400">
              <button 
                onClick={() => setIsCvOpen(false)}
                className="retro-btn px-5 py-1 text-xs font-bold"
              >
                Close Viewer
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ================= MODAL OVERLAY: RETRO IMAGE VIEWER (FULL UNCUT SCALE) ================= */}
      {previewImage && (
        <div 
          className="fixed inset-0 bg-black/75 z-50 flex items-center justify-center p-3 sm:p-6"
          onClick={() => setPreviewImage(null)}
        >
          <div 
            className="bg-retro-gray retro-box-raised w-full max-w-4xl max-h-[92vh] flex flex-col p-1 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Titlebar */}
            <div className="bg-gradient-to-r from-retro-blue to-retro-blue-light text-white px-2 py-1 flex items-center justify-between font-bold text-xs sm:text-sm select-none">
              <div className="flex items-center gap-2 truncate">
                <ImageIcon className="w-4 h-4 text-cyan-200 flex-shrink-0" />
                <span className="truncate">ImageViewer.exe - {previewImage.title}</span>
              </div>
              <div className="flex items-center gap-1 flex-shrink-0">
                <button className="retro-btn w-4 h-4 flex items-center justify-center text-[10px] text-black" aria-label="Minimize"><Minus size={10} /></button>
                <button className="retro-btn w-4 h-4 flex items-center justify-center text-[10px] text-black" aria-label="Maximize"><Square size={9} /></button>
                <button 
                  onClick={() => setPreviewImage(null)} 
                  className="retro-btn w-4 h-4 flex items-center justify-center text-black font-bold text-xs active:translate-y-0.5"
                  aria-label="Close"
                >
                  ✕
                </button>
              </div>
            </div>

            {/* Retro Menu Bar */}
            <div className="flex items-center gap-3 px-2 py-0.5 text-[11px] font-mono border-b border-gray-400 bg-retro-gray text-gray-800 select-none">
              <span className="hover:bg-retro-blue hover:text-white px-1 cursor-pointer">File</span>
              <span className="hover:bg-retro-blue hover:text-white px-1 cursor-pointer">View</span>
              <span className="hover:bg-retro-blue hover:text-white px-1 cursor-pointer">Zoom</span>
              <span className="text-gray-500 ml-auto hidden sm:inline">[Original Uncut Resolution]</span>
            </div>

            {/* Image Canvas Viewport */}
            <div className="bg-[#141414] retro-box-sunken p-2 sm:p-4 m-1 flex-1 flex items-center justify-center overflow-auto max-h-[72vh] relative group/viewer">
              <img 
                src={previewImage.url} 
                alt={previewImage.title} 
                className="max-w-full max-h-[68vh] object-contain border border-gray-600 shadow-lg select-none"
              />

              {/* Tombol Navigasi Cepat di atas Foto jika terdapat multiple images */}
              {previewImage.images && previewImage.images.length > 1 && (
                <>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      const newIdx = (previewImage.currentIndex - 1 + previewImage.images.length) % previewImage.images.length;
                      setPreviewImage((prev) => ({
                        ...prev,
                        url: prev.images[newIdx],
                        currentIndex: newIdx,
                      }));
                    }}
                    className="retro-btn absolute left-3 top-1/2 -translate-y-1/2 px-3 py-2 font-bold text-sm bg-[#d4d0c8] shadow-lg opacity-80 hover:opacity-100 active:translate-y-[-46%]"
                    title="Foto Sebelumnya (Left Arrow)"
                  >
                    ◀
                  </button>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      const newIdx = (previewImage.currentIndex + 1) % previewImage.images.length;
                      setPreviewImage((prev) => ({
                        ...prev,
                        url: prev.images[newIdx],
                        currentIndex: newIdx,
                      }));
                    }}
                    className="retro-btn absolute right-3 top-1/2 -translate-y-1/2 px-3 py-2 font-bold text-sm bg-[#d4d0c8] shadow-lg opacity-80 hover:opacity-100 active:translate-y-[-46%]"
                    title="Foto Selanjutnya (Right Arrow)"
                  >
                    ▶
                  </button>
                </>
              )}
            </div>

            {/* Retro Status Bar */}
            <div className="px-2 py-1 flex items-center justify-between text-[11px] font-mono text-gray-700 bg-retro-gray border-t border-gray-400 select-none flex-wrap gap-2">
              <div className="flex items-center gap-2 truncate">
                <span className="truncate">{previewImage.subtitle || "Original Resolution View"}</span>
                {previewImage.images && previewImage.images.length > 1 && (
                  <span className="bg-yellow-200 text-yellow-900 border border-yellow-500 px-1.5 py-0.5 text-[10px] font-bold">
                    Photo {previewImage.currentIndex + 1} of {previewImage.images.length}
                  </span>
                )}
              </div>
              <div className="flex items-center gap-2 flex-shrink-0">
                {previewImage.images && previewImage.images.length > 1 && (
                  <>
                    <button
                      type="button"
                      onClick={() => {
                        const newIdx = (previewImage.currentIndex - 1 + previewImage.images.length) % previewImage.images.length;
                        setPreviewImage((prev) => ({
                          ...prev,
                          url: prev.images[newIdx],
                          currentIndex: newIdx,
                        }));
                      }}
                      className="retro-btn px-2.5 py-0.5 text-xs font-bold active:translate-y-0.5"
                    >
                      ◀ Prev
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        const newIdx = (previewImage.currentIndex + 1) % previewImage.images.length;
                        setPreviewImage((prev) => ({
                          ...prev,
                          url: prev.images[newIdx],
                          currentIndex: newIdx,
                        }));
                      }}
                      className="retro-btn px-2.5 py-0.5 text-xs font-bold active:translate-y-0.5"
                    >
                      Next ▶
                    </button>
                  </>
                )}
                <button 
                  onClick={() => setPreviewImage(null)}
                  className="retro-btn px-4 py-0.5 text-xs font-bold active:translate-y-0.5 ml-2 flex-shrink-0"
                >
                  Close (Esc)
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ================= DIALOG NOTIFIKASI SUKSES (ALERT) ================= */}
      {sentAlert && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4">
          <div className="bg-retro-gray retro-box-raised w-80 p-1">
            <div className="bg-retro-blue text-white px-2 py-1 flex justify-between items-center text-xs font-bold">
              <span>Message_Status.dll</span>
              <button onClick={() => setSentAlert(false)} className="text-white">✕</button>
            </div>
            <div className="p-4 flex items-center gap-3 bg-retro-gray">
              <CheckCircle className="w-8 h-8 text-green-700 flex-shrink-0" />
              <div className="text-xs">
                <strong>Message Dispatched!</strong>
                <p className="text-gray-600 mt-0.5">Your message has been sent successfully.</p>
              </div>
            </div>
            <div className="p-2 flex justify-center bg-retro-gray">
              <button onClick={() => setSentAlert(false)} className="retro-btn px-6 py-1 text-xs font-bold">
                OK
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ================= WINDOWS 95 START MENU POPUP ================= */}
      {isStartMenuOpen && (
        <>
          <div 
            className="fixed inset-0 z-45"
            onClick={() => setIsStartMenuOpen(false)}
          />
          <div className="fixed bottom-10 left-1 z-50 bg-retro-gray retro-box-raised w-60 flex p-1 select-none">
            {/* Start Menu Vertical Side Banner */}
            <div className="bg-gradient-to-t from-retro-blue to-retro-blue-light text-white font-bold font-mono text-sm px-1.5 py-4 flex items-end justify-center">
              <span className="[writing-mode:vertical-rl] rotate-180 tracking-widest text-xs">AjiOS 95</span>
            </div>

            {/* OS Info & System Details */}
            <div className="flex-1 p-3 text-xs font-mono space-y-2">
              <div className="border-b border-gray-400 pb-1.5">
                <p className="font-bold text-sm text-blue-950 flex items-center gap-1.5">
          
                  <span>[v2026.1]</span>
                </p>
              </div>

              <div className="space-y-1 text-[11px] text-gray-800">
                <p><strong>Owner:</strong> {profileData.name}</p>
                <p className="text-green-800 font-bold flex items-center gap-1 mt-1">
                  <span className="w-2 h-2 rounded-full bg-green-500 inline-block animate-pulse"></span>
                  <span>System Online & Ready</span>
                </p>
              </div>

              <div className="pt-2 border-t border-gray-300 flex justify-end">
                <button
                  onClick={() => setIsStartMenuOpen(false)}
                  className="retro-btn px-3 py-0.5 text-[11px] font-bold"
                >
                  OK
                </button>
              </div>
            </div>
          </div>
        </>
      )}

      {/* ================= RETRO TASKBAR FOOTER ================= */}
      <footer className="fixed bottom-0 left-0 right-0 h-10 bg-retro-gray retro-box-raised flex items-center justify-between px-2 z-40 select-none">
        <div className="flex items-center gap-1 sm:gap-2 flex-1 min-w-0 mr-2 overflow-hidden">
          {/* Start Button */}
          <button 
            onClick={() => setIsStartMenuOpen(!isStartMenuOpen)}
            className={`retro-btn px-2.5 sm:px-3 py-1 font-bold text-xs flex items-center gap-1.5 flex-shrink-0 ${
              isStartMenuOpen ? 'retro-box-sunken bg-gray-300' : ''
            }`}
          >
            <div className=""></div> {/* tampat nari gambar*/}
            <span className="hidden sm:inline">Start</span>
          </button>

          {/* Running App Buttons in Taskbar */}
          <div className="flex items-center gap-1 overflow-x-auto py-0.5 max-w-full">
            {taskbarApps.map((app) => {
              const IconComponent = app.icon;
              const isActive = activeSection === app.id;
              return (
                <button
                  key={app.id}
                  onClick={() => scrollTo(app.id)}
                  title={`Go to ${app.title}`}
                  className={`px-2 py-1 text-[11px] font-mono font-bold flex items-center gap-1.5 whitespace-nowrap transition-all flex-shrink-0 ${
                    isActive 
                      ? 'retro-box-sunken bg-[#b8b4ab] text-black border border-black/50' 
                      : 'retro-btn text-gray-800 hover:bg-gray-100'
                  }`}
                >
                  {/* Status Indicator: Green when active, gray when inactive */}
                  <span className={`w-2 h-2 rounded-full flex-shrink-0 ${
                    isActive 
                      ? 'bg-green-500 shadow-[0_0_6px_#22c55e] animate-pulse' 
                      : 'bg-gray-400'
                  }`} />
                  <IconComponent size={12} className="flex-shrink-0" />
                  <span className={isActive ? 'font-bold text-green-950' : ''}>{app.name}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Taskbar Right: CRT Toggle & Clock */}
        <div className="flex items-center gap-1.5 flex-shrink-0">
          {/* CRT Monitor Effect Toggle Button */}
          <button 
            onClick={() => setCrtEnabled(!crtEnabled)}
            title="Toggle CRT Screen Scanlines (Uji Coba)"
            className={`retro-btn px-2 py-1 text-[11px] font-mono font-bold flex items-center gap-1 ${
              crtEnabled ? 'text-green-800' : 'text-gray-500'
            }`}
          >
            <span>📺 CRT: {crtEnabled ? "ON" : "OFF"}</span>
          </button>

          {/* Digital Clock */}
          <div className="retro-box-sunken px-2.5 py-1 bg-retro-gray text-xs font-mono font-bold">
            {time || "12:00 PM"}
          </div>
        </div>
      </footer>

      {/* ================= CRT MONITOR SCANLINE OVERLAY ================= */}
      {crtEnabled && <div className="crt-screen" />}

    </div>
  );
}