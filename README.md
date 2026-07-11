# MT5 Market Analyzer 📊

A comprehensive web-based market analysis tool for MT5 traders that analyzes market structures, supply/demand zones, support/resistance levels, trend analysis, and price action signals.

## Features 🎯

### Market Structure Analysis
- **Higher Highs/Lows Detection** - Identify uptrend confirmations
- **Lower Highs/Lows Detection** - Identify downtrend confirmations
- **Structure Breaks** - Detect bullish and bearish break patterns
- **Trend Direction** - Real-time trend classification

### Supply & Demand Zones
- **Supply Zone Identification** - Detect high-rejection areas where sellers dominated
- **Demand Zone Identification** - Detect low-rejection areas where buyers dominated
- **Zone Strength Calculation** - Quantify zone reliability
- **Zone Test Tracking** - Monitor how many times zones have been tested

### Support & Resistance Levels
- **Pivot Point Calculation** - Dynamic pivot, R1, R2, S1, S2 levels
- **Recent Highs/Lows** - Identify immediate resistance and support
- **Touch Counter** - Track how many times levels have been tested
- **Level Strength Ranking** - Classify levels by strength

### Trend Analysis
- **Moving Average Crossovers** - MA20 and MA50 trend confirmation
- **RSI Analysis** - Identify overbought/oversold conditions
- **MACD Signals** - Momentum and trend confirmation
- **Volatility Measurement** - Quantify market volatility
- **Trend Strength Classification** - Weak, Moderate, or Strong trends

### Price Action Signals
- **Pin Bars** - Long-wick rejection candles
- **Engulfing Patterns** - Strong directional signals
- **Inside Bars** - Consolidation patterns
- **Hammers** - Bullish reversal signals
- **Shooting Stars** - Bearish reversal signals

### Supported Instruments
- EURUSD
- GBPUSD
- USDJPY
- AUDUSD
- GOLD
- SPX500

### Timeframes
- M5, M15, M30
- H1, H4
- D1

## Installation 🚀

1. Clone the repository:
```bash
git clone https://github.com/Castramaine/mt5-market-analyzer.git
cd mt5-market-analyzer
```

2. Open `index.html` in a modern web browser

3. No dependencies to install - uses Chart.js from CDN

## How to Use 📖

1. **Select Symbol** - Choose from the available currency pairs, commodities, or indices
2. **Choose Timeframe** - Select your preferred timeframe (M5-D1)
3. **View Analysis** - The app automatically analyzes and displays:
   - Interactive price chart with moving averages and Bollinger Bands
   - Market structure details
   - Supply and demand zones
   - Support and resistance levels
   - Trend analysis metrics
   - Price action signals

4. **Navigate Tabs** - Click tabs to view different analysis sections
5. **Refresh Analysis** - Click "Analyze Market" button for fresh analysis
6. **Export Data** - Download analysis results as JSON

## File Structure 📁

```
mt5-market-analyzer/
├── index.html           # Main HTML structure
├── styles.css          # Styling and responsive design
├── marketData.js       # Market data generation and technical calculations
├── analyzer.js         # Core market analysis engine
├── chartRenderer.js    # Chart.js visualization
├── app.js             # Main application logic
└── README.md          # This file
```

## Technical Details 🔧

### Market Data Generation
- Simulates realistic OHLC (Open, High, Low, Close) data
- Includes volume information
- Symbol-specific volatility profiles

### Technical Indicators
- **Moving Averages**: SMA, EMA
- **Bollinger Bands**: Standard deviation-based volatility bands
- **RSI**: Relative Strength Index (14-period default)
- **MACD**: Moving Average Convergence Divergence
- **Pivot Points**: Professional pivot point calculations

### Analysis Algorithms
- Structure detection using local extremes
- Zone identification through price rejection patterns
- Support/resistance based on pivot points and recent extremes
- Trend classification using multiple indicators
- Price action pattern recognition

## Features in Detail 🌟

### Real-time Chart Visualization
- Candlestick prices with moving averages
- Bollinger Bands for volatility analysis
- Color-coded indicators (green uptrend, red downtrend)
- Responsive design for mobile and desktop

### Zone Analysis
- Color-coded supply (red) and demand (green) zones
- Strength percentages based on price action
- Test count showing zone rejections
- Recent zone identification

### Level Analysis
- Pivot-based resistance and support
- Recent high/low tracking
- Touch frequency monitoring
- Strength classification (Strong, Medium, Recent)

### Signal Detection
- Multiple candlestick pattern recognition
- Signal type classification (Bullish, Bearish, Neutral)
- Confidence ratings (Low, Medium, High, Very High)

## Browser Compatibility 🌐

- Chrome/Chromium (recommended)
- Firefox
- Safari
- Edge
- Mobile browsers (responsive design)

## Data Note 📌

This application generates simulated market data based on realistic parameters. For live trading, integrate with actual MT5 API or data feed.

## Future Enhancements 🔮

- Live MT5 API integration
- Multiple timeframe analysis (MTF)
- Alert system for signals
- Trading journal integration
- Advanced technical indicators
- WebSocket real-time updates

## License 📄

MIT License - Feel free to use and modify

## Support 💬

For issues and feature requests, please open a GitHub issue.

## Contributing 🤝

Contributions are welcome! Please feel free to submit pull requests.

---

**Made by Castramaine** | Version 1.0 | Last Updated: 2024