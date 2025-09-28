/* =========================
   Advanced portfolio script
   - Contains all interactivity, Three.js, GSAP, and data handling.
   ========================= */

// Global window variables from HTML CDNs (GSAP, THREE, Rellax, VanillaTilt) are accessible here.

/* ------------- Helpers ------------- */
const $ = (sel) => document.querySelector(sel);
const $$ = (sel) => Array.from(document.querySelectorAll(sel));

/* --------- Initialize Locomotive Scroll & connect to GSAP ScrollTrigger --------- */
function initSmoothScroll() {
  const loco = new LocomotiveScroll({
    el: document.querySelector("#main-container"),
    smooth: true,
    smartphone: { smooth: true },
    tablet: { smooth: true },
    multiplier: 1.0,
    getDirection: true
  });

  gsap.registerPlugin(ScrollTrigger);
  ScrollTrigger.scrollerProxy("#main-container", {
    scrollTop(value) {
      return arguments.length && loco ? loco.scrollTo(value, 0, 0) : loco ? loco.scroll.instance.scroll.y : 0;
    },
    getBoundingClientRect() {
      return { top: 0, left: 0, width: window.innerWidth, height: window.innerHeight };
    },
  });

  loco.on("scroll", ScrollTrigger.update);
  ScrollTrigger.addEventListener("refresh", () => loco.update());
  ScrollTrigger.refresh();
  return loco;
}

/* ------------- Three.js: Welcome particle background ------------- */
function initThreeBackground() {
  if (typeof THREE === 'undefined') return;

  const container = document.getElementById("three-bg");
  if (!container) return;

  const w = container.clientWidth || window.innerWidth;
  const h = container.clientHeight || window.innerHeight;

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(45, w / h, 0.1, 1000);
  camera.position.z = 45;

  const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
  renderer.setSize(w, h);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  container.appendChild(renderer.domElement);

  // particles geometry
  const particleCount = 1200;
  const geometry = new THREE.BufferGeometry();
  const positions = new Float32Array(particleCount * 3);
  const colors = new Float32Array(particleCount * 3);

  for (let i = 0; i < particleCount; i++) {
    const i3 = i * 3;
    positions[i3 + 0] = (Math.random() - 0.5) * 200;
    positions[i3 + 1] = (Math.random() - 0.5) * 120;
    positions[i3 + 2] = (Math.random() - 0.5) * 200;

    // color mix towards neon blue
    const t = Math.random();
    const r = 0.0;
    const g = 0.8 * t + 0.1 * (1 - t);
    const b = 1.0 * (1 - t) + 0.5 * t;
    colors[i3 + 0] = r;
    colors[i3 + 1] = g;
    colors[i3 + 2] = b;
  }

  geometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));
  geometry.setAttribute("color", new THREE.BufferAttribute(colors, 3));

  const material = new THREE.PointsMaterial({
    size: 0.9,
    vertexColors: true,
    transparent: true,
    opacity: 0.85,
    depthWrite: false
  });

  const points = new THREE.Points(geometry, material);
  scene.add(points);

  let rot = 0;
  function animate() {
    if (!renderer.domElement) return;

    rot += 0.0018;
    points.rotation.y = rot;
    points.rotation.x = Math.sin(rot * 0.5) * 0.02;
    renderer.render(scene, camera);
    requestAnimationFrame(animate);
  }
  animate();

  window.addEventListener("resize", () => {
    const W = container.clientWidth || window.innerWidth;
    const H = container.clientHeight || window.innerHeight;
    renderer.setSize(W, H);
    camera.aspect = W / H;
    camera.updateProjectionMatrix();
  });
}

/* ------------- Three.js: Scroll-Controlled 3D Octahedron for About Section ------------- */
function initThreeShapeScroll() {
    if (typeof THREE === 'undefined' || typeof gsap === 'undefined') return;

    const mount = document.getElementById("three-shape-scroll");
    if (!mount) return;

    const W = mount.clientWidth || 128;
    const H = mount.clientHeight || 128;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, W / H, 0.1, 100);
    camera.position.z = 2;

    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setSize(W, H);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    mount.innerHTML = '';
    mount.appendChild(renderer.domElement);

    const geometry = new THREE.OctahedronGeometry(1, 0);
    const material = new THREE.MeshBasicMaterial({
        color: 0x00ffff,
        wireframe: true,
        opacity: 0.8,
        transparent: true
    });
    const shape = new THREE.Mesh(geometry, material);
    scene.add(shape);

    function renderShape() {
        if (!renderer.domElement) return;
        shape.rotation.z += 0.005;
        shape.rotation.x += 0.002;
        renderer.render(scene, camera);
        requestAnimationFrame(renderShape);
    }
    renderShape();

    gsap.to(shape.rotation, {
        x: Math.PI * 4,
        y: Math.PI * 8,
        scale: 1.5,
        ease: "none",
        scrollTrigger: {
            trigger: "#section-about",
            start: "top bottom",
            end: "bottom top",
            scrub: 1.5,
            scroller: "#main-container"
        }
    });

    window.addEventListener("resize", () => {
        const w = mount.clientWidth || 128;
        const h = mount.clientHeight || 128;
        renderer.setSize(w, h);
        camera.aspect = w / h;
        camera.updateProjectionMatrix();
    });
}


