// スクロールによるフェードイン
const faders = document.querySelectorAll('.fade-in');
const options = {
    threshold: 0.5
};

const appearOnScroll = new IntersectionObserver(function(entries, appearOnScroll) {
    entries.forEach(entry => {
        if (!entry.isIntersecting) {
            return;
        } else {
            entry.target.classList.add('visible');
            appearOnScroll.unobserve(entry.target);
        }
    });
}, options);

faders.forEach(fader => {
    appearOnScroll.observe(fader);
});

// AOS (Animate on Scroll) の初期化
AOS.init();

// Typed.jsの初期化
var typed = new Typed('.element', {
    strings: ["廣瀬大雅のポートフォリオへようこそ","WEB開発が好きです", "JavaScriptが好きです","最近はjavaを勉強中です"],
    typeSpeed: 50,
    backSpeed: 25,
    loop: true
});

// フローティングアクションボタンのクリックイベント
document.getElementById('back-to-top').addEventListener('click', () => {
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
});

// スムーズスクロールとページ内ナビゲーション
document.querySelectorAll('nav a').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        e.preventDefault();
        document.querySelector(this.getAttribute('href')).scrollIntoView({
            behavior: 'smooth'
        });
    });
});

// ホバー時のパララックス効果
document.querySelectorAll('.project').forEach(project => {
    project.addEventListener('mousemove', (e) => {
        const { offsetX, offsetY } = e;
        const { clientWidth, clientHeight } = project;

        const moveX = (offsetX - clientWidth / 2) / 20;
        const moveY = (offsetY - clientHeight / 2) / 20;

        project.style.transform = `translate(${moveX}px, ${moveY}px) scale(1.05)`;
    });

    project.addEventListener('mouseleave', () => {
        project.style.transform = `translate(0, 0) scale(1)`;
    });
});

// プロジェクトフィルタリング機能
const filters = document.querySelectorAll('.filter-btn');
filters.forEach(filter => {
    filter.addEventListener('click', function() {
        const category = this.dataset.category;
        const projects = document.querySelectorAll('.project');
        projects.forEach(project => {
            if (category === 'all' || project.dataset.category === category) {
                project.style.display = 'block';
                project.classList.add('fade-in', 'visible');
            } else {
                project.style.display = 'none';
                project.classList.remove('visible');
            }
        });
    });
});

// ダークモード切り替え
const toggleButton = document.getElementById('dark-mode-toggle');
toggleButton.addEventListener('click', () => {
    document.body.classList.toggle('dark-mode');
});

// カスタムカーソル
const cursor = document.querySelector('.custom-cursor');
document.addEventListener('mousemove', (e) => {
    cursor.style.left = `${e.clientX}px`;
    cursor.style.top = `${e.clientY}px`;
});

document.querySelectorAll('.project').forEach(project => {
    project.addEventListener('mouseenter', () => {
        cursor.classList.add('project-hover');
    });
    project.addEventListener('mouseleave', () => {
        cursor.classList.remove('project-hover');
    });
});

// フルスクリーンメニュー
const menuToggle = document.getElementById('menu-toggle');
menuToggle.addEventListener('click', () => {
    document.body.classList.toggle('menu-active');
});

document.querySelectorAll('.fullscreen-menu a').forEach(link => {
    link.addEventListener('click', () => {
        document.body.classList.remove('menu-active');
    });
});

// スクロールトリガーアニメーション
window.addEventListener('scroll', () => {
    const triggerElements = document.querySelectorAll('.scroll-trigger');
    const triggerOffset = 150;

    triggerElements.forEach(el => {
        const elementTop = el.getBoundingClientRect().top;
        const windowHeight = window.innerHeight;

        if (elementTop < windowHeight - triggerOffset) {
            el.classList.add('active');
        }
    });
});

// リベールアニメーション
document.addEventListener('DOMContentLoaded', function () {
    const revealElements = document.querySelectorAll('.reveal');

    const revealOnScroll = () => {
        revealElements.forEach(el => {
            const elementTop = el.getBoundingClientRect().top;
            const windowHeight = window.innerHeight;

            if (elementTop < windowHeight - 100) {
                el.classList.add('active');
            }
        });
    };

    window.addEventListener('scroll', revealOnScroll);
    revealOnScroll();
});

document.addEventListener('DOMContentLoaded', () => {
    // シーンの作成
    const scene = new THREE.Scene();

    // カメラの作成
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.z = 5;

    // レンダラーの作成
    const renderer = new THREE.WebGLRenderer();
    renderer.setSize(window.innerWidth, window.innerHeight);
    document.body.appendChild(renderer.domElement);

    // キューブの作成
    const geometry = new THREE.BoxGeometry();
    const material = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
    const cube = new THREE.Mesh(geometry, material);
    scene.add(cube);

    // アニメーション関数
    function animate() {
        requestAnimationFrame(animate);

        // キューブを回転
        cube.rotation.x += 0.01;
        cube.rotation.y += 0.01;

        renderer.render(scene, camera);
    }

    animate();

    // ウィンドウリサイズ対応
    window.addEventListener('resize', () => {
        const width = window.innerWidth;
        const height = window.innerHeight;
        renderer.setSize(width, height);
        camera.aspect = width / height;
        camera.updateProjectionMatrix();
    });
});

document.addEventListener('DOMContentLoaded', () => {
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / (window.innerHeight / 2), 0.1, 1000);
    camera.position.z = 2;

    const renderer = new THREE.WebGLRenderer({ alpha: true });
    renderer.setSize(window.innerWidth, window.innerHeight / 2);
    document.querySelector('.hero-banner').appendChild(renderer.domElement);

    const particleCount = 1000;
    const particles = new THREE.BufferGeometry();
    const particlePositions = new Float32Array(particleCount * 3);

    for (let i = 0; i < particleCount * 3; i++) {
        particlePositions[i] = (Math.random() - 0.5) * 5;
    }

    particles.setAttribute('position', new THREE.BufferAttribute(particlePositions, 3));

    const particleMaterial = new THREE.PointsMaterial({
        color: 0xffffff,
        size: 0.02,
    });

    const particleSystem = new THREE.Points(particles, particleMaterial);
    scene.add(particleSystem);

    function animate() {
        requestAnimationFrame(animate);

        particleSystem.rotation.x += 0.001;
        particleSystem.rotation.y += 0.001;

        renderer.render(scene, camera);
    }

    animate();

    window.addEventListener('resize', () => {
        const width = window.innerWidth;
        const height = window.innerHeight / 2;
        renderer.setSize(width, height);
        camera.aspect = width / height;
        camera.updateProjectionMatrix();
    });

    document.addEventListener('mousemove', (event) => {
        const mouseX = (event.clientX / window.innerWidth) * 2 - 1;
        const mouseY = -(event.clientY / (window.innerHeight / 2)) * 2 + 1;

        particleSystem.rotation.x = mouseY * 0.5;
        particleSystem.rotation.y = mouseX * 0.5;
    });
});

const scroll = new LocomotiveScroll({
    el: document.querySelector('[data-scroll-container]'),
    smooth: true,
    getDirection: true
});

ScrollReveal().reveal('.section-title', {
    distance: '50px',
    origin: 'bottom',
    duration: 1000,
    reset: true
});
ScrollReveal().reveal('.project', {
    interval: 200,
    origin: 'bottom',
    distance: '20px',
    duration: 800,
    reset: false
});