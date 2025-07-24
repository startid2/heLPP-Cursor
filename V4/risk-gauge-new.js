class RiskGaugeNew {
    constructor(containerId, options = {}) {
        this.container = document.getElementById(containerId);
        this.options = {
            width: 200,
            height: 100,
            value: 4.2,
            minValue: 1,
            maxValue: 7,
            ...options
        };
        this.init();
    }

    init() {
        this.render();
        this.setValue(this.options.value);
    }

    render() {
        const { width, height } = this.options;
        
        const radius = 75;
        const centerX = 100;
        const centerY = 85;
        
        // Gradient continu (rouge-orange → jaune → vert clair)
        const gradientHTML = `
            <defs>
                <linearGradient id="gaugeGradientNew" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" style="stop-color:#FF5722;stop-opacity:1" />
                    <stop offset="25%" style="stop-color:#FF9800;stop-opacity:1" />
                    <stop offset="50%" style="stop-color:#FFC107;stop-opacity:1" />
                    <stop offset="75%" style="stop-color:#CDDC39;stop-opacity:1" />
                    <stop offset="100%" style="stop-color:#8BC34A;stop-opacity:1" />
                </linearGradient>
            </defs>
        `;
        
        // Arc principal avec gradient continu
        const mainArcHTML = `
            <path d="M 25 85 A 75 75 0 0 1 175 85" 
                  stroke="url(#gaugeGradientNew)" 
                  stroke-width="8" 
                  fill="none" 
                  stroke-linecap="round"/>
        `;
        
        // Générer les graduations
        let marksHTML = '';
        for (let i = 0; i <= 7; i++) {
            const angle = -90 + (i * sectionAngle);
            const rad = (angle * Math.PI) / 180;
            const x = centerX + radius * Math.cos(rad);
            const y = centerY - radius * Math.sin(rad);
            const markLength = (i === 0 || i === 7) ? 10 : 8;
            const markWidth = (i === 0 || i === 7) ? 1.5 : 1;
            
            marksHTML += `
                <line x1="${x}" y1="${y}" x2="${x}" y2="${y - markLength}" 
                      stroke="#333" stroke-width="${markWidth}"/>
            `;
        }
        
        this.container.innerHTML = `
            <div class="risk-gauge-new" style="width: ${width}px; height: ${height}px; margin: 0 auto; position: relative;">
                <svg width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" style="overflow: visible;">
                    ${gradientHTML}
                    
                    <!-- Arc principal avec gradient continu -->
                    ${mainArcHTML}
                    
                    <!-- Plage de profil de risque (plus discrète) -->
                    <g class="profile-range" style="opacity: 0.15;">
                        <path d="M 25 85 A 75 75 0 0 1 175 85" 
                              stroke="#FF9800" 
                              stroke-width="8" 
                              fill="none" 
                              stroke-linecap="round"
                              class="profile-range-path"/>
                    </g>
                    
                    <!-- Graduations -->
                    <g class="gauge-marks-new">
                        ${marksHTML}
                    </g>
                    
                    <!-- Pointeur de la stratégie -->
                    <g class="strategy-needle" style="transform-origin: ${centerX}px ${centerY}px;">
                        <line x1="${centerX}" y1="${centerY}" x2="${centerX}" y2="30" 
                              stroke="#000" 
                              stroke-width="3" 
                              stroke-linecap="round"/>
                        <circle cx="${centerX}" cy="${centerY}" r="4" fill="#FF9800"/>
                    </g>
                    
                    <!-- Valeur centrale -->
                    <text x="${centerX}" y="98" 
                          text-anchor="middle" 
                          font-family="DM Sans, sans-serif" 
                          font-size="14" 
                          font-weight="600" 
                          fill="#333" class="gauge-value-new">4.2</text>
                </svg>
            </div>
        `;

        this.strategyNeedle = this.container.querySelector('.strategy-needle');
        this.profileRange = this.container.querySelector('.profile-range-path');
        this.valueText = this.container.querySelector('.gauge-value-new');
        this.gauge = this.container.querySelector('.risk-gauge-new');
    }

    setValue(value) {
        const { minValue, maxValue } = this.options;
        
        // Limiter la valeur entre min et max
        const clampedValue = Math.max(minValue, Math.min(maxValue, value));
        
        // Calculer l'angle de l'aiguille (de -90° à 90°)
        const angle = ((clampedValue - minValue) / (maxValue - minValue)) * 180 - 90;
        
        // Ajuster pour que l'aiguille pointe vers le haut et légèrement à droite
        const adjustedAngle = angle + 5;
        
        // Appliquer la rotation au pointeur
        this.strategyNeedle.style.transform = `rotate(${adjustedAngle}deg)`;
        
        // Mettre à jour le texte de la valeur
        this.valueText.textContent = clampedValue.toFixed(1);
        
        // Mettre à jour la plage de profil
        this.updateProfileRange(clampedValue);
        
        // Ajouter une animation fluide
        this.strategyNeedle.style.transition = 'transform 0.5s ease-out';
    }
    
    updateProfileRange(profileValue) {
        const { minValue, maxValue } = this.options;
        const radius = 75;
        const centerX = 100;
        const centerY = 85;
        
        // Calculer l'angle pour la plage de profil
        const angle = ((profileValue - minValue) / (maxValue - minValue)) * 180;
        const endRad = ((angle - 90) * Math.PI) / 180;
        
        const endX = centerX + radius * Math.cos(endRad);
        const endY = centerY - radius * Math.sin(endRad);
        
        // Créer le chemin de la plage (de la position 1 à la position du profil)
        const startX = centerX + radius * Math.cos(-90 * Math.PI / 180);
        const startY = centerY - radius * Math.sin(-90 * Math.PI / 180);
        
        const largeArcFlag = angle > 180 ? 1 : 0;
        
        this.profileRange.setAttribute('d', `M ${startX} ${startY} A ${radius} ${radius} 0 ${largeArcFlag} 1 ${endX} ${endY}`);
    }

    // Méthode pour changer la valeur avec animation
    animateToValue(value, duration = 1000) {
        const { minValue, maxValue } = this.options;
        const clampedValue = Math.max(minValue, Math.min(maxValue, value));
        
        // Animation fluide
        this.needle.style.transition = `transform ${duration}ms ease-out`;
        this.setValue(clampedValue);
        
        // Retirer la transition après l'animation
        setTimeout(() => {
            this.needle.style.transition = '';
        }, duration);
    }

    // Méthode pour ajouter des interactions
    addInteractions() {
        this.gauge.addEventListener('click', () => {
            // Animation de rebond
            const currentTransform = this.needle.style.transform;
            this.needle.style.transform = currentTransform + ' scale(1.1)';
            setTimeout(() => {
                this.needle.style.transform = currentTransform;
            }, 200);
        });
    }
}

// Export pour utilisation
if (typeof module !== 'undefined' && module.exports) {
    module.exports = RiskGaugeNew;
} 