// --------------------------------------------------------
// 1. XR LENS CURSOR LOGIC
// --------------------------------------------------------
const cursor = document.getElementById('cursor');

function updateHoverTargets() {
    const hoverTargets = document.querySelectorAll('.hover-target, a, button, .pub-item, .game-card');
    hoverTargets.forEach(target => {
        if (!target.dataset.cursorBound) {
            target.addEventListener('mouseenter', cursorActive);
            target.addEventListener('mouseleave', cursorInactive);
            target.dataset.cursorBound = "true";
        }
    });
}

function cursorActive() { cursor.classList.add('active'); }
function cursorInactive() { cursor.classList.remove('active'); }

let mouseX = 0, mouseY = 0;
let cursorX = 0, cursorY = 0;

document.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
});

function animateCursor() {
    cursorX += (mouseX - cursorX) * 0.35;
    cursorY += (mouseY - cursorY) * 0.35;
    cursor.style.left = `${cursorX}px`;
    cursor.style.top = `${cursorY}px`;
    requestAnimationFrame(animateCursor);
}

updateHoverTargets();
animateCursor();

// --------------------------------------------------------
// 2. SCROLL LOGIC (PROGRESS & REVEAL)
// --------------------------------------------------------
const nav = document.querySelector('nav');

window.addEventListener('scroll', () => {
    const winScroll = document.body.scrollTop || document.documentElement.scrollTop;
    const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
    const scrolled = (winScroll / height) * 100;
    document.getElementById('scroll-progress').style.width = scrolled + '%';

    // Nav Background
    if (winScroll > 50) {
        nav.classList.add('scrolled');
    } else {
        nav.classList.remove('scrolled');
    }
});

// Scroll Reveal Observer
const revealCallback = (entries, observer) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('active');
        }
    });
};

const revealObserver = new IntersectionObserver(revealCallback, {
    threshold: 0.1
});

document.querySelectorAll('.reveal').forEach(el => {
    revealObserver.observe(el);
});

// --------------------------------------------------------
// 3. THEME TOGGLE (DARK MODE)
// --------------------------------------------------------
const themeToggle = document.getElementById('theme-toggle');
const body = document.body;

themeToggle.addEventListener('click', () => {
    const currentTheme = body.getAttribute('data-theme');
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    const isDark = newTheme === 'dark';
    
    body.setAttribute('data-theme', newTheme);
    // Removed themeToggle.textContent line to keep only ◐
    
    // Update network instances
    if (network) network.setOptions(getNetworkOptions(isDark));
});

// --------------------------------------------------------
// 4. CITE BUTTON & ACCORDION
// --------------------------------------------------------
const pubItems = document.querySelectorAll('.pub-item');
const toast = document.getElementById('toast');

pubItems.forEach(item => {
    const title = item.querySelector('.pub-title');
    const citeBtn = item.querySelector('.cite-btn');

    title.addEventListener('click', (e) => {
        e.stopPropagation();
        item.classList.toggle('active');
    });

    citeBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        const citation = item.getAttribute('data-citation');
        navigator.clipboard.writeText(citation).then(() => {
            toast.classList.add('show');
            setTimeout(() => toast.classList.remove('show'), 2000);
        });
    });
});

// --------------------------------------------------------
// 5. DYNAMIC BLUEPRINT FILTERING
// --------------------------------------------------------
const filterBtns = document.querySelectorAll('.filter-btn');

filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        filterBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');

        const filter = btn.getAttribute('data-filter');

        pubItems.forEach(item => {
            if (filter === 'all' || item.classList.contains(filter)) {
                item.classList.remove('fade-out');
                item.style.display = 'grid';
            } else {
                item.classList.add('fade-out');
                setTimeout(() => { if(item.classList.contains('fade-out')) item.style.display = 'none'; }, 500);
            }
        });
    });
});