/* ------------- Three.js: Rotating 3D skills cluster (icons as sprites) ------------- */
function initThreeSkills() {
  if (typeof THREE === 'undefined') return;
  const mount = document.getElementById("three-skills");
  if (!mount) return;

  const W = mount.clientWidth || 400;
  const H = mount.clientHeight || 300;

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(50, W / H, 0.1, 1000);
  camera.position.z = 60;

  const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
  renderer.setSize(W, H);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  mount.innerHTML = '';
  mount.appendChild(renderer.domElement);

  const skillsIcons = [
    { label: "Py", color: "#FFD43B" },
    { label: "ML", color: "#00ffff" },
    { label: "Tab", color: "#FF6347" },
    { label: "SQL", color: "#30A6F0" },
    { label: "Gen", color: "#FF00AA" },
    { label: "Web", color: "#39D353" }
  ];

  const group = new THREE.Group();
  scene.add(group);

  function createSprite(text, color) {
    const size = 128;
    const canvas = document.createElement("canvas");
    canvas.width = size; canvas.height = size;
    const ctx = canvas.getContext("2d");

    ctx.fillStyle = "rgba(255,255,255,0.02)";
    ctx.beginPath();
    ctx.arc(size/2, size/2, size/2 - 2, 0, Math.PI * 2);
    ctx.fill();

    ctx.strokeStyle = color;
    ctx.lineWidth = 8;
    ctx.beginPath();
    ctx.arc(size/2, size/2, size/2 - 8, 0, Math.PI * 2);
    ctx.stroke();

    ctx.fillStyle = "#fff";
    ctx.font = "bold 46px Inter, Arial";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText(text, size/2, size/2);

    const tex = new THREE.CanvasTexture(canvas);
    tex.needsUpdate = true;
    const mat = new THREE.SpriteMaterial({ map: tex, transparent: true, depthTest: false });
    return new THREE.Sprite(mat);
  }

  const radius = 30;
  skillsIcons.forEach((s, i) => {
    const sprite = createSprite(s.label, s.color);
    const phi = Math.acos(-1 + (2 * i) / skillsIcons.length);
    const theta = Math.sqrt(skillsIcons.length * Math.PI) * phi;
    sprite.position.set(
      radius * Math.cos(theta) * Math.sin(phi),
      radius * Math.sin(theta) * Math.sin(phi),
      radius * Math.cos(phi)
    );
    sprite.scale.set(12, 12, 1);
    group.add(sprite);
  });

  function renderSkills() {
    if (!renderer.domElement) return;

    group.rotation.y += 0.005;
    group.rotation.x = Math.sin(Date.now() * 0.0007) * 0.1;
    renderer.render(scene, camera);
    requestAnimationFrame(renderSkills);
  }
  renderSkills();

  window.addEventListener("resize", () => {
    const w = mount.clientWidth || 400;
    const h = mount.clientHeight || 300;
    renderer.setSize(w, h);
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
  });
}

/* ------------- Rellax parallax init ------------- */
function initRellax() {
  try {
    if (typeof Rellax === 'undefined') return;
    new Rellax('[data-rellax-speed]', { center: true });
  } catch (e) {
    console.warn("Rellax init failed", e);
  }
}

/* ------------- VanillaTilt init ------------- */
function initTilt() {
    if (typeof VanillaTilt === 'undefined') return;
  VanillaTilt.init(document.querySelectorAll("[data-tilt]"), {
    max: 12, speed: 400, glare: true, "max-glare": 0.25
  });
}

