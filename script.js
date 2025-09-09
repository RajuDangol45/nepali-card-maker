class FestivalCardBuilder {
    constructor() {
        this.currentLanguage = 'en';
        this.currentTemplate = null;
        this.uploadedPhoto = null;
        this.canvas = null;
        this.ctx = null;
        
        // Font settings (base dimensions - scaling handled by context)
        this.fontSettings = {
            family: 'Arial',
            size: 36, // Base size - will be scaled automatically by context
            color: '#ffffff',
            bold: true,
            italic: false
        };
        
        // Image cache for template backgrounds
        this.templateImages = {};
        this.imageLoadPromises = {};
        
        // Animation system
        this.animationManager = null;
        this.gifExporter = null;
        this.previewAnimationId = null;
        this.previewFrame = 0;
        this.isPreviewPlaying = true;
        
        // Drag and drop functionality for text positioning
        this.textPositions = {
            name: { x: null, y: null }, // null means use default positioning
            wish: { x: null, y: null }
        };
        this.isDragging = false;
        this.dragTarget = null;
        this.dragOffset = { x: 0, y: 0 };
        
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
                wishSelectorLabel: 'Choose Your Wish:',
                photoLabel: 'Upload Photo (Optional):',
                previewTitle: 'Preview',
                downloadText: 'Download PNG',
                downloadGifText: 'Download GIF',
                shareText: 'Share Card',
                shareModalTitle: 'Share Your Card',
                daysLabel: 'Days',
                hoursLabel: 'Hours',
                minutesLabel: 'Minutes',
                secondsLabel: 'Seconds',
                fontSettingsTitle: 'Font Settings',
                fontFamilyLabel: 'Font:',
                fontSizeLabel: 'Size:',
                fontColorLabel: 'Color:',
                fontStyleLabel: 'Style:',
                removePhotoText: 'Remove Photo',
                resetText: 'Reset Card'
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
                wishSelectorLabel: 'आफ्नो शुभकामना छान्नुहोस्:',
                photoLabel: 'फोटो अपलोड गर्नुहोस् (वैकल्पिक):',
                previewTitle: 'पूर्वावलोकन',
                downloadText: 'PNG डाउनलोड गर्नुहोस्',
                downloadGifText: 'GIF डाउनलोड गर्नुहोस्',
                shareText: 'कार्ड साझा गर्नुहोस्',
                shareModalTitle: 'आफ्नो कार्ड साझा गर्नुहोस्',
                daysLabel: 'दिन',
                hoursLabel: 'घण्टा',
                minutesLabel: 'मिनेट',
                secondsLabel: 'सेकेन्ड',
                fontSettingsTitle: 'फन्ट सेटिङहरू',
                fontFamilyLabel: 'फन्ट:',
                fontSizeLabel: 'साइज:',
                fontColorLabel: 'रंग:',
                fontStyleLabel: 'शैली:',
                removePhotoText: 'फोटो हटाउनुहोस्',
                resetText: 'कार्ड रिसेट गर्नुहोस्'
            }
        };
        
        // Initialize template manager
        this.templateManager = null;
        this.templates = [];
        
        this.init();
    }
    
    async init() {
        this.setupEventListeners();
        this.initCanvas();
        this.startCountdown();
        await this.loadTemplates();
        this.updateLanguage();
        this.initFontControls();
    }
    
    initFontControls() {
        // Set initial values for font controls
        document.getElementById('fontFamily').value = this.fontSettings.family;
        document.getElementById('fontSize').value = this.fontSettings.size; // Direct value
        document.getElementById('fontColor').value = this.fontSettings.color;
        document.getElementById('fontSizeValue').textContent = this.fontSettings.size + 'px';
        
        // Set initial button states
        document.getElementById('boldBtn').classList.toggle('active', this.fontSettings.bold);
        document.getElementById('italicBtn').classList.toggle('active', this.fontSettings.italic);
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
        // Wish input listener is now handled in setupWishSelection()
        document.getElementById('photoInput').addEventListener('change', (e) => this.handlePhotoUpload(e));
        
        // Font controls
        document.getElementById('fontFamily').addEventListener('change', (e) => this.updateFontSetting('family', e.target.value));
        document.getElementById('fontSize').addEventListener('input', (e) => this.updateFontSetting('size', parseInt(e.target.value)));
        document.getElementById('fontColor').addEventListener('input', (e) => this.updateFontSetting('color', e.target.value));
        document.getElementById('boldBtn').addEventListener('click', () => this.toggleFontStyle('bold'));
        document.getElementById('italicBtn').addEventListener('click', () => this.toggleFontStyle('italic'));
        
        // New action buttons
        document.getElementById('removePhotoBtn').addEventListener('click', () => this.removePhoto());
        document.getElementById('resetCardBtn').addEventListener('click', () => this.resetCard());
        
        // Action buttons
        document.getElementById('downloadBtn').addEventListener('click', () => this.downloadCard());
        document.getElementById('downloadGifBtn').addEventListener('click', () => this.downloadGif());
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
        
        // Preview controls
        document.getElementById('playPauseBtn').addEventListener('click', () => this.togglePreviewPlayback());
        
        // Canvas drag and drop for text positioning
        this.setupTextDragListeners();
        
        // Wish selection functionality
        this.setupWishSelection();
    }
    
    setupTextDragListeners() {
        const canvas = document.getElementById('cardCanvas');
        
        // Mouse events
        canvas.addEventListener('mousedown', (e) => this.handleDragStart(e));
        canvas.addEventListener('mousemove', (e) => this.handleDragMove(e));
        canvas.addEventListener('mouseup', (e) => this.handleDragEnd(e));
        canvas.addEventListener('mouseleave', (e) => this.handleDragEnd(e));
        
        // Touch events for mobile
        canvas.addEventListener('touchstart', (e) => this.handleDragStart(e, true));
        canvas.addEventListener('touchmove', (e) => this.handleDragMove(e, true));
        canvas.addEventListener('touchend', (e) => this.handleDragEnd(e, true));
        
        // Prevent context menu on right click
        canvas.addEventListener('contextmenu', (e) => e.preventDefault());
    }
    
    handleDragStart(e, isTouch = false) {
        const coords = this.getMouseCoords(e, isTouch);
        if (!coords) return;
        
        // Simple distance-based hit detection for name
        const namePos = this.getTextPosition('name');
        const nameDistance = Math.sqrt(
            Math.pow(coords.x - namePos.x, 2) + 
            Math.pow(coords.y - namePos.y, 2)
        );
        
        if (nameDistance < 80) {
            this.isDragging = true;
            this.dragTarget = 'name';
            this.dragOffset = { x: coords.x - namePos.x, y: coords.y - namePos.y };
            this.canvas.style.cursor = 'grabbing';
            if (isTouch) e.preventDefault();
            return;
        }
        
        // Simple distance-based hit detection for wish
        const wishPos = this.getTextPosition('wish');
        const wishDistance = Math.sqrt(
            Math.pow(coords.x - wishPos.x, 2) + 
            Math.pow(coords.y - wishPos.y, 2)
        );
        
        if (wishDistance < 80) {
            this.isDragging = true;
            this.dragTarget = 'wish';
            this.dragOffset = { x: coords.x - wishPos.x, y: coords.y - wishPos.y };
            this.canvas.style.cursor = 'grabbing';
            if (isTouch) e.preventDefault();
        }
    }
    
    handleDragMove(e, isTouch = false) {
        const coords = this.getMouseCoords(e, isTouch);
        if (!coords) return;
        
        if (!this.isDragging) {
            // Check for hover effects
            const namePos = this.getTextPosition('name');
            const wishPos = this.getTextPosition('wish');
            
            const nameDistance = Math.sqrt(
                Math.pow(coords.x - namePos.x, 2) + 
                Math.pow(coords.y - namePos.y, 2)
            );
            const wishDistance = Math.sqrt(
                Math.pow(coords.x - wishPos.x, 2) + 
                Math.pow(coords.y - wishPos.y, 2)
            );
            
            if (nameDistance < 80 || wishDistance < 80) {
                this.canvas.style.cursor = 'grab';
            } else {
                this.canvas.style.cursor = 'default';
            }
            return;
        }
        
        // Handle dragging
        if (isTouch) e.preventDefault();
        
        const newX = coords.x - this.dragOffset.x;
        const newY = coords.y - this.dragOffset.y;
        
        // Constrain to canvas bounds
        const padding = 60;
        const constrainedX = Math.max(padding, Math.min(this.canvas.width - padding, newX));
        const constrainedY = Math.max(padding, Math.min(this.canvas.height - padding, newY));
        
        // Update text position
        this.textPositions[this.dragTarget] = { x: constrainedX, y: constrainedY };
        
        // Update preview
        this.updatePreview();
    }
    
    handleDragEnd(e, isTouch = false) {
        if (this.isDragging) {
            this.isDragging = false;
            this.dragTarget = null;
            this.canvas.style.cursor = 'default';
        }
    }
    
    getMouseCoords(e, isTouch = false) {
        let clientX, clientY;
        if (isTouch) {
            if (e.touches.length === 0) return null;
            clientX = e.touches[0].clientX;
            clientY = e.touches[0].clientY;
        } else {
            clientX = e.clientX;
            clientY = e.clientY;
        }
        
        const rect = this.canvas.getBoundingClientRect();
        const scaleX = this.canvas.width / this.canvas.clientWidth;
        const scaleY = this.canvas.height / this.canvas.clientHeight;
        
        return {
            x: (clientX - rect.left) * scaleX,
            y: (clientY - rect.top) * scaleY
        };
    }
    
    setupWishSelection() {
        const predefinedWishBtn = document.getElementById('predefinedWishBtn');
        const customWishBtn = document.getElementById('customWishBtn');
        const predefinedWishSection = document.getElementById('predefinedWishSection');
        const customWishSection = document.getElementById('customWishSection');
        const wishSelector = document.getElementById('wishSelector');
        const wishInput = document.getElementById('wishInput');

        // Handle wish type selection buttons
        predefinedWishBtn.addEventListener('click', () => {
            predefinedWishBtn.classList.add('active');
            customWishBtn.classList.remove('active');
            predefinedWishSection.classList.add('active');
            customWishSection.classList.remove('active');
            
            // Clear custom wish input
            wishInput.value = '';
            this.updatePreview();
        });

        customWishBtn.addEventListener('click', () => {
            customWishBtn.classList.add('active');
            predefinedWishBtn.classList.remove('active');
            customWishSection.classList.add('active');
            predefinedWishSection.classList.remove('active');
            
            // Clear predefined selection
            wishSelector.value = '';
            this.updatePreview();
        });

        // Handle predefined wish selection
        wishSelector.addEventListener('change', () => {
            if (wishSelector.value) {
                // Clear custom wish input when predefined is selected
                wishInput.value = '';
                this.updatePreview();
            }
        });

        // Handle custom wish input
        wishInput.addEventListener('input', () => {
            if (wishInput.value.trim()) {
                // Clear predefined selection when custom text is entered
                wishSelector.value = '';
            }
            this.updatePreview();
        });
    }
    
    getCurrentWish() {
        const wishSelector = document.getElementById('wishSelector');
        const wishInput = document.getElementById('wishInput');
        
        // Return predefined wish if selected
        if (wishSelector.value) {
            const selectedOption = wishSelector.options[wishSelector.selectedIndex];
            return selectedOption ? selectedOption.text : '';
        }
        
        // Return custom wish if entered
        return wishInput.value.trim();
    }
    
    getTextPosition(textType) {
        const position = this.textPositions[textType];
        if (position.x !== null && position.y !== null) {
            return position;
        }
        
        // Return default position if not set
        const baseWidth = this.canvas.width;
        const baseHeight = this.canvas.height;
        
        if (textType === 'name') {
            const nameY = this.uploadedPhoto ? 280 * 3 : 200 * 3; // Scale factor applied
            return { x: baseWidth / 2, y: nameY };
        } else if (textType === 'wish') {
            const nameY = this.uploadedPhoto ? 280 * 3 : 200 * 3;
            const wishY = nameY + 60 * 3; // Scale factor applied
            return { x: baseWidth / 2, y: wishY };
        }
        
        return { x: baseWidth / 2, y: baseHeight / 2 };
    }
    
    resetTextPositions() {
        // Reset text positions to defaults
        this.textPositions = {
            name: { x: null, y: null },
            wish: { x: null, y: null }
        };
        this.updatePreview();
    }
    
    initCanvas() {
        this.canvas = document.getElementById('cardCanvas');
        this.ctx = this.canvas.getContext('2d');
        
        // Set high internal resolution for quality
        const scale = 3;
        const baseWidth = 400;
        const baseHeight = 600;
        
        this.canvas.width = baseWidth * scale;
        this.canvas.height = baseHeight * scale;
        
        // Scale the canvas down for display but maintain high internal resolution
        this.canvas.style.width = baseWidth + 'px';
        this.canvas.style.height = baseHeight + 'px';
        
        // Scale the context to match internal resolution
        this.ctx.scale(scale, scale);
        
        // Enable high-DPI rendering for even better quality on retina displays
        const dpr = window.devicePixelRatio || 1;
        if (dpr > 1) {
            // Adjust for device pixel ratio
            const finalWidth = baseWidth * scale * dpr;
            const finalHeight = baseHeight * scale * dpr;
            
            this.canvas.width = finalWidth;
            this.canvas.height = finalHeight;
            this.canvas.style.width = baseWidth + 'px';
            this.canvas.style.height = baseHeight + 'px';
            
            this.ctx.scale(scale * dpr, scale * dpr);
        }
        
        // Improve text rendering quality
        this.ctx.imageSmoothingEnabled = true;
        this.ctx.imageSmoothingQuality = 'high';
        this.ctx.textBaseline = 'top';
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
        document.getElementById('wishSelectorLabel').textContent = t.wishSelectorLabel;
        document.getElementById('photoLabel').textContent = t.photoLabel;
        document.getElementById('previewTitle').textContent = t.previewTitle;
        document.getElementById('downloadText').textContent = t.downloadText;
        document.getElementById('downloadGifText').textContent = t.downloadGifText;
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
        
        // Update new control labels
        document.getElementById('fontSettingsTitle').textContent = t.fontSettingsTitle;
        document.getElementById('fontFamilyLabel').textContent = t.fontFamilyLabel;
        document.getElementById('fontSizeLabel').textContent = t.fontSizeLabel;
        document.getElementById('fontColorLabel').textContent = t.fontColorLabel;
        document.getElementById('fontStyleLabel').textContent = t.fontStyleLabel;
        document.getElementById('removePhotoText').textContent = t.removePhotoText;
        document.getElementById('resetText').textContent = t.resetText;
        
        // Update font size display
        document.getElementById('fontSizeValue').textContent = this.fontSettings.size + 'px';
    }
    
    startCountdown() {
        const dashainDate = new Date('2025-09-22').getTime(); // Dashain 2025 starts September 22nd
        
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
    
    async loadTemplates() {
        // Initialize template manager
        if (typeof TemplateManager !== 'undefined') {
            this.templateManager = new TemplateManager(this);
            await this.templateManager.loadTemplates();
            this.templates = this.templateManager.getAllTemplateConfigs();
        } else {
            // Fallback to legacy templates if TemplateManager not available
            this.templates = this.getLegacyTemplates();
        }
        
        this.renderTemplateGrid();
    }
    
    getLegacyTemplates() {
        return [
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
                id: 'dashain3',
                name: 'Kite Flying Day',
                background: 'linear-gradient(135deg, #87ceeb, #98fb98)',
                colors: ['#87ceeb', '#98fb98'],
                decorations: ['🪁', '☀️', '🪁'],
                wishes: {
                    en: 'May your spirits soar high like kites in the sky this Dashain!',
                    ne: 'यो दशैंमा तपाईंको आत्मा आकाशमा चंगाजस्तै माथि उड्दै जाओस्!'
                }
            }
        ];
    }
    
    renderTemplateGrid() {
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
                case 'dashain2':
                    this.renderTikaTemplateBackground(ctx, width, height, true);
                    break;
                case 'tihar1':
                    this.renderTiharLightsBackground(ctx, width, height, true);
                    break;
                case 'dashain3':
                    this.renderKiteFlyingBackground(ctx, width, height, true);
                    break;
                case 'dashain4':
                case 'dashain5':
                    if (this.templateManager && this.templateManager.renderTemplate(template.id, ctx, width, height)) {
                        break;
                    }
                    // Fallback for legacy rendering
                    if (template.id === 'dashain4') {
                        this.renderMinimalistDashainBackground(ctx, width, height, true);
                    } else {
                        this.renderDurgaGraceBackground(ctx, width, height, true);
                    }
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
    
    renderKiteFlyingBackground(ctx, width, height, isPreview = false) {
        // Bright day sky gradient
        const gradient = ctx.createLinearGradient(0, 0, 0, height);
        gradient.addColorStop(0, '#87CEEB'); // Sky blue
        gradient.addColorStop(0.3, '#98FB98'); // Light green
        gradient.addColorStop(0.7, '#90EE90'); // Lighter green
        gradient.addColorStop(1, '#7CFC00'); // Lawn green
        
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, width, height);
        
        // Sun
        ctx.fillStyle = '#FFD700';
        ctx.shadowColor = '#FFA500';
        ctx.shadowBlur = 20;
        ctx.beginPath();
        ctx.arc(width * 0.8, height * 0.2, width * 0.06, 0, Math.PI * 2);
        ctx.fill();
        ctx.shadowBlur = 0;
        
        // Sun rays
        ctx.strokeStyle = 'rgba(255, 215, 0, 0.6)';
        ctx.lineWidth = 3;
        for (let i = 0; i < 8; i++) {
            const angle = (i * Math.PI * 2) / 8;
            const rayLength = width * 0.1;
            ctx.beginPath();
            ctx.moveTo(
                width * 0.8 + Math.cos(angle) * width * 0.08,
                height * 0.2 + Math.sin(angle) * width * 0.08
            );
            ctx.lineTo(
                width * 0.8 + Math.cos(angle) * rayLength,
                height * 0.2 + Math.sin(angle) * rayLength
            );
            ctx.stroke();
        }
        
        // Fluffy clouds
        this.drawCloud(ctx, width * 0.2, height * 0.15, width * 0.12);
        this.drawCloud(ctx, width * 0.6, height * 0.08, width * 0.08);
        this.drawCloud(ctx, width * 0.1, height * 0.25, width * 0.1);
        
        // Note: Kites will be drawn by animation functions, not static ones
        
        // Hills/mountains in background
        ctx.fillStyle = 'rgba(34, 139, 34, 0.4)';
        ctx.beginPath();
        ctx.moveTo(0, height * 0.8);
        ctx.quadraticCurveTo(width * 0.3, height * 0.7, width * 0.6, height * 0.8);
        ctx.quadraticCurveTo(width * 0.8, height * 0.75, width, height * 0.85);
        ctx.lineTo(width, height);
        ctx.lineTo(0, height);
        ctx.closePath();
        ctx.fill();
        
        // Static grass/field details (no animation)
        ctx.strokeStyle = 'rgba(0, 128, 0, 0.3)';
        ctx.lineWidth = 2;
        const grassPositions = [0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 0.9]; // Fixed positions
        grassPositions.forEach(pos => {
            const x = width * pos;
            const y = height * 0.88;
            const grassHeight = width * 0.02;
            
            ctx.beginPath();
            ctx.moveTo(x, y);
            ctx.lineTo(x + 2, y - grassHeight);
            ctx.stroke();
        });
    }
    
    renderMinimalistDashainBackground(ctx, width, height, isPreview = false) {
        // Soft gradient background - very gentle colors
        const gradient = ctx.createLinearGradient(0, 0, 0, height);
        gradient.addColorStop(0, '#f8f9fa'); // Very light grey
        gradient.addColorStop(0.3, '#f1f3f4'); // Slightly darker grey
        gradient.addColorStop(0.7, '#e8eaed'); // Light silver
        gradient.addColorStop(1, '#dadce0'); // Soft grey bottom
        
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, width, height);
        
        // Subtle Om symbol in background
        ctx.save();
        ctx.globalAlpha = 0.08;
        ctx.font = `${width * 0.25}px serif`;
        ctx.fillStyle = '#6c757d';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText('ॐ', width / 2, height * 0.35);
        ctx.restore();
        
        // Minimal decorative border
        ctx.strokeStyle = 'rgba(108, 117, 125, 0.2)';
        ctx.lineWidth = 2;
        ctx.setLineDash([10, 10]);
        ctx.strokeRect(width * 0.05, height * 0.05, width * 0.9, height * 0.9);
        ctx.setLineDash([]);
        
        // Subtle lotus petals in corners
        this.drawMinimalLotus(ctx, width * 0.1, height * 0.9, width * 0.08);
        this.drawMinimalLotus(ctx, width * 0.9, height * 0.9, width * 0.08);
        this.drawMinimalLotus(ctx, width * 0.1, height * 0.1, width * 0.08);
        this.drawMinimalLotus(ctx, width * 0.9, height * 0.1, width * 0.08);
    }
    
    drawMinimalLotus(ctx, x, y, size) {
        ctx.save();
        ctx.globalAlpha = 0.15;
        ctx.fillStyle = '#dc3545';
        
        // Simple lotus shape with 5 petals
        for (let i = 0; i < 5; i++) {
            ctx.save();
            ctx.translate(x, y);
            ctx.rotate((i * 72) * Math.PI / 180);
            
            ctx.beginPath();
            ctx.ellipse(0, -size * 0.3, size * 0.2, size * 0.4, 0, 0, Math.PI * 2);
            ctx.fill();
            ctx.restore();
        }
        
        // Center circle
        ctx.beginPath();
        ctx.arc(x, y, size * 0.15, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
    }
    
    renderDurgaGraceBackground(ctx, width, height, isPreview = false) {
        // Warm cream gradient background
        const gradient = ctx.createLinearGradient(0, 0, 0, height);
        gradient.addColorStop(0, '#fef9e7'); // Warm cream
        gradient.addColorStop(0.3, '#fdf6e3'); // Light cream
        gradient.addColorStop(0.7, '#f8f4e6'); // Soft beige
        gradient.addColorStop(1, '#f5f1e8'); // Gentle tan
        
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, width, height);
        
        // Beautiful Durga face design (similar to traditional art)
        const centerX = width / 2;
        const centerY = height * 0.4;
        const scale = width * 0.12;
        
        this.drawDurgaFace(ctx, centerX, centerY, scale);
        
        // Elegant border with traditional patterns
        ctx.strokeStyle = 'rgba(212, 105, 26, 0.15)';
        ctx.lineWidth = 3;
        ctx.setLineDash([15, 8, 3, 8]);
        ctx.strokeRect(width * 0.06, height * 0.06, width * 0.88, height * 0.88);
        ctx.setLineDash([]);
        
        // Sacred trident symbols in corners (very subtle)
        this.drawMinimalTrident(ctx, width * 0.12, height * 0.12, width * 0.06);
        this.drawMinimalTrident(ctx, width * 0.88, height * 0.12, width * 0.06);
        this.drawMinimalTrident(ctx, width * 0.12, height * 0.88, width * 0.06);
        this.drawMinimalTrident(ctx, width * 0.88, height * 0.88, width * 0.06);
        
        // Gentle Sanskrit text "दुर्गा" (Durga) - very subtle
        ctx.save();
        ctx.globalAlpha = 0.08;
        ctx.font = `${width * 0.08}px serif`;
        ctx.fillStyle = '#d4691a';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText('दुर्गा', width / 2, height * 0.75);
        ctx.restore();
    }
    
    drawMinimalTrident(ctx, x, y, size) {
        ctx.save();
        ctx.globalAlpha = 0.12;
        ctx.strokeStyle = '#d4691a';
        ctx.lineWidth = 2;
        
        // Central prong
        ctx.beginPath();
        ctx.moveTo(x, y - size * 0.4);
        ctx.lineTo(x, y + size * 0.4);
        ctx.stroke();
        
        // Left prong
        ctx.beginPath();
        ctx.moveTo(x - size * 0.25, y - size * 0.3);
        ctx.lineTo(x - size * 0.25, y + size * 0.2);
        ctx.stroke();
        
        // Right prong
        ctx.beginPath();
        ctx.moveTo(x + size * 0.25, y - size * 0.3);
        ctx.lineTo(x + size * 0.25, y + size * 0.2);
        ctx.stroke();
        
        // Connecting lines
        ctx.beginPath();
        ctx.moveTo(x - size * 0.25, y - size * 0.3);
        ctx.lineTo(x, y - size * 0.4);
        ctx.lineTo(x + size * 0.25, y - size * 0.3);
        ctx.stroke();
        
        ctx.restore();
    }
    
    drawDurgaFace(ctx, centerX, centerY, scale) {
        ctx.save();
        ctx.globalAlpha = 0.12;
        ctx.fillStyle = '#b71c1c';
        ctx.strokeStyle = '#b71c1c';
        ctx.lineWidth = 2;
        
        // Face outline (oval)
        ctx.beginPath();
        ctx.ellipse(centerX, centerY, scale * 0.8, scale * 1.0, 0, 0, Math.PI * 2);
        ctx.fill();
        
        // Third eye (crescent moon symbol at top)
        ctx.save();
        ctx.globalAlpha = 0.15;
        ctx.strokeStyle = '#fff';
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.arc(centerX, centerY - scale * 0.85, scale * 0.15, Math.PI * 0.2, Math.PI * 0.8);
        ctx.stroke();
        
        // Small dot in crescent (bindu)
        ctx.fillStyle = '#fff';
        ctx.beginPath();
        ctx.arc(centerX, centerY - scale * 0.85, scale * 0.05, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
        
        // Eyes (almond shaped)
        const eyeY = centerY - scale * 0.3;
        const eyeWidth = scale * 0.35;
        const eyeHeight = scale * 0.18;
        
        // Left eye
        ctx.save();
        ctx.globalAlpha = 0.18;
        ctx.fillStyle = '#fff';
        this.drawAlmondEye(ctx, centerX - scale * 0.35, eyeY, eyeWidth, eyeHeight);
        ctx.restore();
        
        // Right eye  
        ctx.save();
        ctx.globalAlpha = 0.18;
        ctx.fillStyle = '#fff';
        this.drawAlmondEye(ctx, centerX + scale * 0.35, eyeY, eyeWidth, eyeHeight);
        ctx.restore();
        
        // Eye pupils
        ctx.save();
        ctx.globalAlpha = 0.25;
        ctx.fillStyle = '#000';
        ctx.beginPath();
        ctx.arc(centerX - scale * 0.35, eyeY, scale * 0.08, 0, Math.PI * 2);
        ctx.fill();
        ctx.beginPath();
        ctx.arc(centerX + scale * 0.35, eyeY, scale * 0.08, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
        
        // Nose (elegant curve)
        ctx.save();
        ctx.globalAlpha = 0.15;
        ctx.strokeStyle = '#fff';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(centerX, centerY - scale * 0.1);
        ctx.quadraticCurveTo(centerX - scale * 0.08, centerY, centerX, centerY + scale * 0.1);
        ctx.stroke();
        
        // Nostril details
        ctx.beginPath();
        ctx.arc(centerX - scale * 0.06, centerY + scale * 0.05, scale * 0.02, 0, Math.PI * 2);
        ctx.fill();
        ctx.beginPath();
        ctx.arc(centerX + scale * 0.06, centerY + scale * 0.05, scale * 0.02, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
        
        // Lips (beautiful curves)
        ctx.save();
        ctx.globalAlpha = 0.16;
        ctx.fillStyle = '#d32f2f';
        this.drawLips(ctx, centerX, centerY + scale * 0.4, scale * 0.25);
        ctx.restore();
        
        // Crown/Mukut (simplified)
        ctx.save();
        ctx.globalAlpha = 0.14;
        ctx.fillStyle = '#ffd700';
        ctx.strokeStyle = '#ffd700';
        ctx.lineWidth = 2;
        
        // Crown base
        ctx.beginPath();
        ctx.ellipse(centerX, centerY - scale * 1.15, scale * 0.9, scale * 0.15, 0, Math.PI, 0);
        ctx.fill();
        
        // Crown peaks
        for (let i = 0; i < 5; i++) {
            const angle = Math.PI + (i * Math.PI / 4);
            const peakX = centerX + Math.cos(angle) * scale * 0.7;
            const peakY = centerY - scale * 1.15;
            const height = scale * (0.2 + (i === 2 ? 0.15 : 0));
            
            ctx.beginPath();
            ctx.moveTo(peakX - scale * 0.08, peakY);
            ctx.lineTo(peakX, peakY - height);
            ctx.lineTo(peakX + scale * 0.08, peakY);
            ctx.closePath();
            ctx.fill();
        }
        ctx.restore();
        
        // Earrings
        ctx.save();
        ctx.globalAlpha = 0.12;
        ctx.fillStyle = '#ffd700';
        
        // Left earring
        ctx.beginPath();
        ctx.arc(centerX - scale * 0.75, centerY - scale * 0.1, scale * 0.08, 0, Math.PI * 2);
        ctx.fill();
        ctx.beginPath();
        ctx.ellipse(centerX - scale * 0.75, centerY + scale * 0.05, scale * 0.06, scale * 0.12, 0, 0, Math.PI * 2);
        ctx.fill();
        
        // Right earring
        ctx.beginPath();
        ctx.arc(centerX + scale * 0.75, centerY - scale * 0.1, scale * 0.08, 0, Math.PI * 2);
        ctx.fill();
        ctx.beginPath();
        ctx.ellipse(centerX + scale * 0.75, centerY + scale * 0.05, scale * 0.06, scale * 0.12, 0, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
        
        ctx.restore();
    }
    
    drawAlmondEye(ctx, x, y, width, height) {
        ctx.beginPath();
        ctx.moveTo(x - width/2, y);
        ctx.quadraticCurveTo(x - width/4, y - height/2, x, y);
        ctx.quadraticCurveTo(x + width/4, y - height/2, x + width/2, y);
        ctx.quadraticCurveTo(x + width/4, y + height/2, x, y);
        ctx.quadraticCurveTo(x - width/4, y + height/2, x - width/2, y);
        ctx.closePath();
        ctx.fill();
    }
    
    drawLips(ctx, x, y, width) {
        ctx.beginPath();
        // Upper lip curve
        ctx.moveTo(x - width, y);
        ctx.quadraticCurveTo(x - width/2, y - width/3, x, y - width/6);
        ctx.quadraticCurveTo(x + width/2, y - width/3, x + width, y);
        // Lower lip curve  
        ctx.quadraticCurveTo(x + width/2, y + width/4, x, y + width/6);
        ctx.quadraticCurveTo(x - width/2, y + width/4, x - width, y);
        ctx.closePath();
        ctx.fill();
    }
    
    drawCloud(ctx, x, y, size) {
        ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
        ctx.shadowColor = 'rgba(200, 200, 200, 0.3)';
        ctx.shadowBlur = 10;
        
        // Main cloud body (multiple overlapping circles)
        const circles = [
            { dx: 0, dy: 0, r: size * 0.5 },
            { dx: -size * 0.3, dy: size * 0.1, r: size * 0.4 },
            { dx: size * 0.3, dy: size * 0.1, r: size * 0.4 },
            { dx: -size * 0.15, dy: -size * 0.2, r: size * 0.3 },
            { dx: size * 0.15, dy: -size * 0.2, r: size * 0.3 }
        ];
        
        circles.forEach(circle => {
            ctx.beginPath();
            ctx.arc(x + circle.dx, y + circle.dy, circle.r, 0, Math.PI * 2);
            ctx.fill();
        });
        
        ctx.shadowBlur = 0;
    }
    
    drawKite(ctx, x, y, size, primaryColor, secondaryColor) {
        ctx.save();
        
        // Kite body (diamond shape)
        ctx.fillStyle = primaryColor;
        ctx.beginPath();
        ctx.moveTo(x, y - size); // Top point
        ctx.lineTo(x + size * 0.7, y); // Right point
        ctx.lineTo(x, y + size * 1.2); // Bottom point
        ctx.lineTo(x - size * 0.7, y); // Left point
        ctx.closePath();
        ctx.fill();
        
        // Kite cross pattern
        ctx.fillStyle = secondaryColor;
        ctx.beginPath();
        ctx.moveTo(x, y - size * 0.5); // Top triangle
        ctx.lineTo(x + size * 0.35, y);
        ctx.lineTo(x - size * 0.35, y);
        ctx.closePath();
        ctx.fill();
        
        // Kite string
        ctx.strokeStyle = 'rgba(139, 69, 19, 0.8)';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(x, y + size * 1.2);
        
        // Wavy string going down
        const stringLength = size * 3;
        const waves = 5;
        for (let i = 1; i <= waves; i++) {
            const progress = i / waves;
            const waveX = x + Math.sin(progress * Math.PI * 2) * size * 0.3;
            const waveY = y + size * 1.2 + progress * stringLength;
            ctx.lineTo(waveX, waveY);
        }
        ctx.stroke();
        
        // Kite tail ribbons
        ctx.fillStyle = secondaryColor;
        for (let i = 1; i <= 3; i++) {
            const tailY = y + size * 1.2 + i * size * 0.8;
            const tailX = x + Math.sin(i * 0.5) * size * 0.2;
            
            ctx.beginPath();
            ctx.ellipse(tailX, tailY, size * 0.15, size * 0.08, Math.PI * 0.1 * i, 0, Math.PI * 2);
            ctx.fill();
        }
        
        ctx.restore();
    }
    
    // Different kite types for variety
    drawDiamondKite(ctx, x, y, size, primaryColor, secondaryColor, rotation = 0) {
        ctx.save();
        ctx.translate(x, y);
        ctx.rotate(rotation);
        
        // Diamond kite body
        ctx.fillStyle = primaryColor;
        ctx.beginPath();
        ctx.moveTo(0, -size); // Top
        ctx.lineTo(size * 0.6, 0); // Right
        ctx.lineTo(0, size * 1.2); // Bottom
        ctx.lineTo(-size * 0.6, 0); // Left
        ctx.closePath();
        ctx.fill();
        
        // Cross design
        ctx.fillStyle = secondaryColor;
        ctx.beginPath();
        ctx.moveTo(0, -size * 0.4);
        ctx.lineTo(size * 0.3, 0);
        ctx.lineTo(0, size * 0.6);
        ctx.lineTo(-size * 0.3, 0);
        ctx.closePath();
        ctx.fill();
        
        // String
        ctx.strokeStyle = 'rgba(139, 69, 19, 0.7)';
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.moveTo(0, size * 1.2);
        ctx.lineTo(size * 0.2, size * 2);
        ctx.lineTo(-size * 0.1, size * 2.8);
        ctx.stroke();
        
        ctx.restore();
    }
    
    drawBoxKite(ctx, x, y, size, primaryColor, secondaryColor, rotation = 0) {
        ctx.save();
        ctx.translate(x, y);
        ctx.rotate(rotation);
        
        // Box kite structure (3D look)
        ctx.fillStyle = primaryColor;
        ctx.fillRect(-size * 0.4, -size * 0.8, size * 0.8, size * 0.6);
        
        // Top section
        ctx.fillStyle = secondaryColor;
        ctx.fillRect(-size * 0.4, -size * 0.8, size * 0.8, size * 0.2);
        
        // Bottom section
        ctx.fillRect(-size * 0.4, size * 0.2, size * 0.8, size * 0.2);
        
        // Side depth effect
        ctx.fillStyle = 'rgba(0, 0, 0, 0.2)';
        ctx.beginPath();
        ctx.moveTo(size * 0.4, -size * 0.8);
        ctx.lineTo(size * 0.6, -size * 0.9);
        ctx.lineTo(size * 0.6, size * 0.5);
        ctx.lineTo(size * 0.4, size * 0.4);
        ctx.closePath();
        ctx.fill();
        
        // String
        ctx.strokeStyle = 'rgba(139, 69, 19, 0.7)';
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.moveTo(0, size * 0.4);
        ctx.lineTo(size * 0.3, size * 1.5);
        ctx.stroke();
        
        ctx.restore();
    }
    
    drawDeltaKite(ctx, x, y, size, primaryColor, secondaryColor, rotation = 0) {
        ctx.save();
        ctx.translate(x, y);
        ctx.rotate(rotation);
        
        // Delta/triangular kite
        ctx.fillStyle = primaryColor;
        ctx.beginPath();
        ctx.moveTo(0, -size * 0.8); // Top point
        ctx.lineTo(size * 0.8, size * 0.8); // Right bottom
        ctx.lineTo(-size * 0.8, size * 0.8); // Left bottom
        ctx.closePath();
        ctx.fill();
        
        // Wing pattern
        ctx.fillStyle = secondaryColor;
        ctx.beginPath();
        ctx.moveTo(0, -size * 0.8);
        ctx.lineTo(size * 0.4, size * 0.2);
        ctx.lineTo(-size * 0.4, size * 0.2);
        ctx.closePath();
        ctx.fill();
        
        // String
        ctx.strokeStyle = 'rgba(139, 69, 19, 0.7)';
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.moveTo(0, size * 0.6);
        ctx.lineTo(-size * 0.2, size * 2);
        ctx.stroke();
        
        ctx.restore();
    }
    
    drawStuntKite(ctx, x, y, size, primaryColor, secondaryColor, rotation = 0) {
        ctx.save();
        ctx.translate(x, y);
        ctx.rotate(rotation);
        
        // Stunt kite (dual-line, wider shape)
        ctx.fillStyle = primaryColor;
        ctx.beginPath();
        ctx.moveTo(0, -size * 0.6); // Top
        ctx.lineTo(size * 1.2, size * 0.3); // Right wing
        ctx.lineTo(size * 0.8, size * 0.8); // Right bottom
        ctx.lineTo(0, size * 0.4); // Center bottom
        ctx.lineTo(-size * 0.8, size * 0.8); // Left bottom
        ctx.lineTo(-size * 1.2, size * 0.3); // Left wing
        ctx.closePath();
        ctx.fill();
        
        // Wing stripes
        ctx.fillStyle = secondaryColor;
        ctx.beginPath();
        ctx.moveTo(size * 0.3, 0);
        ctx.lineTo(size * 0.9, size * 0.4);
        ctx.lineTo(size * 0.6, size * 0.6);
        ctx.lineTo(0, size * 0.2);
        ctx.closePath();
        ctx.fill();
        
        // Mirror for left side
        ctx.beginPath();
        ctx.moveTo(-size * 0.3, 0);
        ctx.lineTo(-size * 0.9, size * 0.4);
        ctx.lineTo(-size * 0.6, size * 0.6);
        ctx.lineTo(0, size * 0.2);
        ctx.closePath();
        ctx.fill();
        
        // Dual strings
        ctx.strokeStyle = 'rgba(139, 69, 19, 0.7)';
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.moveTo(-size * 0.3, size * 0.6);
        ctx.lineTo(-size * 0.5, size * 1.8);
        ctx.moveTo(size * 0.3, size * 0.6);
        ctx.lineTo(size * 0.5, size * 1.8);
        ctx.stroke();
        
        ctx.restore();
    }
    
    drawSimpleKite(ctx, x, y, size, primaryColor, secondaryColor, rotation = 0) {
        ctx.save();
        ctx.translate(x, y);
        ctx.rotate(rotation);
        
        // Simple distant kite (less detail)
        ctx.fillStyle = primaryColor;
        ctx.beginPath();
        ctx.moveTo(0, -size);
        ctx.lineTo(size * 0.5, 0);
        ctx.lineTo(0, size);
        ctx.lineTo(-size * 0.5, 0);
        ctx.closePath();
        ctx.fill();
        
        // Simple cross
        ctx.strokeStyle = secondaryColor;
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(0, -size);
        ctx.lineTo(0, size);
        ctx.moveTo(-size * 0.5, 0);
        ctx.lineTo(size * 0.5, 0);
        ctx.stroke();
        
        // Minimal string
        ctx.strokeStyle = 'rgba(139, 69, 19, 0.5)';
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(0, size);
        ctx.lineTo(size * 0.1, size * 1.5);
        ctx.stroke();
        
        ctx.restore();
    }
    
    // New Dashain Templates
    renderTempleBackground(ctx, width, height, isPreview = false) {
        // Himalayan sky gradient
        const gradient = ctx.createLinearGradient(0, 0, 0, height);
        gradient.addColorStop(0, '#87CEEB'); // Sky blue
        gradient.addColorStop(0.3, '#DAA520'); // Golden horizon
        gradient.addColorStop(0.7, '#CD853F'); // Temple glow
        gradient.addColorStop(1, '#8B4513'); // Earth
        
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, width, height);
        
        // Himalayan mountains silhouette
        this.drawHimalayanRange(ctx, width, height);
        
        // Multiple pagoda temples with traditional architecture
        this.drawPagodaTemple(ctx, width * 0.2, height * 0.75, width * 0.15);
        this.drawPagodaTemple(ctx, width * 0.5, height * 0.7, width * 0.2);
        this.drawPagodaTemple(ctx, width * 0.8, height * 0.8, width * 0.12);
        
        // Dashain-specific elements
        this.drawJamaraStalks(ctx, width * 0.15, height * 0.9, width * 0.08);
        this.drawTikaPlate(ctx, width * 0.85, height * 0.85, width * 0.06);
        
        // Traditional swing (ping)
        this.drawTraditionalSwing(ctx, width * 0.7, height * 0.4, width * 0.15);
        
        // Colorful prayer flags across temples
        this.drawPrayerFlagString(ctx, width * 0.1, height * 0.3, width * 0.8);
        
        // Khukuri and garland
        this.drawKhukuriAndGarland(ctx, width * 0.9, height * 0.5, width * 0.08);
        
        // Family tika ceremony silhouette
        this.drawTikaCeremony(ctx, width * 0.3, height * 0.85, width * 0.12);
        
        // Madal drum
        this.drawMadal(ctx, width * 0.05, height * 0.6, width * 0.06);
        
        // Dhaka pattern border
        this.drawDhakaPatternBorder(ctx, width, height, '#DC143C');
    }
    
    renderMarigoldGardenBackground(ctx, width, height, isPreview = false) {
        // Festival morning sky
        const gradient = ctx.createLinearGradient(0, 0, 0, height);
        gradient.addColorStop(0, '#87CEEB'); // Sky blue
        gradient.addColorStop(0.2, '#FFD700'); // Golden
        gradient.addColorStop(0.6, '#FFA500'); // Orange
        gradient.addColorStop(1, '#228B22'); // Garden green
        
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, width, height);
        
        // Himalayan backdrop (distant mountains)
        this.drawDistantMountains(ctx, width, height * 0.4);
        
        // Traditional house with marigold decorations
        this.drawNepaliFestivalHouse(ctx, width * 0.7, height * 0.6, width * 0.25);
        
        // Large marigold garden beds with varying heights
        const gardenBeds = [
            { x: 0, y: height * 0.7, w: width * 0.4, h: height * 0.3 },
            { x: width * 0.6, y: height * 0.75, w: width * 0.4, h: height * 0.25 }
        ];
        
        gardenBeds.forEach(bed => {
            ctx.fillStyle = 'rgba(139, 69, 19, 0.4)';
            ctx.fillRect(bed.x, bed.y, bed.w, bed.h);
            
            // Dense marigold patches
            for (let i = 0; i < 12; i++) {
                const x = bed.x + Math.random() * bed.w;
                const y = bed.y + Math.random() * bed.h * 0.7;
                const size = width * (0.03 + Math.random() * 0.04);
                this.drawMarigoldFlower(ctx, x, y, size);
            }
        });
        
        // Marigold garlands hanging
        this.drawMarigoldGarland(ctx, width * 0.2, height * 0.25, width * 0.6);
        this.drawMarigoldGarland(ctx, width * 0.1, height * 0.45, width * 0.3);
        
        // Traditional goat (Dashain symbol) with flower garland
        this.drawDecoratedGoat(ctx, width * 0.15, height * 0.8, width * 0.08);
        
        // Jamara growing in pots
        this.drawJamaraPots(ctx, width * 0.85, height * 0.9, width * 0.12);
        
        // Lotus pond corner
        this.drawLotusPond(ctx, width * 0.05, height * 0.85, width * 0.15);
        
        // Traditional dhaka pattern decorative elements
        this.drawDhakaElements(ctx, width, height);
        
        // Flying traditional kites in distance
        this.drawDistantKites(ctx, width, height);
    }
    
    // New Tihar Templates
    renderDeepawaliBackground(ctx, width, height, isPreview = false) {
        // Festival night sky gradient
        const gradient = ctx.createLinearGradient(0, 0, 0, height);
        gradient.addColorStop(0, '#000428'); // Deep night blue
        gradient.addColorStop(0.3, '#004e92'); // Royal blue
        gradient.addColorStop(0.7, '#FF6B35'); // Warm orange glow
        gradient.addColorStop(1, '#2E1503'); // Dark brown ground
        
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, width, height);
        
        // Full moon (Tihar is lunar calendar based)
        this.drawFullMoon(ctx, width * 0.8, height * 0.2, width * 0.08);
        
        // Stars constellation
        this.drawStarConstellation(ctx, width, height);
        
        // Traditional Nepali houses with lit windows
        this.drawTiharHouse(ctx, width * 0.1, height * 0.5, width * 0.25, height * 0.5);
        this.drawTiharHouse(ctx, width * 0.65, height * 0.55, width * 0.3, height * 0.45);
        
        // String lights on houses (modern urban touch)
        this.drawFestivalStringLights(ctx, width * 0.1, height * 0.45, width * 0.25);
        this.drawFestivalStringLights(ctx, width * 0.65, height * 0.5, width * 0.3);
        
        // Multiple rangoli patterns (varying sizes and designs)
        this.drawDetailedRangoli(ctx, width * 0.3, height * 0.8, width * 0.12, 'flower');
        this.drawDetailedRangoli(ctx, width * 0.7, height * 0.85, width * 0.08, 'geometric');
        
        // Rows of diyas in traditional arrangements
        this.drawDiyaArrangement(ctx, width, height, 'mandala');
        this.drawDiyaArrangement(ctx, width * 0.15, height * 0.9, 'line');
        
        // Laxmi footprints leading to house entrance
        this.drawLaxmiFootprints(ctx, width * 0.5, height * 0.75, width * 0.25, height * 0.25);
        
        // Traditional oil lamps on window sills
        this.drawWindowLamps(ctx, width, height);
        
        // Sparklers/phooljhari effects
        this.drawSparklerEffects(ctx, width * 0.4, height * 0.3, width * 0.06);
        this.drawSparklerEffects(ctx, width * 0.85, height * 0.4, width * 0.04);
    }
    
    renderLakshmiPujaBackground(ctx, width, height, isPreview = false) {
        // Sacred evening gradient with warm glow
        const gradient = ctx.createLinearGradient(0, 0, 0, height);
        gradient.addColorStop(0, '#4A148C'); // Deep purple
        gradient.addColorStop(0.3, '#7B1FA2'); // Purple
        gradient.addColorStop(0.7, '#E91E63'); // Pink
        gradient.addColorStop(1, '#BF360C'); // Deep orange ground
        
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, width, height);
        
        // Sacred altar/puja area
        this.drawPujaAltar(ctx, width / 2, height * 0.8, width * 0.6);
        
        // Goddess Lakshmi silhouette (subtle, traditional)
        this.drawLakshmiSilhouette(ctx, width * 0.5, height * 0.3, width * 0.15);
        
        // Multiple lotus flowers (Lakshmi's symbol)
        this.drawSacredLotus(ctx, width * 0.2, height * 0.6, width * 0.08);
        this.drawSacredLotus(ctx, width * 0.8, height * 0.65, width * 0.06);
        this.drawSacredLotus(ctx, width * 0.15, height * 0.4, width * 0.05);
        
        // Golden coins scattered (wealth symbols)
        this.drawGoldenCoins(ctx, width, height, 8);
        
        // Sacred kalash with coconut and mango leaves
        this.drawSacredKalash(ctx, width * 0.3, height * 0.75, width * 0.08);
        this.drawSacredKalash(ctx, width * 0.7, height * 0.78, width * 0.06);
        
        // Decorated cow (Gai Tihar symbol)
        this.drawDecoratedCow(ctx, width * 0.15, height * 0.85, width * 0.12);
        
        // Traditional oil lamps around altar
        this.drawAltarDiyas(ctx, width / 2, height * 0.8, width * 0.3);
        
        // Money plant/prosperity symbols
        this.drawProsperityVines(ctx, width * 0.05, height * 0.2, width * 0.15, height * 0.6);
        this.drawProsperityVines(ctx, width * 0.9, height * 0.25, width * 0.1, height * 0.5);
        
        // Rangoli around altar
        this.drawAltarRangoli(ctx, width / 2, height * 0.9, width * 0.4);
    }
    
    renderDeusiBhailoBackground(ctx, width, height, isPreview = false) {
        // Evening celebration gradient
        const gradient = ctx.createLinearGradient(0, 0, 0, height);
        gradient.addColorStop(0, '#FF6B35'); // Warm orange
        gradient.addColorStop(0.3, '#F7931E'); // Golden orange
        gradient.addColorStop(0.7, '#DC143C'); // Crimson
        gradient.addColorStop(1, '#8B0000'); // Dark red ground
        
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, width, height);
        
        // Traditional Nepali house with courtyard
        this.drawTraditionalCourtyard(ctx, width * 0.6, height * 0.65, width * 0.35);
        
        // Deusi Bhailo group performance (silhouettes in traditional poses)
        this.drawDeusiBhailoGroup(ctx, width * 0.2, height * 0.7, width * 0.4);
        
        // Traditional musical instruments
        this.drawMadal(ctx, width * 0.15, height * 0.85, width * 0.06);
        this.drawSarangi(ctx, width * 0.85, height * 0.8, width * 0.05);
        this.drawBansuri(ctx, width * 0.05, height * 0.5, width * 0.03);
        
        // Musical notes and rhythm symbols
        this.drawMusicalRhythm(ctx, width, height);
        
        // Traditional oil lamps lighting the celebration
        this.drawCelebrationLamps(ctx, width, height);
        
        // Dogs with tika and garlands (Kukur Tihar)
        this.drawTiharDog(ctx, width * 0.8, height * 0.9, width * 0.08);
        
        // Crow on rooftop (Kag Tihar)
        this.drawTiharCrow(ctx, width * 0.7, height * 0.4, width * 0.04);
        
        // Brother-sister tika ceremony in background
        this.drawBhaiTikaCeremony(ctx, width * 0.85, height * 0.6, width * 0.12);
        
        // Traditional Nepali flag elements
        this.drawNepaliFlag(ctx, width * 0.05, height * 0.15, width * 0.08);
        
        // Confetti and celebration particles
        this.drawFestivalConfetti(ctx, width, height, '#FFD700');
    }
    
    // Combination Festival Templates
    renderUnityBackground(ctx, width, height, isPreview = false) {
        // Coral and teal gradient representing unity
        const gradient = ctx.createLinearGradient(0, 0, 0, height);
        gradient.addColorStop(0, '#FF6B6B'); // Coral
        gradient.addColorStop(0.3, '#4ECDC4'); // Teal
        gradient.addColorStop(0.7, '#45B7D1'); // Sky blue
        gradient.addColorStop(1, '#96CEB4'); // Mint green
        
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, width, height);
        
        // Central unity symbol (hands joined)
        this.drawUnitySymbol(ctx, width / 2, height * 0.4, width * 0.12);
        
        // Mixed festival elements
        // Dashain elements (left side)
        this.drawSimpleKite(ctx, width * 0.2, height * 0.3, width * 0.04, '#FF1744', '#FFC107', 0.2);
        this.drawMarigoldFlower(ctx, width * 0.15, height * 0.7, width * 0.06);
        
        // Tihar elements (right side)
        this.drawDiya(ctx, width * 0.8, height * 0.75, width * 0.025);
        this.drawDiya(ctx, width * 0.85, height * 0.8, width * 0.02);
        
        // Shared joy symbols
        ctx.fillStyle = '#FFD700';
        for (let i = 0; i < 15; i++) {
            const x = Math.random() * width;
            const y = Math.random() * height;
            const size = Math.random() * width * 0.008 + width * 0.005;
            
            ctx.beginPath();
            ctx.arc(x, y, size, 0, Math.PI * 2);
            ctx.fill();
        }
    }
    
    renderFestivalLightsBackground(ctx, width, height, isPreview = false) {
        // Golden and pink celebration gradient
        const gradient = ctx.createLinearGradient(0, 0, 0, height);
        gradient.addColorStop(0, '#FFD700'); // Gold
        gradient.addColorStop(0.3, '#FF69B4'); // Hot pink
        gradient.addColorStop(0.7, '#FF6347'); // Tomato
        gradient.addColorStop(1, '#FFA500'); // Orange
        
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, width, height);
        
        // String lights across the top
        this.drawStringLights(ctx, width, height * 0.15);
        
        // Mix of kites and diyas
        this.drawSimpleKite(ctx, width * 0.3, height * 0.25, width * 0.035, '#9C27B0', '#FFEB3B', -0.1);
        this.drawDiya(ctx, width * 0.4, height * 0.8, width * 0.03);
        this.drawDiya(ctx, width * 0.6, height * 0.85, width * 0.025);
        
        // Fireworks bursts
        this.drawFirework(ctx, width * 0.7, height * 0.3, width * 0.08);
        this.drawFirework(ctx, width * 0.2, height * 0.4, width * 0.06);
        
        // Celebration text area (subtle)
        ctx.fillStyle = 'rgba(255, 255, 255, 0.1)';
        ctx.fillRect(0, height * 0.5, width, height * 0.2);
    }
    
    // Helper drawing functions for new templates
    drawTempleStructure(ctx, x, y, width) {
        const templeWidth = width;
        const templeHeight = width * 0.8;
        
        // Main temple base
        ctx.beginPath();
        ctx.rect(x - templeWidth/2, y - templeHeight/2, templeWidth, templeHeight/2);
        ctx.fill();
        
        // Temple spire
        ctx.beginPath();
        ctx.moveTo(x, y - templeHeight/2 - width * 0.2);
        ctx.lineTo(x - templeWidth/4, y - templeHeight/2);
        ctx.lineTo(x + templeWidth/4, y - templeHeight/2);
        ctx.closePath();
        ctx.fill();
    }
    
    drawMarigoldFlower(ctx, x, y, size) {
        // Outer petals
        ctx.fillStyle = '#FFA500';
        for (let i = 0; i < 8; i++) {
            const angle = (i * Math.PI * 2) / 8;
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
        ctx.fillStyle = '#FF8C00';
        ctx.beginPath();
        ctx.arc(x, y, size * 0.3, 0, Math.PI * 2);
        ctx.fill();
    }
    
    drawDiya(ctx, x, y, size) {
        // Diya base
        ctx.fillStyle = '#8B4513';
        ctx.beginPath();
        ctx.ellipse(x, y, size * 1.2, size * 0.6, 0, 0, Math.PI * 2);
        ctx.fill();
        
        // Flame
        ctx.fillStyle = '#FF4500';
        ctx.beginPath();
        ctx.ellipse(x, y - size * 0.8, size * 0.3, size * 0.8, 0, 0, Math.PI * 2);
        ctx.fill();
        
        // Flame glow
        ctx.fillStyle = '#FFD700';
        ctx.beginPath();
        ctx.ellipse(x, y - size * 0.8, size * 0.15, size * 0.4, 0, 0, Math.PI * 2);
        ctx.fill();
    }
    
    drawUnitySymbol(ctx, x, y, size) {
        // Two hands joining
        ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
        
        // Left hand
        ctx.beginPath();
        ctx.ellipse(x - size * 0.3, y, size * 0.4, size * 0.2, -0.2, 0, Math.PI * 2);
        ctx.fill();
        
        // Right hand
        ctx.beginPath();
        ctx.ellipse(x + size * 0.3, y, size * 0.4, size * 0.2, 0.2, 0, Math.PI * 2);
        ctx.fill();
        
        // Connection/unity symbol
        ctx.strokeStyle = '#FFD700';
        ctx.lineWidth = 4;
        ctx.beginPath();
        ctx.arc(x, y, size * 0.6, 0, Math.PI * 2);
        ctx.stroke();
    }
    
    // Essential helper functions for authentic elements
    drawHimalayanRange(ctx, width, height) {
        ctx.fillStyle = 'rgba(70, 70, 70, 0.4)';
        ctx.beginPath();
        ctx.moveTo(0, height * 0.6);
        ctx.quadraticCurveTo(width * 0.2, height * 0.3, width * 0.4, height * 0.45);
        ctx.quadraticCurveTo(width * 0.6, height * 0.2, width * 0.8, height * 0.4);
        ctx.quadraticCurveTo(width * 0.9, height * 0.3, width, height * 0.5);
        ctx.lineTo(width, height);
        ctx.lineTo(0, height);
        ctx.closePath();
        ctx.fill();
    }
    
    drawPagodaTemple(ctx, x, y, size) {
        ctx.fillStyle = '#8B4513';
        // Temple base
        ctx.fillRect(x - size/2, y - size/3, size, size/2);
        
        // Pagoda roofs (multiple tiers)
        ctx.fillStyle = '#654321';
        for (let tier = 0; tier < 3; tier++) {
            const tierY = y - size/3 - tier * size/6;
            const tierWidth = size * (1 - tier * 0.2);
            
            ctx.beginPath();
            ctx.moveTo(x, tierY - size/8);
            ctx.lineTo(x - tierWidth/2, tierY);
            ctx.lineTo(x + tierWidth/2, tierY);
            ctx.closePath();
            ctx.fill();
        }
    }
    
    drawJamaraStalks(ctx, x, y, size) {
        ctx.strokeStyle = '#228B22';
        ctx.lineWidth = 3;
        
        for (let i = 0; i < 8; i++) {
            const offsetX = (i - 4) * size/8;
            const height = size + Math.random() * size/2;
            
            ctx.beginPath();
            ctx.moveTo(x + offsetX, y);
            ctx.lineTo(x + offsetX + Math.random() * 4 - 2, y - height);
            ctx.stroke();
        }
    }
    
    drawTikaPlate(ctx, x, y, size) {
        // Plate
        ctx.fillStyle = '#DAA520';
        ctx.beginPath();
        ctx.ellipse(x, y, size, size * 0.6, 0, 0, Math.PI * 2);
        ctx.fill();
        
        // Tika powder (red)
        ctx.fillStyle = '#DC143C';
        ctx.beginPath();
        ctx.ellipse(x - size * 0.3, y - size * 0.1, size * 0.25, size * 0.15, 0, 0, Math.PI * 2);
        ctx.fill();
        
        // Rice grains (white)
        ctx.fillStyle = '#FFFFFF';
        for (let i = 0; i < 10; i++) {
            const grainX = x + (Math.random() - 0.5) * size * 1.5;
            const grainY = y + (Math.random() - 0.5) * size * 0.8;
            ctx.fillRect(grainX, grainY, 2, 1);
        }
    }
    
    drawTraditionalSwing(ctx, x, y, size) {
        // Swing ropes
        ctx.strokeStyle = '#8B4513';
        ctx.lineWidth = 4;
        ctx.beginPath();
        ctx.moveTo(x - size * 0.5, y - size);
        ctx.lineTo(x - size * 0.3, y);
        ctx.moveTo(x + size * 0.5, y - size);
        ctx.lineTo(x + size * 0.3, y);
        ctx.stroke();
        
        // Swing seat
        ctx.fillStyle = '#654321';
        ctx.fillRect(x - size * 0.4, y, size * 0.8, size * 0.1);
        
        // Person on swing (silhouette)
        ctx.fillStyle = 'rgba(0, 0, 0, 0.6)';
        ctx.beginPath();
        ctx.arc(x, y - size * 0.15, size * 0.08, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillRect(x - size * 0.05, y - size * 0.1, size * 0.1, size * 0.2);
    }
    
    drawMadal(ctx, x, y, size) {
        // Drum body
        ctx.fillStyle = '#8B4513';
        ctx.beginPath();
        ctx.ellipse(x, y, size, size * 0.4, 0, 0, Math.PI * 2);
        ctx.fill();
        
        // Drum heads
        ctx.fillStyle = '#DEB887';
        ctx.beginPath();
        ctx.ellipse(x - size * 0.3, y, size * 0.25, size * 0.35, 0, 0, Math.PI * 2);
        ctx.fill();
        ctx.beginPath();
        ctx.ellipse(x + size * 0.3, y, size * 0.3, size * 0.4, 0, 0, Math.PI * 2);
        ctx.fill();
    }
    
    drawPrayerFlagString(ctx, x, y, width) {
        const flagColors = ['#FF6B6B', '#4ECDC4', '#FFD700', '#9C27B0', '#FF8C00'];
        const flagWidth = width / flagColors.length;
        
        for (let i = 0; i < flagColors.length; i++) {
            const flagX = x + (i * flagWidth);
            
            // Draw flag rope
            ctx.strokeStyle = '#8B4513';
            ctx.lineWidth = 2;
            ctx.beginPath();
            ctx.moveTo(flagX, y);
            ctx.lineTo(flagX + flagWidth, y);
            ctx.stroke();
            
            // Draw triangular flag
            ctx.fillStyle = flagColors[i];
            ctx.beginPath();
            ctx.moveTo(flagX, y);
            ctx.lineTo(flagX + flagWidth * 0.8, y + 15);
            ctx.lineTo(flagX, y + 30);
            ctx.closePath();
            ctx.fill();
        }
    }
    
    drawKhukuriAndGarland(ctx, x, y, size) {
        // Khukuri (curved knife)
        ctx.fillStyle = '#C0C0C0';
        ctx.beginPath();
        ctx.ellipse(x, y, size * 0.6, size * 0.1, Math.PI * 0.3, 0, Math.PI * 2);
        ctx.fill();
        
        // Handle
        ctx.fillStyle = '#8B4513';
        ctx.fillRect(x - size * 0.1, y + size * 0.3, size * 0.2, size * 0.4);
        
        // Garland around it
        for (let i = 0; i < 8; i++) {
            const angle = (i / 8) * Math.PI * 2;
            const flowerX = x + Math.cos(angle) * size * 0.8;
            const flowerY = y + Math.sin(angle) * size * 0.8;
            
            ctx.fillStyle = '#FFD700';
            ctx.beginPath();
            ctx.arc(flowerX, flowerY, size * 0.1, 0, Math.PI * 2);
            ctx.fill();
        }
    }
    
    drawTikaCeremony(ctx, x, y, size) {
        // Elder figure
        ctx.fillStyle = 'rgba(139, 69, 19, 0.7)';
        ctx.beginPath();
        ctx.arc(x - size * 0.3, y - size * 0.3, size * 0.2, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillRect(x - size * 0.4, y - size * 0.1, size * 0.2, size * 0.6);
        
        // Younger figure (kneeling)
        ctx.fillStyle = 'rgba(160, 82, 45, 0.7)';
        ctx.beginPath();
        ctx.arc(x + size * 0.2, y, size * 0.15, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillRect(x + size * 0.1, y + size * 0.15, size * 0.2, size * 0.4);
        
        // Tika (red mark)
        ctx.fillStyle = '#DC143C';
        ctx.beginPath();
        ctx.arc(x + size * 0.2, y - size * 0.05, size * 0.05, 0, Math.PI * 2);
        ctx.fill();
    }
    
    drawDhakaPatternBorder(ctx, width, height, color) {
        const borderWidth = 20;
        ctx.fillStyle = color;
        
        // Top border with geometric pattern
        for (let i = 0; i < width; i += 30) {
            ctx.beginPath();
            ctx.moveTo(i, 0);
            ctx.lineTo(i + 15, borderWidth);
            ctx.lineTo(i + 30, 0);
            ctx.closePath();
            ctx.fill();
        }
        
        // Bottom border
        for (let i = 0; i < width; i += 30) {
            ctx.beginPath();
            ctx.moveTo(i, height);
            ctx.lineTo(i + 15, height - borderWidth);
            ctx.lineTo(i + 30, height);
            ctx.closePath();
            ctx.fill();
        }
        
        // Side borders
        ctx.fillRect(0, 0, borderWidth, height);
        ctx.fillRect(width - borderWidth, 0, borderWidth, height);
    }
    
    drawDistantMountains(ctx, width, height) {
        const mountainPeaks = [
            { x: 0, y: height * 0.6 },
            { x: width * 0.2, y: height * 0.3 },
            { x: width * 0.4, y: height * 0.5 },
            { x: width * 0.6, y: height * 0.2 },
            { x: width * 0.8, y: height * 0.4 },
            { x: width, y: height * 0.6 }
        ];
        
        ctx.fillStyle = 'rgba(105, 105, 105, 0.6)';
        ctx.beginPath();
        ctx.moveTo(0, height);
        mountainPeaks.forEach(peak => {
            ctx.lineTo(peak.x, peak.y);
        });
        ctx.lineTo(width, height);
        ctx.closePath();
        ctx.fill();
    }
    
    drawNepaliFestivalHouse(ctx, x, y, size) {
        // House base
        ctx.fillStyle = '#8B4513';
        ctx.fillRect(x - size * 0.5, y, size, size * 0.6);
        
        // Traditional sloped roof
        ctx.fillStyle = '#CD853F';
        ctx.beginPath();
        ctx.moveTo(x - size * 0.6, y);
        ctx.lineTo(x, y - size * 0.4);
        ctx.lineTo(x + size * 0.5, y);
        ctx.closePath();
        ctx.fill();
        
        // Door and windows
        ctx.fillStyle = '#654321';
        ctx.fillRect(x - size * 0.1, y + size * 0.2, size * 0.2, size * 0.4);
        
        // Window decorations
        ctx.fillStyle = '#FFD700';
        ctx.fillRect(x - size * 0.4, y + size * 0.15, size * 0.15, size * 0.15);
        ctx.fillRect(x + size * 0.25, y + size * 0.15, size * 0.15, size * 0.15);
        
        // Marigold garlands
        for (let i = 0; i < 5; i++) {
            ctx.fillStyle = '#FFA500';
            ctx.beginPath();
            ctx.arc(x - size * 0.4 + (i * size * 0.2), y - size * 0.1, size * 0.03, 0, Math.PI * 2);
            ctx.fill();
        }
    }
    
    drawMarigoldGarland(ctx, x, y, width) {
        const flowerCount = Math.floor(width / 20);
        for (let i = 0; i < flowerCount; i++) {
            const flowerX = x + (i * (width / flowerCount));
            ctx.fillStyle = '#FFA500';
            ctx.beginPath();
            ctx.arc(flowerX, y, 8, 0, Math.PI * 2);
            ctx.fill();
            
            ctx.fillStyle = '#FFD700';
            ctx.beginPath();
            ctx.arc(flowerX, y, 5, 0, Math.PI * 2);
            ctx.fill();
        }
    }
    
    drawDecoratedGoat(ctx, x, y, size) {
        ctx.fillStyle = '#F5F5DC';
        ctx.beginPath();
        ctx.ellipse(x, y, size * 0.6, size * 0.4, 0, 0, Math.PI * 2);
        ctx.fill();
        
        ctx.fillStyle = '#8B4513';
        ctx.beginPath();
        ctx.arc(x - size * 0.3, y - size * 0.2, size * 0.15, 0, Math.PI * 2);
        ctx.fill();
        
        ctx.fillStyle = '#FFD700';
        for (let i = 0; i < 3; i++) {
            ctx.beginPath();
            ctx.arc(x - size * 0.2 + (i * size * 0.2), y - size * 0.4, size * 0.05, 0, Math.PI * 2);
            ctx.fill();
        }
    }
    
    drawJamaraPots(ctx, x, y, size) {
        for (let i = 0; i < 3; i++) {
            const potX = x + (i * size * 0.4);
            
            ctx.fillStyle = '#CD853F';
            ctx.fillRect(potX - size * 0.15, y, size * 0.3, size * 0.4);
            
            ctx.fillStyle = '#228B22';
            for (let j = 0; j < 8; j++) {
                const grassX = potX - size * 0.1 + (j * size * 0.025);
                const grassHeight = size * 0.3 + Math.random() * size * 0.2;
                ctx.fillRect(grassX, y - grassHeight, 2, grassHeight);
            }
        }
    }
    
    drawLotusPond(ctx, x, y, size) {
        ctx.fillStyle = 'rgba(70, 130, 180, 0.6)';
        ctx.beginPath();
        ctx.ellipse(x, y, size * 0.8, size * 0.6, 0, 0, Math.PI * 2);
        ctx.fill();
        
        for (let i = 0; i < 4; i++) {
            const angle = (i / 4) * Math.PI * 2;
            const lotusX = x + Math.cos(angle) * size * 0.4;
            const lotusY = y + Math.sin(angle) * size * 0.3;
            
            ctx.fillStyle = '#FFB6C1';
            ctx.beginPath();
            ctx.arc(lotusX, lotusY, size * 0.08, 0, Math.PI * 2);
            ctx.fill();
        }
    }
    
    drawDhakaElements(ctx, width, height) {
        const patterns = 8;
        for (let i = 0; i < patterns; i++) {
            const x = (i / patterns) * width;
            const y = height * 0.95;
            
            ctx.fillStyle = '#DC143C';
            ctx.beginPath();
            ctx.moveTo(x, y);
            ctx.lineTo(x + 15, y - 10);
            ctx.lineTo(x + 30, y);
            ctx.closePath();
            ctx.fill();
        }
    }
    
    drawDistantKites(ctx, width, height) {
        const kitePositions = [
            { x: width * 0.1, y: height * 0.15, size: 8, color: '#FF6B6B' },
            { x: width * 0.3, y: height * 0.1, size: 6, color: '#4ECDC4' },
            { x: width * 0.7, y: height * 0.12, size: 7, color: '#FFD700' },
            { x: width * 0.9, y: height * 0.18, size: 5, color: '#9C27B0' }
        ];
        
        kitePositions.forEach(kite => {
            ctx.fillStyle = kite.color;
            ctx.beginPath();
            ctx.moveTo(kite.x, kite.y - kite.size);
            ctx.lineTo(kite.x - kite.size * 0.7, kite.y);
            ctx.lineTo(kite.x, kite.y + kite.size);
            ctx.lineTo(kite.x + kite.size * 0.7, kite.y);
            ctx.closePath();
            ctx.fill();
        });
    }
    
    drawTiharHouse(ctx, x, y, width, height) {
        ctx.fillStyle = '#8B4513';
        ctx.fillRect(x, y, width, height);
        
        ctx.fillStyle = '#CD853F';
        ctx.beginPath();
        ctx.moveTo(x - width * 0.1, y);
        ctx.lineTo(x + width * 0.5, y - height * 0.3);
        ctx.lineTo(x + width * 1.1, y);
        ctx.closePath();
        ctx.fill();
        
        ctx.fillStyle = '#FFD700';
        for (let i = 0; i < 3; i++) {
            for (let j = 0; j < 2; j++) {
                const lightX = x + width * 0.2 + (i * width * 0.25);
                const lightY = y + height * 0.2 + (j * height * 0.3);
                ctx.beginPath();
                ctx.arc(lightX, lightY, 3, 0, Math.PI * 2);
                ctx.fill();
            }
        }
    }
    
    drawFestivalStringLights(ctx, x, y, width) {
        ctx.strokeStyle = '#8B4513';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(x, y);
        ctx.quadraticCurveTo(x + width * 0.5, y + 20, x + width, y);
        ctx.stroke();
        
        const lightColors = ['#FFD700', '#FF6B6B', '#4ECDC4', '#9C27B0'];
        const lightCount = 6;
        
        for (let i = 0; i < lightCount; i++) {
            const t = i / (lightCount - 1);
            const lightX = x + t * width;
            const lightY = y + 20 * Math.sin(Math.PI * t);
            
            ctx.fillStyle = lightColors[i % lightColors.length];
            ctx.beginPath();
            ctx.arc(lightX, lightY, 4, 0, Math.PI * 2);
            ctx.fill();
        }
    }
    
    drawDetailedRangoli(ctx, x, y, size, type) {
        const colors = ['#FF6B6B', '#FFD700', '#4ECDC4', '#9C27B0', '#FF8C00'];
        
        if (type === 'flower') {
            for (let ring = 0; ring < 3; ring++) {
                const petals = 8;
                for (let i = 0; i < petals; i++) {
                    const angle = (i / petals) * Math.PI * 2;
                    const petalX = x + Math.cos(angle) * size * (0.3 + ring * 0.2);
                    const petalY = y + Math.sin(angle) * size * (0.3 + ring * 0.2);
                    
                    ctx.fillStyle = colors[ring];
                    ctx.beginPath();
                    ctx.arc(petalX, petalY, size * 0.1, 0, Math.PI * 2);
                    ctx.fill();
                }
            }
        } else {
            for (let ring = 0; ring < 4; ring++) {
                const sides = 6;
                ctx.strokeStyle = colors[ring];
                ctx.lineWidth = 3;
                ctx.beginPath();
                for (let i = 0; i <= sides; i++) {
                    const angle = (i / sides) * Math.PI * 2;
                    const pointX = x + Math.cos(angle) * size * (0.2 + ring * 0.15);
                    const pointY = y + Math.sin(angle) * size * (0.2 + ring * 0.15);
                    if (i === 0) ctx.moveTo(pointX, pointY);
                    else ctx.lineTo(pointX, pointY);
                }
                ctx.stroke();
            }
        }
    }
    
    drawLaxmiFootprints(ctx, x, y, width, height) {
        const footprintCount = 6;
        for (let i = 0; i < footprintCount; i++) {
            const footX = x + (i % 2) * width * 0.3 + (Math.floor(i / 2) * width * 0.2);
            const footY = y + (Math.floor(i / 2) * height * 0.15);
            
            ctx.fillStyle = '#DC143C';
            ctx.beginPath();
            ctx.ellipse(footX, footY, width * 0.04, height * 0.06, 0, 0, Math.PI * 2);
            ctx.fill();
            
            for (let toe = 0; toe < 5; toe++) {
                const toeX = footX - width * 0.02 + (toe * width * 0.01);
                const toeY = footY - height * 0.03;
                ctx.beginPath();
                ctx.arc(toeX, toeY, 2, 0, Math.PI * 2);
                ctx.fill();
            }
        }
    }
    
    drawWindowLamps(ctx, width, height) {
        const lampPositions = [
            { x: width * 0.15, y: height * 0.3 },
            { x: width * 0.35, y: height * 0.35 },
            { x: width * 0.65, y: height * 0.32 },
            { x: width * 0.85, y: height * 0.28 }
        ];
        
        lampPositions.forEach(lamp => {
            ctx.fillStyle = '#FFD700';
            ctx.beginPath();
            ctx.arc(lamp.x, lamp.y, 5, 0, Math.PI * 2);
            ctx.fill();
            
            ctx.fillStyle = 'rgba(255, 215, 0, 0.3)';
            ctx.beginPath();
            ctx.arc(lamp.x, lamp.y, 12, 0, Math.PI * 2);
            ctx.fill();
        });
    }
    
    drawSparklerEffects(ctx, x, y, size) {
        const sparkCount = 12;
        for (let i = 0; i < sparkCount; i++) {
            const angle = (i / sparkCount) * Math.PI * 2;
            const sparkX = x + Math.cos(angle) * size * (0.5 + Math.random() * 0.5);
            const sparkY = y + Math.sin(angle) * size * (0.5 + Math.random() * 0.5);
            
            ctx.fillStyle = ['#FFD700', '#FFFFFF', '#FFA500'][Math.floor(Math.random() * 3)];
            ctx.beginPath();
            ctx.arc(sparkX, sparkY, 1 + Math.random() * 2, 0, Math.PI * 2);
            ctx.fill();
        }
    }
    
    drawPujaAltar(ctx, x, y, width) {
        ctx.fillStyle = '#8B4513';
        ctx.fillRect(x - width * 0.5, y, width, width * 0.2);
        
        ctx.fillStyle = '#FFD700';
        ctx.fillRect(x - width * 0.4, y - width * 0.05, width * 0.8, width * 0.05);
        
        for (let i = 0; i < 5; i++) {
            const itemX = x - width * 0.3 + (i * width * 0.15);
            const itemY = y - width * 0.1;
            
            ctx.fillStyle = '#FF6B6B';
            ctx.beginPath();
            ctx.arc(itemX, itemY, width * 0.03, 0, Math.PI * 2);
            ctx.fill();
        }
    }
    
    drawLakshmiSilhouette(ctx, x, y, size) {
        ctx.fillStyle = 'rgba(255, 215, 0, 0.7)';
        
        ctx.beginPath();
        ctx.arc(x, y - size * 0.3, size * 0.2, 0, Math.PI * 2);
        ctx.fill();
        
        ctx.fillRect(x - size * 0.15, y - size * 0.1, size * 0.3, size * 0.6);
        
        ctx.fillStyle = '#FFD700';
        for (let i = 0; i < 4; i++) {
            const lotusX = x - size * 0.3 + (i * size * 0.2);
            const lotusY = y + size * 0.6;
            ctx.beginPath();
            ctx.arc(lotusX, lotusY, size * 0.05, 0, Math.PI * 2);
            ctx.fill();
        }
    }
    
    drawSacredLotus(ctx, x, y, size) {
        const petalCount = 8;
        for (let i = 0; i < petalCount; i++) {
            const angle = (i / petalCount) * Math.PI * 2;
            const petalX = x + Math.cos(angle) * size * 0.6;
            const petalY = y + Math.sin(angle) * size * 0.6;
            
            ctx.fillStyle = '#FFB6C1';
            ctx.beginPath();
            ctx.ellipse(petalX, petalY, size * 0.3, size * 0.15, angle, 0, Math.PI * 2);
            ctx.fill();
        }
        
        ctx.fillStyle = '#FFD700';
        ctx.beginPath();
        ctx.arc(x, y, size * 0.2, 0, Math.PI * 2);
        ctx.fill();
    }
    
    drawGoldenCoins(ctx, width, height, count) {
        for (let i = 0; i < count; i++) {
            const coinX = Math.random() * width;
            const coinY = height * 0.7 + Math.random() * height * 0.2;
            
            ctx.fillStyle = '#FFD700';
            ctx.beginPath();
            ctx.arc(coinX, coinY, 8, 0, Math.PI * 2);
            ctx.fill();
            
            ctx.strokeStyle = '#FFA500';
            ctx.lineWidth = 2;
            ctx.stroke();
        }
    }
    
    drawSacredKalash(ctx, x, y, size) {
        ctx.fillStyle = '#B8860B';
        ctx.beginPath();
        ctx.arc(x, y + size * 0.2, size * 0.4, 0, Math.PI * 2);
        ctx.fill();
        
        ctx.fillStyle = '#DAA520';
        ctx.fillRect(x - size * 0.2, y - size * 0.2, size * 0.4, size * 0.4);
        
        ctx.fillStyle = '#228B22';
        for (let i = 0; i < 5; i++) {
            const leafX = x - size * 0.15 + (i * size * 0.075);
            const leafY = y - size * 0.4;
            ctx.beginPath();
            ctx.ellipse(leafX, leafY, size * 0.03, size * 0.08, 0, 0, Math.PI * 2);
            ctx.fill();
        }
    }
    
    drawDecoratedCow(ctx, x, y, size) {
        ctx.fillStyle = '#F5F5DC';
        ctx.beginPath();
        ctx.ellipse(x, y, size * 0.7, size * 0.4, 0, 0, Math.PI * 2);
        ctx.fill();
        
        ctx.fillStyle = '#8B4513';
        ctx.beginPath();
        ctx.arc(x - size * 0.5, y - size * 0.1, size * 0.15, 0, Math.PI * 2);
        ctx.fill();
        
        ctx.fillStyle = '#FFD700';
        for (let i = 0; i < 5; i++) {
            const garlandX = x - size * 0.3 + (i * size * 0.15);
            const garlandY = y - size * 0.2;
            ctx.beginPath();
            ctx.arc(garlandX, garlandY, size * 0.04, 0, Math.PI * 2);
            ctx.fill();
        }
    }
    
    drawAltarDiyas(ctx, x, y, width) {
        const diyaCount = 7;
        for (let i = 0; i < diyaCount; i++) {
            const diyaX = x - width * 0.5 + (i * width / (diyaCount - 1));
            
            ctx.fillStyle = '#CD853F';
            ctx.beginPath();
            ctx.arc(diyaX, y, 8, 0, Math.PI * 2);
            ctx.fill();
            
            ctx.fillStyle = '#FFD700';
            ctx.beginPath();
            ctx.ellipse(diyaX, y - 3, 3, 8, 0, 0, Math.PI * 2);
            ctx.fill();
        }
    }
    
    drawProsperityVines(ctx, x, y, width, height) {
        ctx.strokeStyle = '#228B22';
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.moveTo(x, y);
        
        const segments = 8;
        for (let i = 1; i <= segments; i++) {
            const segmentY = y + (i / segments) * height;
            const curve = Math.sin((i / segments) * Math.PI * 4) * width * 0.3;
            ctx.quadraticCurveTo(x + curve, segmentY - height / segments * 0.5, x, segmentY);
        }
        ctx.stroke();
        
        for (let i = 0; i < 6; i++) {
            const leafY = y + (i / 5) * height;
            const leafX = x + Math.sin((i / 5) * Math.PI * 4) * width * 0.3;
            
            ctx.fillStyle = '#32CD32';
            ctx.beginPath();
            ctx.ellipse(leafX, leafY, width * 0.05, width * 0.08, 0, 0, Math.PI * 2);
            ctx.fill();
        }
    }
    
    drawAltarRangoli(ctx, x, y, width) {
        const colors = ['#FF6B6B', '#FFD700', '#4ECDC4', '#9C27B0'];
        const rings = 4;
        
        for (let ring = 0; ring < rings; ring++) {
            const radius = (width / 2) * (ring + 1) / rings;
            const petals = 8 + ring * 4;
            
            ctx.fillStyle = colors[ring];
            for (let i = 0; i < petals; i++) {
                const angle = (i / petals) * Math.PI * 2;
                const petalX = x + Math.cos(angle) * radius;
                const petalY = y + Math.sin(angle) * radius;
                
                ctx.beginPath();
                ctx.arc(petalX, petalY, width * 0.02, 0, Math.PI * 2);
                ctx.fill();
            }
        }
    }
    
    drawTraditionalCourtyard(ctx, x, y, width) {
        ctx.fillStyle = '#DEB887';
        ctx.fillRect(x - width * 0.5, y, width, width * 0.6);
        
        ctx.strokeStyle = '#8B4513';
        ctx.lineWidth = 2;
        const gridSize = width / 8;
        for (let i = 0; i <= 8; i++) {
            ctx.beginPath();
            ctx.moveTo(x - width * 0.5 + i * gridSize, y);
            ctx.lineTo(x - width * 0.5 + i * gridSize, y + width * 0.6);
            ctx.stroke();
            
            ctx.beginPath();
            ctx.moveTo(x - width * 0.5, y + i * gridSize * 0.6);
            ctx.lineTo(x + width * 0.5, y + i * gridSize * 0.6);
            ctx.stroke();
        }
        
        ctx.fillStyle = '#FFD700';
        for (let i = 0; i < 12; i++) {
            const flowerX = x - width * 0.4 + Math.random() * width * 0.8;
            const flowerY = y + Math.random() * width * 0.6;
            ctx.beginPath();
            ctx.arc(flowerX, flowerY, 3, 0, Math.PI * 2);
            ctx.fill();
        }
    }
    
    drawDeusiBhailoGroup(ctx, x, y, width) {
        const colors = ['#FF6B6B', '#4ECDC4', '#FFD700'];
        for (let i = 0; i < 4; i++) {
            const personX = x + (i * width * 0.25);
            const personY = y + Math.sin(i * 0.5) * 10;
            
            ctx.fillStyle = colors[i % colors.length];
            ctx.beginPath();
            ctx.arc(personX, personY - 20, 8, 0, Math.PI * 2);
            ctx.fill();
            
            ctx.fillRect(personX - 6, personY - 12, 12, 25);
            
            ctx.strokeStyle = '#8B4513';
            ctx.lineWidth = 2;
            ctx.beginPath();
            ctx.moveTo(personX, personY + 13);
            ctx.lineTo(personX - 5, personY + 25);
            ctx.moveTo(personX, personY + 13);
            ctx.lineTo(personX + 5, personY + 25);
            ctx.stroke();
        }
    }
    
    drawSarangi(ctx, x, y, size) {
        ctx.fillStyle = '#8B4513';
        ctx.fillRect(x - size * 0.4, y - size * 0.6, size * 0.8, size * 1.2);
        
        ctx.fillStyle = '#654321';
        ctx.beginPath();
        ctx.ellipse(x, y - size * 0.2, size * 0.35, size * 0.5, 0, 0, Math.PI * 2);
        ctx.fill();
        
        ctx.strokeStyle = '#DDD';
        ctx.lineWidth = 1;
        for (let i = 0; i < 4; i++) {
            const stringY = y - size * 0.5 + (i * size * 0.25);
            ctx.beginPath();
            ctx.moveTo(x - size * 0.3, stringY);
            ctx.lineTo(x + size * 0.3, stringY);
            ctx.stroke();
        }
    }
    
    drawBansuri(ctx, x, y, size) {
        ctx.fillStyle = '#D2691E';
        ctx.fillRect(x - size * 0.1, y - size, size * 0.2, size * 2);
        
        ctx.fillStyle = '#8B4513';
        for (let i = 0; i < 6; i++) {
            const holeY = y - size * 0.7 + (i * size * 0.25);
            ctx.beginPath();
            ctx.arc(x, holeY, size * 0.05, 0, Math.PI * 2);
            ctx.fill();
        }
    }
    
    drawMusicalRhythm(ctx, width, height) {
        const notes = ['♪', '♫', '♬'];
        for (let i = 0; i < 12; i++) {
            const noteX = Math.random() * width;
            const noteY = height * 0.2 + Math.random() * height * 0.3;
            
            ctx.fillStyle = `rgba(255, 215, 0, ${0.5 + Math.random() * 0.5})`;
            ctx.font = `${16 + Math.random() * 8}px serif`;
            ctx.fillText(notes[Math.floor(Math.random() * notes.length)], noteX, noteY);
        }
    }
    
    drawCelebrationLamps(ctx, width, height) {
        const lampPositions = [
            { x: width * 0.1, y: height * 0.4 },
            { x: width * 0.3, y: height * 0.45 },
            { x: width * 0.5, y: height * 0.42 },
            { x: width * 0.7, y: height * 0.47 },
            { x: width * 0.9, y: height * 0.44 }
        ];
        
        lampPositions.forEach(lamp => {
            ctx.fillStyle = '#CD853F';
            ctx.beginPath();
            ctx.arc(lamp.x, lamp.y, 6, 0, Math.PI * 2);
            ctx.fill();
            
            ctx.fillStyle = '#FFD700';
            ctx.beginPath();
            ctx.ellipse(lamp.x, lamp.y - 4, 3, 10, 0, 0, Math.PI * 2);
            ctx.fill();
            
            ctx.fillStyle = 'rgba(255, 215, 0, 0.4)';
            ctx.beginPath();
            ctx.arc(lamp.x, lamp.y, 15, 0, Math.PI * 2);
            ctx.fill();
        });
    }
    
    drawTiharDog(ctx, x, y, size) {
        ctx.fillStyle = '#8B4513';
        ctx.beginPath();
        ctx.ellipse(x, y, size * 0.7, size * 0.4, 0, 0, Math.PI * 2);
        ctx.fill();
        
        ctx.beginPath();
        ctx.arc(x - size * 0.4, y - size * 0.2, size * 0.3, 0, Math.PI * 2);
        ctx.fill();
        
        ctx.fillStyle = '#FFD700';
        for (let i = 0; i < 5; i++) {
            const garlandX = x - size * 0.3 + (i * size * 0.15);
            const garlandY = y - size * 0.3;
            ctx.beginPath();
            ctx.arc(garlandX, garlandY, size * 0.05, 0, Math.PI * 2);
            ctx.fill();
        }
        
        ctx.fillStyle = '#DC143C';
        ctx.beginPath();
        ctx.arc(x - size * 0.4, y - size * 0.3, size * 0.08, 0, Math.PI * 2);
        ctx.fill();
    }
    
    drawTiharCrow(ctx, x, y, size) {
        ctx.fillStyle = '#000';
        ctx.beginPath();
        ctx.ellipse(x, y, size * 0.8, size * 0.4, 0, 0, Math.PI * 2);
        ctx.fill();
        
        ctx.beginPath();
        ctx.arc(x - size * 0.5, y - size * 0.1, size * 0.3, 0, Math.PI * 2);
        ctx.fill();
        
        ctx.fillStyle = '#FFA500';
        ctx.beginPath();
        ctx.moveTo(x - size * 0.7, y - size * 0.05);
        ctx.lineTo(x - size * 0.9, y - size * 0.1);
        ctx.lineTo(x - size * 0.7, y - size * 0.15);
        ctx.closePath();
        ctx.fill();
    }
    
    drawBhaiTikaCeremony(ctx, x, y, size) {
        ctx.fillStyle = 'rgba(139, 69, 19, 0.7)';
        ctx.beginPath();
        ctx.arc(x - size * 0.3, y - size * 0.3, size * 0.15, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillRect(x - size * 0.35, y - size * 0.15, size * 0.1, size * 0.4);
        
        ctx.fillStyle = 'rgba(160, 82, 45, 0.7)';
        ctx.beginPath();
        ctx.arc(x + size * 0.2, y - size * 0.2, size * 0.12, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillRect(x + size * 0.15, y - size * 0.08, size * 0.1, size * 0.3);
        
        ctx.fillStyle = '#DC143C';
        ctx.beginPath();
        ctx.arc(x + size * 0.2, y - size * 0.25, size * 0.04, 0, Math.PI * 2);
        ctx.fill();
        
        ctx.fillStyle = '#FFD700';
        for (let i = 0; i < 3; i++) {
            const garlandX = x - size * 0.2 + (i * size * 0.2);
            const garlandY = y + size * 0.1;
            ctx.beginPath();
            ctx.arc(garlandX, garlandY, size * 0.03, 0, Math.PI * 2);
            ctx.fill();
        }
    }
    
    drawNepaliFlag(ctx, x, y, size) {
        ctx.fillStyle = '#DC143C';
        ctx.beginPath();
        ctx.moveTo(x, y);
        ctx.lineTo(x + size * 0.8, y + size * 0.3);
        ctx.lineTo(x, y + size * 0.6);
        ctx.closePath();
        ctx.fill();
        
        ctx.beginPath();
        ctx.moveTo(x, y + size * 0.6);
        ctx.lineTo(x + size * 0.6, y + size * 0.8);
        ctx.lineTo(x, y + size);
        ctx.closePath();
        ctx.fill();
        
        ctx.fillStyle = '#003893';
        ctx.strokeStyle = '#003893';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.arc(x + size * 0.25, y + size * 0.2, size * 0.08, 0, Math.PI * 2);
        ctx.stroke();
        
        for (let i = 0; i < 12; i++) {
            const angle = (i / 12) * Math.PI * 2;
            const rayX = x + size * 0.25 + Math.cos(angle) * size * 0.15;
            const rayY = y + size * 0.6 + Math.sin(angle) * size * 0.1;
            ctx.beginPath();
            ctx.moveTo(x + size * 0.25, y + size * 0.6);
            ctx.lineTo(rayX, rayY);
            ctx.stroke();
        }
    }
    
    drawFestivalConfetti(ctx, width, height, baseColor) {
        for (let i = 0; i < 25; i++) {
            const confettiX = Math.random() * width;
            const confettiY = Math.random() * height;
            const size = 2 + Math.random() * 4;
            
            const colors = [baseColor, '#FF6B6B', '#4ECDC4', '#9C27B0', '#FF8C00'];
            ctx.fillStyle = colors[Math.floor(Math.random() * colors.length)];
            
            ctx.save();
            ctx.translate(confettiX, confettiY);
            ctx.rotate(Math.random() * Math.PI * 2);
            ctx.fillRect(-size/2, -size/2, size, size);
            ctx.restore();
        }
    }
    
    drawStarConstellation(ctx, width, height) {
        // Create a beautiful star constellation pattern
        const constellations = [
            // Big Dipper-like pattern
            [
                { x: width * 0.15, y: height * 0.15 },
                { x: width * 0.2, y: height * 0.18 },
                { x: width * 0.25, y: height * 0.16 },
                { x: width * 0.3, y: height * 0.14 },
                { x: width * 0.32, y: height * 0.2 },
                { x: width * 0.28, y: height * 0.25 },
                { x: width * 0.22, y: height * 0.23 }
            ],
            // Southern Cross-like pattern
            [
                { x: width * 0.7, y: height * 0.12 },
                { x: width * 0.75, y: height * 0.08 },
                { x: width * 0.8, y: height * 0.15 },
                { x: width * 0.72, y: height * 0.2 },
                { x: width * 0.77, y: height * 0.16 }
            ]
        ];
        
        // Draw constellation lines
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.4)';
        ctx.lineWidth = 1;
        
        constellations.forEach(constellation => {
            ctx.beginPath();
            constellation.forEach((star, index) => {
                if (index === 0) {
                    ctx.moveTo(star.x, star.y);
                } else {
                    ctx.lineTo(star.x, star.y);
                }
            });
            ctx.stroke();
        });
        
        // Draw constellation stars (brighter)
        ctx.fillStyle = '#FFFFFF';
        constellations.forEach(constellation => {
            constellation.forEach(star => {
                ctx.beginPath();
                ctx.arc(star.x, star.y, 2, 0, Math.PI * 2);
                ctx.fill();
                
                // Add star glow
                ctx.fillStyle = 'rgba(255, 255, 255, 0.3)';
                ctx.beginPath();
                ctx.arc(star.x, star.y, 4, 0, Math.PI * 2);
                ctx.fill();
                ctx.fillStyle = '#FFFFFF';
            });
        });
        
        // Add scattered individual stars
        for (let i = 0; i < 20; i++) {
            const starX = Math.random() * width;
            const starY = Math.random() * (height * 0.4); // Keep stars in upper portion
            const starSize = 0.5 + Math.random() * 1.5;
            const brightness = 0.5 + Math.random() * 0.5;
            
            ctx.fillStyle = `rgba(255, 255, 255, ${brightness})`;
            ctx.beginPath();
            ctx.arc(starX, starY, starSize, 0, Math.PI * 2);
            ctx.fill();
        }
    }
    
    drawStringLights(ctx, width, height) {
        // Reduced to 2 light strings for minimalistic approach
        const stringCount = 2;
        const lightColors = ['#FFD700', '#FF6B6B', '#4ECDC4', '#9C27B0'];
        
        for (let string = 0; string < stringCount; string++) {
            const stringY = height + (string * height * 0.2);
            const sag = 12 + string * 8; // Gentler sag for cleaner look
            
            // Draw the string/wire (thinner and more subtle)
            ctx.strokeStyle = 'rgba(139, 69, 19, 0.4)';
            ctx.lineWidth = 1.5;
            ctx.beginPath();
            ctx.moveTo(0, stringY);
            ctx.quadraticCurveTo(width / 2, stringY + sag, width, stringY);
            ctx.stroke();
            
            // Draw lights along the string (fewer lights per string)
            const lightCount = 5 + string; // Only 5-6 lights per string
            for (let i = 0; i <= lightCount; i++) {
                const t = i / lightCount;
                // Calculate position along the curve
                const lightX = t * width;
                const lightY = stringY + sag * 4 * t * (1 - t); // Parabolic curve
                
                // Light bulb body (slightly larger for better visibility with fewer lights)
                ctx.fillStyle = lightColors[i % lightColors.length];
                ctx.beginPath();
                ctx.arc(lightX, lightY, 5, 0, Math.PI * 2);
                ctx.fill();
                
                // Enhanced glow effect for quality
                ctx.fillStyle = `rgba(255, 215, 0, 0.25)`;
                ctx.beginPath();
                ctx.arc(lightX, lightY, 10, 0, Math.PI * 2);
                ctx.fill();
                
                // Light reflection/highlight (more prominent)
                ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
                ctx.beginPath();
                ctx.arc(lightX - 1.5, lightY - 1.5, 2, 0, Math.PI * 2);
                ctx.fill();
            }
        }
        
        // Reduced hanging elements (only 3 instead of 5)
        for (let i = 0; i < 3; i++) {
            const hangX = (i + 1) * (width / 4);
            const hangY = height + 20;
            
            // Small decorative hanging element (slightly larger for better quality)
            ctx.fillStyle = '#FFD700';
            ctx.beginPath();
            ctx.arc(hangX, hangY + 10, 4, 0, Math.PI * 2);
            ctx.fill();
            
            // Hanging string
            ctx.strokeStyle = 'rgba(139, 69, 19, 0.3)';
            ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.moveTo(hangX, hangY);
            ctx.lineTo(hangX, hangY + 8);
            ctx.stroke();
        }
    }
    
    drawDiyaArrangement(ctx, x, y, arrangement) {
        if (arrangement === 'mandala') {
            // Circular mandala arrangement of diyas
            const rings = 3;
            const center = { x: x * 0.5, y: y * 0.7 };
            
            for (let ring = 0; ring < rings; ring++) {
                const radius = (ring + 1) * 40;
                const diyaCount = 6 + ring * 4;
                
                for (let i = 0; i < diyaCount; i++) {
                    const angle = (i / diyaCount) * Math.PI * 2;
                    const diyaX = center.x + Math.cos(angle) * radius;
                    const diyaY = center.y + Math.sin(angle) * radius;
                    
                    // Draw diya
                    ctx.fillStyle = '#CD853F';
                    ctx.beginPath();
                    ctx.arc(diyaX, diyaY, 6, 0, Math.PI * 2);
                    ctx.fill();
                    
                    // Draw flame
                    ctx.fillStyle = '#FFD700';
                    ctx.beginPath();
                    ctx.ellipse(diyaX, diyaY - 4, 2, 6, 0, 0, Math.PI * 2);
                    ctx.fill();
                    
                    // Glow effect
                    ctx.fillStyle = 'rgba(255, 215, 0, 0.3)';
                    ctx.beginPath();
                    ctx.arc(diyaX, diyaY, 12, 0, Math.PI * 2);
                    ctx.fill();
                }
            }
        } else if (arrangement === 'line') {
            // Linear arrangement of diyas
            const diyaCount = 8;
            const spacing = 25;
            const startX = x;
            const startY = y;
            
            for (let i = 0; i < diyaCount; i++) {
                const diyaX = startX + (i * spacing);
                const diyaY = startY + Math.sin(i * 0.5) * 5; // Slight wave pattern
                
                // Draw diya
                ctx.fillStyle = '#CD853F';
                ctx.beginPath();
                ctx.arc(diyaX, diyaY, 5, 0, Math.PI * 2);
                ctx.fill();
                
                // Draw flame
                ctx.fillStyle = '#FFD700';
                ctx.beginPath();
                ctx.ellipse(diyaX, diyaY - 3, 2, 5, 0, 0, Math.PI * 2);
                ctx.fill();
                
                // Glow effect
                ctx.fillStyle = 'rgba(255, 215, 0, 0.2)';
                ctx.beginPath();
                ctx.arc(diyaX, diyaY, 10, 0, Math.PI * 2);
                ctx.fill();
            }
        }
    }
    
    drawFullMoon(ctx, x, y, size) {
        // Moon glow
        ctx.fillStyle = 'rgba(255, 255, 224, 0.3)';
        ctx.beginPath();
        ctx.arc(x, y, size * 1.5, 0, Math.PI * 2);
        ctx.fill();
        
        // Moon
        ctx.fillStyle = '#F5F5DC';
        ctx.beginPath();
        ctx.arc(x, y, size, 0, Math.PI * 2);
        ctx.fill();
        
        // Moon craters
        ctx.fillStyle = 'rgba(0, 0, 0, 0.1)';
        const craters = [
            {x: x - size * 0.2, y: y - size * 0.3, r: size * 0.15},
            {x: x + size * 0.3, y: y + size * 0.1, r: size * 0.1},
            {x: x - size * 0.1, y: y + size * 0.4, r: size * 0.12}
        ];
        
        craters.forEach(crater => {
            ctx.beginPath();
            ctx.arc(crater.x, crater.y, crater.r, 0, Math.PI * 2);
            ctx.fill();
        });
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
    
    async loadTemplateImage(template) {
        if (!template.imageUrl) return null;
        
        if (this.templateImages[template.id]) {
            return this.templateImages[template.id];
        }
        
        if (this.imageLoadPromises[template.id]) {
            return this.imageLoadPromises[template.id];
        }
        
        this.imageLoadPromises[template.id] = new Promise((resolve, reject) => {
            const img = new Image();
            img.crossOrigin = 'anonymous';
            img.onload = () => {
                this.templateImages[template.id] = img;
                resolve(img);
            };
            img.onerror = reject;
            img.src = template.imageUrl;
        });
        
        return this.imageLoadPromises[template.id];
    }
    
    async selectTemplate(templateId) {
        // Remove previous selection
        document.querySelectorAll('.template-item').forEach(item => {
            item.classList.remove('selected');
        });
        
        // Add selection to clicked template
        document.querySelector(`[data-template-id="${templateId}"]`).classList.add('selected');
        
        this.currentTemplate = this.templates.find(t => t.id === templateId);
        
        // Load template image if available
        if (this.currentTemplate.imageUrl) {
            try {
                await this.loadTemplateImage(this.currentTemplate);
            } catch (error) {
                console.warn('Failed to load template image, using fallback', error);
            }
        }
        
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
                    document.getElementById('removePhotoBtn').style.display = 'block';
                    this.updatePreview();
                };
                img.src = e.target.result;
            };
            reader.readAsDataURL(file);
        }
    }
    
    removePhoto() {
        this.uploadedPhoto = null;
        document.getElementById('photoInput').value = '';
        document.getElementById('removePhotoBtn').style.display = 'none';
        this.updatePreview();
    }
    
    resetCard() {
        // Clear all inputs
        document.getElementById('nameInput').value = '';
        document.getElementById('wishInput').value = '';
        document.getElementById('wishSelector').value = '';
        document.getElementById('photoInput').value = '';
        
        // Reset font settings to defaults
        this.fontSettings = {
            family: 'Arial',
            size: 36, // Base size
            color: '#ffffff',
            bold: true,
            italic: false
        };
        
        // Update font controls
        document.getElementById('fontFamily').value = this.fontSettings.family;
        document.getElementById('fontSize').value = this.fontSettings.size; // Direct value
        document.getElementById('fontColor').value = this.fontSettings.color;
        document.getElementById('fontSizeValue').textContent = this.fontSettings.size + 'px';
        
        // Update style buttons
        document.getElementById('boldBtn').classList.toggle('active', this.fontSettings.bold);
        document.getElementById('italicBtn').classList.toggle('active', this.fontSettings.italic);
        
        // Remove photo
        this.removePhoto();
        
        // Reset text positions
        this.resetTextPositions();
        
        // Update preview
        this.updatePreview();
    }
    
    updateFontSetting(property, value) {
        this.fontSettings[property] = value;
        
        // Update size display
        if (property === 'size') {
            document.getElementById('fontSizeValue').textContent = value + 'px';
        }
        
        this.updatePreview();
    }
    
    toggleFontStyle(style) {
        this.fontSettings[style] = !this.fontSettings[style];
        document.getElementById(style + 'Btn').classList.toggle('active', this.fontSettings[style]);
        this.updatePreview();
    }
    
    async updatePreview() {
        try {
            if (!this.currentTemplate) return;
            
            // Stop existing animation
            this.stopPreviewAnimation();
            
            // Initialize animation manager for preview
            if (!this.animationManager) {
                this.animationManager = new AnimationManager(this);
            }
            
            // Always render at least one frame (for when paused)
            const name = document.getElementById('nameInput').value;
            const wish = this.getCurrentWish();
            this.renderPreviewFrame(name, wish);
            
            // Start animated preview only if playing
            this.startPreviewAnimation();
            
        } catch (error) {
            console.error('Error updating preview:', error);
        }
    }
    
    startPreviewAnimation() {
        if (!this.isPreviewPlaying) return;
        
        this.lastPreviewTime = 0;
        const targetFPS = 15; // Lower FPS for better performance
        const frameInterval = 1000 / targetFPS;
        
        const animate = (currentTime) => {
            try {
                // Throttle to target FPS for better performance
                if (currentTime - this.lastPreviewTime >= frameInterval) {
                    const name = document.getElementById('nameInput').value;
                    const wish = this.getCurrentWish();
                    
                    // Render animated frame
                    this.renderPreviewFrame(name, wish);
                    
                    // Update frame counter (45 frames for 3-second loop at 15fps)
                    this.previewFrame = (this.previewFrame + 1) % 45;
                    
                    this.lastPreviewTime = currentTime;
                }
                
                // Continue animation
                if (this.isPreviewPlaying) {
                    this.previewAnimationId = requestAnimationFrame(animate);
                }
            } catch (error) {
                console.error('Error in preview animation:', error);
            }
        };
        
        this.previewAnimationId = requestAnimationFrame(animate);
    }
    
    stopPreviewAnimation() {
        if (this.previewAnimationId) {
            cancelAnimationFrame(this.previewAnimationId);
            this.previewAnimationId = null;
        }
    }
    
    togglePreviewPlayback() {
        this.isPreviewPlaying = !this.isPreviewPlaying;
        
        const button = document.getElementById('playPauseBtn');
        const buttonText = document.getElementById('playPauseText');
        
        if (this.isPreviewPlaying) {
            buttonText.textContent = '⏸️ Pause';
            this.startPreviewAnimation();
        } else {
            buttonText.textContent = '▶️ Play';
            this.stopPreviewAnimation();
        }
    }
    
    async renderPreviewFrame(name, wish) {
        const ctx = this.ctx;
        const baseWidth = 400;
        const baseHeight = 600;
        
        // Calculate animation time (3-second loop at 15fps)
        const animationTime = (this.previewFrame / 45); // 3-second loop
        
        // Clear canvas
        ctx.clearRect(0, 0, baseWidth, baseHeight);
        
        // Render animated background
        await this.renderPreviewBackground(animationTime);
        
        // Render static elements
        await this.renderStaticElements(name, wish);
    }
    
    async renderPreviewBackground(animationTime) {
        const ctx = this.ctx;
        const width = 400;
        const height = 600;
        const template = this.currentTemplate;
        
        // Save context state
        ctx.save();
        
        switch (template.id) {
            case 'dashain2':
                this.renderPreviewTikaBackground(ctx, width, height, animationTime);
                break;
            case 'tihar1':
                this.renderPreviewTiharBackground(ctx, width, height, animationTime);
                break;
            case 'dashain3':
                this.renderPreviewKiteFlyingBackground(ctx, width, height, animationTime);
                break;
            case 'dashain4':
            case 'dashain5':
                if (this.templateManager && this.templateManager.renderTemplatePreview(template.id, ctx, width, height, animationTime)) {
                    break;
                }
                // Fallback for legacy rendering
                if (template.id === 'dashain4') {
                    this.renderPreviewMinimalistDashainBackground(ctx, width, height, animationTime);
                } else {
                    this.renderPreviewDurgaGraceBackground(ctx, width, height, animationTime);
                }
                break;
            default:
                // Fallback to static background
                await this.renderTemplateBackground();
        }
        
        // Restore context state
        ctx.restore();
    }
    
    renderPreviewTikaBackground(ctx, width, height, animationTime) {
        // Static background first
        this.renderTikaTemplateBackground(ctx, width, height, false);
        
        // Add rotating mandalas
        const rotationAngle = animationTime * Math.PI * 2;
        
        // Rotate central mandala
        ctx.save();
        ctx.translate(width / 2, height * 0.3);
        ctx.rotate(rotationAngle);
        ctx.translate(-width / 2, -height * 0.3);
        this.drawMandalaPattern(ctx, width / 2, height * 0.3, width * 0.08, 12);
        ctx.restore();
        
        // Add pulsing effect to marigolds
        const pulseScale = 1 + 0.2 * Math.sin(animationTime * Math.PI * 4);
        ctx.fillStyle = `rgba(255, 215, 0, ${0.7 + 0.3 * Math.sin(animationTime * Math.PI * 4)})`;
        for (let i = 0; i < 8; i++) {
            const angle = (i * Math.PI * 2) / 8;
            const x = width/2 + Math.cos(angle) * width * 0.35;
            const y = height/2 + Math.sin(angle) * height * 0.35;
            
            ctx.save();
            ctx.translate(x, y);
            ctx.scale(pulseScale, pulseScale);
            ctx.beginPath();
            ctx.arc(0, 0, width * 0.015, 0, Math.PI * 2);
            ctx.fill();
            ctx.restore();
        }
    }
    
    renderPreviewTiharBackground(ctx, width, height, animationTime) {
        // Static background first
        this.renderTiharLightsBackground(ctx, width, height, false);
        
        // Add flickering diyas
        const flicker = 0.8 + 0.4 * Math.sin(animationTime * Math.PI * 6);
        
        // Override diya drawing with flicker effect
        ctx.globalAlpha = flicker;
        this.drawDiya(ctx, width * 0.2, height * 0.7, width * 0.025);
        this.drawDiya(ctx, width * 0.5, height * 0.75, width * 0.02);
        this.drawDiya(ctx, width * 0.8, height * 0.65, width * 0.025);
        ctx.globalAlpha = 1.0;
        
        // Add twinkling stars
        for (let i = 0; i < 10; i++) {
            const twinkle = Math.sin(animationTime * Math.PI * 4 + i) * 0.5 + 0.5;
            ctx.fillStyle = `rgba(255, 255, 255, ${twinkle})`;
            const x = (i * 37) % width;
            const y = (i * 23) % (height * 0.5);
            ctx.beginPath();
            ctx.arc(x, y, 1 + twinkle, 0, Math.PI * 2);
            ctx.fill();
        }
    }
    
    renderPreviewRangoliBackground(ctx, width, height, animationTime) {
        // Static background first
        this.renderRangoliBackground(ctx, width, height, false);
        
        // Add floating petals
        for (let i = 0; i < 8; i++) {
            const petalX = width * 0.1 + (i * width * 0.1) + Math.sin(animationTime * Math.PI * 2 + i) * 20;
            const petalY = height * 0.2 + (animationTime * height * 0.6) % height + Math.cos(animationTime * Math.PI * 3 + i) * 10;
            
            ctx.fillStyle = `rgba(255, 105, 180, ${0.6 + 0.4 * Math.sin(animationTime * Math.PI * 2 + i)})`;
            ctx.save();
            ctx.translate(petalX, petalY);
            ctx.rotate(animationTime * Math.PI * 2 + i);
            ctx.beginPath();
            ctx.ellipse(0, 0, 8, 4, 0, 0, Math.PI * 2);
            ctx.fill();
            ctx.restore();
        }
    }
    
    renderPreviewFestivalJoyBackground(ctx, width, height, animationTime) {
        // Static background first
        this.renderFestivalJoyBackground(ctx, width, height, false);
        
        // Add animated confetti
        for (let i = 0; i < 15; i++) {
            const confettiX = (i * 27 + animationTime * 50) % width;
            const confettiY = (i * 19 + animationTime * 100) % height;
            const rotation = animationTime * Math.PI * 4 + i;
            
            ctx.save();
            ctx.translate(confettiX, confettiY);
            ctx.rotate(rotation);
            ctx.fillStyle = ['#FF6B6B', '#4ECDC4', '#45B7D1', '#FFA07A', '#FFD700'][i % 5];
            ctx.fillRect(-3, -3, 6, 6);
            ctx.restore();
        }
    }
    
    renderPreviewMandalaBackground(ctx, width, height, animationTime) {
        // Static background first
        this.renderMandalaBackground(ctx, width, height, false);
        
        // Add rotating central mandala with trails
        const rotationAngle = animationTime * Math.PI;
        const centerX = width / 2;
        const centerY = height * 0.35;
        
        // Draw rotation trail
        for (let trail = 0; trail < 5; trail++) {
            ctx.save();
            ctx.globalAlpha = 0.1 + trail * 0.05;
            ctx.translate(centerX, centerY);
            ctx.rotate(rotationAngle - trail * 0.2);
            ctx.translate(-centerX, -centerY);
            
            // Multiple mandala rings with rotation
            for (let ring = 1; ring <= 4; ring++) {
                const radius = ring * width * 0.04;
                ctx.strokeStyle = 'rgba(255, 215, 0, 0.6)';
                ctx.lineWidth = 2;
                
                for (let i = 0; i < 8; i++) {
                    const angle = (i * Math.PI * 2) / 8;
                    ctx.beginPath();
                    ctx.moveTo(centerX, centerY);
                    ctx.lineTo(centerX + Math.cos(angle) * radius, centerY + Math.sin(angle) * radius);
                    ctx.stroke();
                }
            }
            ctx.restore();
        }
    }
    
    renderPreviewKiteFlyingBackground(ctx, width, height, animationTime) {
        // Static background first (without kites)
        this.renderKiteFlyingBackground(ctx, width, height, false);
        
        // Now draw animated kites on top
        const windSpeed = animationTime * Math.PI * 2; // Full cycle
        
        // Animate diverse kites with different types and motions
        const animatedKites = [
            { type: 'diamond', x: width * 0.2, y: height * 0.35, size: width * 0.06, colors: ['#FF1744', '#FFC107'], baseRotation: 0.1 },
            { type: 'box', x: width * 0.75, y: height * 0.25, size: width * 0.055, colors: ['#2196F3', '#FFFFFF'], baseRotation: -0.2 },
            { type: 'delta', x: width * 0.45, y: height * 0.4, size: width * 0.045, colors: ['#9C27B0', '#FF9800'], baseRotation: 0.15 },
            { type: 'diamond', x: width * 0.65, y: height * 0.5, size: width * 0.04, colors: ['#4CAF50', '#FFEB3B'], baseRotation: -0.1 },
            { type: 'stunt', x: width * 0.15, y: height * 0.6, size: width * 0.042, colors: ['#FF5722', '#00BCD4'], baseRotation: 0.25 },
            { type: 'simple', x: width * 0.85, y: height * 0.4, size: width * 0.025, colors: ['#E91E63', '#FFEB3B'], baseRotation: -0.05 },
            { type: 'simple', x: width * 0.35, y: height * 0.2, size: width * 0.028, colors: ['#795548', '#FF9800'], baseRotation: 0.3 },
            { type: 'simple', x: width * 0.92, y: height * 0.15, size: width * 0.02, colors: ['#607D8B', '#4CAF50'], baseRotation: -0.15 }
        ];
        
        // Draw each kite with unique animation
        animatedKites.forEach((kite, index) => {
            // Calculate gentle swaying motion based on kite size and type
            const swayAmplitude = kite.size * (0.6 + Math.sin(index) * 0.4);
            const swayFrequency = 0.4 + index * 0.15;
            const swayX = kite.x + Math.sin(windSpeed * swayFrequency) * swayAmplitude;
            const swayY = kite.y + Math.cos(windSpeed * swayFrequency * 0.6) * swayAmplitude * 0.2;
            
            // Add rotation animation
            const rotation = kite.baseRotation + Math.sin(windSpeed * swayFrequency + index) * 0.1;
            
            // Draw animated kite based on type
            this.drawAnimatedKiteByType(ctx, kite.type, swayX, swayY, kite.size, kite.colors[0], kite.colors[1], rotation);
        });
        
        // Add floating clouds that move slowly
        const cloudOffset = animationTime * 0.3; // Slow cloud movement
        this.drawCloud(ctx, width * 0.2 + cloudOffset * width * 0.1, height * 0.15, width * 0.12);
        this.drawCloud(ctx, width * 0.6 + cloudOffset * width * 0.05, height * 0.08, width * 0.08);
    }
    
    renderPreviewMinimalistDashainBackground(ctx, width, height, animationTime) {
        // Static minimalist background
        this.renderMinimalistDashainBackground(ctx, width, height, false);
        
        // Subtle glow animation on Om symbol
        ctx.save();
        const glowIntensity = 0.05 + Math.sin(animationTime * Math.PI * 2) * 0.03;
        ctx.globalAlpha = glowIntensity;
        ctx.shadowColor = '#dc3545';
        ctx.shadowBlur = 20;
        ctx.font = `${width * 0.25}px serif`;
        ctx.fillStyle = '#dc3545';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText('ॐ', width / 2, height * 0.35);
        ctx.restore();
        
        // Gentle floating particles
        const particleTime = animationTime * Math.PI;
        for (let i = 0; i < 3; i++) {
            const x = width * (0.3 + i * 0.2) + Math.sin(particleTime + i) * 20;
            const y = height * (0.7 + Math.sin(particleTime * 0.7 + i) * 0.1);
            const alpha = 0.1 + Math.sin(particleTime + i) * 0.05;
            
            ctx.save();
            ctx.globalAlpha = alpha;
            ctx.fillStyle = '#ffc107';
            ctx.beginPath();
            ctx.arc(x, y, 3, 0, Math.PI * 2);
            ctx.fill();
            ctx.restore();
        }
    }
    
    renderPreviewDurgaGraceBackground(ctx, width, height, animationTime) {
        // Static Durga background
        this.renderDurgaGraceBackground(ctx, width, height, false);
        
        // Subtle divine light animation around the Durga silhouette
        const centerX = width / 2;
        const centerY = height * 0.4;
        const lightRadius = width * 0.2;
        
        ctx.save();
        const lightIntensity = 0.08 + Math.sin(animationTime * Math.PI * 1.5) * 0.04;
        ctx.globalAlpha = lightIntensity;
        
        // Gentle radial glow
        const gradient = ctx.createRadialGradient(centerX, centerY, 0, centerX, centerY, lightRadius);
        gradient.addColorStop(0, '#d4691a');
        gradient.addColorStop(0.5, 'rgba(212, 105, 26, 0.3)');
        gradient.addColorStop(1, 'rgba(212, 105, 26, 0)');
        
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, width, height);
        ctx.restore();
        
        // Floating divine sparkles
        const sparkleTime = animationTime * Math.PI * 0.8;
        for (let i = 0; i < 5; i++) {
            const angle = sparkleTime + i * (Math.PI * 2 / 5);
            const radius = lightRadius * 0.7 + Math.sin(sparkleTime * 1.3 + i) * 20;
            const x = centerX + Math.cos(angle) * radius;
            const y = centerY + Math.sin(angle) * radius * 0.6;
            const alpha = 0.2 + Math.sin(animationTime * Math.PI * 2.2 + i) * 0.15;
            
            ctx.save();
            ctx.globalAlpha = alpha;
            ctx.fillStyle = '#ffc107';
            ctx.shadowColor = '#ffc107';
            ctx.shadowBlur = 8;
            
            // Small star shape
            this.drawMiniStar(ctx, x, y, 3);
            ctx.restore();
        }
        
        // Breathing effect on "दुर्गा" text
        ctx.save();
        const textGlow = 0.12 + Math.sin(animationTime * Math.PI * 1.2) * 0.06;
        ctx.globalAlpha = textGlow;
        ctx.font = `${width * 0.08}px serif`;
        ctx.fillStyle = '#d4691a';
        ctx.shadowColor = '#d4691a';
        ctx.shadowBlur = 10;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText('दुर्गा', width / 2, height * 0.75);
        ctx.restore();
    }
    
    drawMiniStar(ctx, x, y, radius) {
        ctx.beginPath();
        for (let i = 0; i < 5; i++) {
            const angle = (i * 2 * Math.PI / 5) - Math.PI / 2;
            const x1 = x + Math.cos(angle) * radius;
            const y1 = y + Math.sin(angle) * radius;
            const x2 = x + Math.cos(angle + Math.PI / 5) * radius * 0.4;
            const y2 = y + Math.sin(angle + Math.PI / 5) * radius * 0.4;
            
            if (i === 0) ctx.moveTo(x1, y1);
            else ctx.lineTo(x1, y1);
            ctx.lineTo(x2, y2);
        }
        ctx.closePath();
        ctx.fill();
    }
    
    drawAnimatedKiteByType(ctx, type, x, y, size, primaryColor, secondaryColor, rotation) {
        switch (type) {
            case 'diamond':
                this.drawDiamondKite(ctx, x, y, size, primaryColor, secondaryColor, rotation);
                break;
            case 'box':
                this.drawBoxKite(ctx, x, y, size, primaryColor, secondaryColor, rotation);
                break;
            case 'delta':
                this.drawDeltaKite(ctx, x, y, size, primaryColor, secondaryColor, rotation);
                break;
            case 'stunt':
                this.drawStuntKite(ctx, x, y, size, primaryColor, secondaryColor, rotation);
                break;
            case 'simple':
                this.drawSimpleKite(ctx, x, y, size, primaryColor, secondaryColor, rotation);
                break;
            default:
                this.drawDiamondKite(ctx, x, y, size, primaryColor, secondaryColor, rotation);
        }
    }

    renderPreviewTempleBackground(ctx, width, height, animationTime) {
        // Static background first
        this.renderTempleBackground(ctx, width, height, false);
        
        // Add floating prayer flags that sway
        const wind = Math.sin(animationTime * Math.PI * 2) * 0.3;
        for (let i = 0; i < 5; i++) {
            const flagX = width * (0.15 + i * 0.15) + wind * 10;
            const flagY = height * 0.12 + Math.sin(animationTime * Math.PI * 3 + i) * 5;
            
            ctx.fillStyle = ['#FF6B6B', '#4ECDC4', '#FFD700', '#9C27B0', '#FF8C00'][i];
            ctx.fillRect(flagX, flagY, 15, 10);
        }
        
        // Add temple bell swinging animation
        const bellSwing = Math.sin(animationTime * Math.PI * 3) * 0.1;
        ctx.save();
        ctx.translate(width * 0.5, height * 0.45);
        ctx.rotate(bellSwing);
        ctx.fillStyle = '#DAA520';
        ctx.beginPath();
        ctx.arc(0, 0, width * 0.02, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
    }

    renderPreviewDeepawaliBackground(ctx, width, height, animationTime) {
        // Static background first
        this.renderDeepawaliBackground(ctx, width, height, false);
        
        // Add animated diyas with flickering flames
        const diyas = [
            { x: width * 0.2, y: height * 0.8, size: width * 0.02 },
            { x: width * 0.4, y: height * 0.85, size: width * 0.018 },
            { x: width * 0.6, y: height * 0.82, size: width * 0.022 },
            { x: width * 0.8, y: height * 0.79, size: width * 0.019 }
        ];
        
        diyas.forEach((diya, index) => {
            const flicker = 0.7 + 0.5 * Math.sin(animationTime * Math.PI * 8 + index * 1.5);
            ctx.globalAlpha = flicker;
            this.drawDiya(ctx, diya.x, diya.y, diya.size);
            ctx.globalAlpha = 1.0;
        });
        
        // Add sparkling stars
        for (let i = 0; i < 15; i++) {
            const sparkle = Math.sin(animationTime * Math.PI * 6 + i * 0.8) * 0.5 + 0.5;
            ctx.fillStyle = `rgba(255, 215, 0, ${sparkle})`;
            const x = (i * 31) % width;
            const y = (i * 19) % (height * 0.6);
            ctx.beginPath();
            ctx.arc(x, y, 1 + sparkle, 0, Math.PI * 2);
            ctx.fill();
        }
    }

    renderPreviewFestivalLightsBackground(ctx, width, height, animationTime) {
        // Static background first
        this.renderFestivalLightsBackground(ctx, width, height, false);
        
        // Add animated fireworks
        const fireworks = [
            { x: width * 0.3, y: height * 0.2, size: width * 0.05 },
            { x: width * 0.7, y: height * 0.15, size: width * 0.04 },
            { x: width * 0.5, y: height * 0.1, size: width * 0.06 }
        ];
        
        fireworks.forEach((firework, index) => {
            const intensity = Math.sin(animationTime * Math.PI * 4 + index * 2) * 0.5 + 0.5;
            const colors = ['#FF6B6B', '#4ECDC4', '#FFD700'];
            this.drawFirework(ctx, firework.x, firework.y, firework.size * intensity, colors[index]);
        });
        
        // Add floating kites
        const kiteSwayX = Math.sin(animationTime * Math.PI) * 20;
        const kiteSwayY = Math.cos(animationTime * Math.PI * 0.7) * 10;
        this.drawKite(ctx, width * 0.8 + kiteSwayX, height * 0.3 + kiteSwayY, width * 0.03, '#FF1744');
        this.drawKite(ctx, width * 0.15 + kiteSwayX * 0.8, height * 0.25 + kiteSwayY * 1.2, width * 0.025, '#4CAF50');
    }
    
    async update2DCanvas(name, wish) {
        // Clear canvas using base dimensions since context is scaled
        const baseWidth = 400;
        const baseHeight = 600;
        this.ctx.clearRect(0, 0, baseWidth, baseHeight);
        
        // Draw background - use image if available, otherwise fall back to canvas drawing
        await this.renderTemplateBackground();
        
        // Draw photo if uploaded (back to base dimensions since context is scaled)
        if (this.uploadedPhoto) {
            const photoSize = 120; // Base size
            const photoX = (baseWidth - photoSize) / 2;
            const photoY = 120; // Base size
            
            this.ctx.save();
            this.ctx.beginPath();
            this.ctx.arc(photoX + photoSize/2, photoY + photoSize/2, photoSize/2, 0, Math.PI * 2);
            this.ctx.closePath();
            this.ctx.clip();
            
            this.ctx.drawImage(this.uploadedPhoto, photoX, photoY, photoSize, photoSize);
            this.ctx.restore();
            
            // Photo border with glow (base dimensions)
            this.ctx.strokeStyle = '#fff';
            this.ctx.lineWidth = 4; // Base size
            this.ctx.shadowColor = '#fff';
            this.ctx.shadowBlur = 8; // Base size
            this.ctx.beginPath();
            this.ctx.arc(photoX + photoSize/2, photoY + photoSize/2, photoSize/2, 0, Math.PI * 2);
            this.ctx.stroke();
            this.ctx.shadowBlur = 0;
        }
        
        // Draw name with enhanced styling (only if name is provided)
        if (name && name.trim()) {
            // Build font string using font settings
            const fontStyle = this.fontSettings.italic ? 'italic ' : '';
            const fontWeight = this.fontSettings.bold ? 'bold ' : '';
            const fontSize = this.fontSettings.size;
            const fontFamily = this.fontSettings.family;
            
            this.ctx.fillStyle = this.fontSettings.color;
            this.ctx.font = `${fontStyle}${fontWeight}${fontSize}px ${fontFamily}`;
            this.ctx.textAlign = 'center';
            this.ctx.shadowColor = 'rgba(0,0,0,0.8)';
            this.ctx.shadowBlur = 6; // Base size
            this.ctx.shadowOffsetX = 2; // Base size  
            this.ctx.shadowOffsetY = 2; // Base size
            
            const nameY = this.uploadedPhoto ? 280 : 200; // Base size
            
            // Add gold outline to name text
            this.ctx.strokeStyle = '#FFD700';
            this.ctx.lineWidth = 2; // Base size
            this.ctx.strokeText(name, baseWidth / 2, nameY);
            this.ctx.fillText(name, baseWidth / 2, nameY);
        }
        
        // Draw wish text with better styling (only if wish is provided)
        if (wish && wish.trim()) {
            // Use smaller font for wish text
            const wishFontSize = Math.max(12, this.fontSettings.size * 0.5);
            const fontStyle = this.fontSettings.italic ? 'italic ' : '';
            const fontWeight = this.fontSettings.bold ? 'normal ' : ''; // Wish text usually not bold
            
            this.ctx.font = `${fontStyle}${fontWeight}${wishFontSize}px ${this.fontSettings.family}`;
            this.ctx.shadowBlur = 3; // Base size
            this.ctx.fillStyle = this.fontSettings.color;
            const nameY = this.uploadedPhoto ? 280 : 200; // Base size
            const wishY = (name && name.trim()) ? nameY + 60 : nameY; // Base size
            this.wrapText(wish, baseWidth / 2, wishY, baseWidth - 40, wishFontSize + 7); // Base size
        }
        
        // Draw enhanced watermark (barely noticeable)
        this.ctx.font = '8px Arial'; // Much smaller font
        this.ctx.fillStyle = 'rgba(255,255,255,0.3)'; // Much more transparent
        this.ctx.shadowBlur = 0; // No shadow
        this.ctx.shadowColor = 'transparent';
        this.ctx.textAlign = 'center';
        // this.ctx.fillText('Made with ❤️ on nepali-card-maker.vercel.app', baseWidth / 2, baseHeight - 10); // Closer to bottom
        
        // Reset shadow and stroke
        this.ctx.shadowBlur = 0;
        this.ctx.shadowColor = 'transparent';
        this.ctx.strokeStyle = 'transparent';
        this.ctx.lineWidth = 1;
    }
    
    async renderTemplateBackground() {
        const width = 400; // Base width
        const height = 600; // Base height
        
        // Try to load and use template image first
        const templateImage = this.templateImages[this.currentTemplate.id];
        if (templateImage) {
            // Draw high-quality image background
            this.ctx.drawImage(templateImage, 0, 0, width, height);
            return;
        }
        
        // Fall back to canvas-drawn background (scaled for high-res)
        switch (this.currentTemplate.id) {
            case 'dashain2':
                this.renderTikaTemplateBackground(this.ctx, width, height, false);
                break;
            case 'tihar1':
                this.renderTiharLightsBackground(this.ctx, width, height, false);
                break;
            case 'dashain3':
                this.renderKiteFlyingBackground(this.ctx, width, height, false);
                break;
            case 'dashain4':
            case 'dashain5':
                if (this.templateManager && this.templateManager.renderTemplate(this.currentTemplate.id, this.ctx, width, height)) {
                    break;
                }
                // Fallback for legacy rendering
                if (this.currentTemplate.id === 'dashain4') {
                    this.renderMinimalistDashainBackground(this.ctx, width, height, false);
                } else {
                    this.renderDurgaGraceBackground(this.ctx, width, height, false);
                }
                break;
            default:
                // Simple gradient fallback
                const gradient = this.ctx.createLinearGradient(0, 0, 0, height);
                const colors = this.currentTemplate.colors || ['#ff6b6b', '#ffa500'];
                gradient.addColorStop(0, colors[0]);
                gradient.addColorStop(1, colors[1] || colors[0]);
                this.ctx.fillStyle = gradient;
                this.ctx.fillRect(0, 0, width, height);
        }
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
    
    // GIF Animation Methods
    async downloadGif() {
        if (!this.currentTemplate) return;
        
        try {
            // Disable button and show progress
            document.getElementById('downloadGifBtn').disabled = true;
            document.getElementById('gifProgress').style.display = 'block';
            
            // Initialize animation system
            this.animationManager = new AnimationManager(this);
            this.gifExporter = new GIFExporter();
            
            // Generate GIF
            await this.gifExporter.createAnimatedGif(this.animationManager);
            
        } catch (error) {
            console.error('Error generating GIF:', error);
            alert('Error generating GIF. Please try again.');
        } finally {
            // Re-enable button and hide progress
            document.getElementById('downloadGifBtn').disabled = false;
            document.getElementById('gifProgress').style.display = 'none';
        }
    }
    
    // Render static elements (for GIF frames)
    async renderStaticElements(name, wish) {
        const baseWidth = 400;
        const baseHeight = 600;
        
        // Draw photo if uploaded
        if (this.uploadedPhoto) {
            const photoSize = 120;
            const photoX = (baseWidth - photoSize) / 2;
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
        
        // Draw name with enhanced styling
        if (name && name.trim()) {
            const fontStyle = this.fontSettings.italic ? 'italic ' : '';
            const fontWeight = this.fontSettings.bold ? 'bold ' : '';
            const fontSize = this.fontSettings.size;
            const fontFamily = this.fontSettings.family;
            
            this.ctx.fillStyle = this.fontSettings.color;
            this.ctx.font = `${fontStyle}${fontWeight}${fontSize}px ${fontFamily}`;
            this.ctx.textAlign = 'center';
            this.ctx.shadowColor = 'rgba(0,0,0,0.8)';
            this.ctx.shadowBlur = 6;
            this.ctx.shadowOffsetX = 2;
            this.ctx.shadowOffsetY = 2;
            
            // Use drag position or default position
            const namePos = this.getTextPosition('name');
            const displayScale = baseWidth / this.canvas.width; // Scale from internal canvas to display size
            const nameX = namePos.x * displayScale;
            const nameY = namePos.y * displayScale;
            
            
            // Add gold outline to name text
            this.ctx.strokeStyle = '#FFD700';
            this.ctx.lineWidth = 2;
            this.ctx.strokeText(name, nameX, nameY);
            this.ctx.fillText(name, nameX, nameY);
        }
        
        // Draw wish text
        if (wish && wish.trim()) {
            const wishFontSize = Math.max(12, this.fontSettings.size * 0.5);
            const fontStyle = this.fontSettings.italic ? 'italic ' : '';
            const fontWeight = this.fontSettings.bold ? 'normal ' : '';
            
            this.ctx.font = `${fontStyle}${fontWeight}${wishFontSize}px ${this.fontSettings.family}`;
            this.ctx.shadowBlur = 3;
            this.ctx.fillStyle = this.fontSettings.color;
            
            // Use drag position or default position
            const wishPos = this.getTextPosition('wish');
            const displayScale = baseWidth / this.canvas.width;
            const wishX = wishPos.x * displayScale;
            const wishY = wishPos.y * displayScale;
            
            
            this.wrapText(wish, wishX, wishY, baseWidth - 40, wishFontSize + 7);
        }
        
        // Draw watermark
        this.ctx.font = '8px Arial';
        this.ctx.fillStyle = 'rgba(255,255,255,0.3)';
        this.ctx.shadowBlur = 0;
        this.ctx.shadowColor = 'transparent';
        this.ctx.textAlign = 'center';
        this.ctx.fillText('Made with ❤️ on nepali-card-maker.vercel.app', baseWidth / 2, baseHeight - 10);
    }
    
    // Render static elements on a specific canvas for GIF generation
    async renderStaticElementsOnCanvas(canvas, ctx, name, wish) {
        const baseWidth = 400;
        const baseHeight = 600;
        
        // Draw photo if uploaded
        if (this.uploadedPhoto) {
            const photoSize = 120;
            const photoX = (baseWidth - photoSize) / 2;
            const photoY = 120;
            
            ctx.save();
            ctx.beginPath();
            ctx.arc(photoX + photoSize/2, photoY + photoSize/2, photoSize/2, 0, Math.PI * 2);
            ctx.closePath();
            ctx.clip();
            
            ctx.drawImage(this.uploadedPhoto, photoX, photoY, photoSize, photoSize);
            ctx.restore();
            
            // Photo border with glow
            ctx.strokeStyle = '#fff';
            ctx.lineWidth = 4;
            ctx.shadowColor = '#fff';
            ctx.shadowBlur = 8;
            ctx.beginPath();
            ctx.arc(photoX + photoSize/2, photoY + photoSize/2, photoSize/2, 0, Math.PI * 2);
            ctx.stroke();
            ctx.shadowBlur = 0;
        }
        
        // Draw name with enhanced styling
        if (name && name.trim()) {
            const fontStyle = this.fontSettings.italic ? 'italic ' : '';
            const fontWeight = this.fontSettings.bold ? 'bold ' : '';
            const fontSize = this.fontSettings.size;
            const fontFamily = this.fontSettings.family;
            
            ctx.fillStyle = this.fontSettings.color;
            ctx.font = `${fontStyle}${fontWeight}${fontSize}px ${fontFamily}`;
            ctx.textAlign = 'center';
            ctx.shadowColor = 'rgba(0,0,0,0.8)';
            ctx.shadowBlur = 6;
            ctx.shadowOffsetX = 2;
            ctx.shadowOffsetY = 2;
            
            // Use drag position or default position
            const namePos = this.getTextPosition('name');
            const displayScale = baseWidth / this.canvas.width;
            const nameX = namePos.x * displayScale;
            const nameY = namePos.y * displayScale;
            
            // Add gold outline to name text
            ctx.strokeStyle = '#FFD700';
            ctx.lineWidth = 2;
            ctx.strokeText(name, nameX, nameY);
            ctx.fillText(name, nameX, nameY);
        }
        
        // Draw wish text
        if (wish && wish.trim()) {
            const wishFontSize = Math.max(12, this.fontSettings.size * 0.5);
            const fontStyle = this.fontSettings.italic ? 'italic ' : '';
            const fontWeight = this.fontSettings.bold ? 'normal ' : '';
            
            ctx.font = `${fontStyle}${fontWeight}${wishFontSize}px ${this.fontSettings.family}`;
            ctx.shadowBlur = 3;
            ctx.fillStyle = this.fontSettings.color;
            
            // Use drag position or default position
            const wishPos = this.getTextPosition('wish');
            const displayScale = baseWidth / this.canvas.width;
            const wishX = wishPos.x * displayScale;
            const wishY = wishPos.y * displayScale;
            
            this.wrapTextOnCanvas(ctx, wish, wishX, wishY, baseWidth - 40, wishFontSize + 7);
        }
        
        // Draw watermark
        ctx.font = '8px Arial';
        ctx.fillStyle = 'rgba(255,255,255,0.3)';
        ctx.shadowBlur = 0;
        ctx.shadowColor = 'transparent';
        ctx.textAlign = 'center';
        ctx.fillText('Made with ❤️ on nepali-card-maker.vercel.app', baseWidth / 2, baseHeight - 10);
        
        // Reset shadow and stroke
        ctx.shadowBlur = 0;
        ctx.shadowColor = 'transparent';
    }
    
    // Wrap text helper for canvas context
    wrapTextOnCanvas(ctx, text, x, y, maxWidth, lineHeight) {
        const words = text.split(' ');
        let line = '';
        
        for (let n = 0; n < words.length; n++) {
            const testLine = line + words[n] + ' ';
            const metrics = ctx.measureText(testLine);
            const testWidth = metrics.width;
            
            if (testWidth > maxWidth && n > 0) {
                ctx.fillText(line, x, y);
                line = words[n] + ' ';
                y += lineHeight;
            } else {
                line = testLine;
            }
        }
        ctx.fillText(line, x, y);
    }
}

// Animation Manager Class
class AnimationManager {
    constructor(cardBuilder) {
        this.cardBuilder = cardBuilder;
        this.frameCount = 0;
        this.totalFrames = 45; // Match preview: 3 seconds at 15fps
        this.animationTime = 0;
    }
    
    async renderFrame(frameNumber) {
        this.frameCount = frameNumber;
        this.animationTime = frameNumber / this.totalFrames;
        
        // Get card data
        const name = document.getElementById('nameInput').value;
        const wish = this.cardBuilder.getCurrentWish();
        
        // Render animated frame and return canvas
        const canvas = await this.renderAnimatedFrame(name, wish);
        return canvas;
    }
    
    async renderAnimatedFrame(name, wish) {
        // Create a separate canvas for GIF generation with correct dimensions
        if (!this.gifCanvas) {
            this.gifCanvas = document.createElement('canvas');
            this.gifCanvas.width = 400;
            this.gifCanvas.height = 600;
            this.gifCtx = this.gifCanvas.getContext('2d');
        }
        
        const ctx = this.gifCtx;
        const baseWidth = 400;
        const baseHeight = 600;
        
        // Clear canvas
        ctx.clearRect(0, 0, baseWidth, baseHeight);
        
        // Render animated background on GIF canvas
        await this.renderAnimatedBackground();
        
        // Draw static elements (photo, text) on GIF canvas
        await this.cardBuilder.renderStaticElementsOnCanvas(this.gifCanvas, this.gifCtx, name, wish);
        
        return this.gifCanvas;
    }
    
    async renderAnimatedBackground() {
        const ctx = this.gifCtx;
        const width = 400;
        const height = 600;
        const template = this.cardBuilder.currentTemplate;
        
        // Save context state
        ctx.save();
        
        switch (template.id) {
            case 'dashain2':
                this.renderAnimatedTikaBackground(ctx, width, height);
                break;
            case 'tihar1':
                this.renderAnimatedTiharBackground(ctx, width, height);
                break;
            case 'dashain3':
                this.renderAnimatedKiteFlyingBackground(ctx, width, height);
                break;
            case 'dashain4':
            case 'dashain5':
                if (this.cardBuilder.templateManager && this.cardBuilder.templateManager.renderTemplateAnimated(template.id, ctx, width, height, this.animationTime)) {
                    break;
                }
                // Fallback for legacy rendering
                if (template.id === 'dashain4') {
                    this.renderAnimatedMinimalistDashainBackground(ctx, width, height);
                } else {
                    this.renderAnimatedDurgaGraceBackground(ctx, width, height);
                }
                break;
            default:
                // Fallback to static background
                await this.cardBuilder.renderTemplateBackground();
        }
        
        // Restore context state
        ctx.restore();
    }
    
    renderAnimatedTikaBackground(ctx, width, height) {
        // Static background first
        this.cardBuilder.renderTikaTemplateBackground(ctx, width, height, false);
        
        // Add rotating mandalas
        const rotationAngle = this.animationTime * Math.PI * 2;
        
        // Rotate central mandala
        ctx.save();
        ctx.translate(width / 2, height * 0.3);
        ctx.rotate(rotationAngle);
        ctx.translate(-width / 2, -height * 0.3);
        this.cardBuilder.drawMandalaPattern(ctx, width / 2, height * 0.3, width * 0.08, 12);
        ctx.restore();
        
        // Add pulsing effect to marigolds
        const pulseScale = 1 + 0.2 * Math.sin(this.animationTime * Math.PI * 4);
        ctx.fillStyle = `rgba(255, 215, 0, ${0.7 + 0.3 * Math.sin(this.animationTime * Math.PI * 4)})`;
        for (let i = 0; i < 8; i++) {
            const angle = (i * Math.PI * 2) / 8;
            const x = width/2 + Math.cos(angle) * width * 0.35;
            const y = height/2 + Math.sin(angle) * height * 0.35;
            
            ctx.save();
            ctx.translate(x, y);
            ctx.scale(pulseScale, pulseScale);
            ctx.beginPath();
            ctx.arc(0, 0, width * 0.015, 0, Math.PI * 2);
            ctx.fill();
            ctx.restore();
        }
    }
    
    renderAnimatedTiharBackground(ctx, width, height) {
        // Static background first
        this.cardBuilder.renderTiharLightsBackground(ctx, width, height, false);
        
        // Add flickering diyas
        const flicker = 0.8 + 0.4 * Math.sin(this.animationTime * Math.PI * 6 + Math.random());
        
        // Override diya drawing with flicker effect
        ctx.globalAlpha = flicker;
        this.cardBuilder.drawDiya(ctx, width * 0.2, height * 0.7, width * 0.025);
        this.cardBuilder.drawDiya(ctx, width * 0.5, height * 0.75, width * 0.02);
        this.cardBuilder.drawDiya(ctx, width * 0.8, height * 0.65, width * 0.025);
        ctx.globalAlpha = 1.0;
        
        // Add twinkling stars
        for (let i = 0; i < 10; i++) {
            const twinkle = Math.sin(this.animationTime * Math.PI * 4 + i) * 0.5 + 0.5;
            ctx.fillStyle = `rgba(255, 255, 255, ${twinkle})`;
            const x = (i * 37) % width;
            const y = (i * 23) % (height * 0.5);
            ctx.beginPath();
            ctx.arc(x, y, 1 + twinkle, 0, Math.PI * 2);
            ctx.fill();
        }
    }
    
    renderAnimatedRangoliBackground(ctx, width, height) {
        // Static background first
        this.cardBuilder.renderRangoliBackground(ctx, width, height, false);
        
        // Add floating petals
        for (let i = 0; i < 8; i++) {
            const petalX = width * 0.1 + (i * width * 0.1) + Math.sin(this.animationTime * Math.PI * 2 + i) * 20;
            const petalY = height * 0.2 + this.animationTime * height * 0.6 + Math.cos(this.animationTime * Math.PI * 3 + i) * 10;
            
            if (petalY < height) {
                ctx.fillStyle = `rgba(255, 105, 180, ${0.6 + 0.4 * Math.sin(this.animationTime * Math.PI * 2 + i)})`;
                ctx.save();
                ctx.translate(petalX, petalY);
                ctx.rotate(this.animationTime * Math.PI * 2 + i);
                ctx.beginPath();
                ctx.ellipse(0, 0, 8, 4, 0, 0, Math.PI * 2);
                ctx.fill();
                ctx.restore();
            }
        }
    }
    
    renderAnimatedFestivalJoyBackground(ctx, width, height) {
        // Static background first
        this.cardBuilder.renderFestivalJoyBackground(ctx, width, height, false);
        
        // Add animated confetti
        for (let i = 0; i < 15; i++) {
            const confettiX = (i * 27 + this.animationTime * 50) % width;
            const confettiY = (i * 19 + this.animationTime * 100) % height;
            const rotation = this.animationTime * Math.PI * 4 + i;
            
            ctx.save();
            ctx.translate(confettiX, confettiY);
            ctx.rotate(rotation);
            ctx.fillStyle = ['#FF6B6B', '#4ECDC4', '#45B7D1', '#FFA07A', '#FFD700'][i % 5];
            ctx.fillRect(-3, -3, 6, 6);
            ctx.restore();
        }
    }
    
    renderAnimatedMandalaBackground(ctx, width, height) {
        // Static background first
        this.cardBuilder.renderMandalaBackground(ctx, width, height, false);
        
        // Add rotating central mandala with trails
        const rotationAngle = this.animationTime * Math.PI;
        const centerX = width / 2;
        const centerY = height * 0.35;
        
        // Draw rotation trail
        for (let trail = 0; trail < 5; trail++) {
            ctx.save();
            ctx.globalAlpha = 0.1 + trail * 0.05;
            ctx.translate(centerX, centerY);
            ctx.rotate(rotationAngle - trail * 0.2);
            ctx.translate(-centerX, -centerY);
            
            // Multiple mandala rings with rotation
            for (let ring = 1; ring <= 4; ring++) {
                const radius = ring * width * 0.04;
                ctx.strokeStyle = 'rgba(255, 215, 0, 0.6)';
                ctx.lineWidth = 2;
                
                for (let i = 0; i < 8; i++) {
                    const angle = (i * Math.PI * 2) / 8;
                    ctx.beginPath();
                    ctx.moveTo(centerX, centerY);
                    ctx.lineTo(centerX + Math.cos(angle) * radius, centerY + Math.sin(angle) * radius);
                    ctx.stroke();
                }
            }
            ctx.restore();
        }
    }
    
    renderAnimatedKiteFlyingBackground(ctx, width, height) {
        // Static background first (without kites)
        this.cardBuilder.renderKiteFlyingBackground(ctx, width, height, false);
        
        // Now draw animated kites on top  
        const windSpeed = this.animationTime * Math.PI * 2; // Full cycle
        
        // Animate diverse kites with different types and motions
        const animatedKites = [
            { type: 'diamond', x: width * 0.2, y: height * 0.35, size: width * 0.06, colors: ['#FF1744', '#FFC107'], baseRotation: 0.1 },
            { type: 'box', x: width * 0.75, y: height * 0.25, size: width * 0.055, colors: ['#2196F3', '#FFFFFF'], baseRotation: -0.2 },
            { type: 'delta', x: width * 0.45, y: height * 0.4, size: width * 0.045, colors: ['#9C27B0', '#FF9800'], baseRotation: 0.15 },
            { type: 'diamond', x: width * 0.65, y: height * 0.5, size: width * 0.04, colors: ['#4CAF50', '#FFEB3B'], baseRotation: -0.1 },
            { type: 'stunt', x: width * 0.15, y: height * 0.6, size: width * 0.042, colors: ['#FF5722', '#00BCD4'], baseRotation: 0.25 },
            { type: 'simple', x: width * 0.85, y: height * 0.4, size: width * 0.025, colors: ['#E91E63', '#FFEB3B'], baseRotation: -0.05 },
            { type: 'simple', x: width * 0.35, y: height * 0.2, size: width * 0.028, colors: ['#795548', '#FF9800'], baseRotation: 0.3 },
            { type: 'simple', x: width * 0.92, y: height * 0.15, size: width * 0.02, colors: ['#607D8B', '#4CAF50'], baseRotation: -0.15 }
        ];
        
        // Draw each kite with unique animation
        animatedKites.forEach((kite, index) => {
            // Calculate gentle swaying motion based on kite size and type
            const swayAmplitude = kite.size * (0.6 + Math.sin(index) * 0.4);
            const swayFrequency = 0.4 + index * 0.15;
            const swayX = kite.x + Math.sin(windSpeed * swayFrequency) * swayAmplitude;
            const swayY = kite.y + Math.cos(windSpeed * swayFrequency * 0.6) * swayAmplitude * 0.2;
            
            // Add rotation animation
            const rotation = kite.baseRotation + Math.sin(windSpeed * swayFrequency + index) * 0.1;
            
            // Draw animated kite based on type
            this.cardBuilder.drawAnimatedKiteByType(ctx, kite.type, swayX, swayY, kite.size, kite.colors[0], kite.colors[1], rotation);
        });
        
        // Add floating clouds that move slowly
        const cloudOffset = this.animationTime * 0.3; // Slow cloud movement
        this.cardBuilder.drawCloud(ctx, width * 0.2 + cloudOffset * width * 0.1, height * 0.15, width * 0.12);
        this.cardBuilder.drawCloud(ctx, width * 0.6 + cloudOffset * width * 0.05, height * 0.08, width * 0.08);
    }

    renderAnimatedMinimalistDashainBackground(ctx, width, height) {
        // Static minimalist background
        this.cardBuilder.renderMinimalistDashainBackground(ctx, width, height, false);
        
        // Subtle breathing glow on Om symbol
        const breathingIntensity = 0.08 + Math.sin(this.animationTime * Math.PI) * 0.05;
        ctx.save();
        ctx.globalAlpha = breathingIntensity;
        ctx.shadowColor = '#dc3545';
        ctx.shadowBlur = 25;
        ctx.font = `${width * 0.25}px serif`;
        ctx.fillStyle = '#dc3545';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText('ॐ', width / 2, height * 0.35);
        ctx.restore();
        
        // Gentle floating light particles (very minimal)
        const particleTime = this.animationTime * Math.PI * 0.5;
        for (let i = 0; i < 4; i++) {
            const angle = particleTime + i * Math.PI / 2;
            const radius = 30 + Math.sin(this.animationTime * Math.PI * 1.5 + i) * 15;
            const x = width / 2 + Math.cos(angle) * radius;
            const y = height * 0.35 + Math.sin(angle) * radius;
            const alpha = 0.15 + Math.sin(this.animationTime * Math.PI * 2 + i) * 0.1;
            
            ctx.save();
            ctx.globalAlpha = alpha;
            ctx.fillStyle = '#ffc107';
            ctx.beginPath();
            ctx.arc(x, y, 2, 0, Math.PI * 2);
            ctx.fill();
            ctx.restore();
        }
        
        // Subtle lotus glow animation in corners
        const lotusGlow = 0.05 + Math.sin(this.animationTime * Math.PI * 1.2) * 0.03;
        ctx.save();
        ctx.globalAlpha = lotusGlow;
        ctx.shadowColor = '#dc3545';
        ctx.shadowBlur = 15;
        this.cardBuilder.drawMinimalLotus(ctx, width * 0.1, height * 0.9, width * 0.08);
        this.cardBuilder.drawMinimalLotus(ctx, width * 0.9, height * 0.9, width * 0.08);
        this.cardBuilder.drawMinimalLotus(ctx, width * 0.1, height * 0.1, width * 0.08);
        this.cardBuilder.drawMinimalLotus(ctx, width * 0.9, height * 0.1, width * 0.08);
        ctx.restore();
    }

    renderAnimatedDurgaGraceBackground(ctx, width, height) {
        // Static Durga background
        this.cardBuilder.renderDurgaGraceBackground(ctx, width, height, false);
        
        // Divine energy emanation animation
        const centerX = width / 2;
        const centerY = height * 0.4;
        const lightRadius = width * 0.25;
        
        // Pulsing divine aura
        const pulseIntensity = 0.1 + Math.sin(this.animationTime * Math.PI * 1.2) * 0.06;
        ctx.save();
        ctx.globalAlpha = pulseIntensity;
        
        // Multiple layers of divine light
        for (let layer = 0; layer < 3; layer++) {
            const layerRadius = lightRadius * (0.4 + layer * 0.3);
            const gradient = ctx.createRadialGradient(centerX, centerY, 0, centerX, centerY, layerRadius);
            gradient.addColorStop(0, '#d4691a');
            gradient.addColorStop(0.3, 'rgba(212, 105, 26, 0.2)');
            gradient.addColorStop(1, 'rgba(212, 105, 26, 0)');
            
            ctx.fillStyle = gradient;
            ctx.fillRect(0, 0, width, height);
        }
        ctx.restore();
        
        // Orbiting divine sparkles (more elaborate than preview)
        const orbitalTime = this.animationTime * Math.PI * 0.6;
        for (let orbit = 0; orbit < 2; orbit++) {
            const orbitRadius = lightRadius * (0.6 + orbit * 0.2);
            const numSparkles = 6 + orbit * 2;
            
            for (let i = 0; i < numSparkles; i++) {
                const angle = orbitalTime * (1 + orbit * 0.3) + i * (Math.PI * 2 / numSparkles);
                const x = centerX + Math.cos(angle) * orbitRadius;
                const y = centerY + Math.sin(angle) * orbitRadius * 0.7;
                const alpha = 0.25 + Math.sin(this.animationTime * Math.PI * 2.5 + i) * 0.15;
                
                ctx.save();
                ctx.globalAlpha = alpha;
                ctx.fillStyle = orbit === 0 ? '#ffc107' : '#ff8c00';
                ctx.shadowColor = orbit === 0 ? '#ffc107' : '#ff8c00';
                ctx.shadowBlur = 12;
                
                this.cardBuilder.drawMiniStar(ctx, x, y, 2 + orbit);
                ctx.restore();
            }
        }
        
        // Enhanced breathing effect on "दुर्गा" text with divine glow
        ctx.save();
        const textPulse = 0.15 + Math.sin(this.animationTime * Math.PI) * 0.08;
        ctx.globalAlpha = textPulse;
        ctx.font = `${width * 0.08}px serif`;
        ctx.fillStyle = '#d4691a';
        ctx.shadowColor = '#d4691a';
        ctx.shadowBlur = 15;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText('दुर्गा', width / 2, height * 0.75);
        ctx.restore();
        
        // Subtle trident glow animation
        const tridentGlow = 0.08 + Math.sin(this.animationTime * Math.PI * 0.8) * 0.04;
        ctx.save();
        ctx.globalAlpha = tridentGlow;
        ctx.shadowColor = '#d4691a';
        ctx.shadowBlur = 8;
        this.cardBuilder.drawMinimalTrident(ctx, width * 0.12, height * 0.12, width * 0.06);
        this.cardBuilder.drawMinimalTrident(ctx, width * 0.88, height * 0.12, width * 0.06);
        this.cardBuilder.drawMinimalTrident(ctx, width * 0.12, height * 0.88, width * 0.06);
        this.cardBuilder.drawMinimalTrident(ctx, width * 0.88, height * 0.88, width * 0.06);
        ctx.restore();
    }

    renderAnimatedTempleBackground(ctx, width, height) {
        // Static background first
        this.cardBuilder.renderTempleBackground(ctx, width, height, false);
        
        // Add swaying prayer flags
        const wind = Math.sin(this.animationTime * Math.PI * 2) * 0.3;
        for (let i = 0; i < 5; i++) {
            const flagX = width * (0.15 + i * 0.15) + wind * 10;
            const flagY = height * 0.12 + Math.sin(this.animationTime * Math.PI * 3 + i) * 5;
            
            ctx.fillStyle = ['#FF6B6B', '#4ECDC4', '#FFD700', '#9C27B0', '#FF8C00'][i];
            ctx.fillRect(flagX, flagY, 15, 10);
        }
        
        // Add temple bell swinging animation
        const bellSwing = Math.sin(this.animationTime * Math.PI * 3) * 0.1;
        ctx.save();
        ctx.translate(width * 0.5, height * 0.45);
        ctx.rotate(bellSwing);
        ctx.fillStyle = '#DAA520';
        ctx.beginPath();
        ctx.arc(0, 0, width * 0.02, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
        
        // Add moving clouds
        const cloudOffset = this.animationTime * 0.2;
        ctx.globalAlpha = 0.7;
        this.cardBuilder.drawCloud(ctx, width * 0.1 + cloudOffset * width * 0.05, height * 0.15, width * 0.08);
        ctx.globalAlpha = 1.0;
    }

    renderAnimatedDeepawaliBackground(ctx, width, height) {
        // Static background first
        this.cardBuilder.renderDeepawaliBackground(ctx, width, height, false);
        
        // Add animated diyas with intense flickering
        const diyas = [
            { x: width * 0.2, y: height * 0.8, size: width * 0.02 },
            { x: width * 0.4, y: height * 0.85, size: width * 0.018 },
            { x: width * 0.6, y: height * 0.82, size: width * 0.022 },
            { x: width * 0.8, y: height * 0.79, size: width * 0.019 }
        ];
        
        diyas.forEach((diya, index) => {
            const flicker = 0.6 + 0.6 * Math.sin(this.animationTime * Math.PI * 10 + index * 1.8);
            ctx.globalAlpha = flicker;
            this.cardBuilder.drawDiya(ctx, diya.x, diya.y, diya.size);
            ctx.globalAlpha = 1.0;
        });
        
        // Add intense sparkling effect
        for (let i = 0; i < 20; i++) {
            const sparkle = Math.sin(this.animationTime * Math.PI * 8 + i * 1.2) * 0.5 + 0.5;
            ctx.fillStyle = `rgba(255, 215, 0, ${sparkle})`;
            const x = (i * 31) % width;
            const y = (i * 19) % (height * 0.6);
            ctx.beginPath();
            ctx.arc(x, y, 2 + sparkle * 2, 0, Math.PI * 2);
            ctx.fill();
        }
        
        // Add floating rangoli patterns
        const floatOffset = Math.sin(this.animationTime * Math.PI) * 10;
        ctx.globalAlpha = 0.6;
        this.cardBuilder.drawRangoliPattern(ctx, width * 0.5, height * 0.4 + floatOffset, width * 0.08);
        ctx.globalAlpha = 1.0;
    }

    renderAnimatedFestivalLightsBackground(ctx, width, height) {
        // Static background first
        this.cardBuilder.renderFestivalLightsBackground(ctx, width, height, false);
        
        // Add explosive fireworks animation
        const fireworks = [
            { x: width * 0.3, y: height * 0.2, size: width * 0.06 },
            { x: width * 0.7, y: height * 0.15, size: width * 0.05 },
            { x: width * 0.5, y: height * 0.1, size: width * 0.07 }
        ];
        
        fireworks.forEach((firework, index) => {
            const intensity = Math.sin(this.animationTime * Math.PI * 6 + index * 2.5) * 0.5 + 0.5;
            const colors = ['#FF6B6B', '#4ECDC4', '#FFD700'];
            this.cardBuilder.drawFirework(ctx, firework.x, firework.y, firework.size * intensity, colors[index]);
        });
        
        // Add dynamic kite movements
        const windStrength = 1.5;
        const kiteSwayX = Math.sin(this.animationTime * Math.PI * windStrength) * 25;
        const kiteSwayY = Math.cos(this.animationTime * Math.PI * windStrength * 0.7) * 15;
        this.cardBuilder.drawKite(ctx, width * 0.8 + kiteSwayX, height * 0.3 + kiteSwayY, width * 0.04, '#FF1744');
        this.cardBuilder.drawKite(ctx, width * 0.15 + kiteSwayX * 0.8, height * 0.25 + kiteSwayY * 1.2, width * 0.03, '#4CAF50');
        
        // Add floating diyas
        const diyaFloat = Math.sin(this.animationTime * Math.PI * 2) * 8;
        this.cardBuilder.drawDiya(ctx, width * 0.9, height * 0.6 + diyaFloat, width * 0.015);
        this.cardBuilder.drawDiya(ctx, width * 0.1, height * 0.7 - diyaFloat, width * 0.012);
    }
}

// GIF Exporter Class
class GIFExporter {
    constructor() {
        this.progress = 0;
    }
    
    async createAnimatedGif(animationManager) {
        return new Promise(async (resolve, reject) => {
            try {
                const totalFrames = animationManager.totalFrames;
                console.log(`Starting GIF generation with ${totalFrames} frames using gifshot.js`);
                
                // Generate all frames as images
                const images = [];
                
                for (let frame = 0; frame < totalFrames; frame++) {
                    // Update progress
                    const frameProgress = (frame / totalFrames) * 80; // 80% for frame generation
                    document.getElementById('progressFill').style.width = frameProgress + '%';
                    document.getElementById('progressText').textContent = `Generating frames... ${frame + 1}/${totalFrames}`;
                    
                    console.log(`Generating frame ${frame + 1}/${totalFrames}`);
                    
                    // Render frame
                    const canvas = await animationManager.renderFrame(frame);
                    
                    if (!canvas) {
                        throw new Error(`Failed to render frame ${frame}`);
                    }
                    
                    // Convert canvas to data URL
                    const dataURL = canvas.toDataURL('image/png');
                    images.push(dataURL);
                    
                    // Allow UI to update
                    await new Promise(resolve => setTimeout(resolve, 5));
                }
                
                console.log('All frames generated, creating GIF...');
                document.getElementById('progressText').textContent = 'Creating GIF...';
                document.getElementById('progressFill').style.width = '90%';
                
                // Create GIF using gifshot.js with high quality settings
                gifshot.createGIF({
                    images: images,
                    gifWidth: 400,
                    gifHeight: 600,
                    interval: 0.067, // 67ms delay between frames (15fps)
                    numFrames: totalFrames,
                    frameDuration: 1, // 1 frame duration for 67ms
                    quality: 1, // Highest quality (1-20, lower is better)
                    sampleInterval: 1, // Lower sampling for better quality
                    numWorkers: 2,
                    // Optimization for mobile viewing
                    gifQuality: 1, // Best quality
                    progressCallback: function(captureProgress) {
                        // Optional: could add more detailed progress
                        console.log('GIF progress:', Math.round(captureProgress * 100) + '%');
                    }
                }, (obj) => {
                    if (!obj.error) {
                        console.log('GIF creation successful');
                        document.getElementById('progressFill').style.width = '100%';
                        document.getElementById('progressText').textContent = 'Download ready!';
                        
                        // Convert base64 to blob and download
                        this.downloadBase64(obj.image);
                        resolve();
                    } else {
                        console.error('GIF creation error:', obj.error);
                        reject(new Error('Failed to create GIF: ' + obj.error));
                    }
                });
                
            } catch (error) {
                console.error('GIF generation error:', error);
                reject(error);
            }
        });
    }
    
    downloadBase64(base64) {
        // Convert base64 to blob
        const byteCharacters = atob(base64.split(',')[1]);
        const byteNumbers = new Array(byteCharacters.length);
        for (let i = 0; i < byteCharacters.length; i++) {
            byteNumbers[i] = byteCharacters.charCodeAt(i);
        }
        const byteArray = new Uint8Array(byteNumbers);
        const blob = new Blob([byteArray], {type: 'image/gif'});
        
        // Download the blob
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `festival-card-animated-${Date.now()}.gif`;
        link.click();
        URL.revokeObjectURL(url);
    }
}

// Initialize the app when the DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new FestivalCardBuilder();
});