// --------------------------------------------------------
// 6. RESEARCH NETWORK GRAPH
// --------------------------------------------------------
const nodes = new vis.DataSet([
    // Core Concepts
    { id: 101, label: 'Communication Studies', category: 'comm', size: 35 },
    { id: 102, label: 'Crisis Communication', category: 'comm' },
    { id: 103, label: 'Twitter', category: 'comm' },
    { id: 104, label: 'Pandemic / Coronavirus', category: 'comm' },
    { id: 105, label: 'Globalization', category: 'comm' },
    { id: 106, label: 'Localization', category: 'comm' },
    { id: 107, label: 'Content Analysis', category: 'comm' },
    { id: 201, label: 'Extended Reality (XR)', category: 'xr', size: 35 },
    { id: 202, label: 'Virtual Reality (VR)', category: 'xr' },
    { id: 203, label: 'Augmented Reality (AR)', category: 'xr' },
    { id: 204, label: 'Cultural Heritage', category: 'xr' },
    { id: 205, label: 'Visitor Experience', category: 'xr' },
    { id: 206, label: 'User Experience (UX)', category: 'xr' },
    { id: 207, label: 'Agora of Smyrna', category: 'xr' },
    { id: 208, label: 'New Museology', category: 'xr' },
    { id: 301, label: 'Experiential Marketing', category: 'mkt', size: 35 },
    { id: 302, label: 'Consumption Culture', category: 'mkt' },
    { id: 303, label: 'Shopping Centers', category: 'mkt' },
    { id: 304, label: 'Consumer Behavior', category: 'mkt' },
    { id: 305, label: 'Special Days', category: 'mkt' },
    { id: 306, label: 'Bibliometric Analysis', category: 'mkt' }
]);

const edges = new vis.DataSet([
    // Conceptual Links
    { from: 101, to: 102 }, { from: 101, to: 105 }, { from: 102, to: 103 }, 
    { from: 102, to: 104 }, { from: 105, to: 106 }, { from: 101, to: 107 },
    { from: 201, to: 202 }, { from: 201, to: 203 }, { from: 202, to: 204 }, 
    { from: 204, to: 207 }, { from: 202, to: 205 }, { from: 205, to: 206 },
    { from: 204, to: 208 },
    { from: 301, to: 302 }, { from: 301, to: 303 }, { from: 302, to: 304 },
    { from: 304, to: 305 }, { from: 301, to: 306 },
    { from: 205, to: 301, dashes: true }, 
    { from: 102, to: 201, dashes: true }, 
    { from: 107, to: 306, dashes: true }
]);

const data = { nodes: nodes, edges: edges };
const container = document.getElementById('network-graph');

let network = null;

function getNetworkOptions(isDark) {
    return {
        nodes: {
            shape: 'dot',
            font: { face: 'Neue Haas Grotesk Display Pro', size: 18, color: isDark ? '#ffffff' : '#111111' },
            borderWidth: 2,
            color: {
                border: isDark ? '#ffffff' : '#111111', background: isDark ? '#000000' : '#ffffff',
                highlight: { border: '#FF5500', background: '#FF5500' }
            }
        },
        edges: {
            color: { color: isDark ? '#444444' : '#888888', highlight: '#FF5500' },
            width: 1.5, smooth: { type: 'continuous' }
        },
        physics: {
            forceAtlas2Based: { gravitationalConstant: -100, centralGravity: 0.01, springLength: 150, springConstant: 0.08 },
            maxVelocity: 50, solver: 'forceAtlas2Based', timestep: 0.35,
            stabilization: { iterations: 200 }
        },
        interaction: { hover: true, zoomView: true, dragView: true, keyboard: true }
    };
}

network = new vis.Network(container, data, getNetworkOptions(false));

// NODE SELECTION FILTERING
network.on("selectNode", function (params) {
    if (params.nodes.length > 0) {
        const nodeId = params.nodes[0];
        const selectedNode = nodes.get(nodeId);
        const category = selectedNode.category;

        // Sync with filter buttons
        filterBtns.forEach(btn => {
            if (btn.getAttribute('data-filter') === category) {
                btn.classList.add('active');
            } else {
                btn.classList.remove('active');
            }
        });

        // Filter publications
        pubItems.forEach(item => {
            if (category === 'all' || item.classList.contains(category)) {
                item.classList.remove('fade-out');
                item.style.display = 'grid';
            } else {
                item.classList.add('fade-out');
                setTimeout(() => { if(item.classList.contains('fade-out')) item.style.display = 'none'; }, 500);
            }
        });
    }
});

network.on("deselectNode", function () {
    // Reset to 'all'
    filterBtns.forEach(btn => {
        if (btn.getAttribute('data-filter') === 'all') {
            btn.classList.add('active');
        } else {
            btn.classList.remove('active');
        }
    });

    pubItems.forEach(item => {
        item.classList.remove('fade-out');
        item.style.display = 'grid';
    });
});

// ZOOM LOGIC FOR MOBILE
network.once("stabilizationIterationsDone", function () {
    if (window.innerWidth < 768) {
        network.moveTo({
            scale: 0.6, // Zoomed in for mobile
            animation: { duration: 1000, easingFunction: "easeInOutQuad" }
        });
    } else {
        network.fit({
            animation: { duration: 1000, easingFunction: "easeInOutQuad" }
        });
    }
});