/* ------------- GSAP: section animations, timeline, float effects ------------- */
function initGSAPAnimations() {
  if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') return;

  // split hero title
  const heroTitle = $(".hero-title");
  if (heroTitle) {
      const txt = heroTitle.textContent.trim();
      heroTitle.textContent = "";
      const frag = document.createDocumentFragment();
      for (let i = 0; i < txt.length; i++) {
        const ch = txt[i];
        const span = document.createElement("span");
        span.textContent = ch === " " ? "\u00A0" : ch;
        span.style.display = "inline-block";
        span.style.opacity = 0;
        span.style.transform = "translateY(100%)";
        frag.appendChild(span);
      }
      heroTitle.appendChild(frag);

      gsap.to(".hero-title span", {
        y: 0,
        opacity: 1,
        duration: 0.6,
        ease: "power3.out",
        stagger: 0.04,
        delay: 0.5
      });
  }

  // float small elements
  gsap.utils.toArray(".float").forEach((el, i) => {
    gsap.fromTo(el, { y: 0 }, { y: -12, yoyo: true, repeat: -1, duration: 2.5 + (i * 0.2), ease: "sine.inOut" });
  });

  // content-card fade + lift on scroll
  gsap.utils.toArray(".content-card").forEach(c => {
    gsap.from(c, {
      y: 60, opacity: 0, scale: 0.95, duration: 1.2, ease: "power3.out",
      scrollTrigger: { trigger: c, start: "top 90%", scroller: "#main-container" }
    });
  });

  // timeline line growth
  const tlLine = gsap.timeline({
    scrollTrigger: {
      trigger: "#timeline",
      start: "top 80%",
      end: "bottom 20%",
      scrub: 0.8,
      scroller: "#main-container"
    }
  });
  tlLine.to("#timeline-line", { height: "100%", ease: "none" });

  // timeline cards fly in
  gsap.utils.toArray(".timeline-card").forEach((card, idx) => {
    const fromX = idx % 2 === 0 ? -120 : 120;
    gsap.from(card, {
      x: fromX, opacity: 0, duration: 1.2, ease: "power3.out",
      scrollTrigger: { trigger: card, start: "top 95%", scroller: "#main-container" }
    });
  });
}

/* ------------- Navigation: smooth scroll to sections ------------- */
function initNavigation() {
    $$(".nav-link").forEach(link => {
        link.addEventListener("click", (e) => {
            e.preventDefault();
            const targetId = link.getAttribute("data-target");
            const targetElement = document.getElementById(targetId);

            if (window.loco && targetElement) {
                // Offset by the navbar height (approx 80px)
                window.loco.scrollTo(targetElement, { offset: -80 });
            } else if (targetElement) {
                targetElement.scrollIntoView({ behavior: "smooth" });
            }
        });
    });
}


/* ------------- About: reveal content (wipe) ------------- */
function initAboutButtons() {
  const aboutMap = {
    career: `<strong>🌟 Career Vision & Goals</strong>
        <ul style="text-align:left;margin-left:18px;list-style-type:disc;">
            <li>Short-term Goal: Secure a high-paying role (10–12 LPA) as a fresher in AI/ML, Data Science, or Cloud.</li>
            <li>Preferred Roles: AI Engineer/ML Ops Engineer (Primary), Data Scientist (Secondary), Cloud Architect (Tertiary).</li>
            <li>Long-term Vision: Lead innovative AI projects, build AI-driven products, and contribute to cutting-edge research in Generative AI and automation.</li>
        </ul>`,
    skills: `<strong>🛠 Core Skills & Interests</strong>
        <ul style="text-align:left;margin-left:18px;list-style-type:disc;">
            <li>Programming & Frameworks: Python, SQL, Java, HTML, CSS, JavaScript.</li>
            <li>AI & ML: Machine Learning algorithms, AI agents, Generative AI, RAG-based systems, Decision Trees, Expert Systems.</li>
            <li>Data Tools: Tableau, Numpy, Scipy, Pandas.</li>
            <li>Soft Skills: Problem-solving, analytical thinking, logical reasoning, and creativity in projects.</li>
        </ul>`,
    learning: `<strong>📌 Current Learning Path</strong>
        <ul style="text-align:left;margin-left:18px;list-style-type:disc;">
            <li>AI/ML Focus: Deepening knowledge of AI fundamentals, advanced ML algorithms, Generative AI (RAG), and expert systems.</li>
            <li>Programming: Mastering advanced Python frameworks for development.</li>
            <li>Web & Cloud: Advanced interactive web development and AWS basics for cloud-based AI solutions.</li>
        </ul>`,
     location: `<p>I am currently a passionate B.Tech CSE-AIML student in my 3rd year, based in Hyderabad, Telangana, India 🇮🇳. I thoroughly enjoy problem-solving, learning new technologies, and applying them to create intelligent systems.</p>`
  };

  $$(".about-btn").forEach(btn => {
    btn.addEventListener("click", () => {
      const key = btn.dataset.key;
      const target = $("#about-reveal");
      target.innerHTML = aboutMap[key] || "Coming soon";
      target.style.clipPath = "inset(0 100% 0 0)";
      gsap.to(target, { clipPath: "inset(0 0% 0 0)", duration: 0.7, ease: "power2.out" });
      gsap.from(target, { y: 18, opacity: 0, duration: 0.7 });
    });
  });
}

