"use client"

import { useState, useEffect, useRef } from "react"
import { motion, AnimatePresence, Variants } from "framer-motion"
import {
  ChevronDown,
  Github,
  Linkedin,
  Twitter,
  ExternalLink,
  Award,
  GraduationCap,
  Briefcase,
  User,
  Menu,
  X,
  MapPin,
  Mail,
  Sun,
  Moon,
  ChevronUp,
} from "lucide-react"
import {
  SiReact, SiNextdotjs, SiTypescript, SiNodedotjs,
  SiPython, SiMongodb, SiDocker, SiGithub,
  SiJavascript, SiHtml5, SiCss, SiExpress,
  SiMysql, SiTensorflow, SiOpencv, SiGit,
  SiLinux, SiFirebase, SiKubernetes,
  SiTailwindcss, SiFastapi, SiPostgresql,
  SiPostman, SiVercel, SiPandas, SiScikitlearn,
  SiRust, SiGraphql,
} from "react-icons/si"
import { FaAws } from "react-icons/fa"
import Image from "next/image"
import { collection, getDocs, doc, getDoc, query, orderBy } from "firebase/firestore";
import { db } from "@/lib/firebase";

// LeetCode Icon Component
const LeetCodeIcon = ({ size = 24, className = "" }: { size?: number; className?: string }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <path d="M12 13h7.5" />
    <path d="M9.424 7.268l4.999 -4.999" />
    <path d="M16.633 16.644l-2.402 2.415a3.189 3.189 0 0 1 -4.524 0l-3.77 -3.787a3.223 3.223 0 0 1 0 -4.544l3.77 -3.787a3.19 3.19 0 0 1 4.524 0l2.302 2.313" />
  </svg>
)

const LeetCodeModal = ({ isOpen, onClose, username = "harsh_agar_12" }: { isOpen: boolean; onClose: () => void; username?: string }) => {
    const [data, setData] = useState<any>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
  
    useEffect(() => {
      if (isOpen && !data) {
        setLoading(true);
        // Using external API to avoid server-side route issues with static export
        fetch(`https://alfa-leetcode-api.onrender.com/userProfile/${username}`)
          .then((res) => {

            if (!res.ok) throw new Error("Failed to fetch data");
            return res.json();
          })
          .then((data) => {
             console.log("LeetCode Data:", data)
             if (data.status === 'error') {
                 throw new Error(data.message || "Failed to fetch data");
             }
             setData(data)
          })
          .catch((err) => setError(err.message))
          .finally(() => setLoading(false));
      }
    }, [isOpen, username, data]);
  
    if (!isOpen) return null;
  
    return (
      <div className="leetcode-modal-overlay" onClick={onClose}>
        <div 
            className="leetcode-modal-content"
            onClick={e => e.stopPropagation()}
        >
          <button 
            onClick={onClose}
            className="leetcode-close-btn"
          >
           <X size={24} />
          </button>
  
          <div className="leetcode-header">
            <div className="leetcode-icon-wrapper">
               <LeetCodeIcon className="text-sky-400" size={32} />
            </div>
            <div>
                <h3 className="text-xl font-bold text-white">LeetCode Stats</h3>
                <p className="text-slate-400 text-sm">@{username}</p>
            </div>
          </div>
  
          {loading ? (
            <div className="flex justify-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-sky-400"></div>
            </div>
          ) : error ? (
            <div className="text-red-400 text-center py-4">{error}</div>
          ) : data ? (
            <div className="leetcode-body">
                 {/* Rank & Total */}
                 <div className="leetcode-grid">
                    <div className="leetcode-stat-box">
                        <div className="leetcode-stat-label">Global Ranking</div>
                        <div className="leetcode-stat-value">
                            {parseInt(data.ranking).toLocaleString()}
                        </div>
                    </div>
                    <div className="leetcode-stat-box">
                        <div className="leetcode-stat-label">Total Solved</div>
                        <div className="leetcode-stat-value">
                            {data.totalSolved}
                        </div>
                    </div>
                 </div>
  
                 {/* Progress Bars */}
                 <div className="leetcode-progress-container">
                    <div className="leetcode-progress-item">
                        <div className="leetcode-progress-header">
                            <span className="text-emerald-400">Easy</span>
                            <span className="text-slate-300">
                                {data.easySolved} 
                                <span className="text-slate-500 text-xs ml-1">
                                     / {data.totalEasy}
                                </span>
                            </span>
                        </div>
                        <div className="leetcode-progress-track">
                            <div 
                                className="leetcode-progress-fill bg-emerald-400"
                                style={{ width: `${(data.easySolved / data.totalEasy * 100) || 0}%`, backgroundColor: '#34d399' }}
                            />
                        </div>
                    </div>
  
                    <div className="leetcode-progress-item">
                        <div className="leetcode-progress-header">
                            <span className="text-indigo-400">Medium</span>
                            <span className="text-slate-300">
                                {data.mediumSolved}
                                <span className="text-slate-500 text-xs ml-1">
                                     / {data.totalMedium}
                                </span>
                            </span>
                        </div>
                        <div className="leetcode-progress-track">
                            <div 
                                className="leetcode-progress-fill bg-indigo-400"
                                style={{ width: `${(data.mediumSolved / data.totalMedium * 100) || 0}%`, backgroundColor: '#818cf8' }}
                            />
                        </div>
                    </div>
  
                    <div className="leetcode-progress-item">
                        <div className="leetcode-progress-header">
                            <span className="text-rose-400">Hard</span>
                            <span className="text-slate-300">
                                {data.hardSolved}
                                <span className="text-slate-500 text-xs ml-1">
                                     / {data.totalHard}
                                </span>
                            </span>
                        </div>
                        <div className="leetcode-progress-track">
                            <div 
                                className="leetcode-progress-fill bg-rose-400"
                                style={{ width: `${(data.hardSolved / data.totalHard * 100) || 0}%`, backgroundColor: '#fb7185' }}
                            />
                        </div>
                    </div>
                 </div>
  
                 <a 
                    href={`https://leetcode.com/${username}/`} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="leetcode-btn-primary"
                 >
                    <span>View Full Profile</span>
                    <ExternalLink size={16} />
                 </a>
            </div>
          ) : null}
        </div>
      </div>
    );
  };

