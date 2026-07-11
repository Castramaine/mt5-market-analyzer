// Chart Renderer - Handles chart.js visualization
class ChartRenderer {
    constructor() {
        this.chart = null;
        this.dataGenerator = new MarketDataGenerator();
    }

    // Render candlestick chart with indicators
    renderChart(candles, symbol) {
        const ctx = document.getElementById('marketChart').getContext('2d');
        
        // Calculate indicators
        const ma20 = this.dataGenerator.calculateMA(candles, 20);
        const ma50 = this.dataGenerator.calculateMA(candles, 50);
        const bb = this.dataGenerator.calculateBollingerBands(candles, 20, 2);

        // Prepare chart data
        const labels = candles.map((_, i) => i);
        
        // Format OHLC data for display
        const closes = candles.map(c => c.close);
        const highs = candles.map(c => c.high);
        const lows = candles.map(c => c.low);

        if (this.chart) {
            this.chart.destroy();
        }

        this.chart = new Chart(ctx, {
            type: 'line',
            data: {
                labels: labels,
                datasets: [
                    {
                        label: 'Close Price',
                        data: closes,
                        borderColor: '#00d4ff',
                        backgroundColor: 'rgba(0, 212, 255, 0.05)',
                        borderWidth: 2,
                        fill: false,
                        tension: 0.3,
                        pointRadius: 0,
                        yAxisID: 'y'
                    },
                    {
                        label: 'MA 20',
                        data: ma20,
                        borderColor: '#00ff88',
                        backgroundColor: 'rgba(0, 255, 136, 0)',
                        borderWidth: 1.5,
                        fill: false,
                        tension: 0.3,
                        pointRadius: 0,
                        borderDash: [5, 5],
                        yAxisID: 'y'
                    },
                    {
                        label: 'MA 50',
                        data: ma50,
                        borderColor: '#ff4444',
                        backgroundColor: 'rgba(255, 68, 68, 0)',
                        borderWidth: 1.5,
                        fill: false,
                        tension: 0.3,
                        pointRadius: 0,
                        borderDash: [5, 5],
                        yAxisID: 'y'
                    },
                    {
                        label: 'Upper BB',
                        data: bb.upper,
                        borderColor: '#ffaa00',
                        backgroundColor: 'rgba(255, 170, 0, 0)',
                        borderWidth: 1,
                        fill: false,
                        tension: 0.3,
                        pointRadius: 0,
                        borderDash: [3, 3],
                        yAxisID: 'y'
                    },
                    {
                        label: 'Lower BB',
                        data: bb.lower,
                        borderColor: '#ffaa00',
                        backgroundColor: 'rgba(255, 170, 0, 0)',
                        borderWidth: 1,
                        fill: false,
                        tension: 0.3,
                        pointRadius: 0,
                        borderDash: [3, 3],
                        yAxisID: 'y'
                    }
                ]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                interaction: {
                    mode: 'index',
                    intersect: false
                },
                plugins: {
                    legend: {
                        labels: {
                            color: '#e0e0e0',
                            font: {
                                size: 12
                            }
                        },
                        position: 'top'
                    },
                    title: {
                        display: true,
                        text: `${symbol} Market Chart`,
                        color: '#00d4ff',
                        font: {
                            size: 14,
                            weight: 'bold'
                        }
                    }
                },
                scales: {
                    y: {
                        type: 'linear',
                        display: true,
                        position: 'left',
                        grid: {
                            color: 'rgba(255, 255, 255, 0.05)',
                            drawBorder: false
                        },
                        ticks: {
                            color: '#a0a0a0',
                            font: {
                                size: 11
                            }
                        }
                    },
                    x: {
                        grid: {
                            color: 'rgba(255, 255, 255, 0.05)',
                            drawBorder: false
                        },
                        ticks: {
                            color: '#a0a0a0',
                            font: {
                                size: 11
                            }
                        }
                    }
                }
            }
        });
    }
}

// Export for use in other modules
window.ChartRenderer = ChartRenderer;