/* ------------- Skills: click reveals + radial animation ------------- */
function initSkillButtons() {
  const skillsMap = {
    python: "🐍 Python Programming → Deep proficiency in core Python, OOP, and scientific computing (Numpy, Scipy, Pandas). Applying frameworks like Scikit-learn and TensorFlow for AI/ML development.",
    aiml: "🧠 AI/ML → Strong foundation in core ML algorithms, Decision Trees, Bayesian Networks, and Expert Systems. Actively exploring deep learning models and advanced techniques.",
    datasci: "📊 Data Tools → Expertise in data cleaning, manipulation, and analytics reporting using Tableau and Pandas. Focus on Exploratory Data Analysis (EDA) and statistical modeling.",
    sql: "🗄️ SQL & Data Querying → Comprehensive knowledge of DDL/DML, advanced joins, nested queries, and efficient data retrieval for robust, data-driven backends.",
    javaweb: "🌐 Web Dev → Foundational knowledge in Java, HTML, CSS, and JavaScript, used for developing interactive web projects, including portfolio features.",
    genai: "🔥 Generative AI → Focused learning on Generative AI models, RAG (Retrieval-Augmented Generation) systems, and prompt engineering, complemented by relevant certifications."
  };

  $$(".skill-btn").forEach(btn => {
    btn.addEventListener("click", () => {
      const key = btn.dataset.key;
      const target = $("#skill-reveal");
      target.innerHTML = `<div style="max-width:800px;margin:0 auto;text-align:left;line-height:1.5;">${skillsMap[key] || "Coming soon"}</div>`;

      target.style.clipPath = "inset(0 100% 0 0)";
      gsap.to(target, { clipPath: "inset(0 0% 0 0)", duration: 0.7, ease: "power2.out" });
      gsap.from(target, { y: 12, opacity: 0, duration: 0.6 });

      $$(".radial").forEach((r, i) => {
        const val = Number(r.dataset.val || 75);
        const svg = r.querySelector('.circular');
        const NS = 'http://www.w3.org/2000/svg';

        let prog = svg.querySelector('.progress');
        if (!prog) {
          prog = document.createElementNS(NS, 'path');
          prog.classList.add('progress');
          prog.setAttribute('d', 'M18 2a16 16 0 1 0 0 32');
          prog.setAttribute('fill', 'none');
          prog.setAttribute('stroke', getComputedStyle(document.documentElement).getPropertyValue('--accent') || '#00ffff');
          prog.setAttribute('stroke-width', '3');
          prog.setAttribute('stroke-linecap', 'round');
          svg.appendChild(prog);
        }

        const circ = 2 * Math.PI * 16;
        const dash = (val / 100) * circ;

        const valueEl = r.querySelector('.value');
        gsap.to(valueEl, { opacity: 1, duration: 0.3, delay: 0.1 });

        gsap.fromTo(prog.style,
            { strokeDasharray: `0 ${circ}` },
            { strokeDasharray: `${dash} ${circ}`, duration: 1.2 + i * 0.1, ease: 'power2.out' }
        );
      });
    });
  });
}