const GithubStatsModal = ({ isOpen, onClose, username }: { isOpen: boolean; onClose: () => void; username: string }) => {
    const [data, setData] = useState<any>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
  
    useEffect(() => {
      if (isOpen && !data) {
        setLoading(true);
        fetch(`https://api.github.com/users/${username}`)
          .then((res) => {
            if (!res.ok) throw new Error("Failed to fetch data");
            return res.json();
          })
          .then((userJson) => {
            return fetch(`https://api.github.com/users/${username}/repos?per_page=100`)
              .then(res => res.json())
              .then(reposJson => {
                const languages: any = {};
                if (Array.isArray(reposJson)) {
                  reposJson.forEach((repo: any) => {
                    if (repo.language) {
                      languages[repo.language] = (languages[repo.language] || 0) + 1;
                    }
                  });
                }
                
                const topLanguages = Object.entries(languages)
                  .sort((a: any, b: any) => b[1] - a[1])
                  .slice(0, 3)
                  .map(entry => entry[0]);

                setData({
                  ...userJson,
                  topLanguages,
                  totalStars: Array.isArray(reposJson) ? reposJson.reduce((acc: number, repo: any) => acc + repo.stargazers_count, 0) : 0
                });
                setLoading(false);
              });
          })
          .catch((err) => {
            setError(err.message);
            setLoading(false);
          });
      }
    }, [isOpen, username, data]);
  
    if (!isOpen) return null;
  
    return (
      <div className="leetcode-modal-overlay" onClick={onClose}>
        <div className="leetcode-modal-content" onClick={e => e.stopPropagation()}>
          <button className="leetcode-modal-close" onClick={onClose}>
            <X size={20} />
          </button>
          
          <div className="leetcode-header">
              <div className="leetcode-icon-wrapper" style={{ borderRadius: '50%', background: 'rgba(56, 189, 248, 0.1)' }}>
                  <Github className="text-sky-400" size={32} />
              </div>
              <div>
                  <h3 className="text-xl font-bold text-white tracking-tight">GitHub Identity</h3>
                  <p className="text-slate-400 text-sm">@{username}</p>
              </div>
          </div>
  
          {loading ? (
              <div className="py-20 text-center">
                  <div className="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-sky-400 mb-4"></div>
                  <p className="text-slate-400 animate-pulse">Syncing repositories...</p>
              </div>
          ) : error ? (
              <div className="py-10 text-center text-rose-400 bg-rose-400/10 rounded-xl border border-rose-400/20">
                  <p>Synchronization failed: {error}</p>
              </div>
          ) : data ? (
            <div className="leetcode-body">
                 {/* GitHub Stats Grid */}
                 <div className="leetcode-grid">
                    <div className="leetcode-stat-box">
                        <div className="leetcode-stat-label">Repositories</div>
                        <div className="leetcode-stat-value">{data.public_repos}</div>
                    </div>
                    <div className="leetcode-stat-box">
                        <div className="leetcode-stat-label">Followers</div>
                        <div className="leetcode-stat-value text-sky-400">{data.followers}</div>
                    </div>
                    <div className="leetcode-stat-box">
                        <div className="leetcode-stat-label">Total Stars</div>
                        <div className="leetcode-stat-value">{data.totalStars}</div>
                    </div>
                 </div>

                 {/* Top Languages as Progress-themed Items */}
                 <div className="leetcode-progress-container">
                    <h4 className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-4">Top Specializations</h4>
                    {data.topLanguages?.map((lang: string, index: number) => (
                        <div key={lang} className="leetcode-progress-item">
                            <div className="leetcode-progress-header">
                                <span className={index === 0 ? "text-sky-400" : "text-slate-300"}>{lang}</span>
                                <span className="text-slate-500 text-[10px] uppercase">{index === 0 ? "Primary" : "Core"}</span>
                            </div>
                            <div className="leetcode-progress-track">
                                <div 
                                    className="leetcode-progress-fill"
                                    style={{ 
                                        width: `${100 - (index * 25)}%`, 
                                        backgroundColor: index === 0 ? '#38bdf8' : '#6366f1',
                                        opacity: 1 - (index * 0.15)
                                    }}
                                />
                            </div>
                        </div>
                    ))}
                 </div>
                 
                 <div className="pt-2">
                    <a 
                        href={`https://github.com/${username}`} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="leetcode-btn-primary"
                    >
                        <span>Explore Full Repository</span>
                        <ExternalLink size={16} />
                    </a>
                 </div>
            </div>
          ) : null}
        </div>
      </div>
    );
  };

