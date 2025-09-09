// Durga's Grace Template - dashain5
class DurgaGraceTemplate {
    constructor(cardBuilder) {
        this.cardBuilder = cardBuilder;
        this.id = 'dashain5';
        this.name = 'Durga\'s Grace';
        this.colors = ['#fef9e7', '#f8f4e6'];
        this.decorations = ['🙏', '🌺', '🙏'];
        this.wishes = {
            en: 'May Maa Durga shower you with strength, wisdom and divine blessings.',
            ne: 'माँ दुर्गाले तपाईंलाई शक्ति, बुद्धि र दिव्य आशीर्वादले भरिदिऊन्।'
        };
    }

    renderBackground(ctx, width, height, isPreview = false) {
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

    renderPreview(ctx, width, height, animationTime) {
        // Static Durga background
        this.renderBackground(ctx, width, height, false);
        
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

    renderAnimated(ctx, width, height, animationTime) {
        // Static Durga background
        this.renderBackground(ctx, width, height, false);
        
        // Divine energy emanation animation
        const centerX = width / 2;
        const centerY = height * 0.4;
        const lightRadius = width * 0.25;
        
        // Pulsing divine aura
        const pulseIntensity = 0.1 + Math.sin(animationTime * Math.PI * 1.2) * 0.06;
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
        const orbitalTime = animationTime * Math.PI * 0.6;
        for (let orbit = 0; orbit < 2; orbit++) {
            const orbitRadius = lightRadius * (0.6 + orbit * 0.2);
            const numSparkles = 6 + orbit * 2;
            
            for (let i = 0; i < numSparkles; i++) {
                const angle = orbitalTime * (1 + orbit * 0.3) + i * (Math.PI * 2 / numSparkles);
                const x = centerX + Math.cos(angle) * orbitRadius;
                const y = centerY + Math.sin(angle) * orbitRadius * 0.7;
                const alpha = 0.25 + Math.sin(animationTime * Math.PI * 2.5 + i) * 0.15;
                
                ctx.save();
                ctx.globalAlpha = alpha;
                ctx.fillStyle = orbit === 0 ? '#ffc107' : '#ff8c00';
                ctx.shadowColor = orbit === 0 ? '#ffc107' : '#ff8c00';
                ctx.shadowBlur = 12;
                
                this.drawMiniStar(ctx, x, y, 2 + orbit);
                ctx.restore();
            }
        }
        
        // Enhanced breathing effect on "दुर्गा" text with divine glow
        ctx.save();
        const textPulse = 0.15 + Math.sin(animationTime * Math.PI) * 0.08;
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
        const tridentGlow = 0.08 + Math.sin(animationTime * Math.PI * 0.8) * 0.04;
        ctx.save();
        ctx.globalAlpha = tridentGlow;
        ctx.shadowColor = '#d4691a';
        ctx.shadowBlur = 8;
        this.drawMinimalTrident(ctx, width * 0.12, height * 0.12, width * 0.06);
        this.drawMinimalTrident(ctx, width * 0.88, height * 0.12, width * 0.06);
        this.drawMinimalTrident(ctx, width * 0.12, height * 0.88, width * 0.06);
        this.drawMinimalTrident(ctx, width * 0.88, height * 0.88, width * 0.06);
        ctx.restore();
    }

    drawDurgaFace(ctx, centerX, centerY, scale) {
        ctx.save();
        
        // Draw the artistic Durga face like in the reference image
        
        // THIRD EYE - Flame/leaf shape with red dot
        ctx.save();
        ctx.globalAlpha = 0.25;
        
        // Flame outline (black)
        ctx.strokeStyle = '#000';
        ctx.fillStyle = '#000';
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.moveTo(centerX, centerY - scale * 1.2);
        ctx.quadraticCurveTo(centerX - scale * 0.12, centerY - scale * 0.95, centerX - scale * 0.08, centerY - scale * 0.85);
        ctx.quadraticCurveTo(centerX, centerY - scale * 0.9, centerX + scale * 0.08, centerY - scale * 0.85);
        ctx.quadraticCurveTo(centerX + scale * 0.12, centerY - scale * 0.95, centerX, centerY - scale * 1.2);
        ctx.closePath();
        ctx.stroke();
        
        // Red inner flame
        ctx.fillStyle = '#dc143c';
        ctx.globalAlpha = 0.3;
        ctx.beginPath();
        ctx.moveTo(centerX, centerY - scale * 1.15);
        ctx.quadraticCurveTo(centerX - scale * 0.06, centerY - scale * 0.98, centerX - scale * 0.04, centerY - scale * 0.9);
        ctx.quadraticCurveTo(centerX, centerY - scale * 0.93, centerX + scale * 0.04, centerY - scale * 0.9);
        ctx.quadraticCurveTo(centerX + scale * 0.06, centerY - scale * 0.98, centerX, centerY - scale * 1.15);
        ctx.closePath();
        ctx.fill();
        
        // Red dot (bindu)
        ctx.fillStyle = '#dc143c';
        ctx.globalAlpha = 0.4;
        ctx.beginPath();
        ctx.arc(centerX, centerY - scale * 0.75, scale * 0.06, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
        
        // EYES - Beautiful almond shaped with artistic curves
        const eyeY = centerY - scale * 0.35;
        const eyeSpacing = scale * 0.45;
        
        // Left eye
        this.drawArtisticEye(ctx, centerX - eyeSpacing, eyeY, scale, 'left');
        
        // Right eye  
        this.drawArtisticEye(ctx, centerX + eyeSpacing, eyeY, scale, 'right');
        
        // NOSE - Detailed with proper bridge and nostrils
        ctx.save();
        ctx.globalAlpha = 0.3;
        ctx.strokeStyle = '#000';
        ctx.lineWidth = 2;
        
        // Nose bridge (vertical line)
        ctx.beginPath();
        ctx.moveTo(centerX, centerY - scale * 0.1);
        ctx.lineTo(centerX, centerY + scale * 0.18);
        ctx.stroke();
        
        // Left nostril curve
        ctx.beginPath();
        ctx.moveTo(centerX - scale * 0.04, centerY + scale * 0.15);
        ctx.quadraticCurveTo(centerX - scale * 0.08, centerY + scale * 0.18, centerX - scale * 0.04, centerY + scale * 0.22);
        ctx.stroke();
        
        // Right nostril curve
        ctx.beginPath();
        ctx.moveTo(centerX + scale * 0.04, centerY + scale * 0.15);
        ctx.quadraticCurveTo(centerX + scale * 0.08, centerY + scale * 0.18, centerX + scale * 0.04, centerY + scale * 0.22);
        ctx.stroke();
        
        // Nose tip definition
        ctx.lineWidth = 1.5;
        ctx.globalAlpha = 0.25;
        ctx.beginPath();
        ctx.arc(centerX, centerY + scale * 0.18, scale * 0.02, 0, Math.PI * 2);
        ctx.stroke();
        
        // Nose piercing (nath) - traditional style
        ctx.strokeStyle = '#ffd700';
        ctx.fillStyle = '#ffd700';
        ctx.lineWidth = 2;
        ctx.globalAlpha = 0.4;
        
        // Main ring
        ctx.beginPath();
        ctx.arc(centerX - scale * 0.06, centerY + scale * 0.2, scale * 0.04, 0, Math.PI * 2);
        ctx.stroke();
        
        // Small decorative bead on the ring
        ctx.fillStyle = '#ff1744';
        ctx.globalAlpha = 0.5;
        ctx.beginPath();
        ctx.arc(centerX - scale * 0.06, centerY + scale * 0.16, scale * 0.015, 0, Math.PI * 2);
        ctx.fill();
        
        // Chain connection (optional decorative element)
        ctx.strokeStyle = '#ffd700';
        ctx.lineWidth = 1;
        ctx.globalAlpha = 0.3;
        ctx.beginPath();
        ctx.moveTo(centerX - scale * 0.06, centerY + scale * 0.24);
        ctx.quadraticCurveTo(centerX - scale * 0.04, centerY + scale * 0.28, centerX - scale * 0.02, centerY + scale * 0.26);
        ctx.stroke();
        
        ctx.restore();
        
        // LIPS - Beautiful curved lips with artistic style
        this.drawArtisticLips(ctx, centerX, centerY + scale * 0.45, scale);
        
        
        ctx.restore();
    }
    
    drawArtisticEye(ctx, x, y, scale, side) {
        ctx.save();
        
        // Create slanted focused look - eyes looking slightly towards center and down
        const focusOffsetX = side === 'left' ? scale * 0.02 : -scale * 0.02;
        const focusOffsetY = scale * 0.01;
        
        // Eye outline - bold black artistic strokes with slant
        ctx.strokeStyle = '#000';
        ctx.lineWidth = 4;
        ctx.globalAlpha = 0.4;
        
        // Main eye shape - elongated almond with focus slant
        ctx.beginPath();
        if (side === 'left') {
            // Left eye curves - slanted for focused look
            ctx.moveTo(x - scale * 0.26, y + scale * 0.02);
            ctx.quadraticCurveTo(x - scale * 0.08, y - scale * 0.15, x + scale * 0.16, y - scale * 0.08);
            ctx.quadraticCurveTo(x + scale * 0.24, y - scale * 0.02, x + scale * 0.14, y + scale * 0.06);
            ctx.quadraticCurveTo(x - scale * 0.12, y + scale * 0.14, x - scale * 0.26, y + scale * 0.02);
        } else {
            // Right eye curves - slanted for focused look 
            ctx.moveTo(x + scale * 0.26, y + scale * 0.02);
            ctx.quadraticCurveTo(x + scale * 0.08, y - scale * 0.15, x - scale * 0.16, y - scale * 0.08);
            ctx.quadraticCurveTo(x - scale * 0.24, y - scale * 0.02, x - scale * 0.14, y + scale * 0.06);
            ctx.quadraticCurveTo(x + scale * 0.12, y + scale * 0.14, x + scale * 0.26, y + scale * 0.02);
        }
        ctx.stroke();
        
        // Enhanced eyelashes - multiple layers
        ctx.lineWidth = 2;
        ctx.globalAlpha = 0.4;
        
        // Upper eyelashes - dense and curved
        const lashCount = 8;
        for (let i = 0; i < lashCount; i++) {
            const lashAngle = (i / (lashCount - 1)) * 0.8 - 0.4; // Spread lashes
            const lashLength = scale * (0.12 + Math.random() * 0.08); // Varied lengths
            const baseX = x + (side === 'left' ? -1 : 1) * scale * (0.2 - i * 0.05);
            const baseY = y - scale * 0.08;
            
            const lashEndX = baseX + Math.sin(lashAngle) * lashLength;
            const lashEndY = baseY - Math.cos(lashAngle) * lashLength;
            
            ctx.beginPath();
            ctx.moveTo(baseX, baseY);
            ctx.quadraticCurveTo(
                baseX + Math.sin(lashAngle) * lashLength * 0.5,
                baseY - Math.cos(lashAngle) * lashLength * 0.8,
                lashEndX,
                lashEndY
            );
            ctx.stroke();
        }
        
        // Lower eyelashes - shorter and subtle
        ctx.lineWidth = 1.5;
        ctx.globalAlpha = 0.25;
        const lowerLashCount = 5;
        for (let i = 0; i < lowerLashCount; i++) {
            const lashAngle = (i / (lowerLashCount - 1)) * 0.4 - 0.2;
            const lashLength = scale * 0.05;
            const baseX = x + (side === 'left' ? -1 : 1) * scale * (0.15 - i * 0.06);
            const baseY = y + scale * 0.06;
            
            ctx.beginPath();
            ctx.moveTo(baseX, baseY);
            ctx.lineTo(
                baseX + Math.sin(lashAngle) * lashLength,
                baseY + Math.cos(lashAngle) * lashLength
            );
            ctx.stroke();
        }
        
        // Eye decorative strokes - wing-like extensions
        ctx.lineWidth = 3;
        ctx.globalAlpha = 0.35;
        
        // Outer wing stroke
        const wingStartX = side === 'left' ? x + scale * 0.24 : x - scale * 0.24;
        const wingEndX = side === 'left' ? x + scale * 0.35 : x - scale * 0.35;
        ctx.beginPath();
        ctx.moveTo(wingStartX, y - scale * 0.02);
        ctx.quadraticCurveTo(
            side === 'left' ? x + scale * 0.32 : x - scale * 0.32,
            y - scale * 0.12,
            wingEndX,
            y - scale * 0.05
        );
        ctx.stroke();
        
        // Inner decorative line
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(side === 'left' ? x - scale * 0.2 : x + scale * 0.2, y - scale * 0.08);
        ctx.quadraticCurveTo(x, y - scale * 0.15, side === 'left' ? x + scale * 0.1 : x - scale * 0.1, y - scale * 0.1);
        ctx.stroke();
        
        // White of eye - slightly slanted oval for focused look
        ctx.fillStyle = '#fff';
        ctx.globalAlpha = 0.9;
        ctx.save();
        ctx.translate(x, y);
        ctx.rotate((side === 'left' ? -0.1 : 0.1)); // Slight rotation for slant
        ctx.beginPath();
        ctx.ellipse(0, 0, scale * 0.11, scale * 0.07, 0, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
        
        // Pupil - positioned for focused look (looking slightly inward and down)
        const pupilX = x + focusOffsetX;
        const pupilY = y + focusOffsetY;
        
        ctx.fillStyle = '#000';
        ctx.globalAlpha = 0.95;
        ctx.beginPath();
        ctx.arc(pupilX, pupilY, scale * 0.06, 0, Math.PI * 2);
        ctx.fill();
        
        // Eye shine - positioned on pupil
        ctx.fillStyle = '#fff';
        ctx.globalAlpha = 0.8;
        ctx.beginPath();
        ctx.arc(pupilX + scale * 0.02, pupilY - scale * 0.02, scale * 0.015, 0, Math.PI * 2);
        ctx.fill();
        
        // Secondary smaller shine
        ctx.globalAlpha = 0.5;
        ctx.beginPath();
        ctx.arc(pupilX - scale * 0.015, pupilY + scale * 0.015, scale * 0.008, 0, Math.PI * 2);
        ctx.fill();
        
        ctx.restore();
    }
    
    drawArtisticLips(ctx, x, y, scale) {
        ctx.save();
        
        // Lip outline - black
        ctx.strokeStyle = '#000';
        ctx.lineWidth = 2;
        ctx.globalAlpha = 0.3;
        
        ctx.beginPath();
        // Upper lip curve (M shape)
        ctx.moveTo(x - scale * 0.15, y);
        ctx.quadraticCurveTo(x - scale * 0.08, y - scale * 0.06, x - scale * 0.02, y - scale * 0.02);
        ctx.quadraticCurveTo(x, y - scale * 0.04, x + scale * 0.02, y - scale * 0.02);
        ctx.quadraticCurveTo(x + scale * 0.08, y - scale * 0.06, x + scale * 0.15, y);
        
        // Lower lip curve
        ctx.quadraticCurveTo(x + scale * 0.08, y + scale * 0.08, x, y + scale * 0.06);
        ctx.quadraticCurveTo(x - scale * 0.08, y + scale * 0.08, x - scale * 0.15, y);
        ctx.closePath();
        ctx.stroke();
        
        // Lip fill - magenta/pink
        ctx.fillStyle = '#e91e63';
        ctx.globalAlpha = 0.4;
        ctx.fill();
        
        // Lip highlight
        ctx.fillStyle = '#f8bbd9';
        ctx.globalAlpha = 0.3;
        ctx.beginPath();
        ctx.ellipse(x, y + scale * 0.02, scale * 0.08, scale * 0.03, 0, 0, Math.PI * 2);
        ctx.fill();
        
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
}

// Export for module system
if (typeof module !== 'undefined' && module.exports) {
    module.exports = DurgaGraceTemplate;
}