// --------------------------------------------------------
// 7. DYNAMIC GEOMETRIC MESH (HERO BACKGROUND)
// --------------------------------------------------------
const topoContainer = document.getElementById('topo-container');
const points = [];
const numPoints = 60;
const connectionDist = 250;

function initMesh() {
    topoContainer.innerHTML = '';
    points.length = 0;
    const width = window.innerWidth;
    const height = window.innerHeight;

    for (let i = 0; i < numPoints; i++) {
        points.push({
            x: Math.random() * width,
            y: Math.random() * height,
            vx: (Math.random() - 0.5) * 0.8,
            vy: (Math.random() - 0.5) * 0.8,
            element: document.createElementNS("http://www.w3.org/2000/svg", "circle")
        });
        points[i].element.setAttribute("r", "1.5");
        points[i].element.setAttribute("fill", "var(--accent)");
        points[i].element.setAttribute("opacity", "0.4");
        topoContainer.appendChild(points[i].element);
    }
}

function animateMesh() {
    const width = window.innerWidth;
    const height = window.innerHeight;
    
    // Clear existing lines (or reuse paths for better perf)
    const existingPaths = topoContainer.querySelectorAll('path');
    existingPaths.forEach(p => p.remove());

    // Update positions
    points.forEach(p => {
        p.x += p.vx;
        p.y += p.vy;

        // Bounce
        if (p.x < 0 || p.x > width) p.vx *= -1;
        if (p.y < 0 || p.y > height) p.vy *= -1;

        p.element.setAttribute("cx", p.x);
        p.element.setAttribute("cy", p.y);
    });

    // Draw Connections
    for (let i = 0; i < points.length; i++) {
        for (let j = i + 1; j < points.length; j++) {
            const dx = points[i].x - points[j].x;
            const dy = points[i].y - points[j].y;
            const dist = Math.sqrt(dx * dx + dy * dy);

            if (dist < connectionDist) {
                const path = document.createElementNS("http://www.w3.org/2000/svg", "path");
                const opacity = (1 - dist / connectionDist) * 0.3;
                path.setAttribute("d", `M ${points[i].x},${points[i].y} L ${points[j].x},${points[j].y}`);
                path.setAttribute("stroke", "var(--accent)");
                path.setAttribute("stroke-width", "0.5");
                path.setAttribute("opacity", opacity);
                path.setAttribute("fill", "none");
                topoContainer.appendChild(path);
            }
        }
    }
    requestAnimationFrame(animateMesh);
}

window.addEventListener('resize', initMesh);
initMesh();
animateMesh();

// --------------------------------------------------------
// 8. PROJECT & COURSE MODAL LOGIC
// --------------------------------------------------------
const projectModal = document.getElementById('project-modal');
const modalContent = document.getElementById('modal-content');
const modalClose = document.getElementById('modal-close');
const gameCards = document.querySelectorAll('.game-card');

const projectDetails = {
    museo: {
        title: "Museo_Logic",
        category: "Research Tool // LIVE",
        description: "A strategic simulation tool originating from Dr. Simge Uğurluer’s doctoral dissertation. It operates at the intersection of New Museology and Experiential Marketing.",
        methodology: "Synthesizes three core research variables: Heritage Core, Immersive Medium, and Visitor Segment to generate strategic directives for XR applications.",
        tech: ["GSAP", "HTML5", "PhD Framework", "Marketing Psychology"],
        link: "lab.html"
    },
    killcampaign: {
        title: "Kill the Campaign",
        category: "Serious Game // LIVE",
        description: "A workshop-based serious game designed to train strategic thinking by deconstructing successful historical campaigns through modern cultural challenges.",
        methodology: "Gamifies strategic critique through randomized constraints, encouraging students to identify strategic vulnerabilities without relying on subjective opinions.",
        tech: ["Strategy", "Serious Games", "Deconstruction", "Classroom Toolkit"],
        link: "kill-campaign-test.html"
    },
    crisis: {
        title: "PR Crisis Simulator",
        category: "Serious Game",
        description: "A digital training platform where communication students manage a high-stakes corporate crisis in real-time.",
        methodology: "Built on a custom branching narrative engine. Uses AI-driven sentiment analysis.",
        tech: ["JavaScript", "Node.js", "GPT-4 API", "Tailwind CSS"]
    },
    brand: {
        title: "Brand Narrative Lens",
        category: "AR Experience",
        description: "An Augmented Reality application that overlays digital storytelling onto physical retail environments.",
        methodology: "Investigated through qualitative user interviews and spatial heatmaps.",
        tech: ["8th Wall", "WebAR", "Three.js", "Spark AR"]
    }
};

