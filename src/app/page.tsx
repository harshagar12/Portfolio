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
} from "lucide-react"
import Image from "next/image"

export default function Portfolio() {
  const [activeSection, setActiveSection] = useState("home")
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [scrollY, setScrollY] = useState(0)
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })
  const [cursorVariant, setCursorVariant] = useState("default")
  const [isDarkMode, setIsDarkMode] = useState(true)
  const skillsRef = useRef<HTMLDivElement>(null)

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

  // Mouse tracking for cursor follower
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY })
    }

    window.addEventListener("mousemove", handleMouseMove)
    return () => window.removeEventListener("mousemove", handleMouseMove)
  }, [])

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

  const socialLinks = [
    { href: "https://github.com/harshagar12", icon: Github, label: "GitHub" },
    { href: "https://www.linkedin.com/in/harsh-agarwal-a31b4528b", icon: Linkedin, label: "LinkedIn" },
    { href: "https://x.com/HarshAgar12", icon: Twitter, label: "Twitter" },
  ]

  return (
    <div className="portfolio-container">
      {/* Animated Background */}
      <div className="animated-background">
        <div className="bg-animation">
          {[...Array(50)].map((_, i) => (
            <div
              key={i}
              className="particle"
              style={{
                left: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 20}s`,
                animationDuration: `${15 + Math.random() * 10}s`,
              }}
            />
          ))}
        </div>
        <div className="gradient-overlay"></div>
      </div>

      {/* Cursor Follower */}
      <div
        className={`cursor-follower ${cursorVariant}`}
        style={{
          left: `${mousePosition.x}px`,
          top: `${mousePosition.y}px`,
        }}
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
      <button
        onClick={toggleTheme}
        className="theme-toggle theme-toggle-desktop"
        aria-label="Toggle theme"
      >
        {isDarkMode ? <Sun size={18} /> : <Moon size={18} />}
      </button>
      {/* Social links for mobile/tablet only */}
      <div className="nav-social-mobile">
        {socialLinks.map((social) => {
          const Icon = social.icon;
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
          );
        })}
      </div>
    </div>

    <div className="nav-actions">
      <div className="nav-social">
        {socialLinks.map((social) => {
          const Icon = social.icon;
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
          );
        })}
      </div>

      <button
        className="mobile-menu-toggle"
        onClick={() => setIsMenuOpen(!isMenuOpen)}
        aria-label={isMenuOpen ? "Close menu" : "Open menu"}
      >
        {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
      </button>
    </div>
  </div>
</nav>

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
              <div className="profile-image-wrapper">
                <Image
                  src="/images/profile.jpg"
                  alt="Harsh Agarwal"
                  width={350}
                  height={350}
                  className="profile-image"
                />
                <div className="tech-orbit">
                  <div className="tech-icon tech-1">⚛️</div>
                  <div className="tech-icon tech-2">🐍</div>
                  <div className="tech-icon tech-3">📱</div>
                  <div className="tech-icon tech-4">☕</div>
                </div>
              </div>
            </div>
          </div>

          <div className="hero-right">
            <div className="hero-text">
              <div className="text-background-balls">
                <div className="bouncing-ball ball-1"></div>
                <div className="bouncing-ball ball-2"></div>
                <div className="bouncing-ball ball-3"></div>
                <div className="bouncing-ball ball-4"></div>
                <div className="bouncing-ball ball-5"></div>
              </div>
              <h1 className="hero-title">
                <span className="title-line">Hi, I&apos;m</span>
                <span className="title-name">Harsh Agarwal</span>
                <span className="title-role">Computer Science Student & Developer</span>
              </h1>

              <p className="hero-description">
                Third-year CSE student specializing in full-stack development, IoT automation, and AI/ML integration.
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
                  onMouseEnter={() => setCursorVariant("hover")}
                  onMouseLeave={() => setCursorVariant("default")}
                >
                  View My Work
                </button>
                <a
                  href="/Resume.pdf"
                  className="btn btn-secondary"
                  target="_blank"
                  rel="noopener noreferrer"
                  onMouseEnter={() => setCursorVariant("hover")}
                  onMouseLeave={() => setCursorVariant("default")}
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
          onMouseEnter={() => setCursorVariant("hover")}
          onMouseLeave={() => setCursorVariant("default")}
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
                programming to building production-ready applications across web development, IoT systems, and AI/ML
                solutions.
              </p>

              <p className="about-paragraph">
                My core expertise includes full-stack development with modern web-dev technologies, IoT automation using
                microcontrollers, and AI integration. Proficient in Python, Java, and C with hands-on experience in
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
            <div className="skills-grid">
              <div className="skills-category">
                <h3 className="skills-category-title">
                  <Code className="category-icon" />
                  Technical Skills
                </h3>
                <div className="skills-cards">
                  {[
                    { name: "Python", icon: "🐍" },
                    { name: "Java", icon: "☕" },
                    { name: "JavaScript", icon: "📜" },
                    { name: "HTML/CSS", icon: "🌐" },
                    { name: "IoT", icon: "🔌" },
                    { name: "MySQL", icon: "🗄️" },
                    { name: "Git", icon: "📊" },
                    { name: "React", icon: "⚛️" },
                  ].map((skill, index) => (
                    <div
                      key={skill.name}
                      className="skill-item"
                      onMouseEnter={() => setCursorVariant("hover")}
                      onMouseLeave={() => setCursorVariant("default")}
                    >
                      <div className="skill-icon">{skill.icon}</div>
                      <div className="skill-name">{skill.name}</div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="skills-category">
                <h3 className="skills-category-title">
                  <User className="category-icon" />
                  Soft Skills
                </h3>
                <div className="skills-cards">
                  {[
                    { name: "Communication", icon: "💬" },
                    { name: "Teamwork", icon: "🤝" },
                    { name: "Problem Solving", icon: "🧩" },
                    { name: "Time Management", icon: "⏰" },
                    { name: "Adaptability", icon: "🔄" },
                    { name: "Leadership", icon: "👑" },
                    { name: "Critical Thinking", icon: "🧠" },
                    { name: "Creativity", icon: "🎨" },
                  ].map((skill, index) => (
                    <div
                      key={skill.name}
                      className="skill-item"
                      onMouseEnter={() => setCursorVariant("hover")}
                      onMouseLeave={() => setCursorVariant("default")}
                    >
                      <div className="skill-icon">{skill.icon}</div>
                      <div className="skill-name">{skill.name}</div>
                    </div>
                  ))}
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

          <div className="projects-grid">
            {[
              {
                title: "Literate",
                description:
                  "An AI-powered, full-stack reading application that enables users to upload books and interact with a chatbot that answers context-aware questions using a RAG pipeline. Features an intuitive reading interface, integrated note-taking, and robust data persistence with Firestore.",
                image: "/images/project5.png",
                link: "https://github.com/harshagar12/Literate",
                tech: ["TypeScript", "Next.js", "FireStore", "GenKitAI"],
              },
              {
                title: "BlogWave",
                description:
                  "A full-stack blogging platform enabling users to create, share, and explore diverse content. Built with Node.js, Express.js, MySQL, and modern web technologies.",
                image: "/images/project1.png",
                link: "https://github.com/harshagar12/blog_wave",
                tech: ["Node.js", "Express.js", "MySQL", "JavaScript"],
              },
              {
                title: "Unified AI Tools Hub",
                description:
                  "Web application integrating AI Chatbot, Photo Editor, and Text-to-Speech features using Azure Cognitive Services and modern cloud technologies.",
                image: "/images/project2.png",
                link: "https://github.com/harshagar12/ai-tools-hub",
                tech: ["Streamlit", "Azure", "MongoDB", "Python"],
              },
              {
                title: "SideView: YouTube Extension",
                description:
                  "Chrome extension that enhances YouTube viewing by displaying video descriptions and comments in a resizable side panel while keeping the video visible.",
                image: "/images/project3.png",
                link: "https://github.com/harshagar12/SideView",
                tech: ["JavaScript", "Chrome APIs", "DOM Manipulation"],
              },
              {
                title: "Telegram Home Automation",
                description:
                  "IoT-based home automation system using Telegram as control interface. Features motion detection and remote control of lights and appliances.",
                image: "/images/project4.jpg",
                link: "https://github.com/harshagar12/Home-Automation",
                tech: ["ESP32", "IoT", "Telegram API", "C++"],
              },
            ].map((project, index) => (
              <div
                key={index}
                className="project-card"
                style={{ animationDelay: `${index * 0.15}s` }}
                onMouseEnter={() => setCursorVariant("hover")}
                onMouseLeave={() => setCursorVariant("default")}
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
                      onMouseEnter={() => setCursorVariant("hover")}
                      onMouseLeave={() => setCursorVariant("default")}
                    >
                      <ExternalLink size={20} />
                    </a>
                  </div>
                </div>
                <div className="project-content">
                  <h3 className="project-title">{project.title}</h3>
                  <p className="project-description">{project.description}</p>
                  <div className="project-tech">
                    {project.tech.map((tech) => (
                      <span key={tech} className="tech-tag">
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            ))}
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

          <div className="accomplishments-timeline">
            {[
              {
                title: "Class Topper - Silver Medal",
                description:
                  "Awarded Silver Medal and Certificate for being the Class Topper in the 2nd Semester during annual fest Resonance.",
                image: "/images/accomplishment1.png",
                year: "2024",
              },
              {
                title: "Runner's Up - Innovate 2025",
                description:
                  "Secured 2nd Place in Innovate 2025 Hackathon organized by MNIT Jalandhar, Thapar Institute and Modi Institute.",
                image: "/images/accomplishment2.png",
                year: "2025",
              },
              {
                title: "1st Place - Hack-ito 2023",
                description:
                  "Developed a prosthetic arm prototype for below elbow amputees using EMG sensors and servo motors.",
                image: "/images/accomplishment3.png",
                year: "2023",
              },
              {
                title: "Certificate of Appreciation",
                description:
                  "Awarded Certificate of Appreciation and Memento for developing and installing Home Automation System in college.",
                image: "/images/accomplishment4.png",
                year: "2024",
              },
              {
                title: "2nd Place - Hack-ito 2024",
                description: "Improved prosthetic arm prototype with doctor approval and testing with amputees.",
                image: "/images/accomplishment5.png",
                year: "2024",
              },
              {
                title: "Top 6 - Launchpad Challenge 2024",
                description:
                  "Led team to pitch mobile application connecting local businesses with customers through loyalty rewards.",
                image: "/images/accomplishment6.png",
                year: "2024",
              },
            ].map((accomplishment, index) => (
              <div
                key={index}
                className="timeline-item"
                style={{ animationDelay: `${index * 0.2}s` }}
                onMouseEnter={() => setCursorVariant("hover")}
                onMouseLeave={() => setCursorVariant("default")}
              >
                <div className="timeline-marker">
                  <div className="timeline-dot"></div>
                  <div className="timeline-year">{accomplishment.year}</div>
                </div>
                <div className="timeline-content">
                  <div className="accomplishment-image">
                    <Image
                      src={accomplishment.image || "/placeholder.svg"}
                      alt={accomplishment.title}
                      width={200}
                      height={150}
                      className="accomplishment-img"
                    />
                  </div>
                  <div className="accomplishment-details">
                    <h3 className="accomplishment-title">{accomplishment.title}</h3>
                    <p className="accomplishment-description">{accomplishment.description}</p>
                  </div>
                </div>
              </div>
            ))}
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
                  "Pursuing computer science with focus on Software development, Artificial Intelligence, and Web technologies.",
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
                onMouseEnter={() => setCursorVariant("hover")}
                onMouseLeave={() => setCursorVariant("default")}
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
            <p>&copy; 2024 Harsh Agarwal. All rights reserved.</p>
            <div className="footer-social">
              {socialLinks.map((social) => {
                const Icon = social.icon
                return (
                  <a
                    key={social.label}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    onMouseEnter={() => setCursorVariant("hover")}
                    onMouseLeave={() => setCursorVariant("default")}
                  >
                    <Icon size={18} />
                  </a>
                )
              })}
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