/* ------------- Projects 3D flip and modal ------------- */
function initProjects() {
  $$(".proj-card").forEach(card => {
    card.addEventListener("click", (e) => {
        if (e.target.closest(".repo-link")) return;
        card.classList.toggle("flipped");
    });
  });

  // Project data for modal - INTEGRATED REPO LINKS
  const projectDetails = {
    ev: {
        title: "EV Charging Demand Prediction ⚡",
        tech: "Python, XGBoost, Scikit-learn, Time-Series Analysis",
        summary: "AI/ML project focusing on forecasting the demand for Electric Vehicle charging stations in urban areas. Utilized advanced regression models and time-series techniques to optimize resource allocation and improve service efficiency.",
        insight: "Demonstrates strong foundation in predictive modeling, feature engineering, and real-world applicability of Machine Learning.",
        repo: "https://github.com/Abhinavsharma10-hash/EV_Charging_prediction.git"
    },
    fractoscan: {
        title: "Fractoscan: Orthopedic Fracture Detection 🦴",
        tech: "TensorFlow/Keras, CNNs, Medical Imaging Data, Python",
        summary: "An automated detection system for identifying orthopedic bone fractures from X-ray images using Convolutional Neural Networks (CNNs). Aimed at providing faster, preliminary diagnostic assistance.",
        insight: "Showcases expertise in Deep Learning, Computer Vision, and handling sensitive medical image datasets.",
        repo: null // No repo provided, link will be disabled
    },
    dashboard: {
        title: "Gamified Sustainability Board Game Dashboard 🌍",
        tech: "Tableau, Data Analytics, Gamification Logic",
        summary: "Developed during the 1M1B Internship, this project created an interactive Tableau dashboard to visualize analytics and gamification metrics related to a sustainability board game.",
        insight: "Highlights skills in data visualization, analytics reporting, and transforming raw data into engaging, actionable insights.",
        repo: "https://github.com/Abhinavsharma10-hash/Gamified-Sustainability-board-game.git"
    }
  };

  // modal close
  $$(".modal .modal-close").forEach(button => {
    button.addEventListener("click", (e) => {
      const modal = e.target.closest(".modal");
      modal.classList.remove("show");
      modal.setAttribute("aria-hidden", "true");
    });
  });

  // repo-links open modal with specific content
  $$(".repo-link").forEach(link => {
    link.addEventListener("click", (ev) => {
      ev.preventDefault();
      const key = link.dataset.project;
      const details = projectDetails[key];

      if (!details) return;

      const modal = $("#project-modal");
      const content = $("#project-modal-content");

      const repoButton = details.repo
        ? `<a href="${details.repo}" target="_blank" class="bg-blue-600 hover:bg-blue-700 text-bg-dark font-bold py-2 px-5 rounded-full transition shadow-lg">View GitHub Repo 💾</a>`
        : `<button disabled class="bg-gray-700 text-gray-400 font-bold py-2 px-5 rounded-full shadow-lg cursor-not-allowed">Repo Not Available</button>`;

      content.innerHTML = `
        <h3 class="text-3xl font-bold mb-4 text-accent">${details.title}</h3>
        <p class="text-text-secondary mb-4">${details.summary}</p>
        <p class="text-sm text-accent mb-6">**Tech Stack:** ${details.tech}</p>
        <div class="bg-slate-700 p-4 rounded-lg border border-accent/30">
            <p class="text-sm"><strong>Key Insight:</strong> ${details.insight}</p>
        </div>
        <div class="mt-6 flex justify-center">
            ${repoButton}
        </div>
      `;
      modal.classList.add("show");
      modal.setAttribute("aria-hidden", "false");
    });
  });
}

