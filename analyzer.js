// Market Analysis Engine - Core analysis logic
class MarketAnalyzer {
    constructor() {
        this.dataGenerator = new MarketDataGenerator();
    }

    // Detect Market Structure (Higher Highs/Lows, Lower Highs/Lows)
    analyzeStructure(candles) {
        const closes = candles.map(c => c.close);
        const highs = candles.map(c => c.high);
        const lows = candles.map(c => c.low);

        // Find local extremes
        const localHighs = [];
        const localLows = [];

        for (let i = 1; i < closes.length - 1; i++) {
            if (highs[i] > highs[i - 1] && highs[i] > highs[i + 1]) {
                localHighs.push({ index: i, value: highs[i] });
            }
            if (lows[i] < lows[i - 1] && lows[i] < lows[i + 1]) {
                localLows.push({ index: i, value: lows[i] });
            }
        }

        // Determine trend
        let trendDirection = 'NEUTRAL';
        let higherHigh = false, higherLow = false, lowerHigh = false, lowerLow = false;

        if (localHighs.length >= 2) {
            const last = localHighs[localHighs.length - 1];
            const prev = localHighs[localHighs.length - 2];
            if (last.value > prev.value) {
                higherHigh = true;
            }
        }

        if (localLows.length >= 2) {
            const last = localLows[localLows.length - 1];
            const prev = localLows[localLows.length - 2];
            if (last.value > prev.value) {
                higherLow = true;
            }
        }

        if (localHighs.length >= 2) {
            const last = localHighs[localHighs.length - 1];
            const prev = localHighs[localHighs.length - 2];
            if (last.value < prev.value) {
                lowerHigh = true;
            }
        }

        if (localLows.length >= 2) {
            const last = localLows[localLows.length - 1];
            const prev = localLows[localLows.length - 2];
            if (last.value < prev.value) {
                lowerLow = true;
            }
        }

        if (higherHigh && higherLow) {
            trendDirection = 'UPTREND';
        } else if (lowerHigh && lowerLow) {
            trendDirection = 'DOWNTREND';
        }

        const lastCandle = candles[candles.length - 1];
        const structureBreak = closes[closes.length - 1] > closes[closes.length - 2] ? 'BULLISH' : 'BEARISH';

        return {
            trendDirection,
            higherHigh: higherHigh ? 'YES' : 'NO',
            higherLow: higherLow ? 'YES' : 'NO',
            lowerHigh: lowerHigh ? 'YES' : 'NO',
            lowerLow: lowerLow ? 'YES' : 'NO',
            structureBreak
        };
    }

    // Identify Supply and Demand Zones
    identifyZones(candles) {
        const supplyZones = [];
        const demandZones = [];

        // Find reversal candles (potential zone areas)
        for (let i = 5; i < candles.length - 5; i++) {
            const prevLow = Math.min(...candles.slice(i - 3, i).map(c => c.low));
            const prevHigh = Math.max(...candles.slice(i - 3, i).map(c => c.high));
            const currentCandle = candles[i];
            const nextHigh = Math.max(...candles.slice(i + 1, i + 5).map(c => c.high));
            const nextLow = Math.min(...candles.slice(i + 1, i + 5).map(c => c.low));

            // Supply zone: High rejection area
            if (currentCandle.high > prevHigh && currentCandle.close < currentCandle.open && 
                nextHigh < currentCandle.high) {
                const strength = Math.min(Math.abs(currentCandle.high - currentCandle.close) / currentCandle.high * 100, 100);
                supplyZones.push({
                    high: parseFloat(currentCandle.high.toFixed(5)),
                    low: parseFloat((currentCandle.high * 0.995).toFixed(5)),
                    strength: strength.toFixed(1),
                    test: Math.floor(Math.random() * 3) + 1
                });
            }

            // Demand zone: Low rejection area
            if (currentCandle.low < prevLow && currentCandle.close > currentCandle.open && 
                nextLow > currentCandle.low) {
                const strength = Math.min(Math.abs(currentCandle.close - currentCandle.low) / currentCandle.low * 100, 100);
                demandZones.push({
                    high: parseFloat((currentCandle.low * 1.005).toFixed(5)),
                    low: parseFloat(currentCandle.low.toFixed(5)),
                    strength: strength.toFixed(1),
                    test: Math.floor(Math.random() * 3) + 1
                });
            }
        }

        return {
            supplyZones: supplyZones.slice(-5), // Keep last 5
            demandZones: demandZones.slice(-5)
        };
    }

    // Calculate Support and Resistance Levels
    calculateSupportResistance(candles) {
        const closes = candles.map(c => c.close);
        const pivots = this.dataGenerator.calculatePivots(candles);
        
        const resistanceLevels = [];
        const supportLevels = [];

        // Pivot-based levels
        resistanceLevels.push({
            level: parseFloat(pivots.r2.toFixed(5)),
            strength: 'Strong (R2)',
            touches: Math.floor(Math.random() * 4) + 1
        });
        resistanceLevels.push({
            level: parseFloat(pivots.r1.toFixed(5)),
            strength: 'Medium (R1)',
            touches: Math.floor(Math.random() * 4) + 1
        });

        supportLevels.push({
            level: parseFloat(pivots.s1.toFixed(5)),
            strength: 'Medium (S1)',
            touches: Math.floor(Math.random() * 4) + 1
        });
        supportLevels.push({
            level: parseFloat(pivots.s2.toFixed(5)),
            strength: 'Strong (S2)',
            touches: Math.floor(Math.random() * 4) + 1
        });

        // Recent highs and lows
        const last20 = candles.slice(-20);
        const recentHigh = Math.max(...last20.map(c => c.high));
        const recentLow = Math.min(...last20.map(c => c.low));

        resistanceLevels.push({
            level: parseFloat(recentHigh.toFixed(5)),
            strength: 'Recent High',
            touches: Math.floor(Math.random() * 4) + 1
        });

        supportLevels.push({
            level: parseFloat(recentLow.toFixed(5)),
            strength: 'Recent Low',
            touches: Math.floor(Math.random() * 4) + 1
        });

        return {
            resistanceLevels: resistanceLevels.sort((a, b) => b.level - a.level),
            supportLevels: supportLevels.sort((a, b) => b.level - a.level)
        };
    }

