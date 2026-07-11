// Main Application - App.js
class MT5MarketAnalyzerApp {
    constructor() {
        this.analyzer = new MarketAnalyzer();
        this.chartRenderer = new ChartRenderer();
        this.dataGenerator = new MarketDataGenerator();
        this.currentSymbol = 'EURUSD';
        this.currentTimeframe = 'H1';
        this.candles = [];
        
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.loadInitialData();
    }

    setupEventListeners() {
        // Tab switching
        document.querySelectorAll('.tab-button').forEach(button => {
            button.addEventListener('click', (e) => this.switchTab(e.target.dataset.tab));
        });

        // Symbol and timeframe selection
        document.getElementById('symbolSelect').addEventListener('change', (e) => {
            this.currentSymbol = e.target.value;
            this.loadInitialData();
        });

        document.getElementById('timeframeSelect').addEventListener('change', (e) => {
            this.currentTimeframe = e.target.value;
            this.loadInitialData();
        });

        // Action buttons
        document.getElementById('analyzeBtn').addEventListener('click', () => this.analyzeMarket());
        document.getElementById('exportBtn').addEventListener('click', () => this.exportData());
    }

    loadInitialData() {
        // Generate market data
        this.candles = this.dataGenerator.generateCandles(this.currentSymbol, 100);
        
        // Render chart
        this.chartRenderer.renderChart(this.candles, this.currentSymbol);
        
        // Run analysis
        this.analyzeMarket();
    }

    switchTab(tabName) {
        // Hide all tabs
        document.querySelectorAll('.tab-content').forEach(tab => {
            tab.classList.remove('active');
        });

        // Remove active class from buttons
        document.querySelectorAll('.tab-button').forEach(btn => {
            btn.classList.remove('active');
        });

        // Show selected tab
        document.getElementById(tabName).classList.add('active');
        
        // Highlight button
        document.querySelector(`[data-tab="${tabName}"]`).classList.add('active');
    }

    analyzeMarket() {
        // Market Structure Analysis
        const structure = this.analyzer.analyzeStructure(this.candles);
        document.getElementById('trendDirection').textContent = structure.trendDirection;
        document.getElementById('higherHigh').textContent = structure.higherHigh;
        document.getElementById('higherLow').textContent = structure.higherLow;
        document.getElementById('lowerHigh').textContent = structure.lowerHigh;
        document.getElementById('lowerLow').textContent = structure.lowerLow;
        document.getElementById('structureBreak').textContent = structure.structureBreak;

        // Supply and Demand Zones
        const zones = this.analyzer.identifyZones(this.candles);
        this.displaySupplyZones(zones.supplyZones);
        this.displayDemandZones(zones.demandZones);

        // Support and Resistance Levels
        const levels = this.analyzer.calculateSupportResistance(this.candles);
        this.displayResistanceLevels(levels.resistanceLevels);
        this.displaySupportLevels(levels.supportLevels);

        // Trend Analysis
        const trend = this.analyzer.analyzeTrend(this.candles, this.currentSymbol);
        this.displayTrendAnalysis(trend);

        // Price Action Signals
        const signals = this.analyzer.detectSignals(this.candles);
        this.displayPriceActionSignals(signals);

        // Update last update time
        const now = new Date();
        document.getElementById('lastUpdate').textContent = now.toLocaleTimeString();
    }

    displaySupplyZones(zones) {
        const container = document.getElementById('supplyZones');
        if (zones.length === 0) {
            container.innerHTML = '<p class="loading">No supply zones detected</p>';
            return;
        }

        container.innerHTML = zones.map(zone => `
            <div class="zone-item supply">
                <div>
                    <span class="zone-price">${zone.high.toFixed(5)}</span>
                    <span class="zone-strength strong">Strength: ${zone.strength}%</span>
                </div>
                <div>Tests: ${zone.test}</div>
            </div>
        `).join('');
    }

    displayDemandZones(zones) {
        const container = document.getElementById('demandZones');
        if (zones.length === 0) {
            container.innerHTML = '<p class="loading">No demand zones detected</p>';
            return;
        }

        container.innerHTML = zones.map(zone => `
            <div class="zone-item demand">
                <div>
                    <span class="zone-price">${zone.low.toFixed(5)}</span>
                    <span class="zone-strength strong">Strength: ${zone.strength}%</span>
                </div>
                <div>Tests: ${zone.test}</div>
            </div>
        `).join('');
    }

    displayResistanceLevels(levels) {
        const container = document.getElementById('resistanceLevels');
        container.innerHTML = levels.map(level => `
            <div class="level-item">
                <div>
                    <span class="zone-price">${level.level.toFixed(5)}</span>
                    <span class="zone-strength">${level.strength}</span>
                </div>
                <div>Touches: ${level.touches}</div>
            </div>
        `).join('');
    }

    displaySupportLevels(levels) {
        const container = document.getElementById('supportLevels');
        container.innerHTML = levels.map(level => `
            <div class="level-item">
                <div>
                    <span class="zone-price">${level.level.toFixed(5)}</span>
                    <span class="zone-strength">${level.strength}</span>
                </div>
                <div>Touches: ${level.touches}</div>
            </div>
        `).join('');
    }

    displayTrendAnalysis(trend) {
        const trendBadgeClass = trend.currentTrend === 'UPTREND' ? 'uptrend' : 
                               trend.currentTrend === 'DOWNTREND' ? 'downtrend' : 'ranging';
        
        document.getElementById('currentTrend').innerHTML = 
            `<span class="trend-badge ${trendBadgeClass}">${trend.currentTrend}</span>`;
        document.getElementById('trendStrength').textContent = trend.trendStrength;
        document.getElementById('momentum').textContent = trend.momentum;
        document.getElementById('volatility').textContent = trend.volatility;
        document.getElementById('rsiValue').textContent = trend.rsiValue;
        
        const macdBadgeClass = trend.macdSignal === 'BULLISH' ? 'uptrend' : 'downtrend';
        document.getElementById('macdSignal').innerHTML = 
            `<span class="trend-badge ${macdBadgeClass}">${trend.macdSignal}</span>`;
    }

    displayPriceActionSignals(signals) {
        const container = document.getElementById('priceActionSignals');
        container.innerHTML = signals.map(signal => `
            <div class="signal-item ${signal.type}">
                <div class="signal-title">${signal.name}</div>
                <div class="signal-description">${signal.description}</div>
                <div class="signal-strength">Strength: ${signal.strength}</div>
            </div>
        `).join('');
    }

    exportData() {
        const exportData = {
            symbol: this.currentSymbol,
            timeframe: this.currentTimeframe,
            timestamp: new Date().toISOString(),
            candles: this.candles.slice(-50), // Last 50 candles
            structure: this.analyzer.analyzeStructure(this.candles),
            zones: this.analyzer.identifyZones(this.candles),
            levels: this.analyzer.calculateSupportResistance(this.candles),
            trend: this.analyzer.analyzeTrend(this.candles, this.currentSymbol),
            signals: this.analyzer.detectSignals(this.candles)
        };

        const jsonString = JSON.stringify(exportData, null, 2);
        const blob = new Blob([jsonString], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `MT5_Analysis_${this.currentSymbol}_${this.currentTimeframe}_${new Date().getTime()}.json`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
    }
}

// Initialize app when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    window.app = new MT5MarketAnalyzerApp();
});