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
                nameLabel: 'Your Name:',
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
                nameLabel: 'तपाईंको नाम:',
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
                name: 'Dashain Kites',
                background: 'linear-gradient(135deg, #ff6b6b, #ffa500)',
                colors: ['#ff6b6b', '#ffa500'],
                decorations: ['🪁', '🪁', '🪁'],
                wishes: {
                    en: 'Happy Dashain! May this festival bring joy and prosperity to your life.',
                    ne: 'शुभ दशैं! यो चाडले तपाईंको जीवनमा खुशी र समृद्धि ल्याओस्।'
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
        
        nameInput.placeholder = this.currentLanguage === 'en' ? 'Enter your name' : 'आफ्नो नाम लेख्नुहोस्';
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
    
    renderTemplatePreview(ctx, template, width, height) {
        try {
            // Clear canvas
            ctx.clearRect(0, 0, width, height);
            
            // Draw background gradient
            const gradient = ctx.createLinearGradient(0, 0, width, height);
            const colors = template.colors || ['#ff6b6b', '#ffa500'];
            gradient.addColorStop(0, colors[0]);
            gradient.addColorStop(1, colors[1] || colors[0]);
            
            ctx.fillStyle = gradient;
            ctx.fillRect(0, 0, width, height);
            
            // Draw decorative elements
            ctx.font = `${Math.floor(width * 0.15)}px Arial`;
            ctx.textAlign = 'center';
            ctx.fillStyle = '#fff';
            template.decorations.forEach((decoration, index) => {
                const x = (width / 4) * (index + 1);
                const y = height * 0.25;
                ctx.fillText(decoration, x, y);
            });
            
            // Draw sample name
            ctx.fillStyle = '#fff';
            ctx.font = `bold ${Math.floor(width * 0.1)}px Arial`;
            ctx.textAlign = 'center';
            ctx.shadowColor = 'rgba(0,0,0,0.5)';
            ctx.shadowBlur = 2;
            ctx.shadowOffsetX = 1;
            ctx.shadowOffsetY = 1;
            ctx.fillText('Sample Name', width / 2, height * 0.5);
            
            // Draw sample wish (first few words)
            ctx.font = `${Math.floor(width * 0.06)}px Arial`;
            ctx.shadowBlur = 1;
            const wishPreview = template.wishes.en.split(' ').slice(0, 3).join(' ') + '...';
            ctx.fillText(wishPreview, width / 2, height * 0.65);
            
            // Reset shadow
            ctx.shadowColor = 'transparent';
            ctx.shadowBlur = 0;
            ctx.shadowOffsetX = 0;
            ctx.shadowOffsetY = 0;
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
            
            const name = document.getElementById('nameInput').value || 'Your Name';
            const wish = document.getElementById('wishInput').value || this.currentTemplate.wishes[this.currentLanguage];
            
            // Clear canvas
            this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
            
            // Draw background
            const gradient = this.ctx.createLinearGradient(0, 0, this.canvas.width, this.canvas.height);
            const colors = this.currentTemplate.colors || ['#ff6b6b', '#ffa500'];
            gradient.addColorStop(0, colors[0]);
            gradient.addColorStop(1, colors[1] || colors[0]);
            
            this.ctx.fillStyle = gradient;
            this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
            
            // Draw decorative elements
            this.ctx.font = '40px Arial';
            this.ctx.textAlign = 'center';
            this.ctx.fillStyle = '#fff';
            this.currentTemplate.decorations.forEach((decoration, index) => {
                const x = (this.canvas.width / 4) * (index + 1);
                const y = 80;
                this.ctx.fillText(decoration, x, y);
            });
            
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
                
                // Photo border
                this.ctx.strokeStyle = '#fff';
                this.ctx.lineWidth = 4;
                this.ctx.beginPath();
                this.ctx.arc(photoX + photoSize/2, photoY + photoSize/2, photoSize/2, 0, Math.PI * 2);
                this.ctx.stroke();
            }
            
            // Draw name
            this.ctx.fillStyle = '#fff';
            this.ctx.font = 'bold 32px Arial';
            this.ctx.textAlign = 'center';
            this.ctx.shadowColor = 'rgba(0,0,0,0.5)';
            this.ctx.shadowBlur = 4;
            this.ctx.shadowOffsetX = 2;
            this.ctx.shadowOffsetY = 2;
            
            const nameY = this.uploadedPhoto ? 280 : 200;
            this.ctx.fillText(name, this.canvas.width / 2, nameY);
            
            // Draw wish text (wrapped)
            this.ctx.font = '18px Arial';
            this.ctx.shadowBlur = 2;
            const wishY = nameY + 60;
            this.wrapText(wish, this.canvas.width / 2, wishY, this.canvas.width - 40, 25);
            
            // Draw watermark
            this.ctx.font = '12px Arial';
            this.ctx.fillStyle = 'rgba(255,255,255,0.8)';
            this.ctx.shadowBlur = 1;
            this.ctx.textAlign = 'center';
            this.ctx.fillText('Made with ❤️ on FestivalCards.com', this.canvas.width / 2, this.canvas.height - 20);
        } catch (error) {
            console.error('Error updating preview:', error);
            // Show error message to user
            this.ctx.fillStyle = '#ff6b6b';
            this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
            this.ctx.fillStyle = '#fff';
            this.ctx.font = '20px Arial';
            this.ctx.textAlign = 'center';
            this.ctx.fillText('Preview Error', this.canvas.width / 2, this.canvas.height / 2);
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
}

// Initialize the app when the DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new FestivalCardBuilder();
});