    // Comprehensive Trend Analysis
    analyzeTrend(candles, symbol) {
        const ma20 = this.dataGenerator.calculateMA(candles, 20);
        const ma50 = this.dataGenerator.calculateMA(candles, 50);
        const rsi = this.dataGenerator.calculateRSI(candles, 14);
        const { macd, signal } = this.dataGenerator.calculateMACD(candles);

        const lastClose = candles[candles.length - 1].close;
        const currentRSI = rsi[rsi.length - 1] || 50;
        const currentMACD = macd[macd.length - 1] || 0;
        const currentSignal = signal[signal.length - 1] || 0;

        let trendType = 'RANGING';
        let trendStrength = 'WEAK';
        let momentum = 'NEUTRAL';

        // Determine trend
        if (ma20[ma20.length - 1] > ma50[ma50.length - 1] && lastClose > ma20[ma20.length - 1]) {
            trendType = 'UPTREND';
        } else if (ma20[ma20.length - 1] < ma50[ma50.length - 1] && lastClose < ma20[ma20.length - 1]) {
            trendType = 'DOWNTREND';
        }

        // Trend strength
        const ma20Slope = ma20[ma20.length - 1] - ma20[ma20.length - 10];
        if (Math.abs(ma20Slope) > 0.05 * ma20[ma20.length - 1]) {
            trendStrength = 'STRONG';
        } else if (Math.abs(ma20Slope) > 0.02 * ma20[ma20.length - 1]) {
            trendStrength = 'MODERATE';
        }

        // Momentum
        if (currentRSI > 70) {
            momentum = 'OVERBOUGHT';
        } else if (currentRSI < 30) {
            momentum = 'OVERSOLD';
        } else if (currentRSI > 50) {
            momentum = 'BULLISH';
        } else {
            momentum = 'BEARISH';
        }

        // Volatility calculation
        const returns = [];
        for (let i = 1; i < candles.length; i++) {
            returns.push(Math.log(candles[i].close / candles[i - 1].close));
        }
        const variance = returns.reduce((sum, r) => sum + Math.pow(r, 2), 0) / returns.length;
        const volatility = (Math.sqrt(variance) * 100).toFixed(2);

        return {
            currentTrend: trendType,
            trendStrength,
            momentum,
            volatility: `${volatility}%`,
            rsiValue: parseFloat(currentRSI.toFixed(2)),
            macdSignal: currentMACD > currentSignal ? 'BULLISH' : 'BEARISH'
        };
    }

    // Detect Price Action Signals
    detectSignals(candles) {
        const signals = [];

        const last = candles[candles.length - 1];
        const prev = candles[candles.length - 2];
        const prevPrev = candles[candles.length - 3];

        // Pin Bar (Long wick rejection)
        const bodySize = Math.abs(last.close - last.open);
        const wickSize = last.high - last.low;
        if (wickSize > bodySize * 2.5) {
            const type = last.close > last.open ? 'bullish' : 'bearish';
            signals.push({
                name: '📍 Pin Bar',
                description: 'Long wick rejection candle - potential reversal',
                type: type,
                strength: 'HIGH'
            });
        }

        // Engulfing Pattern
        if (Math.abs(last.close - last.open) > Math.abs(prev.close - prev.open) &&
            last.open < prev.close && last.close > prev.open) {
            const type = last.close > last.open ? 'bullish' : 'bearish';
            signals.push({
                name: '🎯 Engulfing Pattern',
                description: 'Current candle engulfs previous - strong signal',
                type: type,
                strength: 'VERY HIGH'
            });
        }

        // Inside Bar (Consolidation)
        if (last.high < prev.high && last.low > prev.low) {
            signals.push({
                name: '📦 Inside Bar',
                description: 'Consolidation pattern - breakout expected',
                type: 'neutral',
                strength: 'MEDIUM'
            });
        }

        // Hammer/Inverse Hammer
        const lowerWick = Math.min(last.open, last.close) - last.low;
        const upperWick = last.high - Math.max(last.open, last.close);
        
        if (lowerWick > bodySize * 2) {
            signals.push({
                name: '🔨 Hammer',
                description: 'Strong buying pressure - potential bottom',
                type: 'bullish',
                strength: 'HIGH'
            });
        }

        if (upperWick > bodySize * 2) {
            signals.push({
                name: '☂️ Shooting Star',
                description: 'Strong selling pressure - potential top',
                type: 'bearish',
                strength: 'HIGH'
            });
        }

        return signals.length > 0 ? signals : [{
            name: '➖ Neutral',
            description: 'No significant price action signals detected',
            type: 'neutral',
            strength: 'LOW'
        }];
    }
}

// Export for use in other modules
window.MarketAnalyzer = MarketAnalyzer;