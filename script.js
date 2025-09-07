class FestivalCardBuilder {
    constructor() {
        this.currentLanguage = 'en';
        this.currentTemplate = null;
        this.uploadedPhoto = null;
        this.canvas = null;
        this.ctx = null;
        
        this.translations = {
            en: {
                mainTitle: 'Festival Card Builder',
                subtitle: 'Create Beautiful Dashain & Tihar Cards',
                description: 'Create personalized greeting cards with your name, photo, and custom wishes. Share instantly with family and friends!',
                ctaText: 'Make Your Dashain Card 🎊',
                builderTitle: 'Create Your Festival Card',
                templatesTitle: 'Choose a Template',
                customizeTitle: 'Customize Your Card',
                nameLabel: 'Name of the Recipient:',
                wishLabel: 'Custom Wish (Optional):',
                photoLabel: 'Upload Photo (Optional):',
                previewTitle: 'Preview',
                downloadText: 'Download Card',
                shareText: 'Share Card',
                shareModalTitle: 'Share Your Card',
                daysLabel: 'Days',
                hoursLabel: 'Hours',
                minutesLabel: 'Minutes',
                secondsLabel: 'Seconds'
            },
            ne: {
                mainTitle: 'चाडपर्व कार्ड निर्माता',
                subtitle: 'सुन्दर दशैं र तिहारका कार्डहरू बनाउनुहोस्',
                description: 'आफ्नो नाम, फोटो र व्यक्तिगत शुभकामनाका साथ व्यक्तिगत ग्रिटिङ कार्डहरू बनाउनुहोस्। परिवार र साथीहरूसँग तुरुन्तै साझा गर्नुहोस्!',
                ctaText: 'आफ्नो दशैं कार्ड बनाउनुहोस् 🎊',
                builderTitle: 'आफ्नो चाडपर्वको कार्ड बनाउनुहोस्',
                templatesTitle: 'टेम्प्लेट छान्नुहोस्',
                customizeTitle: 'आफ्नो कार्ड अनुकूलित गर्नुहोस्',
                nameLabel: 'प्राप्तकर्ताको नाम:',
                wishLabel: 'व्यक्तिगत शुभकामना (वैकल्पिक):',
                photoLabel: 'फोटो अपलोड गर्नुहोस् (वैकल्पिक):',
                previewTitle: 'पूर्वावलोकन',
                downloadText: 'कार्ड डाउनलोड गर्नुहोस्',
                shareText: 'कार्ड साझा गर्नुहोस्',
                shareModalTitle: 'आफ्नो कार्ड साझा गर्नुहोस्',
                daysLabel: 'दिन',
                hoursLabel: 'घण्टा',
                minutesLabel: 'मिनेट',
                secondsLabel: 'सेकेन्ड'
            }
        };
        
        this.templates = [
            {
                id: 'dashain1',
                name: 'Traditional Dashain Swing',
                background: 'linear-gradient(180deg, #FF8C42, #FFD23F)',
                colors: ['#FF8C42', '#FFD23F'],
                decorations: ['🪁', '🎋', '🌸'],
                wishes: {
                    en: 'WISHING YOU A VERY HAPPY DASHAIN',
                    ne: 'बडा दशैंको शुभकामना'
                }
            },
            {
                id: 'dashain2',
                name: 'Traditional Tika',
                background: 'linear-gradient(135deg, #dc143c, #ff6347)',
                colors: ['#dc143c', '#ff6347'],
                decorations: ['🌺', '🙏', '🌺'],
                wishes: {
                    en: 'Wishing you a blessed Dashain filled with love and happiness.',
                    ne: 'तपाईंलाई प्रेम र खुशीले भरिएको धन्य दशैंको शुभकामना।'
                }
            },
            {
                id: 'tihar1',
                name: 'Tihar Lights',
                background: 'linear-gradient(135deg, #ff8c00, #ffd700)',
                colors: ['#ff8c00', '#ffd700'],
                decorations: ['🏮', '✨', '🏮'],
                wishes: {
                    en: 'Happy Tihar! May the festival of lights illuminate your path to success.',
                    ne: 'शुभ तिहार! उज्यालोको यो चाडले तपाईंको सफलताको बाटो उज्यालो पारोस्।'
                }
            },
            {
                id: 'tihar2',
                name: 'Rangoli Delight',
                background: 'linear-gradient(135deg, #ff1744, #ff6b6b)',
                colors: ['#ff1744', '#ff6b6b'],
                decorations: ['🌸', '🎨', '🌸'],
                wishes: {
                    en: 'Wishing you a colorful and joyous Tihar celebration!',
                    ne: 'तपाईंलाई रंगबिरंगी र खुशीमय तिहार मनाउने शुभकामना!'
                }
            },
            {
                id: 'general1',
                name: 'Festival Joy',
                background: 'linear-gradient(135deg, #9c27b0, #e91e63)',
                colors: ['#9c27b0', '#e91e63'],
                decorations: ['🎆', '🎊', '🎆'],
                wishes: {
                    en: 'May this festival season bring endless joy and prosperity!',
                    ne: 'यो चाडपर्वको मौसमले अनन्त आनन्द र समृद्धि ल्याओस्!'
                }
            },
            {
                id: 'general2',
                name: 'Mandala Blessings',
                background: 'linear-gradient(135deg, #673ab7, #3f51b5)',
                colors: ['#673ab7', '#3f51b5'],
                decorations: ['🕉️', '🌟', '🕉️'],
                wishes: {
                    en: 'Sending you blessings of peace, love, and happiness this festival season.',
                    ne: 'यो चाडपर्वको मौसममा तपाईंलाई शान्ति, प्रेम र खुशीको आशीर्वाद पठाउँदै।'
                }
            },
            {
                id: 'changa_chet',
                name: 'Changa Chet (Kite Festival)',
                background: 'linear-gradient(135deg, #2C5F5F, #4A9B9B)',
                colors: ['#2C5F5F', '#4A9B9B'],
                decorations: ['🪁', '🎋', '🪁'],
                wishes: {
                    en: 'May your dreams soar high like these colorful kites!',
                    ne: 'तपाईंका सपनाहरू यी रंगबिरंगी चंगाहरू जस्तै उच्च उडून्!'
                }
            }
        ];
        
        this.init();
    }
    
    init() {
        this.setupEventListeners();
        this.initCanvas();
        this.startCountdown();
        this.loadTemplates();
        this.updateLanguage();
    }
    
    setupEventListeners() {
        // Navigation
        document.getElementById('startBtn').addEventListener('click', () => this.goToBuilder());
        document.getElementById('backBtn').addEventListener('click', () => this.goToLanding());
        
        // Language toggle
        document.getElementById('langToggle').addEventListener('click', () => this.toggleLanguage());
        document.getElementById('langToggle2').addEventListener('click', () => this.toggleLanguage());
        
        // Form inputs
        document.getElementById('nameInput').addEventListener('input', () => this.updatePreview());
        document.getElementById('wishInput').addEventListener('input', () => this.updatePreview());
        document.getElementById('photoInput').addEventListener('change', (e) => this.handlePhotoUpload(e));
        
        // Action buttons
        document.getElementById('downloadBtn').addEventListener('click', () => this.downloadCard());
        document.getElementById('shareBtn').addEventListener('click', () => this.openShareModal());
        
        // Modal
        document.querySelector('.close').addEventListener('click', () => this.closeShareModal());
        document.querySelectorAll('.share-btn').forEach(btn => {
            btn.addEventListener('click', (e) => this.shareCard(e.target.dataset.platform));
        });
        
        // Close modal when clicking outside
        window.addEventListener('click', (e) => {
            const modal = document.getElementById('shareModal');
            if (e.target === modal) {
                this.closeShareModal();
            }
        });
    }
    
    initCanvas() {
        this.canvas = document.getElementById('cardCanvas');
        this.ctx = this.canvas.getContext('2d');
        this.canvas.width = 400;
        this.canvas.height = 600;
    }
    
    goToBuilder() {
        document.getElementById('landing').classList.remove('active');
        document.getElementById('builder').classList.add('active');
        this.selectTemplate(this.templates[0].id);
    }
    
    goToLanding() {
        document.getElementById('builder').classList.remove('active');
        document.getElementById('landing').classList.add('active');
    }
    
    toggleLanguage() {
        this.currentLanguage = this.currentLanguage === 'en' ? 'ne' : 'en';
        this.updateLanguage();
        this.updatePreview();
    }
    
    updateLanguage() {
        const t = this.translations[this.currentLanguage];
        
        document.getElementById('mainTitle').textContent = t.mainTitle;
        document.getElementById('subtitle').textContent = t.subtitle;
        document.getElementById('description').textContent = t.description;
        document.getElementById('ctaText').textContent = t.ctaText;
        document.getElementById('builderTitle').textContent = t.builderTitle;
        document.getElementById('templatesTitle').textContent = t.templatesTitle;
        document.getElementById('customizeTitle').textContent = t.customizeTitle;
        document.getElementById('nameLabel').textContent = t.nameLabel;
        document.getElementById('wishLabel').textContent = t.wishLabel;
        document.getElementById('photoLabel').textContent = t.photoLabel;
        document.getElementById('previewTitle').textContent = t.previewTitle;
        document.getElementById('downloadText').textContent = t.downloadText;
        document.getElementById('shareText').textContent = t.shareText;
        document.getElementById('shareModalTitle').textContent = t.shareModalTitle;
        document.getElementById('daysLabel').textContent = t.daysLabel;
        document.getElementById('hoursLabel').textContent = t.hoursLabel;
        document.getElementById('minutesLabel').textContent = t.minutesLabel;
        document.getElementById('secondsLabel').textContent = t.secondsLabel;
        
        // Update language toggle buttons
        document.getElementById('langToggle').textContent = this.currentLanguage === 'en' ? 'नेपाली' : 'English';
        document.getElementById('langToggle2').textContent = this.currentLanguage === 'en' ? 'नेपाली' : 'English';
        
        // Update placeholders
        const nameInput = document.getElementById('nameInput');
        const wishInput = document.getElementById('wishInput');
        
        nameInput.placeholder = this.currentLanguage === 'en' ? 'Enter recipient name' : 'प्राप्तकर्ताको नाम लेख्नुहोस्';
        wishInput.placeholder = this.currentLanguage === 'en' ? 'Enter your personalized wish' : 'आफ्नो व्यक्तिगत शुभकामना लेख्नुहोस्';
    }
    
    startCountdown() {
        const dashainDate = new Date('2025-10-22').getTime(); // Updated to 2025 Dashain date
        
        const updateCountdown = () => {
            const now = new Date().getTime();
            const distance = dashainDate - now;
            
            const days = Math.floor(distance / (1000 * 60 * 60 * 24));
            const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
            const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
            const seconds = Math.floor((distance % (1000 * 60)) / 1000);
            
            document.getElementById('days').textContent = String(Math.max(0, days)).padStart(2, '0');
            document.getElementById('hours').textContent = String(Math.max(0, hours)).padStart(2, '0');
            document.getElementById('minutes').textContent = String(Math.max(0, minutes)).padStart(2, '0');
            document.getElementById('seconds').textContent = String(Math.max(0, seconds)).padStart(2, '0');
            
            if (distance < 0) {
                clearInterval(countdownInterval);
                document.getElementById('countdown').innerHTML = '<h2 style="color: white; text-align: center;">🎊 Festival Time! 🎊</h2>';
            }
        };
        
        updateCountdown();
        const countdownInterval = setInterval(updateCountdown, 1000);
    }
    
    loadTemplates() {
        const templateGrid = document.getElementById('templateGrid');
        
        this.templates.forEach((template, index) => {
            const templateItem = document.createElement('div');
            templateItem.className = 'template-item';
            templateItem.dataset.templateId = template.id;
            
            // Create a canvas for each template preview
            const canvas = document.createElement('canvas');
            canvas.width = 150;
            canvas.height = 225; // 2:3 aspect ratio
            canvas.style.width = '100%';
            canvas.style.height = '100%';
            canvas.style.borderRadius = '10px';
            
            const ctx = canvas.getContext('2d');
            this.renderTemplatePreview(ctx, template, canvas.width, canvas.height);
            
            templateItem.appendChild(canvas);
            templateItem.addEventListener('click', () => this.selectTemplate(template.id));
            templateGrid.appendChild(templateItem);
        });
    }
    
    // Helper functions for drawing complex shapes and patterns
    drawCloud(ctx, x, y, size) {
        ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
        ctx.beginPath();
        ctx.arc(x, y, size, 0, Math.PI * 2);
        ctx.arc(x + size * 0.8, y, size * 0.8, 0, Math.PI * 2);
        ctx.arc(x + size * 1.6, y, size, 0, Math.PI * 2);
        ctx.arc(x + size * 0.8, y - size * 0.6, size * 0.7, 0, Math.PI * 2);
        ctx.fill();
    }
    
    drawKite(ctx, x, y, size, color) {
        ctx.fillStyle = color;
        ctx.beginPath();
        ctx.moveTo(x, y - size);
        ctx.lineTo(x + size * 0.7, y);
        ctx.lineTo(x, y + size);
        ctx.lineTo(x - size * 0.7, y);
        ctx.closePath();
        ctx.fill();
        
        // Kite string
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.6)';
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(x, y + size);
        ctx.lineTo(x + size * 0.3, y + size * 2);
        ctx.stroke();
    }
    
    drawMandalaPattern(ctx, x, y, radius, complexity = 8) {
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.3)';
        ctx.lineWidth = 1;
        
        for (let i = 0; i < complexity; i++) {
            const angle = (i * Math.PI * 2) / complexity;
            ctx.beginPath();
            ctx.arc(x, y, radius, 0, Math.PI * 2);
            ctx.stroke();
            
            const innerRadius = radius * 0.6;
            ctx.beginPath();
            ctx.moveTo(x + Math.cos(angle) * innerRadius, y + Math.sin(angle) * innerRadius);
            ctx.lineTo(x + Math.cos(angle) * radius, y + Math.sin(angle) * radius);
            ctx.stroke();
        }
    }
    
    drawDiya(ctx, x, y, size) {
        // Diya base
        ctx.fillStyle = '#D4722B';
        ctx.beginPath();
        ctx.ellipse(x, y, size * 1.2, size * 0.8, 0, 0, Math.PI * 2);
        ctx.fill();
        
        // Flame
        ctx.fillStyle = '#FFD700';
        ctx.beginPath();
        ctx.moveTo(x + size * 0.8, y - size * 0.3);
        ctx.quadraticCurveTo(x + size * 1.1, y - size * 1.2, x + size * 1.4, y - size * 0.3);
        ctx.quadraticCurveTo(x + size * 1.1, y + size * 0.2, x + size * 0.8, y - size * 0.3);
        ctx.fill();
        
        // Glow effect
        ctx.shadowColor = '#FFD700';
        ctx.shadowBlur = size * 0.8;
        ctx.fill();
        ctx.shadowBlur = 0;
    }
    
    drawRangoliPattern(ctx, x, y, size) {
        const colors = ['#FF6B6B', '#4ECDC4', '#45B7D1', '#FFA07A', '#98D8C8'];
        
        for (let ring = 0; ring < 3; ring++) {
            const radius = size - ring * size * 0.25;
            ctx.strokeStyle = colors[ring % colors.length];
            ctx.lineWidth = 3;
            
            // Draw petals
            for (let i = 0; i < 8; i++) {
                const angle = (i * Math.PI * 2) / 8;
                const petalX = x + Math.cos(angle) * radius;
                const petalY = y + Math.sin(angle) * radius;
                
                ctx.beginPath();
                ctx.arc(petalX, petalY, radius * 0.3, 0, Math.PI * 2);
                ctx.stroke();
            }
        }
    }
    
    drawFirework(ctx, x, y, size, color) {
        ctx.strokeStyle = color;
        ctx.lineWidth = 2;
        
        for (let i = 0; i < 12; i++) {
            const angle = (i * Math.PI * 2) / 12;
            ctx.beginPath();
            ctx.moveTo(x, y);
            ctx.lineTo(x + Math.cos(angle) * size, y + Math.sin(angle) * size);
            ctx.stroke();
            
            // Sparkles
            ctx.fillStyle = color;
            ctx.beginPath();
            ctx.arc(x + Math.cos(angle) * size, y + Math.sin(angle) * size, 2, 0, Math.PI * 2);
            ctx.fill();
        }
    }

    renderTemplatePreview(ctx, template, width, height) {
        try {
            // Clear canvas
            ctx.clearRect(0, 0, width, height);
            
            // Render based on template type
            switch (template.id) {
                case 'dashain1':
                    this.renderDashainKitesBackground(ctx, width, height, true);
                    break;
                case 'dashain2':
                    this.renderTikaTemplateBackground(ctx, width, height, true);
                    break;
                case 'tihar1':
                    this.renderTiharLightsBackground(ctx, width, height, true);
                    break;
                case 'tihar2':
                    this.renderRangoliBackground(ctx, width, height, true);
                    break;
                case 'general1':
                    this.renderFestivalJoyBackground(ctx, width, height, true);
                    break;
                case 'general2':
                    this.renderMandalaBackground(ctx, width, height, true);
                    break;
                case 'changa_chet':
                    this.renderChangaChetBackground(ctx, width, height, true);
                    break;
                default:
                    // Fallback
                    const gradient = ctx.createLinearGradient(0, 0, width, height);
                    const colors = template.colors || ['#ff6b6b', '#ffa500'];
                    gradient.addColorStop(0, colors[0]);
                    gradient.addColorStop(1, colors[1] || colors[0]);
                    ctx.fillStyle = gradient;
                    ctx.fillRect(0, 0, width, height);
            }
            
        } catch (error) {
            console.error('Error rendering template preview:', error);
            // Fallback rendering
            ctx.fillStyle = '#ff6b6b';
            ctx.fillRect(0, 0, width, height);
            ctx.fillStyle = '#fff';
            ctx.font = '14px Arial';
            ctx.textAlign = 'center';
            ctx.fillText('Template Error', width / 2, height / 2);
        }
    }
    
    renderDashainKitesBackground(ctx, width, height, isPreview = false) {
        // Orange to yellow gradient background like the reference
        const gradient = ctx.createLinearGradient(0, 0, 0, height);
        gradient.addColorStop(0, '#FF8C42');  // Orange at top
        gradient.addColorStop(0.6, '#FFB347'); // Light orange
        gradient.addColorStop(1, '#FFD23F');   // Yellow at bottom
        
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, width, height);
        
        
        // Draw bamboo swing poles (ping)
        this.drawBambooSwing(ctx, width, height);
        
        // Draw person on swing (silhouette)
        this.drawPersonOnSwing(ctx, width * 0.42, height * 0.45);
        
        // Draw traditional kites with strings
        this.drawTraditionalKite(ctx, width * 0.65, height * 0.25, 40, '#FF69B4', '#E91E63');
        this.drawTraditionalKite(ctx, width * 0.8, height * 0.15, 35, '#4A90E2', '#1976D2');
        this.drawTraditionalKite(ctx, width * 0.75, height * 0.35, 30, '#FF6B6B', '#D32F2F');
        
        // Draw decorative flowers and leaves
        this.drawDecorativeFlower(ctx, width * 0.85, height * 0.7, '#FF69B4');
        this.drawDecorativeFlower(ctx, width * 0.9, height * 0.75, '#4CAF50');
        this.drawDecorativeFlower(ctx, width * 0.05, height * 0.65, '#FFD700');
        this.drawDecorativeFlower(ctx, width * 0.08, height * 0.75, '#FF6B6B');
        
        // Add traditional leaves
        this.drawLeaf(ctx, width * 0.12, height * 0.68, '#228B22');
        this.drawLeaf(ctx, width * 0.88, height * 0.68, '#228B22');
        this.drawLeaf(ctx, width * 0.92, height * 0.72, '#32CD32');
        
        // Add small decorative elements around the swing
        this.drawSmallFlower(ctx, width * 0.25, height * 0.55, '#FF1493');
        this.drawSmallFlower(ctx, width * 0.38, height * 0.52, '#FFD700');
        this.drawSmallFlower(ctx, width * 0.45, height * 0.58, '#FF69B4');
        
    }
    
    drawBambooSwing(ctx, width, height) {
        const swingCenterX = width * 0.3;
        const swingTopY = height * 0.1;
        const swingBottomY = height * 0.65;
        const poleWidth = 8;
        
        // Left bamboo pole
        ctx.strokeStyle = '#8B4513';
        ctx.lineWidth = poleWidth;
        ctx.lineCap = 'round';
        
        // Draw bamboo segments
        for (let i = 0; i < 5; i++) {
            const segmentHeight = (swingBottomY - swingTopY) / 5;
            const startY = swingTopY + i * segmentHeight;
            const endY = swingTopY + (i + 1) * segmentHeight - 5;
            
            ctx.beginPath();
            ctx.moveTo(swingCenterX - 50, startY);
            ctx.lineTo(swingCenterX - 50, endY);
            ctx.stroke();
            
            // Bamboo joints
            if (i < 4) {
                ctx.strokeStyle = '#654321';
                ctx.lineWidth = poleWidth + 2;
                ctx.beginPath();
                ctx.moveTo(swingCenterX - 55, endY);
                ctx.lineTo(swingCenterX - 45, endY);
                ctx.stroke();
                ctx.strokeStyle = '#8B4513';
                ctx.lineWidth = poleWidth;
            }
        }
        
        // Right bamboo pole  
        for (let i = 0; i < 5; i++) {
            const segmentHeight = (swingBottomY - swingTopY) / 5;
            const startY = swingTopY + i * segmentHeight;
            const endY = swingTopY + (i + 1) * segmentHeight - 5;
            
            ctx.beginPath();
            ctx.moveTo(swingCenterX + 50, startY);
            ctx.lineTo(swingCenterX + 50, endY);
            ctx.stroke();
            
            // Bamboo joints
            if (i < 4) {
                ctx.strokeStyle = '#654321';
                ctx.lineWidth = poleWidth + 2;
                ctx.beginPath();
                ctx.moveTo(swingCenterX + 45, endY);
                ctx.lineTo(swingCenterX + 55, endY);
                ctx.stroke();
                ctx.strokeStyle = '#8B4513';
                ctx.lineWidth = poleWidth;
            }
        }
        
        // Cross support beam
        ctx.strokeStyle = '#8B4513';
        ctx.lineWidth = 6;
        ctx.beginPath();
        ctx.moveTo(swingCenterX - 50, swingTopY + 20);
        ctx.lineTo(swingCenterX + 50, swingTopY + 20);
        ctx.stroke();
        
        // Swing ropes
        ctx.strokeStyle = '#654321';
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.moveTo(swingCenterX - 25, swingTopY + 20);
        ctx.lineTo(swingCenterX - 25, height * 0.45);
        ctx.moveTo(swingCenterX + 25, swingTopY + 20);
        ctx.lineTo(swingCenterX + 25, height * 0.45);
        ctx.stroke();
        
        // Swing seat
        ctx.fillStyle = '#D2691E';
        ctx.fillRect(swingCenterX - 40, height * 0.45, 80, 8);
    }
    
    drawPersonOnSwing(ctx, x, y) {
        // Simple silhouette of person sitting on swing
        ctx.fillStyle = '#2F2F2F';
        
        // Head
        ctx.beginPath();
        ctx.arc(x, y - 25, 12, 0, Math.PI * 2);
        ctx.fill();
        
        // Body
        ctx.fillRect(x - 8, y - 15, 16, 25);
        
        // Arms
        ctx.fillRect(x - 15, y - 10, 8, 15);
        ctx.fillRect(x + 7, y - 10, 8, 15);
        
        // Legs
        ctx.fillRect(x - 8, y + 10, 6, 20);
        ctx.fillRect(x + 2, y + 10, 6, 20);
    }
    
    drawTraditionalKite(ctx, x, y, size, color1, color2) {
        // Kite body with more authentic diamond shape
        const gradient = ctx.createLinearGradient(x - size/2, y - size/2, x + size/2, y + size/2);
        gradient.addColorStop(0, color1);
        gradient.addColorStop(0.5, '#FFFFFF');
        gradient.addColorStop(1, color2);
        
        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.moveTo(x, y - size/2);  // Top point
        ctx.lineTo(x + size/2.5, y);  // Right point
        ctx.lineTo(x, y + size/1.8);  // Bottom point
        ctx.lineTo(x - size/2.5, y);  // Left point
        ctx.closePath();
        ctx.fill();
        
        // Kite frame (bamboo sticks)
        ctx.strokeStyle = '#654321';
        ctx.lineWidth = 2.5;
        ctx.beginPath();
        // Vertical stick
        ctx.moveTo(x, y - size/2);
        ctx.lineTo(x, y + size/1.8);
        // Horizontal stick
        ctx.moveTo(x - size/2.5, y);
        ctx.lineTo(x + size/2.5, y);
        ctx.stroke();
        
        // Kite outline
        ctx.strokeStyle = '#444444';
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(x, y - size/2);
        ctx.lineTo(x + size/2.5, y);
        ctx.lineTo(x, y + size/1.8);
        ctx.lineTo(x - size/2.5, y);
        ctx.closePath();
        ctx.stroke();
        
        // Main kite string (stronger and more visible)
        ctx.strokeStyle = '#8B4513';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(x, y + size/1.8);
        // Curved string to make it more natural
        ctx.quadraticCurveTo(x + size/6, y + size/1.2, x + size/3, y + size + 40);
        ctx.stroke();
        
        // Colorful tail ribbons
        const tailColors = [color1, color2, '#FFFF00', '#FF6B6B'];
        for (let i = 0; i < 4; i++) {
            ctx.strokeStyle = tailColors[i % tailColors.length];
            ctx.lineWidth = 4;
            ctx.beginPath();
            const tailX = x + size/3 + i * 8;
            const tailY = y + size + 40 + i * 12;
            ctx.moveTo(tailX, tailY);
            ctx.lineTo(tailX + 12, tailY + 18);
            ctx.stroke();
            
            // Add small flutter effect
            ctx.strokeStyle = tailColors[i % tailColors.length] + '80';
            ctx.lineWidth = 2;
            ctx.beginPath();
            ctx.moveTo(tailX + 12, tailY + 18);
            ctx.lineTo(tailX + 16, tailY + 22);
            ctx.stroke();
        }
    }
    
    drawDecorativeFlower(ctx, x, y, color) {
        ctx.fillStyle = color;
        
        // Simple flower petals
        for (let i = 0; i < 6; i++) {
            const angle = (i * Math.PI * 2) / 6;
            const petalX = x + Math.cos(angle) * 8;
            const petalY = y + Math.sin(angle) * 8;
            
            ctx.beginPath();
            ctx.ellipse(petalX, petalY, 6, 3, angle, 0, Math.PI * 2);
            ctx.fill();
        }
        
        // Flower center
        ctx.fillStyle = '#FFD700';
        ctx.beginPath();
        ctx.arc(x, y, 4, 0, Math.PI * 2);
        ctx.fill();
    }
    
    drawLeaf(ctx, x, y, color) {
        ctx.fillStyle = color;
        ctx.beginPath();
        ctx.ellipse(x, y, 12, 6, Math.PI / 4, 0, Math.PI * 2);
        ctx.fill();
        
        // Leaf vein
        ctx.strokeStyle = '#006400';
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(x - 8, y + 4);
        ctx.lineTo(x + 8, y - 4);
        ctx.stroke();
    }
    
    drawSmallFlower(ctx, x, y, color) {
        ctx.fillStyle = color;
        
        // Small 5-petal flower
        for (let i = 0; i < 5; i++) {
            const angle = (i * Math.PI * 2) / 5;
            const petalX = x + Math.cos(angle) * 5;
            const petalY = y + Math.sin(angle) * 5;
            
            ctx.beginPath();
            ctx.arc(petalX, petalY, 3, 0, Math.PI * 2);
            ctx.fill();
        }
        
        // Tiny center
        ctx.fillStyle = '#FFFFFF';
        ctx.beginPath();
        ctx.arc(x, y, 2, 0, Math.PI * 2);
        ctx.fill();
    }
    
    renderTikaTemplateBackground(ctx, width, height, isPreview = false) {
        // Traditional red/orange gradient
        const gradient = ctx.createRadialGradient(width/2, height/2, 0, width/2, height/2, Math.max(width, height)/2);
        gradient.addColorStop(0, '#FF6B47');
        gradient.addColorStop(0.5, '#DC143C');
        gradient.addColorStop(1, '#8B0000');
        
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, width, height);
        
        // Draw mandala patterns
        this.drawMandalaPattern(ctx, width * 0.2, height * 0.2, width * 0.06, 6);
        this.drawMandalaPattern(ctx, width * 0.8, height * 0.15, width * 0.04, 8);
        this.drawMandalaPattern(ctx, width * 0.15, height * 0.7, width * 0.05, 6);
        this.drawMandalaPattern(ctx, width * 0.85, height * 0.8, width * 0.035, 8);
        
        // Central mandala
        this.drawMandalaPattern(ctx, width / 2, height * 0.3, width * 0.08, 12);
        
        // Decorative border
        ctx.strokeStyle = 'rgba(255, 215, 0, 0.6)';
        ctx.lineWidth = 2;
        ctx.strokeRect(width * 0.05, height * 0.05, width * 0.9, height * 0.9);
        
        // Marigold flowers represented as golden circles
        ctx.fillStyle = 'rgba(255, 215, 0, 0.7)';
        for (let i = 0; i < 8; i++) {
            const angle = (i * Math.PI * 2) / 8;
            const x = width/2 + Math.cos(angle) * width * 0.35;
            const y = height/2 + Math.sin(angle) * height * 0.35;
            ctx.beginPath();
            ctx.arc(x, y, width * 0.015, 0, Math.PI * 2);
            ctx.fill();
        }
    }
    
    renderTiharLightsBackground(ctx, width, height, isPreview = false) {
        // Night sky gradient
        const gradient = ctx.createLinearGradient(0, 0, 0, height);
        gradient.addColorStop(0, '#0F0F23');  // Dark night
        gradient.addColorStop(0.3, '#1a1a2e');
        gradient.addColorStop(1, '#16213e');   // Midnight blue
        
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, width, height);
        
        // Stars
        ctx.fillStyle = '#FFFFFF';
        for (let i = 0; i < 15; i++) {
            const x = Math.random() * width;
            const y = Math.random() * height * 0.5; // Stars in upper half
            ctx.beginPath();
            ctx.arc(x, y, 1, 0, Math.PI * 2);
            ctx.fill();
        }
        
        // Draw diyas
        this.drawDiya(ctx, width * 0.2, height * 0.7, width * 0.025);
        this.drawDiya(ctx, width * 0.5, height * 0.75, width * 0.02);
        this.drawDiya(ctx, width * 0.8, height * 0.65, width * 0.025);
        this.drawDiya(ctx, width * 0.35, height * 0.8, width * 0.02);
        this.drawDiya(ctx, width * 0.65, height * 0.8, width * 0.025);
        
        // String lights effect
        ctx.strokeStyle = 'rgba(255, 215, 0, 0.4)';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(0, height * 0.3);
        ctx.quadraticCurveTo(width * 0.25, height * 0.25, width * 0.5, height * 0.3);
        ctx.quadraticCurveTo(width * 0.75, height * 0.35, width, height * 0.3);
        ctx.stroke();
        
        // Light bulbs on string
        const lightColors = ['#FFD700', '#FF6B6B', '#4ECDC4', '#98D8C8'];
        for (let i = 0; i < 5; i++) {
            const t = i / 4;
            const x = t * width;
            const y = height * 0.3 + Math.sin(t * Math.PI * 2) * height * 0.015;
            
            ctx.fillStyle = lightColors[i % lightColors.length];
            ctx.beginPath();
            ctx.arc(x, y, width * 0.01, 0, Math.PI * 2);
            ctx.fill();
            
            // Glow effect
            ctx.shadowColor = lightColors[i % lightColors.length];
            ctx.shadowBlur = width * 0.015;
            ctx.fill();
            ctx.shadowBlur = 0;
        }
    }
    
    renderRangoliBackground(ctx, width, height, isPreview = false) {
        // Vibrant gradient background
        const gradient = ctx.createRadialGradient(width/2, height/2, 0, width/2, height/2, Math.max(width, height)/2);
        gradient.addColorStop(0, '#FF1744');
        gradient.addColorStop(0.3, '#E91E63');
        gradient.addColorStop(0.6, '#9C27B0');
        gradient.addColorStop(1, '#673AB7');
        
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, width, height);
        
        // Central rangoli
        this.drawRangoliPattern(ctx, width / 2, height * 0.35, width * 0.1);
        
        // Smaller rangolis around
        this.drawRangoliPattern(ctx, width * 0.2, height * 0.7, width * 0.05);
        this.drawRangoliPattern(ctx, width * 0.8, height * 0.7, width * 0.05);
        
        // Flower petals scattered
        const petalColors = ['#FFD700', '#FF69B4', '#00CED1', '#32CD32'];
        for (let i = 0; i < 12; i++) {
            const x = Math.random() * width;
            const y = Math.random() * height;
            const size = Math.random() * width * 0.015 + width * 0.008;
            
            ctx.fillStyle = petalColors[i % petalColors.length] + '80'; // Semi-transparent
            ctx.beginPath();
            ctx.ellipse(x, y, size, size * 0.5, Math.random() * Math.PI, 0, Math.PI * 2);
            ctx.fill();
        }
        
        // Geometric border
        ctx.strokeStyle = 'rgba(255, 215, 0, 0.8)';
        ctx.lineWidth = 2;
        const borderSize = width * 0.015;
        for (let i = 0; i < 4; i++) {
            const x = (i % 2) * (width - borderSize);
            const y = Math.floor(i / 2) * (height - borderSize);
            ctx.strokeRect(x, y, borderSize, borderSize);
        }
    }
    
    renderFestivalJoyBackground(ctx, width, height, isPreview = false) {
        // Dark celebration background
        const gradient = ctx.createLinearGradient(0, 0, 0, height);
        gradient.addColorStop(0, '#1a1a2e');
        gradient.addColorStop(0.5, '#16213e');
        gradient.addColorStop(1, '#0F0F23');
        
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, width, height);
        
        // Fireworks
        const fireworkColors = ['#FF6B6B', '#4ECDC4', '#45B7D1', '#FFA07A', '#FFD700'];
        this.drawFirework(ctx, width * 0.3, height * 0.2, width * 0.06, fireworkColors[0]);
        this.drawFirework(ctx, width * 0.7, height * 0.15, width * 0.045, fireworkColors[1]);
        this.drawFirework(ctx, width * 0.5, height * 0.3, width * 0.055, fireworkColors[2]);
        this.drawFirework(ctx, width * 0.8, height * 0.4, width * 0.04, fireworkColors[3]);
        
        // Celebration confetti
        for (let i = 0; i < 20; i++) {
            const x = Math.random() * width;
            const y = Math.random() * height;
            const size = Math.random() * 3 + 1;
            const color = fireworkColors[Math.floor(Math.random() * fireworkColors.length)];
            
            ctx.fillStyle = color;
            ctx.beginPath();
            if (Math.random() > 0.5) {
                ctx.arc(x, y, size, 0, Math.PI * 2); // Circles
            } else {
                ctx.rect(x, y, size * 2, size * 2); // Squares
            }
            ctx.fill();
        }
        
        // Festival sparkles
        ctx.fillStyle = '#FFD700';
        for (let i = 0; i < 15; i++) {
            const x = Math.random() * width;
            const y = Math.random() * height;
            this.drawStar(ctx, x, y, width * 0.008);
        }
    }
    
    drawStar(ctx, x, y, size) {
        ctx.beginPath();
        ctx.moveTo(x, y - size);
        ctx.lineTo(x + size * 0.3, y - size * 0.3);
        ctx.lineTo(x + size, y);
        ctx.lineTo(x + size * 0.3, y + size * 0.3);
        ctx.lineTo(x, y + size);
        ctx.lineTo(x - size * 0.3, y + size * 0.3);
        ctx.lineTo(x - size, y);
        ctx.lineTo(x - size * 0.3, y - size * 0.3);
        ctx.closePath();
        ctx.fill();
    }
    
    renderMandalaBackground(ctx, width, height, isPreview = false) {
        // Spiritual gradient
        const gradient = ctx.createRadialGradient(width/2, height/2, 0, width/2, height/2, Math.max(width, height)/2);
        gradient.addColorStop(0, '#9C27B0');
        gradient.addColorStop(0.4, '#673AB7');
        gradient.addColorStop(0.8, '#3F51B5');
        gradient.addColorStop(1, '#1A237E');
        
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, width, height);
        
        // Central sacred mandala
        ctx.strokeStyle = 'rgba(255, 215, 0, 0.6)';
        ctx.lineWidth = 2;
        
        const centerX = width / 2;
        const centerY = height * 0.35;
        
        // Multiple mandala rings
        for (let ring = 1; ring <= 4; ring++) {
            const radius = ring * width * 0.04;
            ctx.beginPath();
            ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
            ctx.stroke();
            
            // Sacred geometry lines
            for (let i = 0; i < 8; i++) {
                const angle = (i * Math.PI * 2) / 8;
                ctx.beginPath();
                ctx.moveTo(centerX, centerY);
                ctx.lineTo(centerX + Math.cos(angle) * radius, centerY + Math.sin(angle) * radius);
                ctx.stroke();
            }
        }
        
        // Lotus flowers (simplified as flower shapes)
        ctx.fillStyle = 'rgba(255, 182, 193, 0.6)';
        this.drawFlowerShape(ctx, width * 0.2, height * 0.7, width * 0.04);
        this.drawFlowerShape(ctx, width * 0.8, height * 0.7, width * 0.04);
        
        // Om symbols (represented as golden circles with center dot)
        ctx.fillStyle = 'rgba(255, 215, 0, 0.8)';
        const omPositions = [
            [width * 0.15, height * 0.15],
            [width * 0.85, height * 0.15],
            [width * 0.15, height * 0.85],
            [width * 0.85, height * 0.85]
        ];
        
        omPositions.forEach(([x, y]) => {
            ctx.beginPath();
            ctx.arc(x, y, width * 0.025, 0, Math.PI * 2);
            ctx.fill();
            
            ctx.fillStyle = 'rgba(147, 39, 176, 0.8)';
            ctx.beginPath();
            ctx.arc(x, y, width * 0.008, 0, Math.PI * 2);
            ctx.fill();
            
            ctx.fillStyle = 'rgba(255, 215, 0, 0.8)';
        });
    }
    
    drawFlowerShape(ctx, x, y, size) {
        for (let i = 0; i < 6; i++) {
            const angle = (i * Math.PI * 2) / 6;
            ctx.beginPath();
            ctx.ellipse(
                x + Math.cos(angle) * size * 0.3,
                y + Math.sin(angle) * size * 0.3,
                size * 0.4,
                size * 0.2,
                angle,
                0,
                Math.PI * 2
            );
            ctx.fill();
        }
        
        // Center
        ctx.fillStyle = 'rgba(255, 215, 0, 0.8)';
        ctx.beginPath();
        ctx.arc(x, y, size * 0.15, 0, Math.PI * 2);
        ctx.fill();
    }
    
    renderChangaChetBackground(ctx, width, height, isPreview = false) {
        // Teal gradient background like the reference
        const gradient = ctx.createLinearGradient(0, 0, 0, height);
        gradient.addColorStop(0, '#2C5F5F');  // Dark teal
        gradient.addColorStop(0.5, '#4A9B9B'); // Medium teal
        gradient.addColorStop(1, '#5FB3B3');   // Light teal
        
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, width, height);
        
        // Draw various detailed kites scattered across the canvas
        // Nepali flag kite (top left)
        this.drawNepaliKite(ctx, width * 0.15, height * 0.2, 60);
        
        // Buddha eyes kite (top right) 
        this.drawBuddhaKite(ctx, width * 0.8, height * 0.25, 70);
        
        // Colorful diamond kites
        this.drawDetailedKite(ctx, width * 0.3, height * 0.15, 50, '#8B4513', '#D2691E', '#654321'); // Brown
        this.drawDetailedKite(ctx, width * 0.6, height * 0.4, 55, '#9932CC', '#DDA0DD', '#8A2BE2'); // Purple
        this.drawDetailedKite(ctx, width * 0.25, height * 0.6, 45, '#B22222', '#FF6347', '#8B0000'); // Red
        this.drawDetailedKite(ctx, width * 0.75, height * 0.7, 50, '#4169E1', '#87CEEB', '#191970'); // Blue
        this.drawDetailedKite(ctx, width * 0.45, height * 0.75, 40, '#FF8C00', '#FFA500', '#FF4500'); // Orange
        
        // Additional smaller kites for variety
        this.drawDetailedKite(ctx, width * 0.1, height * 0.5, 35, '#32CD32', '#90EE90', '#228B22'); // Green
        this.drawDetailedKite(ctx, width * 0.85, height * 0.15, 38, '#FFD700', '#FFFF00', '#DAA520'); // Yellow
        this.drawDetailedKite(ctx, width * 0.55, height * 0.12, 42, '#FF1493', '#FF69B4', '#C71585'); // Pink
    }
    
    drawDetailedKite(ctx, x, y, size, color1, color2, frameColor) {
        // Kite body with gradient and texture
        const gradient = ctx.createLinearGradient(x - size/2, y - size/2, x + size/2, y + size/2);
        gradient.addColorStop(0, color1);
        gradient.addColorStop(0.3, color2);
        gradient.addColorStop(0.7, color1);
        gradient.addColorStop(1, color2);
        
        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.moveTo(x, y - size/2);  // Top
        ctx.lineTo(x + size/2.2, y); // Right  
        ctx.lineTo(x, y + size/1.5); // Bottom
        ctx.lineTo(x - size/2.2, y); // Left
        ctx.closePath();
        ctx.fill();
        
        // Kite frame lines
        ctx.strokeStyle = frameColor;
        ctx.lineWidth = 2;
        ctx.beginPath();
        // Vertical line
        ctx.moveTo(x, y - size/2);
        ctx.lineTo(x, y + size/1.5);
        // Horizontal line
        ctx.moveTo(x - size/2.2, y);
        ctx.lineTo(x + size/2.2, y);
        ctx.stroke();
        
        // Kite border
        ctx.strokeStyle = '#2F2F2F';
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.moveTo(x, y - size/2);
        ctx.lineTo(x + size/2.2, y);
        ctx.lineTo(x, y + size/1.5);
        ctx.lineTo(x - size/2.2, y);
        ctx.closePath();
        ctx.stroke();
        
        // Add small decorative pattern in center
        ctx.fillStyle = 'rgba(255, 255, 255, 0.7)';
        ctx.beginPath();
        ctx.arc(x, y, size/8, 0, Math.PI * 2);
        ctx.fill();
    }
    
    drawNepaliKite(ctx, x, y, size) {
        // Nepali flag colors - blue and red triangles
        // Blue triangle (top)
        ctx.fillStyle = '#003893';
        ctx.beginPath();
        ctx.moveTo(x, y - size/2);
        ctx.lineTo(x + size/2.2, y);
        ctx.lineTo(x - size/2.2, y);
        ctx.closePath();
        ctx.fill();
        
        // Red triangle (bottom)
        ctx.fillStyle = '#DC143C';
        ctx.beginPath();
        ctx.moveTo(x - size/2.2, y);
        ctx.lineTo(x + size/2.2, y);
        ctx.lineTo(x, y + size/1.5);
        ctx.closePath();
        ctx.fill();
        
        // White sun symbol in blue section
        ctx.fillStyle = '#FFFFFF';
        ctx.beginPath();
        ctx.arc(x, y - size/6, size/10, 0, Math.PI * 2);
        ctx.fill();
        
        // White moon symbol in red section
        ctx.fillStyle = '#FFFFFF';
        ctx.beginPath();
        ctx.arc(x - size/8, y + size/6, size/12, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = '#DC143C';
        ctx.beginPath();
        ctx.arc(x - size/12, y + size/6, size/12, 0, Math.PI * 2);
        ctx.fill();
        
        // Frame
        ctx.strokeStyle = '#654321';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(x, y - size/2);
        ctx.lineTo(x, y + size/1.5);
        ctx.moveTo(x - size/2.2, y);
        ctx.lineTo(x + size/2.2, y);
        ctx.stroke();
    }
    
    drawBuddhaKite(ctx, x, y, size) {
        // Golden background
        const gradient = ctx.createLinearGradient(x - size/2, y - size/2, x + size/2, y + size/2);
        gradient.addColorStop(0, '#FFD700');
        gradient.addColorStop(0.5, '#FFA500');
        gradient.addColorStop(1, '#DAA520');
        
        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.moveTo(x, y - size/2);
        ctx.lineTo(x + size/2.2, y);
        ctx.lineTo(x, y + size/1.5);
        ctx.lineTo(x - size/2.2, y);
        ctx.closePath();
        ctx.fill();
        
        // Buddha eyes design
        ctx.fillStyle = '#FFFFFF';
        // Left eye
        ctx.beginPath();
        ctx.ellipse(x - size/6, y, size/8, size/12, 0, 0, Math.PI * 2);
        ctx.fill();
        // Right eye
        ctx.beginPath();
        ctx.ellipse(x + size/6, y, size/8, size/12, 0, 0, Math.PI * 2);
        ctx.fill();
        
        // Eye pupils
        ctx.fillStyle = '#000000';
        ctx.beginPath();
        ctx.arc(x - size/6, y, size/16, 0, Math.PI * 2);
        ctx.fill();
        ctx.beginPath();
        ctx.arc(x + size/6, y, size/16, 0, Math.PI * 2);
        ctx.fill();
        
        // Nose (curly design)
        ctx.strokeStyle = '#FFFFFF';
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.arc(x, y + size/8, size/16, 0, Math.PI, false);
        ctx.stroke();
        
        // Third eye dot
        ctx.fillStyle = '#FFFFFF';
        ctx.beginPath();
        ctx.arc(x, y - size/8, size/20, 0, Math.PI * 2);
        ctx.fill();
        
        // Frame
        ctx.strokeStyle = '#B8860B';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(x, y - size/2);
        ctx.lineTo(x, y + size/1.5);
        ctx.moveTo(x - size/2.2, y);
        ctx.lineTo(x + size/2.2, y);
        ctx.stroke();
    }
    
    selectTemplate(templateId) {
        // Remove previous selection
        document.querySelectorAll('.template-item').forEach(item => {
            item.classList.remove('selected');
        });
        
        // Add selection to clicked template
        document.querySelector(`[data-template-id="${templateId}"]`).classList.add('selected');
        
        this.currentTemplate = this.templates.find(t => t.id === templateId);
        this.updatePreview();
    }
    
    handlePhotoUpload(event) {
        const file = event.target.files[0];
        if (file && file.type.startsWith('image/')) {
            const reader = new FileReader();
            reader.onload = (e) => {
                const img = new Image();
                img.onload = () => {
                    this.uploadedPhoto = img;
                    this.updatePreview();
                };
                img.src = e.target.result;
            };
            reader.readAsDataURL(file);
        }
    }
    
    updatePreview() {
        try {
            if (!this.currentTemplate) return;
            
            const name = document.getElementById('nameInput').value;
            const wish = document.getElementById('wishInput').value;
            
            // Update 2D canvas
            this.update2DCanvas(name, wish);
            
        } catch (error) {
            console.error('Error updating preview:', error);
        }
    }
    
    update2DCanvas(name, wish) {
        // Clear canvas
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        
        // Draw sophisticated background based on template
        switch (this.currentTemplate.id) {
            case 'dashain1':
                this.renderDashainKitesBackground(this.ctx, this.canvas.width, this.canvas.height, false);
                break;
            case 'dashain2':
                this.renderTikaTemplateBackground(this.ctx, this.canvas.width, this.canvas.height, false);
                break;
            case 'tihar1':
                this.renderTiharLightsBackground(this.ctx, this.canvas.width, this.canvas.height, false);
                break;
            case 'tihar2':
                this.renderRangoliBackground(this.ctx, this.canvas.width, this.canvas.height, false);
                break;
            case 'general1':
                this.renderFestivalJoyBackground(this.ctx, this.canvas.width, this.canvas.height, false);
                break;
            case 'general2':
                this.renderMandalaBackground(this.ctx, this.canvas.width, this.canvas.height, false);
                break;
            case 'changa_chet':
                this.renderChangaChetBackground(this.ctx, this.canvas.width, this.canvas.height, false);
                break;
        }
        
        // Draw photo if uploaded
        if (this.uploadedPhoto) {
            const photoSize = 120;
            const photoX = (this.canvas.width - photoSize) / 2;
            const photoY = 120;
            
            this.ctx.save();
            this.ctx.beginPath();
            this.ctx.arc(photoX + photoSize/2, photoY + photoSize/2, photoSize/2, 0, Math.PI * 2);
            this.ctx.closePath();
            this.ctx.clip();
            
            this.ctx.drawImage(this.uploadedPhoto, photoX, photoY, photoSize, photoSize);
            this.ctx.restore();
            
            // Photo border with glow
            this.ctx.strokeStyle = '#fff';
            this.ctx.lineWidth = 4;
            this.ctx.shadowColor = '#fff';
            this.ctx.shadowBlur = 8;
            this.ctx.beginPath();
            this.ctx.arc(photoX + photoSize/2, photoY + photoSize/2, photoSize/2, 0, Math.PI * 2);
            this.ctx.stroke();
            this.ctx.shadowBlur = 0;
        }
        
        // Draw name with enhanced styling (only if name is provided)
        if (name && name.trim()) {
            this.ctx.fillStyle = '#fff';
            this.ctx.font = 'bold 36px Arial';
            this.ctx.textAlign = 'center';
            this.ctx.shadowColor = 'rgba(0,0,0,0.8)';
            this.ctx.shadowBlur = 6;
            this.ctx.shadowOffsetX = 2;
            this.ctx.shadowOffsetY = 2;
            
            const nameY = this.uploadedPhoto ? 280 : 200;
            
            // Add gold outline to name text
            this.ctx.strokeStyle = '#FFD700';
            this.ctx.lineWidth = 2;
            this.ctx.strokeText(name, this.canvas.width / 2, nameY);
            this.ctx.fillText(name, this.canvas.width / 2, nameY);
        }
        
        // Draw wish text with better styling (only if wish is provided)
        if (wish && wish.trim()) {
            this.ctx.font = 'italic 18px Arial';
            this.ctx.shadowBlur = 3;
            this.ctx.fillStyle = '#fff';
            const nameY = this.uploadedPhoto ? 280 : 200;
            const wishY = (name && name.trim()) ? nameY + 60 : nameY;
            this.wrapText(wish, this.canvas.width / 2, wishY, this.canvas.width - 40, 25);
        }
        
        // Draw enhanced watermark
        this.ctx.font = '12px Arial';
        this.ctx.fillStyle = 'rgba(255,255,255,0.9)';
        this.ctx.shadowBlur = 2;
        this.ctx.shadowColor = 'rgba(0,0,0,0.5)';
        this.ctx.textAlign = 'center';
        this.ctx.fillText('Made with ❤️ on nepali-card-maker.vercel.app', this.canvas.width / 2, this.canvas.height - 20);
        
        // Reset shadow and stroke
        this.ctx.shadowBlur = 0;
        this.ctx.shadowColor = 'transparent';
        this.ctx.strokeStyle = 'transparent';
        this.ctx.lineWidth = 1;
    }
    
    
    wrapText(text, x, y, maxWidth, lineHeight) {
        const words = text.split(' ');
        let line = '';
        
        for (let n = 0; n < words.length; n++) {
            const testLine = line + words[n] + ' ';
            const metrics = this.ctx.measureText(testLine);
            const testWidth = metrics.width;
            
            if (testWidth > maxWidth && n > 0) {
                this.ctx.fillText(line, x, y);
                line = words[n] + ' ';
                y += lineHeight;
            } else {
                line = testLine;
            }
        }
        this.ctx.fillText(line, x, y);
    }
    
    downloadCard() {
        const link = document.createElement('a');
        link.download = `festival-card-${Date.now()}.png`;
        link.href = this.canvas.toDataURL();
        link.click();
    }
    
    openShareModal() {
        document.getElementById('shareModal').style.display = 'block';
    }
    
    closeShareModal() {
        document.getElementById('shareModal').style.display = 'none';
    }
    
    async shareCard(platform) {
        const cardData = this.canvas.toDataURL();
        const text = this.currentLanguage === 'en' 
            ? 'Check out my festival card! Create yours at FestivalCards.com 🎊'
            : 'मेरो चाडपर्वको कार्ड हेर्नुहोस्! FestivalCards.com मा आफ्नो बनाउनुहोस् 🎊';
        
        // Try to use Web Share API first (works on mobile)
        if (navigator.share && navigator.canShare) {
            try {
                // Convert canvas to blob
                const blob = await new Promise(resolve => this.canvas.toBlob(resolve, 'image/png'));
                const file = new File([blob], 'festival-card.png', { type: 'image/png' });
                
                if (navigator.canShare({ files: [file] })) {
                    await navigator.share({
                        title: 'Festival Card',
                        text: text,
                        files: [file]
                    });
                    this.closeShareModal();
                    return;
                }
            } catch (err) {
                console.log('Web Share API failed:', err);
            }
        }
        
        // Fallback to traditional sharing
        switch (platform) {
            case 'whatsapp':
                // For WhatsApp, we'll download the image and share text
                this.downloadCard();
                window.open(`https://wa.me/?text=${encodeURIComponent(text + ' (Image downloaded - please attach it manually)')}`);
                break;
            case 'facebook':
                window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(window.location.href)}&quote=${encodeURIComponent(text)}`);
                break;
            case 'messenger':
                window.open(`https://m.me/?text=${encodeURIComponent(text)}`);
                break;
        }
        
        this.closeShareModal();
    }
}

// Initialize the app when the DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new FestivalCardBuilder();
});