const courseDetails = {
    adv_design: {
        title: "Advertising Design",
        category: "Undergraduate Compulsory",
        img: "thumbnails/Advertising_Design.png",
        info: "Focuses on the visual language of advertising, from layout principles to creative execution across various media platforms."
    },
    digital_design: {
        title: "Digital Design Applications in Advertising",
        category: "Undergraduate Compulsory",
        img: "thumbnails/Digital_Design_Applications_in_Advertising.png",
        info: "Practical application of digital design tools (Adobe Creative Suite) in the context of professional advertising campaigns."
    },
    mkt_comm: {
        title: "Marketing Communications",
        category: "Undergraduate Compulsory",
        img: "thumbnails/Marketing_Communications.png",
        info: "Explores the integrated nature of marketing communications, covering PR, advertising, personal selling, and digital strategy."
    },
    cross_cultural: {
        title: "Cross-Cultural Advertising",
        category: "Undergraduate Elective",
        img: "thumbnails/Crosscultural_Advertising.png",
        info: "Exploring how cultural differences influence advertising strategies and consumer perception in a globalized market."
    },
    exp_mkt: {
        title: "Experiential Marketing",
        category: "Undergraduate Elective",
        img: "thumbnails/Experiential_Marketing.png",
        info: "Focusing on creating memorable and engaging brand experiences that connect with consumers on an emotional level."
    }
};

gameCards.forEach(card => {
    card.addEventListener('click', () => {
        const projectId = card.getAttribute('data-project');
        const courseId = card.getAttribute('data-course');
        
        if (projectId) {
            const details = projectDetails[projectId];
            modalContent.innerHTML = `
                <div class="modal-header">
                    <span>${details.category}</span>
                    <h2>${details.title}</h2>
                </div>
                <div class="modal-body">
                    <div class="modal-info">
                        <h4>Overview</h4>
                        <p>${details.description}</p>
                        <h4>Foundations</h4>
                        <ul class="modal-tech-list">
                            ${details.tech.map(t => `<li>${t}</li>`).join('')}
                        </ul>
                    </div>
                    <div class="modal-info">
                        <h4>Methodology & Context</h4>
                        <p>${details.methodology}</p>
                        ${details.link ? `<div style="display: flex; justify-content: flex-end; width: 100%; margin-top: 4rem;"><a href="${details.link}" class="cite-btn hover-target" style="display: inline-block; padding: 1.2rem 3rem; opacity: 1; text-decoration: none; font-size: 0.95rem; letter-spacing: 0.1em; background: var(--accent); color: #fff; border: none;">[LAUNCH APPLICATION]</a></div>` : ''}
                    </div>
                </div>
            `;
        } else if (courseId) {
            const details = courseDetails[courseId];
            modalContent.innerHTML = `
                <div class="modal-header">
                    <span>${details.category}</span>
                    <h2>${details.title}</h2>
                </div>
                <div class="modal-body" style="display: block;">
                    <div class="modal-info">
                        <p>${details.info}</p>
                    </div>
                    <img src="${details.img}" alt="${details.title}" style="width: 100%; border: 1px solid var(--grid-line); margin-top: 2rem;">
                </div>
            `;
        }
        
        projectModal.classList.add('active');
        setTimeout(updateHoverTargets, 100);
    });
});

modalClose.addEventListener('click', () => projectModal.classList.remove('active'));
projectModal.addEventListener('click', (e) => { if (e.target === projectModal) projectModal.classList.remove('active'); });

// --------------------------------------------------------
// 9. PORTRAIT SPOTLIGHT LOGIC
// --------------------------------------------------------
const portraitContainer = document.getElementById('portrait-container');

if (portraitContainer) {
    portraitContainer.addEventListener('mousemove', (e) => {
        const rect = portraitContainer.getBoundingClientRect();
        const x = ((e.clientX - rect.left) / rect.width) * 100;
        const y = ((e.clientY - rect.top) / rect.height) * 100;
        
        portraitContainer.style.setProperty('--mouse-x', `${x}%`);
        portraitContainer.style.setProperty('--mouse-y', `${y}%`);
    });
}

setTimeout(updateHoverTargets, 1000);
