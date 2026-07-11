// Market Data Generator - Simulates realistic OHLC data
class MarketDataGenerator {
    constructor() {
        this.basePrice = {
            'EURUSD': 1.0850,
            'GBPUSD': 1.2750,
            'USDJPY': 149.50,
            'AUDUSD': 0.6850,
            'GOLD': 2350.00,
            'SPX500': 5450.00
        };
        this.volatility = {
            'EURUSD': 0.002,
            'GBPUSD': 0.0025,
            'USDJPY': 0.15,
            'AUDUSD': 0.0025,
            'GOLD': 5.0,
            'SPX500': 10.0
        };
    }

    // Generate candles with realistic price action
    generateCandles(symbol, count = 100) {
        const candles = [];
        let currentPrice = this.basePrice[symbol];
        const vol = this.volatility[symbol];

        for (let i = 0; i < count; i++) {
            const open = currentPrice;
            const change = (Math.random() - 0.5) * vol * currentPrice;
            const close = open + change;

            const high = Math.max(open, close) + Math.random() * vol * currentPrice * 0.5;
            const low = Math.min(open, close) - Math.random() * vol * currentPrice * 0.5;

            candles.push({
                time: i,
                open: parseFloat(open.toFixed(5)),
                high: parseFloat(high.toFixed(5)),
                low: parseFloat(low.toFixed(5)),
                close: parseFloat(close.toFixed(5)),
                volume: Math.floor(Math.random() * 1000000 + 500000)
            });

            currentPrice = close;
        }

        return candles;
    }

    // Calculate pivot points
    calculatePivots(candles) {
        const lastCandle = candles[candles.length - 1];
        const h = lastCandle.high;
        const l = lastCandle.low;
        const c = lastCandle.close;

        const pivot = (h + l + c) / 3;
        const r1 = 2 * pivot - l;
        const r2 = pivot + (h - l);
        const s1 = 2 * pivot - h;
        const s2 = pivot - (h - l);

        return { pivot, r1, r2, s1, s2 };
    }

    // Calculate moving averages
    calculateMA(candles, period) {
        const mas = [];
        for (let i = 0; i < candles.length; i++) {
            if (i < period - 1) {
                mas.push(null);
            } else {
                const sum = candles.slice(i - period + 1, i + 1)
                    .reduce((acc, c) => acc + c.close, 0);
                mas.push(sum / period);
            }
        }
        return mas;
    }

    // Calculate RSI
    calculateRSI(candles, period = 14) {
        const rsis = [];
        const changes = [];

        for (let i = 1; i < candles.length; i++) {
            changes.push(candles[i].close - candles[i - 1].close);
        }

        for (let i = 0; i < changes.length; i++) {
            if (i < period - 1) {
                rsis.push(null);
            } else {
                const gains = changes.slice(i - period + 1, i + 1)
                    .filter(c => c > 0)
                    .reduce((a, b) => a + b, 0);
                const losses = changes.slice(i - period + 1, i + 1)
                    .filter(c => c < 0)
                    .reduce((a, b) => a + Math.abs(b), 0);

                const avgGain = gains / period;
                const avgLoss = losses / period;
                const rs = avgGain / (avgLoss || 0.0001);
                const rsi = 100 - (100 / (1 + rs));
                rsis.push(rsi);
            }
        }

        return rsis;
    }

    // Calculate MACD
    calculateMACD(candles) {
        const ema12 = this.calculateEMA(candles, 12);
        const ema26 = this.calculateEMA(candles, 26);

        const macd = [];
        const signal = [];

        for (let i = 0; i < candles.length; i++) {
            if (ema12[i] && ema26[i]) {
                macd.push(ema12[i] - ema26[i]);
            } else {
                macd.push(null);
            }
        }

        // Calculate signal line (EMA of MACD)
        const validMacd = macd.filter(m => m !== null);
        for (let i = 0; i < macd.length; i++) {
            if (i < 8) {
                signal.push(null);
            } else {
                const sum = validMacd.slice(Math.max(0, i - 8), i + 1)
                    .reduce((a, b) => a + b, 0);
                signal.push(sum / 9);
            }
        }

        return { macd, signal };
    }

    calculateEMA(candles, period) {
        const emas = [];
        const k = 2 / (period + 1);

        let sma = 0;
        for (let i = 0; i < period && i < candles.length; i++) {
            sma += candles[i].close;
        }
        sma = sma / period;
        emas[period - 1] = sma;

        for (let i = period; i < candles.length; i++) {
            if (i < period - 1) {
                emas.push(null);
            } else {
                const ema = candles[i].close * k + emas[i - 1] * (1 - k);
                emas.push(ema);
            }
        }

        // Fill early nulls
        for (let i = 0; i < period - 1; i++) {
            emas.unshift(null);
        }

        return emas.slice(0, candles.length);
    }

    // Calculate Bollinger Bands
    calculateBollingerBands(candles, period = 20, stdDev = 2) {
        const sma = this.calculateMA(candles, period);
        const upper = [];
        const lower = [];

        for (let i = 0; i < candles.length; i++) {
            if (i < period - 1) {
                upper.push(null);
                lower.push(null);
            } else {
                const slice = candles.slice(i - period + 1, i + 1);
                const mean = sma[i];
                const variance = slice.reduce((sum, c) => sum + Math.pow(c.close - mean, 2), 0) / period;
                const std = Math.sqrt(variance);

                upper.push(mean + (std * stdDev));
                lower.push(mean - (std * stdDev));
            }
        }

        return { upper, lower, middle: sma };
    }
}

// Export for use in other modules
window.MarketDataGenerator = MarketDataGenerator;