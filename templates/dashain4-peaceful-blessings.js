// Peaceful Blessings Template - dashain4
class PeacefulBlessingsTemplate {
    constructor(cardBuilder) {
        this.cardBuilder = cardBuilder;
        this.id = 'dashain4';
        this.name = 'Peaceful Blessings';
        this.colors = ['#f5f5f5', '#e8e8e8'];
        this.decorations = ['🕉️', '🌸', '🕉️'];
        this.wishes = {
            en: 'May this Dashain bring you inner peace and boundless joy.',
            ne: 'यो दशैंले तपाईंलाई भित्री शान्ति र असीम आनन्द ल्याओस्।'
        };
    }

    renderBackground(ctx, width, height, isPreview = false) {
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

    renderPreview(ctx, width, height, animationTime) {
        // Static minimalist background
        this.renderBackground(ctx, width, height, false);
        
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

    renderAnimated(ctx, width, height, animationTime) {
        // Static minimalist background
        this.renderBackground(ctx, width, height, false);
        
        // Subtle breathing glow on Om symbol
        const breathingIntensity = 0.08 + Math.sin(animationTime * Math.PI) * 0.05;
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
        const particleTime = animationTime * Math.PI * 0.5;
        for (let i = 0; i < 4; i++) {
            const angle = particleTime + i * Math.PI / 2;
            const radius = 30 + Math.sin(animationTime * Math.PI * 1.5 + i) * 15;
            const x = width / 2 + Math.cos(angle) * radius;
            const y = height * 0.35 + Math.sin(angle) * radius;
            const alpha = 0.15 + Math.sin(animationTime * Math.PI * 2 + i) * 0.1;
            
            ctx.save();
            ctx.globalAlpha = alpha;
            ctx.fillStyle = '#ffc107';
            ctx.beginPath();
            ctx.arc(x, y, 2, 0, Math.PI * 2);
            ctx.fill();
            ctx.restore();
        }
        
        // Subtle lotus glow animation in corners
        const lotusGlow = 0.05 + Math.sin(animationTime * Math.PI * 1.2) * 0.03;
        ctx.save();
        ctx.globalAlpha = lotusGlow;
        ctx.shadowColor = '#dc3545';
        ctx.shadowBlur = 15;
        this.drawMinimalLotus(ctx, width * 0.1, height * 0.9, width * 0.08);
        this.drawMinimalLotus(ctx, width * 0.9, height * 0.9, width * 0.08);
        this.drawMinimalLotus(ctx, width * 0.1, height * 0.1, width * 0.08);
        this.drawMinimalLotus(ctx, width * 0.9, height * 0.1, width * 0.08);
        ctx.restore();
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
}

// Export for module system
if (typeof module !== 'undefined' && module.exports) {
    module.exports = PeacefulBlessingsTemplate;
}