export default function Portfolio() {
  const [activeSection, setActiveSection] = useState("home")
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isGithubOpen, setIsGithubOpen] = useState(false)
  const [scrollY, setScrollY] = useState(0)
  const [isDarkMode, setIsDarkMode] = useState(true)
  
  const [activeCategory, setActiveCategory] = useState("All")
  const [showScrollTop, setShowScrollTop] = useState(false)
  
  // Firebase Data State
  const [projects, setProjects] = useState<any[]>([]);
  const [accomplishments, setAccomplishments] = useState<any[]>([]);
  const [resumeUrl, setResumeUrl] = useState("");

  // Role rotation for hero
  const roles = ["Full Stack Developer", "Third-Year CSE Student", "AI/ML Enthusiast", "Problem Solver"]
  const [roleIndex, setRoleIndex] = useState(0)

  useEffect(() => {
    const interval = setInterval(() => {
      setRoleIndex((prev) => (prev + 1) % roles.length)
    }, 3000)
    return () => clearInterval(interval)
  }, [])

  useEffect(() => {
    const fetchData = async () => {
      try {
        const projectsQuery = query(collection(db, "projects"), orderBy("order", "asc"));
        const projectsSnap = await getDocs(projectsQuery);
        if (!projectsSnap.empty) {
            setProjects(projectsSnap.docs.map(d => d.data()));
        }
        const accQuery = query(collection(db, "accomplishments"), orderBy("order", "asc"));
        const accSnap = await getDocs(accQuery);
        if (!accSnap.empty) {
            setAccomplishments(accSnap.docs.map(d => d.data()));
        }
        const resumeSnap = await getDoc(doc(db, "settings", "resume"));
        if (resumeSnap.exists()) {
            setResumeUrl(resumeSnap.data().url);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    fetchData();
  }, []);

  // --- Indicator state ---
  const navRefs = useRef<{ [key: string]: HTMLButtonElement | null }>({})
  const indicatorRef = useRef<HTMLDivElement>(null)
  const [indicatorStyle, setIndicatorStyle] = useState({ left: 0, width: 0 })

  useEffect(() => {
    const updateIndicator = () => {
      const activeRef = navRefs.current[activeSection]
      if (activeRef && indicatorRef.current) {
        const rect = activeRef.getBoundingClientRect()
        const parentRect = activeRef.parentElement?.getBoundingClientRect()
        if (parentRect) {
          setIndicatorStyle({
            left: rect.left - parentRect.left,
            width: rect.width,
          })
        }
      }
    }
    updateIndicator()
    window.addEventListener("resize", updateIndicator)
    return () => window.removeEventListener("resize", updateIndicator)
  }, [activeSection, isMenuOpen])

  // Theme toggle
  useEffect(() => {
    const savedTheme = localStorage.getItem("theme")
    if (savedTheme) {
      setIsDarkMode(savedTheme === "dark")
    }
  }, [])

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", isDarkMode ? "dark" : "light")
    localStorage.setItem("theme", isDarkMode ? "dark" : "light")
  }, [isDarkMode])

  const toggleTheme = () => setIsDarkMode(!isDarkMode)

  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY)
      const sections = ["home", "about", "skills", "projects", "accomplishments", "education"]
      const currentSection = sections.find((section) => {
        const element = document.getElementById(section)
        if (element) {
          const rect = element.getBoundingClientRect()
          return rect.top <= 100 && rect.bottom >= 100
        }
        return false
      })
      if (currentSection) setActiveSection(currentSection)
    }
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId)
    if (element) element.scrollIntoView({ behavior: "smooth" })
    if (isMenuOpen) setIsMenuOpen(false)
  }

  const navItems = [
    { id: "home", label: "Home", icon: User },
    { id: "about", label: "About", icon: User },
    { id: "skills", label: "Skills", icon: Briefcase },
    { id: "projects", label: "Projects", icon: Briefcase },
    { id: "accomplishments", label: "Accomplishments", icon: Award },
    { id: "education", label: "Education", icon: GraduationCap },
  ]

  // Scroll to Top visibility
  useEffect(() => {
    const checkScrollTop = () => {
      setShowScrollTop(window.scrollY > 400)
    }
    window.addEventListener("scroll", checkScrollTop)
    return () => window.removeEventListener("scroll", checkScrollTop)
  }, [])

  const scrollToTop = () => window.scrollTo({ top: 0, behavior: "smooth" })

  const categories = ["All", "Web App", "AI/ML", "IoT", "Chrome Extension"]

  // Framer Motion variants
  const sectionVariants: Variants = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } },
  }

  const staggerContainer: Variants = {
    hidden: {},
    visible: { transition: { staggerChildren: 0.1 } },
  }

  const staggerItem: Variants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } },
  }

  // Skills data with brand icons
  // Skills data with brand icons and grid spans
  const skillCategories = [
    {
      title: "Frontend",
      className: "bento-card-large",
      icon: SiReact,
      skills: [
        { name: "React", desc: "Component architecture", icon: SiReact },
        { name: "Next.js", desc: "Full-stack framework", icon: SiNextdotjs },
        { name: "TypeScript", desc: "Type-safe development", icon: SiTypescript },
        { name: "TailwindCSS", desc: "Utility-first styling", icon: SiTailwindcss },
        { name: "HTML/CSS", desc: "Semantic markup & styling", icon: SiCss },
      ],
    },
    {
      title: "Backend & DB",
      className: "bento-card-tall",
      icon: SiNodedotjs,
      skills: [
        { name: "Node.js", desc: "Server environment", icon: SiNodedotjs },
        { name: "Express", desc: "API framework", icon: SiExpress },
        { name: "FastAPI", desc: "High-perf Python APIs", icon: SiFastapi },
        { name: "PostgreSQL", desc: "Relational DB", icon: SiPostgresql },
        { name: "MongoDB", desc: "NoSQL database", icon: SiMongodb },
        { name: "MySQL", desc: "Relational database", icon: SiMysql },
      ],
    },
    {
      title: "Tools & DevOps",
      className: "bento-card-standard",
      icon: SiDocker,
      skills: [
        { name: "Docker", desc: "Containerization", icon: SiDocker },
        { name: "Git", desc: "Version control", icon: SiGit },
        { name: "Postman", desc: "API testing", icon: SiPostman },
        { name: "Vercel", desc: "Deployment platform", icon: SiVercel },
      ],
    },
    {
      title: "AI & ML",
      className: "bento-card-wide",
      icon: SiTensorflow,
      skills: [
        { name: "Python", desc: "Data processing", icon: SiPython },
        { name: "TensorFlow", desc: "Deep learning", icon: SiTensorflow },
        { name: "Pandas", desc: "Data analysis", icon: SiPandas },
        { name: "Scikit-learn", desc: "Machine learning", icon: SiScikitlearn },
        { name: "OpenCV", desc: "Computer vision", icon: SiOpencv },
      ],
    },
    {
      title: "Currently Learning",
      className: "bento-card-full",
      icon: FaAws,
      skills: [
        { name: "AWS", desc: "Cloud", icon: FaAws },
        { name: "Rust", desc: "Systems programming", icon: SiRust },
        { name: "Microservices", desc: "Distributed systems", icon: SiNodedotjs },
        { name: "GraphQL", desc: "API query language", icon: SiGraphql },
      ],
    },
  ]

  // Hero tech stack icons
  const techStack = [
    { icon: SiReact, label: "React" },
    { icon: SiNextdotjs, label: "Next.js" },
    { icon: SiTypescript, label: "TypeScript" },
    { icon: SiNodedotjs, label: "Node.js" },
    { icon: SiPython, label: "Python" },
    { icon: SiMongodb, label: "MongoDB" },
    { icon: SiDocker, label: "Docker" },
    { icon: SiGithub, label: "GitHub" },
  ]

  const [isLeetCodeModalOpen, setIsLeetCodeModalOpen] = useState(false);

  const socialLinks = [
    { 
        href: "https://github.com/harshagar12", 
        icon: Github, 
        label: "GitHub",
        onClick: (e: React.MouseEvent) => {
            e.preventDefault();
            setIsGithubOpen(true);
        }
    },
    { href: "https://www.linkedin.com/in/harsh-agarwal-a31b4528b", icon: Linkedin, label: "LinkedIn" },
    { href: "https://x.com/HarshAgar12", icon: Twitter, label: "Twitter" },
    { 
        href: "#", 
        icon: LeetCodeIcon, 
        label: "LeetCode", 
        onClick: (e: React.MouseEvent) => {
            e.preventDefault();
            setIsLeetCodeModalOpen(true);
        }
    },
  ]

  return (
    <div className="portfolio-container">
      {/* Ambient Background */}
      <div className="ambient-bg">
        <div className="mesh-blob mesh-blob-1" />
        <div className="mesh-blob mesh-blob-2" />
        <div className="mesh-blob mesh-blob-3" />
        <div className="mesh-blob mesh-blob-4" />
        <div className="noise-overlay" />
      </div>




      {/* Enhanced Navigation */}
      <nav className={`navbar ${scrollY > 50 ? "scrolled" : ""}`}>
  <div className="nav-container">
    <div className="nav-brand">
      <span className="brand-name">Harsh Agarwal</span>
    </div>

    <div className={`nav-menu ${isMenuOpen ? "active" : ""}`} style={{ position: "relative" }}>
      {/* Animated indicator bar */}
      <div
        ref={indicatorRef}
        style={{
          position: "absolute",
          left: indicatorStyle.left,
          width: indicatorStyle.width,
          height: 4,
          bottom: 0,
          background: "var(--accent-primary)",
          borderRadius: 2,
          transition: "left 0.4s cubic-bezier(0.4,0,0.2,1), width 0.4s cubic-bezier(0.4,0,0.2,1)",
          zIndex: 0,
          pointerEvents: "none",
        }}
      />
      {navItems.map((item) => {
        const Icon = item.icon;
        return (
          <button
            key={item.id}
            ref={el => { navRefs.current[item.id] = el; }}
            onClick={() => scrollToSection(item.id)}
            className={`nav-item ${activeSection === item.id ? "active" : ""}`}
          >
            <Icon size={18} />
            <span className="nav-label">{item.label}</span>
          </button>
        );
      })}
      
      {/* Social links for mobile/tablet only */}
      <div className="nav-social-mobile">
        {socialLinks.map((social) => {
          const Icon = social.icon
          
          if (social.onClick) {
             return (
               <button
                  key={social.label}
                  onClick={social.onClick as any}
                  className="nav-social-link"
                  aria-label={social.label}
                  style={{ cursor: 'pointer' }}
               >
                 <Icon size={16} />
               </button>
             )
          }

          return (
            <a
              key={social.label}
              href={social.href}
              target="_blank"
              rel="noopener noreferrer"
              className="nav-social-link"
              aria-label={social.label}
            >
              <Icon size={16} />
            </a>
          )
        })}
      </div>

    </div>

    <div className="nav-actions">
      {/* Desktop Social Links */}
      <div className="nav-social">
        {socialLinks.map((social) => {
          const Icon = social.icon
          
          if (social.onClick) {
            return (
              <button
                 key={social.label}
                 onClick={social.onClick as any}
                 className="nav-social-link"
                 aria-label={social.label}
                 style={{ cursor: 'pointer' }}
              >
                <Icon size={18} />
              </button>
            )
          }
          
          return (
            <a
              key={social.label}
              href={social.href}
              target="_blank"
              rel="noopener noreferrer"
              className="nav-social-link"
              aria-label={social.label}
            >
              <Icon size={18} />
            </a>
          )
        })}
      </div>

      {/* Desktop theme toggle - hidden on mobile */}
      <button
        onClick={toggleTheme}
        className="theme-toggle theme-toggle-desktop"
        aria-label="Toggle theme"
      >
        {isDarkMode ? <Sun size={18} /> : <Moon size={18} />}
      </button>

      {/* Mobile menu toggle - shown only on mobile */}
      
    </div>
      </div>
    </nav>
    <button
        className="mobile-menu-toggle"
        onClick={() => {
          console.log('Current state:', isMenuOpen);
          setIsMenuOpen(!isMenuOpen);
        }}
        aria-label={isMenuOpen ? "Close menu" : "Open menu"}
      >
        {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
      </button>

    {/* Mobile theme toggle - shown only in mobile menu */}
      <button
        onClick={toggleTheme}
        className="theme-toggle theme-toggle-mobile"
        aria-label="Toggle theme"
      >
        {isDarkMode ? <Sun size={15} /> : <Moon size={15} />}
      </button>

      {/* Hero Section */}
      <section id="home" className="hero-section" style={{ paddingTop: "120px" }}>
        <div className="hero-background" />

        <div className="hero-content">
          <div className="hero-left">
            <div className="identity-composition">
                <div className="profile-image-wrapper">
                  <Image
                    src="/images/profile.jpg"
                    alt="Harsh Agarwal"
                    width={350}
                    height={350}
                    className="profile-image"
                  />
                  <div className="profile-glow"></div>
                </div>
                
                {/* Continuous Orbit Animation */}
                <div className="orbit-system">
                  <div className="orbit-ring">
                    {techStack.slice(0, 5).map((tech, i) => (
                      <div key={tech.label} className="orbit-item" style={{ '--i': i, '--total': 5 } as React.CSSProperties}>
                        <div className="orbit-icon-wrapper glass-panel">
                          <tech.icon size={20} className="orbit-icon" />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>


            </div>
          </div>

          <div className="hero-right">
            <motion.div 
              className="hero-text"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease: "easeOut" }}
            >
              <h1 className="hero-title">
                <span className="title-line">Hi, I&apos;m</span>
                <span className="title-name">Harsh Agarwal</span>
                <span className="title-role" style={{ display: "block", height: "1.8em" }}>
                  <AnimatePresence mode="wait">
                    <motion.span
                      key={roleIndex}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      transition={{ duration: 0.4, ease: "easeOut" }}
                      style={{ display: "inline-block" }}
                    >
                      {roles[roleIndex]}
                    </motion.span>
                  </AnimatePresence>
                </span>
              </h1>

              <p className="hero-description">
                Third-year CSE student specializing in full-stack development, IoT automation and AI/ML integration.
                Proven hackathon winner who transforms innovative ideas into practical solutions, bridging academic
                excellence with real-world impact.
              </p>

              <div className="hero-actions">
                <button
                  onClick={() => scrollToSection("projects")}
                  className="btn btn-primary"
                >
                  View My Work
                </button>
                <a
                  href={resumeUrl || "/Resume.pdf"}
                  className="btn btn-secondary"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Resume
                </a>
              </div>
            </motion.div>
          </div>
        </div>

        <div
          className="scroll-indicator"
          onClick={() => scrollToSection("about")}
        >
          <ChevronDown className="scroll-arrow" />
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="section">
        <motion.div className="container" variants={sectionVariants} initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-80px" }}>
          <div className="section-header">
            <h2 className="section-title">About Me</h2>
          </div>

          <div className="about-content">
            <div className="about-text">
              <p className="about-paragraph">
                Driven Computer Science student with a track record of academic excellence, including Silver Medal for
                being the Class Topper in 2nd Semester. My technical journey spans not just theory but also competitive
                programming to building production-ready applications across web development, IoT systems and AI/ML
                solutions.
              </p>
              <p className="about-paragraph">
                My core expertise includes full-stack development with modern web-dev technologies, IoT automation using
                microcontrollers and AI integration. Proficient in Python, Java and C with hands-on experience in
                database management and API integration.
              </p>
            </div>

            <div className="contact-info">
              <div className="contact-item">
                <Mail className="contact-icon" />
                <span>harshagar122005@gmail.com</span>
              </div>
              <div className="contact-item">
                <MapPin className="contact-icon" />
                <span>Jodhpur, Rajasthan</span>
              </div>
            </div>
          </div>
        </motion.div>
      </section>

      {/* Anchoring Section */}
      <section className="section anchoring-section">
        <motion.div className="container" variants={sectionVariants} initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-80px" }}>
          <div className="anchoring-content">
            <div className="anchoring-left">
              <div className="anchoring-text">
                <h3 className="anchoring-title">Beyond Code: The Voice of Events</h3>
                <p className="anchoring-description">
                  Beyond coding, I also actively contribute as an anchor at college events, combining technical skills
                  with strong communication abilities. Currently seeking challenging software development opportunities
                  to apply my skills in meaningful projects while driving innovation and continuous learning.
                </p>
              </div>
            </div>
            <div className="anchoring-gallery">
              <div className="anchoring-image-container">
                <Image
                  src="/images/anchoring1.jpg"
                  alt="Harsh Agarwal anchoring college event"
                  width={400}
                  height={500}
                  className="anchoring-image"
                />
              </div>
            </div>
            <div className="anchoring-stats">
              <div className="anchoring-stat">
                <span className="stat-number">10+</span>
                <span className="stat-label">Events Hosted</span>
              </div>
              <div className="anchoring-stat">
                <span className="stat-number">1000+</span>
                <span className="stat-label">Audience Members</span>
              </div>
              <div className="anchoring-stat">
                <span className="stat-number">3+</span>
                <span className="stat-label">Years Experience</span>
              </div>
            </div>
          </div>
        </motion.div>
      </section>

      {/* Skills Section */}
      <section id="skills" className="section section-alt">
        <motion.div className="container" variants={sectionVariants} initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-80px" }}>
          <div className="section-header">
            <h2 className="section-title">Skills & Expertise</h2>
          </div>

          <motion.div className="bento-grid" variants={staggerContainer} initial="hidden" whileInView="visible" viewport={{ once: true }}>
            {skillCategories.map((cat) => (
              <motion.div key={cat.title} className={`bento-card glass-panel ${cat.className}`} variants={staggerItem}>
                <div className="bento-card-header">
                  <cat.icon size={24} className="bento-card-main-icon" />
                  <div className="bento-card-title">{cat.title}</div>
                </div>
                <div className={`bento-skill-list ${cat.className === 'bento-card-full' ? 'bento-skill-list-horizontal' : ''}`}>
                  {cat.skills.map((skill) => (
                    <div key={skill.name} className="bento-skill-item">
                      <span className="bento-skill-icon"><skill.icon size={18} /></span>
                      <div className="bento-skill-info">
                        <span className="bento-skill-name">{skill.name}</span>
                        <span className="bento-skill-desc">: {skill.desc}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>
            ))}
          </motion.div>
        </motion.div>
      </section>

      {/* Projects Section */}
      <section id="projects" className="section">
        <motion.div className="container" variants={sectionVariants} initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-80px" }}>
          <div className="section-header">
            <h2 className="section-title">Featured Projects</h2>
          </div>

          <div className="project-filters">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setActiveCategory(category)}
                className={`filter-btn ${activeCategory === category ? "active" : ""}`}
              >
                {category}
              </button>
            ))}
          </div>

          <motion.div className="projects-grid" variants={staggerContainer} initial="hidden" whileInView="visible" viewport={{ once: true }}>
            {projects.length > 0 ? (
                projects.filter(project => activeCategory === "All" || project.category === activeCategory)
                .map((project, index) => (
                <motion.div
                    key={index}
                    className="project-card"
                    variants={staggerItem}
                >
                    <div className="project-image">
                    <Image
                        src={project.image || "/placeholder.svg"}
                        alt={project.title}
                        width={300}
                        height={200}
                        className="project-img"
                    />
                    <div className="project-overlay">
                        <a
                        href={project.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="project-link"
                        >
                        <ExternalLink size={20} />
                        </a>
                    </div>
                    </div>
                    <div className="project-content">
                    <h3 className="project-title">{project.title}</h3>
                    <p className="project-description">{project.description}</p>
                    <div className="project-tech">
                        {project.tech?.map((tech: string) => (
                        <span key={tech} className="tech-tag">
                            {tech}
                        </span>
                        ))}
                    </div>
                    </div>
                </motion.div>
                ))
            ) : (
                 <div className="col-span-full text-center text-slate-500 py-10">Loading projects...</div>
            )}
          </motion.div>
        </motion.div>
      </section>

      {/* Accomplishments Section */}
      <section id="accomplishments" className="section section-alt">
        <motion.div className="container" variants={sectionVariants} initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-80px" }}>
          <div className="section-header">
            <h2 className="section-title">Accomplishments</h2>
          </div>

          <motion.div className="accomplishments-grid" variants={staggerContainer} initial="hidden" whileInView="visible" viewport={{ once: true }}>
            {accomplishments.length > 0 ? (
                accomplishments.map((accomplishment, index) => (
                <motion.div
                    key={index}
                    className="accomplishment-card"
                    variants={staggerItem}
                >
                    <div className="accomplishment-image-container">
                    <Image
                        src={accomplishment.image || "/placeholder.svg"}
                        alt={accomplishment.title}
                        fill
                        className="accomplishment-img"
                    />
                    <span className="year-badge">{accomplishment.year}</span>
                    </div>
                    <div className="accomplishment-content">
                    <h3 className="accomplishment-title">{accomplishment.title}</h3>
                    <p className="accomplishment-description">{accomplishment.description}</p>
                    </div>
                </motion.div>
                ))
            ) : (
                <div className="col-span-full text-center text-slate-500 py-10">Loading accomplishments...</div>
            )}
          </motion.div>
        </motion.div>
      </section>

      {/* Education Section */}
      <section id="education" className="section">
        <motion.div className="container" variants={sectionVariants} initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-80px" }}>
          <div className="section-header">
            <h2 className="section-title">Education</h2>
          </div>

          <motion.div className="education-cards" variants={staggerContainer} initial="hidden" whileInView="visible" viewport={{ once: true }}>
            {[
              {
                degree: "B.Tech - Computer Science Engineering",
                institution: "Jodhpur Institute of Engineering and Technology",
                duration: "2023 - 2027",
                description:
                  "Pursuing computer science with focus on Software development, Artificial Intelligence and Web technologies.",
                achievements: [
                  "CGPA: 9.43/10",
                  "Silver Medal (Class Topper 2nd Sem)",
                  "Member: Department Cultural Club",
                ],
                image: "/images/university.jpeg",
              },
              {
                degree: "Higher Secondary Education",
                institution: "Adarsh Vidya Mandir Shankar Vidya Peeth, Mount Abu",
                duration: "2021 - 2023",
                description: "Completed higher secondary school with focus on Mathematics and Science.",
                achievements: ["12th: 78%"],
                image: "/images/sechighschool.jpg",
              },
              {
                degree: "Higher Education",
                institution: "St. Marys High School, Mount Abu",
                duration: "2013 - 2021",
                description: "Completed high school with focus on Mathematics and Science.",
                achievements: ["10th: 90%"],
                image: "/images/highschool.jpg",
              },
            ].map((education, index) => (
              <motion.div
                key={index}
                className="education-card"
                variants={staggerItem}
              >
                <div className="education-image">
                  <Image
                    src={education.image || "/placeholder.svg"}
                    alt={education.institution}
                    width={200}
                    height={150}
                    className="education-img"
                  />
                </div>
                <div className="education-content">
                  <h3 className="education-degree">{education.degree}</h3>
                  <h4 className="education-institution">{education.institution}</h4>
                  <p className="education-duration">{education.duration}</p>
                  <p className="education-description">{education.description}</p>
                  <div className="education-achievements">
                    {education.achievements.map((achievement, i) => (
                      <span key={i} className="achievement-tag">
                        {achievement}
                      </span>
                    ))}
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </motion.div>
      </section>

      {/* Footer */}
      <footer className="footer">
        <div className="container">
          <div className="footer-content">
            <p>&copy; Harsh Agarwal. All rights reserved.</p>
            <div className="footer-social">
              {socialLinks.map((social) => {
                const Icon = social.icon
                
                if (social.onClick) {
                    return (
                      <button
                         key={social.label}
                         onClick={social.onClick as any}
                         className=""
                         aria-label={social.label}
                      >
                        <Icon size={18} />
                      </button>
                    )
                 }

                return (
                  <a
                    key={social.label}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <Icon size={18} />
                  </a>
                )
              })}
            </div>
          </div>
        </div>
      </footer>

      <LeetCodeModal 
        isOpen={isLeetCodeModalOpen} 
        onClose={() => setIsLeetCodeModalOpen(false)} 
      />

      <GithubStatsModal 
        isOpen={isGithubOpen} 
        onClose={() => setIsGithubOpen(false)} 
        username="harshagar12" 
      />

      {/* Scroll to Top Button */}
      <button
        className={`scroll-to-top ${showScrollTop ? "visible" : ""}`}
        onClick={scrollToTop}
        aria-label="Scroll to top"
      >
        <ChevronUp size={24} />
      </button>

    </div>
  )
}
