// Template Manager - handles loading and managing all templates
class TemplateManager {
    constructor(cardBuilder) {
        this.cardBuilder = cardBuilder;
        this.templates = new Map();
        this.templateConfigs = [
            {
                id: 'dashain2',
                name: 'Traditional Tika',
                background: 'linear-gradient(135deg, #dc143c, #ff6347)',
                colors: ['#dc143c', '#ff6347'],
                decorations: ['🌺', '🙏', '🌺'],
                wishes: {
                    en: 'Wishing you a blessed Dashain filled with love and happiness.',
                    ne: 'तपाईंलाई प्रेम र खुशीले भरिएको धन्य दशैंको शुभकामना।'
                },
                renderMethod: 'renderTikaTemplateBackground'
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
                },
                renderMethod: 'renderTiharLightsBackground'
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
                },
                renderMethod: 'renderKiteFlyingBackground'
            }
        ];
    }

    async loadTemplates() {
        // Load modular templates
        if (typeof DurgaGraceTemplate !== 'undefined') {
            const durgaTemplate = new DurgaGraceTemplate(this.cardBuilder);
            this.templates.set('dashain5', durgaTemplate);
        }

        if (typeof PeacefulBlessingsTemplate !== 'undefined') {
            const peacefulTemplate = new PeacefulBlessingsTemplate(this.cardBuilder);
            this.templates.set('dashain4', peacefulTemplate);
        }
    }

    getTemplate(id) {
        return this.templates.get(id);
    }

    getAllTemplateConfigs() {
        // Merge legacy template configs with modular template configs
        const allConfigs = [...this.templateConfigs];
        
        // Add modular template configs
        this.templates.forEach((template, id) => {
            allConfigs.push({
                id: template.id,
                name: template.name,
                background: `linear-gradient(135deg, ${template.colors[0]}, ${template.colors[1]})`,
                colors: template.colors,
                decorations: template.decorations,
                wishes: template.wishes
            });
        });

        return allConfigs;
    }

    renderTemplate(id, ctx, width, height, mode = 'background', animationTime = 0) {
        const template = this.templates.get(id);
        
        if (template) {
            // Use modular template
            switch (mode) {
                case 'preview':
                    template.renderPreview(ctx, width, height, animationTime);
                    break;
                case 'animated':
                    template.renderAnimated(ctx, width, height, animationTime);
                    break;
                default:
                    template.renderBackground(ctx, width, height);
            }
            return true;
        }

        // Fall back to legacy rendering methods
        const config = this.templateConfigs.find(t => t.id === id);
        if (config && this.cardBuilder[config.renderMethod]) {
            this.cardBuilder[config.renderMethod](ctx, width, height, mode === 'preview');
            return true;
        }

        return false;
    }

    renderTemplatePreview(id, ctx, width, height, animationTime) {
        return this.renderTemplate(id, ctx, width, height, 'preview', animationTime);
    }

    renderTemplateAnimated(id, ctx, width, height, animationTime) {
        return this.renderTemplate(id, ctx, width, height, 'animated', animationTime);
    }
}

// Export for module system
if (typeof module !== 'undefined' && module.exports) {
    module.exports = TemplateManager;
}