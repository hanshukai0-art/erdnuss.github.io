// ==================== 配置 ====================
const CONFIG = {
    // 作品配置 - 在这里添加你的作品信息
    works: [
        {
            filename: 'city-1.jpg',
            title: '城市几何',
            category: 'city',
            description: '高楼林立间的光影对比'
        },
        {
            filename: 'city-2.jpg',
            title: '夜色迷离',
            category: 'city',
            description: '城市夜晚的静谧时刻'
        },
        {
            filename: 'humanity-1.jpg',
            title: '匿名的路人',
            category: 'humanity',
            description: '人群中的孤独身影'
        },
        {
            filename: 'humanity-2.jpg',
            title: '决定性瞬间',
            category: 'humanity',
            description: '时光的永恒定格'
        },
        {
            filename: 'nature-1.jpg',
            title: '自然律动',
            category: 'nature',
            description: '光线下的自然纹理'
        },
        {
            filename: 'nature-2.jpg',
            title: '静谧之境',
            category: 'nature',
            description: '自然中的内省时刻'
        }
    ],
    
    // 图片文件夹路径
    imagesFolder: 'images/'
};

// ==================== 全局变量 ====================
let currentLightboxIndex = 0;
let currentCategory = 'all';
let filteredWorks = [];

// ==================== 页面加载 ====================
window.addEventListener('load', () => {
    // 隐藏加载动画
    setTimeout(() => {
        document.getElementById('loader').classList.add('hidden');
    }, 1000);
    
    // 初始化作品集
    initGallery();
    
    // 初始化导航
    initNavigation();
    
    // 初始化滚动效果
    initScrollEffects();
    
    // 初始化灯箱
    initLightbox();
});

// ==================== 作品集初始化 ====================
function initGallery() {
    filteredWorks = CONFIG.works;
    renderGallery();
}

// ==================== 渲染作品集 ====================
function renderGallery() {
    const galleryGrid = document.getElementById('galleryGrid');
    
    // 根据分类过滤作品
    const works = currentCategory === 'all' 
        ? CONFIG.works 
        : CONFIG.works.filter(work => work.category === currentCategory);
    
    filteredWorks = works;
    
    // 清空现有内容
    galleryGrid.innerHTML = '';
    
    // 如果没有作品，显示空状态
    if (works.length === 0) {
        galleryGrid.innerHTML = `
            <div class="gallery-empty">
                <div class="gallery-empty-icon">📷</div>
                <p class="gallery-empty-text">暂无作品，请添加图片到 images 文件夹</p>
            </div>
        `;
        return;
    }
    
    // 渲染每个作品
    works.forEach((work, index) => {
        const item = createGalleryItem(work, index);
        galleryGrid.appendChild(item);
    });
}

// ==================== 创建作品项 ====================
function createGalleryItem(work, index) {
    const item = document.createElement('div');
    item.className = 'gallery-item';
    item.style.animationDelay = `${index * 0.1}s`;
    
    const imagePath = CONFIG.imagesFolder + work.filename;
    
    item.innerHTML = `
        <img src="${imagePath}" 
             alt="${work.title}" 
             loading="lazy"
             onerror="this.src='data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 width=%22400%22 height=%22500%22%3E%3Crect fill=%22%231a1a1a%22 width=%22400%22 height=%22500%22/%3E%3Ctext fill=%22%23666%22 font-family=%22Arial%22 font-size=%2216%22 x=%2250%25%22 y=%2250%25%22 text-anchor=%22middle%22 dominant-baseline=%22middle%22%3E图片未找到%3C/text%3E%3C/svg%3E'">
        <div class="gallery-item-overlay">
            <div class="gallery-item-title">${work.title}</div>
            <div class="gallery-item-category">${getCategoryName(work.category)}</div>
        </div>
    `;
    
    // 点击打开灯箱
    item.addEventListener('click', () => {
        openLightbox(index);
    });
    
    return item;
}

// ==================== 获取分类中文名 ====================
function getCategoryName(category) {
    const names = {
        city: '城市',
        humanity: '人文',
        nature: '自然'
    };
    return names[category] || category;
}

// ==================== 导航初始化 ====================
function initNavigation() {
    const navLinks = document.querySelectorAll('.nav-link');
    
    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            const category = link.getAttribute('data-category');
            
            if (category) {
                e.preventDefault();
                
                // 更新激活状态
                navLinks.forEach(l => l.classList.remove('active'));
                link.classList.add('active');
                
                // 更新分类并重新渲染
                currentCategory = category;
                renderGallery();
                
                // 平滑滚动到作品区域
                document.getElementById('works').scrollIntoView({ 
                    behavior: 'smooth' 
                });
            }
        });
    });
}

// ==================== 滚动效果 ====================
function initScrollEffects() {
    const navbar = document.querySelector('.navbar');
    
    window.addEventListener('scroll', () => {
        if (window.scrollY > 100) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });
}

// ==================== 灯箱功能 ====================
function initLightbox() {
    const lightbox = document.getElementById('lightbox');
    const lightboxImage = document.getElementById('lightboxImage');
    const lightboxCaption = document.getElementById('lightboxCaption');
    const lightboxClose = document.getElementById('lightboxClose');
    const lightboxPrev = document.getElementById('lightboxPrev');
    const lightboxNext = document.getElementById('lightboxNext');
    
    // 关闭灯箱
    lightboxClose.addEventListener('click', closeLightbox);
    lightbox.addEventListener('click', (e) => {
        if (e.target === lightbox) {
            closeLightbox();
        }
    });
    
    // 上一张
    lightboxPrev.addEventListener('click', (e) => {
        e.stopPropagation();
        showPrevImage();
    });
    
    // 下一张
    lightboxNext.addEventListener('click', (e) => {
        e.stopPropagation();
        showNextImage();
    });
    
    // 键盘控制
    document.addEventListener('keydown', (e) => {
        if (!lightbox.classList.contains('active')) return;
        
        switch(e.key) {
            case 'Escape':
                closeLightbox();
                break;
            case 'ArrowLeft':
                showPrevImage();
                break;
            case 'ArrowRight':
                showNextImage();
                break;
        }
    });
}

function openLightbox(index) {
    const lightbox = document.getElementById('lightbox');
    currentLightboxIndex = index;
    updateLightboxImage();
    lightbox.classList.add('active');
    document.body.style.overflow = 'hidden';
}

function closeLightbox() {
    const lightbox = document.getElementById('lightbox');
    lightbox.classList.remove('active');
    document.body.style.overflow = '';
}

function showPrevImage() {
    currentLightboxIndex = (currentLightboxIndex - 1 + filteredWorks.length) % filteredWorks.length;
    updateLightboxImage();
}

function showNextImage() {
    currentLightboxIndex = (currentLightboxIndex + 1) % filteredWorks.length;
    updateLightboxImage();
}

function updateLightboxImage() {
    const work = filteredWorks[currentLightboxIndex];
    const lightboxImage = document.getElementById('lightboxImage');
    const lightboxCaption = document.getElementById('lightboxCaption');
    
    const imagePath = CONFIG.imagesFolder + work.filename;
    lightboxImage.src = imagePath;
    lightboxImage.alt = work.title;
    lightboxCaption.textContent = `${work.title} — ${work.description}`;
}

// ==================== 平滑滚动锚点 ====================
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        const href = this.getAttribute('href');
        if (href !== '#' && document.querySelector(href)) {
            e.preventDefault();
            document.querySelector(href).scrollIntoView({
                behavior: 'smooth'
            });
        }
    });
});