/* ------------- Certifications carousel + modal ------------- */
function initCerts() {
    // Certificate Links Mapping - INTEGRATED GOOGLE DRIVE LINKS
    const certLinks = {
        "AWS Academy: Gen AI Foundations": "https://drive.google.com/file/d/1Wie4B48KGbX7YW7YhozKEjoMiqxBuEUG/view?usp=drivesdk",
        "TATA Gen AI-Powered Data Analysis (Forage)": "https://drive.google.com/file/d/1CDUqRtUD2nCFtOq6T_xA7xfRkEJijRZQ/view?usp=drivesdk",
        "Simplilearn: ML using Python": "https://drive.google.com/file/d/1b8cyAVtaLZJPdij7z13CC-k4IuwBvkSa/view?usp=drivesdk",
        "TimesPro: Fintech Essentials": "https://drive.google.com/file/d/1jCoYHF3ahJYKGNzsCrYHznlpvlIQDbFZ/view?usp=drivesdk",
        "Lets Upgrade: AI Agents Bootcamp": "https://drive.google.com/file/d/1qS0VQJWsdIda6OgeYqFLsx0YVBR1PuDO/view?usp=drivesdk",
    };

  const items = $$(".cert-item");
  if (items.length === 0) return;

  let position = 0;

  function updatePositions() {
    items.forEach((it, i) => {
      const offset = i - position;
      gsap.to(it, {
        x: offset * 240, // Increased spacing
        scale: Math.max(0.7, 1 - Math.abs(offset) * 0.15),
        opacity: Math.abs(offset) > 3 ? 0 : 1, // Hide far items completely
        duration: 0.6,
        ease: "power2.out"
      });
    });
  }
  updatePositions();

  $("#cert-prev").addEventListener("click", () => {
    position = (position - 1 + items.length) % items.length;
    updatePositions();
  });
  $("#cert-next").addEventListener("click", () => {
    position = (position + 1) % items.length;
    updatePositions();
  });

  items.forEach(it => {
    it.addEventListener("click", () => {
      const key = it.dataset.cert;
      const link = certLinks[key];
      const modal = $("#cert-modal");

      const certButton = link
        ? `<a href="${link}" target="_blank" class="bg-blue-600 hover:bg-blue-700 text-bg-dark font-bold py-2 px-5 rounded-full transition shadow-lg">View Certificate Proof </a>`
        : `<button disabled class="bg-gray-700 text-gray-400 font-bold py-2 px-5 rounded-full shadow-lg cursor-not-allowed">Proof Not Available</button>`;


      $("#cert-modal-content").innerHTML = `
        <h3 class="text-3xl font-bold mb-4 text-accent">${key}</h3>
        <p class="text-text-secondary mb-6">Click below to view the certificate document (Opens in new tab).</p>
        <img src="https://placehold.co/400x300/1e293b/00ffff?text=Certificate+Image+Placeholder" alt="Certificate placeholder" class="w-full h-auto rounded-lg border border-accent/50">
        <div class="mt-6 flex justify-center">
            ${certButton}
        </div>
      `;
      modal.classList.add("show");
      modal.setAttribute("aria-hidden", "false");
    });
  });
}

/* ------------- Enter key navigation ------------- */
function initEnterNavigation() {
  const sections = Array.from(document.querySelectorAll("section[data-scroll-section]"));
  if (sections.length === 0) return;

  let idx = 0;
  document.addEventListener("keydown", (e) => {
    if (e.key === "Enter") {
      // Prevent action if an interactive element is focused
      if (document.activeElement.tagName === 'INPUT' || document.activeElement.tagName === 'TEXTAREA' || document.activeElement.tagName === 'BUTTON' || document.activeElement.tagName === 'A') {
        return;
      }

      idx = (idx + 1) % sections.length;
      if (window.loco) {
          window.loco.scrollTo(sections[idx], { offset: -80 });
      } else {
          sections[idx].scrollIntoView({ behavior: "smooth" });
      }

      if (window.loco && window.loco.update) {
        window.loco.update();
      }
    }
  });
}

/* ------------- Contact form submit animation ------------- */
function initContactForm() {
  const form = $("#contact-form");
  const feedback = $("#contact-feedback");
  if (!form) return;
  form.addEventListener("submit", (e) => {
    e.preventDefault();
    gsap.fromTo(feedback, { opacity: 0, y: 10 }, { opacity: 1, y: 0, duration: 0.6, ease: "power2.out" });
    feedback.textContent = "Thanks! I'll get back to you soon ✨";
    form.reset();
  });

  $("#contact-reset").addEventListener("click", () => {
    form.reset();
    gsap.fromTo(feedback, { opacity: 1 }, { opacity: 0, duration: 0.4 });
    feedback.textContent = "";
  });
}

/* ------------- Initialize everything ------------- */
function initAll() {
    let loco;
    try {
        loco = initSmoothScroll();
        window.loco = loco; // Attach to window for global access (e.g., in Navigation)
    } catch (e) {
        console.error("Locomotive Scroll/GSAP init failed. Falling back to native scroll.", e);
        // Fallback for native scrolling
        gsap.registerPlugin(ScrollTrigger);
        ScrollTrigger.scrollerProxy(window, null);
    }

    initThreeBackground();
    initThreeSkills();
    initThreeShapeScroll();
    initRellax();
    initTilt();
    initGSAPAnimations();

    initNavigation();

    initAboutButtons();
    initSkillButtons();
    initProjects();
    initCerts();
    initEnterNavigation();
    initContactForm();

    // extra micro-interactions
    if ($("#btn-resume")) {
        $("#btn-resume").addEventListener("click", () => {
            gsap.fromTo("#btn-resume", { scale: 1 }, { scale: 1.06, yoyo: true, repeat: 1, duration: 0.18 });
        });
    }
}

/* run after DOM ready */
document.addEventListener("DOMContentLoaded", initAll);
