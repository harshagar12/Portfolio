"use client"

import { useState, useEffect, useRef } from "react"
import {
  ChevronDown,
  Github,
  Linkedin,
  Twitter,
  ExternalLink,
  Award,
  GraduationCap,
  Code,
  Briefcase,
  User,
  Menu,
  X,
  MapPin,
  Mail,
  Sun,
  Moon,
  ChevronUp,
  Terminal,
  Coffee,
  FileCode,
  Globe,
  Cpu,
  Database,
  GitGraph,
  Atom,
  MessageSquare,
  Users,
  Puzzle,
  Clock,
  RefreshCcw,
  Crown,
  Brain,
  Palette,
  Smartphone,
  Trophy,
  Target,
  Zap,
} from "lucide-react"
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
        fetch(`https://leetcode-stats-api.herokuapp.com/${username}`)
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
               <LeetCodeIcon className="text-[#ffa116]" size={32} />
            </div>
            <div>
                <h3 className="text-xl font-bold text-white">LeetCode Stats</h3>
                <p className="text-slate-400 text-sm">@{username}</p>
            </div>
          </div>
  
          {loading ? (
            <div className="flex justify-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#ffa116]"></div>
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
                            <span className="text-amber-400">Medium</span>
                            <span className="text-slate-300">
                                {data.mediumSolved}
                                <span className="text-slate-500 text-xs ml-1">
                                     / {data.totalMedium}
                                </span>
                            </span>
                        </div>
                        <div className="leetcode-progress-track">
                            <div 
                                className="leetcode-progress-fill bg-amber-400"
                                style={{ width: `${(data.mediumSolved / data.totalMedium * 100) || 0}%`, backgroundColor: '#fbbf24' }}
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

export default function Portfolio() {
  const [activeSection, setActiveSection] = useState("home")
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [scrollY, setScrollY] = useState(0)
  const mousePosition = useRef({ x: 0, y: 0 })
  const [isDarkMode, setIsDarkMode] = useState(true)
  const skillsRef = useRef<HTMLDivElement>(null)
  
  // --- New features state ---
  const [activeCategory, setActiveCategory] = useState("All")
  const [showScrollTop, setShowScrollTop] = useState(false)
  
  // Firebase Data State
  const [projects, setProjects] = useState<any[]>([]);
  const [accomplishments, setAccomplishments] = useState<any[]>([]);
  const [resumeUrl, setResumeUrl] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch Projects
        const projectsQuery = query(collection(db, "projects"), orderBy("order", "asc"));
        const projectsSnap = await getDocs(projectsQuery);
        if (!projectsSnap.empty) {
            setProjects(projectsSnap.docs.map(d => d.data()));
        }

        // Fetch Accomplishments
        const accQuery = query(collection(db, "accomplishments"), orderBy("order", "asc"));
        const accSnap = await getDocs(accQuery);
        if (!accSnap.empty) {
            setAccomplishments(accSnap.docs.map(d => d.data()));
        }

        // Fetch Resume
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
  
  // Typing effect state
  const [typingText, setTypingText] = useState("")
  const [isDeleting, setIsDeleting] = useState(false)
  const [loopNum, setLoopNum] = useState(0)
  const [typingSpeed, setTypingSpeed] = useState(150)
  
  // 3D Tilt state
  const [tiltStyle, setTiltStyle] = useState({})
  
  const roles = ["Third-year CSE student", "Full Stack Developer", "AI/ML Enthusiast", "Problem Solver"]


  // --- Indicator state ---
  const navRefs = useRef<{ [key: string]: HTMLButtonElement | null }>({})
  const indicatorRef = useRef<HTMLDivElement>(null)
  const [indicatorStyle, setIndicatorStyle] = useState({ left: 0, width: 0 })

  useEffect(() => {
    // Update indicator position/width when activeSection changes or on resize
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

  useEffect(() => {
    // Also update on scroll for smoothness
    const onScroll = () => {
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
    window.addEventListener("scroll", onScroll)
    return () => window.removeEventListener("scroll", onScroll)
  }, [activeSection, isMenuOpen])

  // Theme toggle functionality
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

  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode)
  }



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

      if (currentSection) {
        setActiveSection(currentSection)
      }
    }

    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId)
    if (element) {
      element.scrollIntoView({ behavior: "smooth" })
    }
    if (isMenuOpen) {
      setIsMenuOpen(false)
    }
  }

  const navItems = [
    { id: "home", label: "Home", icon: User },
    { id: "about", label: "About", icon: User },
    { id: "skills", label: "Skills", icon: Code },
    { id: "projects", label: "Projects", icon: Briefcase },
    { id: "accomplishments", label: "Accomplishments", icon: Award },
    { id: "education", label: "Education", icon: GraduationCap },
  ]

  // --- New Feature Effects ---

  // Typing Effect
  useEffect(() => {
    const handleTyping = () => {
      const i = loopNum % roles.length
      const fullText = roles[i]
      
      setTypingText(isDeleting 
        ? fullText.substring(0, typingText.length - 1) 
        : fullText.substring(0, typingText.length + 1)
      )

      setTypingSpeed(isDeleting ? 30 : 150)

      if (!isDeleting && typingText === fullText) {
        setTimeout(() => setIsDeleting(true), 1500)
      } else if (isDeleting && typingText === "") {
        setIsDeleting(false)
        setLoopNum(loopNum + 1)
      }
    }

    const timer = setTimeout(handleTyping, typingSpeed)
    return () => clearTimeout(timer)
  }, [typingText, isDeleting, loopNum])

  // Scroll to Top visibility
  useEffect(() => {
    const checkScrollTop = () => {
      if (!showScrollTop && window.scrollY > 400) {
        setShowScrollTop(true)
      } else if (showScrollTop && window.scrollY <= 400) {
        setShowScrollTop(false)
      }
    }
    window.addEventListener("scroll", checkScrollTop)
    return () => window.removeEventListener("scroll", checkScrollTop)
  }, [showScrollTop])

  // 3D Tilt Handlers
  const handleTiltMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const { left, top, width, height } = e.currentTarget.getBoundingClientRect()
    const x = (e.clientX - left - width / 2) / 25
    const y = (e.clientY - top - height / 2) / 25
    setTiltStyle({ transform: `perspective(1000px) rotateX(${-y}deg) rotateY(${x}deg) scale(1.05)` })
  }

  const handleTiltLeave = () => {
    setTiltStyle({ transform: `perspective(1000px) rotateX(0deg) rotateY(0deg) scale(1)` })
  }

  // Scroll to Top action
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" })
  }

  // Project Filtering Logic
  const categories = ["All", "Web App", "AI/ML", "IoT", "Chrome Extension"] 
  
  // Note: We'll modify the projects array to include categories, 
  // or infer them from tech/description. Ideally, we add a 'category' field.
  // For now, let's infer or just use the whole list if 'All'.
  // Since we can't easily modify the const array in the return, let's assume we filter inside the render.


  // --- Network Background Animation ---
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    let animationFrameId: number
    let width = window.innerWidth
    let height = window.innerHeight

    canvas.width = width
    canvas.height = height

    const particles: Particle[] = []
    const particleCount = Math.floor((width * height) / 9000) // Dynamic density (higher frequency)
    const connectionDistance = 120
    const mouseDistance = 150

    class Particle {
      x: number
      y: number
      vx: number
      vy: number
      size: number

      constructor() {
        this.x = Math.random() * width
        this.y = Math.random() * height
        this.vx = (Math.random() - 0.5) * 0.3 // Sluggish movement
        this.vy = (Math.random() - 0.5) * 0.3
        this.size = Math.random() * 1.5 + 0.5 // Smaller particles
      }

      update() {
        this.x += this.vx
        this.y += this.vy

        // Bounce off edges
        if (this.x < 0 || this.x > width) this.vx *= -1
        if (this.y < 0 || this.y > height) this.vy *= -1
      }

      draw() {
        if (!ctx) return
        ctx.beginPath()
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2)
        ctx.fillStyle = isDarkMode ? "rgba(56, 189, 248, 0.3)" : "rgba(2, 132, 199, 0.3)" // Sky Blue (Dark & Light)
        ctx.fill()
      }
    }

    const init = () => {
      particles.length = 0
      for (let i = 0; i < particleCount; i++) {
        particles.push(new Particle())
      }
    }

    const animate = () => {
      if (!ctx) return
      ctx.clearRect(0, 0, width, height)
      
      // Update and draw particles
      particles.forEach(particle => {
        particle.update()
        particle.draw()
      })

      // Draw connections
      for (let i = 0; i < particles.length; i++) {
        const p1 = particles[i]
        
        // Connect to mouse
        const dxMouse = mousePosition.current.x - p1.x
        const dyMouse = mousePosition.current.y - p1.y
        const distMouse = Math.sqrt(dxMouse * dxMouse + dyMouse * dyMouse)

        if (distMouse < mouseDistance) {
            ctx.beginPath()
            ctx.strokeStyle = isDarkMode ? `rgba(56, 189, 248, ${0.5 * (1 - distMouse / mouseDistance)})` : `rgba(2, 132, 199, ${0.5 * (1 - distMouse / mouseDistance)})` // Sky 600 for Light Mode
            ctx.lineWidth = 0.6
            ctx.moveTo(p1.x, p1.y)
            ctx.lineTo(mousePosition.current.x, mousePosition.current.y)
            ctx.stroke()
        }

        // Connect to other particles
        for (let j = i + 1; j < particles.length; j++) {
          const p2 = particles[j]
          const dx = p1.x - p2.x
          const dy = p1.y - p2.y
          const distance = Math.sqrt(dx * dx + dy * dy)

          if (distance < connectionDistance) {
            ctx.beginPath()
            ctx.strokeStyle = isDarkMode ? `rgba(129, 140, 248, ${0.15 * (1 - distance / connectionDistance)})` : `rgba(79, 70, 229, ${0.15 * (1 - distance / connectionDistance)})` // Indigo 600 for Light Mode
            ctx.lineWidth = 0.3
            ctx.moveTo(p1.x, p1.y)
            ctx.lineTo(p2.x, p2.y)
            ctx.stroke()
          }
        }
      }

      animationFrameId = requestAnimationFrame(animate)
    }

    const handleResize = () => {
      width = window.innerWidth
      height = window.innerHeight
      canvas.width = width
      canvas.height = height
      init()
    }

    const handleMouseMove = (e: MouseEvent) => {
      mousePosition.current = { x: e.clientX, y: e.clientY }
    }

    init()
    animate()
    window.addEventListener("resize", handleResize)
    window.addEventListener("mousemove", handleMouseMove)

    return () => {
      window.removeEventListener("resize", handleResize)
      window.removeEventListener("mousemove", handleMouseMove)
      cancelAnimationFrame(animationFrameId)
    }
  }, [isDarkMode])

  const [isLeetCodeModalOpen, setIsLeetCodeModalOpen] = useState(false);

  // Social Links updated
  const socialLinks = [
    { href: "https://github.com/harshagar12", icon: Github, label: "GitHub" },
    { href: "https://www.linkedin.com/in/harsh-agarwal-a31b4528b", icon: Linkedin, label: "LinkedIn" },
    { href: "https://x.com/HarshAgar12", icon: Twitter, label: "Twitter" },
    { 
        href: "#", 
        icon: LeetCodeIcon, 
        label: "LeetCode", 
        onClick: (e: React.MouseEvent) => {
            e.preventDefault();
            console.log("LeetCode clicked");
            setIsLeetCodeModalOpen(true);
        }
    },
  ]

  const technicalSkills = [
    { name: "Python", icon: Terminal },
    { name: "Java", icon: Coffee },
    { name: "JavaScript", icon: FileCode },
    { name: "HTML/CSS", icon: Globe },
    { name: "IoT", icon: Cpu },
    { name: "MySQL", icon: Database },
    { name: "Git", icon: GitGraph },
    { name: "React", icon: Atom },
  ]

  const softSkills = [
    { name: "Communication", icon: MessageSquare },
    { name: "Teamwork", icon: Users },
    { name: "Problem Solving", icon: Puzzle },
    { name: "Time Management", icon: Clock },
    { name: "Adaptability", icon: RefreshCcw },
    { name: "Leadership", icon: Crown },
    { name: "Critical Thinking", icon: Brain },
    { name: "Creativity", icon: Palette },
  ]

  return (
    <div className="portfolio-container">
      {/* Animated Background */}
      {/* Animated Background */}
      <canvas
        ref={canvasRef}
        className="animated-background"
        style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', pointerEvents: 'none', zIndex: 0 }}
      />




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
        <div className="hero-background">
          <div className="floating-shapes">
            <div className="shape shape-1"></div>
            <div className="shape shape-2"></div>
            <div className="shape shape-3"></div>
            <div className="shape shape-4"></div>
            <div className="shape shape-5"></div>
          </div>
        </div>

        <div className="hero-content">
          <div className="hero-left">
            <div className="profile-container">
                <div 
                  className="profile-image-wrapper tilt-card"
                  onMouseMove={handleTiltMove}
                  onMouseLeave={handleTiltLeave}
                  style={tiltStyle}
                >
                  <Image
                    src="/images/profile.jpg"
                    alt="Harsh Agarwal"
                    width={350}
                    height={350}
                    className="profile-image"
                  />
                  <div className="tech-orbit">
                    <div className="tech-icon tech-1"><Atom size={24} /></div>
                    <div className="tech-icon tech-2"><Terminal size={24} /></div>
                    <div className="tech-icon tech-3"><Smartphone size={24} /></div>
                    <div className="tech-icon tech-4"><Coffee size={24} /></div>
                  </div>
                </div>
            </div>
          </div>

          <div className="hero-right">
            <div className="hero-text">

              <h1 className="hero-title">
                <span className="title-line">Hi, I&apos;m</span>
                <span className="title-name">Harsh Agarwal</span>
                <span className="title-role">
                  {typingText}
                  <span className="typing-cursor"></span>
                </span>
              </h1>

              <p className="hero-description">
                Third-year CSE student specializing in full-stack development, IoT automation and AI/ML integration.
                Proven hackathon winner who transforms innovative ideas into practical solutions, bridging academic
                excellence with real-world impact.
              </p>

              <div className="hero-stats">
                <div className="stat">
                  <span className="stat-number">9.43</span>
                  <span className="stat-label">CGPA</span>
                </div>
                <div className="stat">
                  <span className="stat-number">10+</span>
                  <span className="stat-label">Projects</span>
                </div>
                <div className="stat">
                  <span className="stat-number">5+</span>
                  <span className="stat-label">Awards</span>
                </div>
              </div>

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
            </div>
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
        <div className="container">
          <div className="section-header">
            <h2 className="section-title">About Me</h2>
            <div className="section-line"></div>
          </div>

          <div className="about-content">
            <div className="about-text">
              <div className="text-background-balls">
                <div className="bouncing-ball ball-1"></div>
                <div className="bouncing-ball ball-2"></div>
                <div className="bouncing-ball ball-3"></div>
              </div>
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
        </div>
      </section>

      {/* Enhanced Anchoring Section */}
      <section className="section anchoring-section">
        <div className="container">
          <div className="anchoring-content">
            <div className="anchoring-left">
              <div className="anchoring-text">
                <div className="text-background-balls">
                  <div className="bouncing-ball ball-1"></div>
                  <div className="bouncing-ball ball-2"></div>
                  <div className="bouncing-ball ball-3"></div>
                </div>
                <h3 className="anchoring-title">Beyond Code: The Voice of Events</h3>
                <p className="anchoring-description">
                  Beyond coding, I also actively contribute as an anchor at college events, combining technical skills
                  with strong communication abilities. Currently seeking challenging software development opportunities
                  to apply my skills in meaningful projects while driving innovation and continuous learning.
                </p>
              </div>
            </div>
            <div className="anchoring-gallery">
              <div className="anchoring-background">
                <div className="anchoring-shapes">
                  <div className="anchoring-shape anchoring-shape-1"></div>
                  <div className="anchoring-shape anchoring-shape-2"></div>
                  <div className="anchoring-shape anchoring-shape-3"></div>
                  <div className="anchoring-shape anchoring-shape-4"></div>
                  <div className="anchoring-shape anchoring-shape-5"></div>
                </div>
              </div>
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
        </div>
      </section>

      {/* Skills Section */}
      <section id="skills" className="section section-alt">
        <div className="container">
          <div className="section-header">
            <h2 className="section-title">Skills & Expertise</h2>
            <div className="section-line"></div>
          </div>

          <div className="skills-container">
            <div className="skills-container">
              {/* Technical Skills Marquee */}
              <div className="skills-category" style={{marginBottom: '4rem', width: '100%'}}>
                <h3 className="skills-category-title" style={{justifyContent: 'center', marginBottom: '2rem'}}>
                  <Code className="category-icon" />
                  Technical Skills
                </h3>
                <div className="skills-marquee-container">
                  <div className="skills-marquee">
                    {[...technicalSkills, ...technicalSkills].map((skill, index) => (
                      <div
                        key={`tech-${index}`}
                        className="skill-item"
                        style={{minWidth: '150px'}}
                      >
                        <div className="skill-icon">
                          <skill.icon size={32} />
                        </div>
                        <div className="skill-name">{skill.name}</div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Soft Skills Marquee */}
              <div className="skills-category" style={{width: '100%'}}>
                <h3 className="skills-category-title" style={{justifyContent: 'center', marginBottom: '2rem'}}>
                  <User className="category-icon" />
                  Soft Skills
                </h3>
                <div className="skills-marquee-container">
                  <div className="skills-marquee" style={{animationDirection: "reverse"}}>
                    {[...softSkills, ...softSkills].map((skill, index) => (
                      <div
                        key={`soft-${index}`}
                        className="skill-item"
                        style={{minWidth: '150px'}}
                      >
                        <div className="skill-icon">
                          <skill.icon size={32} />
                        </div>
                        <div className="skill-name">{skill.name}</div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Projects Section */}
      <section id="projects" className="section">
        <div className="container">
          <div className="section-header">
            <h2 className="section-title">Featured Projects</h2>
            <div className="section-line"></div>
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

          <div className="projects-grid">
            {projects.length > 0 ? (
                projects.filter(project => activeCategory === "All" || project.category === activeCategory)
                .map((project, index) => (
                <div
                    key={index}
                    className="project-card"
                    style={{ animationDelay: `${index * 0.15}s` }}
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
                </div>
                ))
            ) : (
                 <div className="col-span-full text-center text-slate-500 py-10">Loading projects...</div>
            )}
          </div>
        </div>
      </section>

      {/* Accomplishments Section */}
      <section id="accomplishments" className="section section-alt">
        <div className="container">
          <div className="section-header">
            <h2 className="section-title">Accomplishments</h2>
            <div className="section-line"></div>
          </div>

          <div className="accomplishments-grid">
            {accomplishments.length > 0 ? (
                accomplishments.map((accomplishment, index) => (
                <div
                    key={index}
                    className="accomplishment-card"
                    style={{ animationDelay: `${index * 0.15}s` }}
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
                </div>
                ))
            ) : (
                <div className="col-span-full text-center text-slate-500 py-10">Loading accomplishments...</div>
            )}
          </div>
        </div>
      </section>

      {/* Education Section */}
      <section id="education" className="section">
        <div className="container">
          <div className="section-header">
            <h2 className="section-title">Education</h2>
            <div className="section-line"></div>
          </div>

          <div className="education-cards">
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
              <div
                key={index}
                className="education-card"
                style={{ animationDelay: `${index * 0.2}s` }}
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
              </div>
            ))}
          </div>
        </div>
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
