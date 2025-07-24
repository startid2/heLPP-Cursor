class RiskGauge {
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
        
        this.container.innerHTML = `
            <div class="risk-gauge" style="width: ${width}px; height: ${height}px; margin: 0 auto; position: relative;">
                <svg width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" style="overflow: visible;">
                    <!-- Fond de la jauge avec gradient continu -->
                    <defs>
                        <linearGradient id="gaugeGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                            <stop offset="0%" style="stop-color:#FF5722;stop-opacity:1" />
                            <stop offset="25%" style="stop-color:#FF9800;stop-opacity:1" />
                            <stop offset="50%" style="stop-color:#FFC107;stop-opacity:1" />
                            <stop offset="75%" style="stop-color:#FFEB3B;stop-opacity:1" />
                            <stop offset="100%" style="stop-color:#FFEB3B;stop-opacity:1" />
                        </linearGradient>
                    </defs>
                    
                    <!-- Arc de la jauge avec gradient continu -->
                    <path d="M 25 85 A 75 75 0 0 1 175 85" 
                          stroke="url(#gaugeGradient)" 
                          stroke-width="8" 
                          fill="none" 
                          stroke-linecap="round"/>
                    
                    <!-- Graduations (7 marques comme dans l'image) -->
                    <g class="gauge-marks">
                        <line x1="25" y1="85" x2="25" y2="75" stroke="#333" stroke-width="1.5"/>
                        <line x1="41.67" y1="83" x2="41.67" y2="73" stroke="#666" stroke-width="1"/>
                        <line x1="58.33" y1="81" x2="58.33" y2="71" stroke="#666" stroke-width="1"/>
                        <line x1="75" y1="79" x2="75" y2="69" stroke="#666" stroke-width="1"/>
                        <line x1="91.67" y1="77" x2="91.67" y2="67" stroke="#666" stroke-width="1"/>
                        <line x1="108.33" y1="75" x2="108.33" y2="65" stroke="#666" stroke-width="1"/>
                        <line x1="125" y1="73" x2="125" y2="63" stroke="#666" stroke-width="1"/>
                        <line x1="141.67" y1="71" x2="141.67" y2="61" stroke="#666" stroke-width="1"/>
                        <line x1="158.33" y1="69" x2="158.33" y2="59" stroke="#666" stroke-width="1"/>
                        <line x1="175" y1="85" x2="175" y2="75" stroke="#333" stroke-width="1.5"/>
                    </g>
                    
                    <!-- Aiguille -->
                    <g class="gauge-needle" style="transform-origin: ${centerX}px ${centerY}px;">
                        <line x1="${centerX}" y1="${centerY}" x2="${centerX}" y2="30" 
                              stroke="#000" 
                              stroke-width="2.5" 
                              stroke-linecap="round"/>
                        <circle cx="${centerX}" cy="${centerY}" r="3" fill="#000"/>
                    </g>
                    
                    <!-- Valeur centrale -->
                    <text x="${centerX}" y="98" 
                          text-anchor="middle" 
                          font-family="DM Sans, sans-serif" 
                          font-size="14" 
                          font-weight="600" 
                          fill="#333" class="gauge-value">4.2</text>
                </svg>
            </div>
        `;

        this.needle = this.container.querySelector('.gauge-needle');
        this.valueText = this.container.querySelector('.gauge-value');
        this.gauge = this.container.querySelector('.risk-gauge');
    }

    setValue(value) {
        const { minValue, maxValue } = this.options;
        
        // Limiter la valeur entre min et max
        const clampedValue = Math.max(minValue, Math.min(maxValue, value));
        
        // Calculer l'angle de l'aiguille (de -90° à 90°)
        const angle = ((clampedValue - minValue) / (maxValue - minValue)) * 180 - 90;
        
        // Ajuster pour que l'aiguille pointe vers le haut et légèrement à droite
        const adjustedAngle = angle + 10;
        
        // Appliquer la rotation à l'aiguille
        this.needle.style.transform = `rotate(${adjustedAngle}deg)`;
        
        // Mettre à jour le texte de la valeur
        this.valueText.textContent = clampedValue.toFixed(1);
        
        // Ajouter une animation fluide
        this.needle.style.transition = 'transform 0.5s ease-out';
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
    module.exports = RiskGauge;
} 