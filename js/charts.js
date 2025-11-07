/**
 * 数据可视化交互网站 - 图表处理文件
 * 负责创建和管理各种类型的图表
 */

// 图表管理器
const ChartManager = {
    // 当前图表实例
    currentChart: null,
    
    // 当前图表类型
    currentType: 'line',
    
    // 当前数据
    currentData: null,
    
    // 原始数据备份
    originalData: null,
    
    // 输入防抖定时器
    inputTimeout: null,
    
    // 图表配置
    config: {
        animation: {
            duration: 1000
        },
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                display: true,
                position: 'top'
            },
            tooltip: {
                enabled: true
            }
        }
    },
    
    // 初始化图表
    init: function(type = 'line') {
        this.currentType = type;
        this.createChart();
        this.updateDataTable();
    },
    
    // 创建图表
    createChart: function() {
        const ctx = document.getElementById('chart').getContext('2d');
        
        // 如果已有图表，先销毁
        if (this.currentChart) {
            this.currentChart.destroy();
        }
        
        // 根据图表类型创建不同的图表
        switch(this.currentType) {
            case 'line':
                this.createLineChart(ctx);
                break;
            case 'bar':
                this.createBarChart(ctx);
                break;
            case 'horizontalBar':
                this.createHorizontalBarChart(ctx);
                break;
            case 'area':
                this.createAreaChart(ctx);
                break;
            case 'histogram':
                this.createHistogramChart(ctx);
                break;
            case 'pie':
                this.createPieChart(ctx);
                break;
            case 'scatter':
                this.createScatterChart(ctx);
                break;
            case 'boxplot':
                this.createBoxPlotChart(ctx);
                break;
            case 'radar':
                this.createRadarChart(ctx);
                break;
            case 'errorBar':
                this.createErrorBarChart(ctx);
                break;
            default:
                this.createLineChart(ctx);
        }
        
        // 更新图表标题和描述
        this.updateChartInfo();
    },
    
    // 创建折线图
    createLineChart: function(ctx) {
        const data = chartData.line;
        
        // 设置当前数据
        this.currentData = [];
        for (let i = 0; i < data.labels.length; i++) {
            const rowData = [];
            data.datasets.forEach(dataset => {
                rowData.push(dataset.data[i]);
            });
            this.currentData.push(rowData);
        }
        
        this.currentChart = new Chart(ctx, {
            type: 'line',
            data: {
                labels: data.labels,
                datasets: data.datasets
            },
            options: {
                ...this.config,
                scales: {
                    y: {
                        beginAtZero: false,
                        grid: {
                            display: document.getElementById('show-grid').checked
                        }
                    },
                    x: {
                        grid: {
                            display: document.getElementById('show-grid').checked
                        }
                    }
                },
                plugins: {
                    ...this.config.plugins,
                    tooltip: {
                        callbacks: {
                            label: function(context) {
                                return `${context.dataset.label}: ${context.raw}°C`;
                            }
                        }
                    }
                }
            }
        });
    },
    
    // 创建柱形图
    createBarChart: function(ctx) {
        // 使用默认的单组数据
        const data = chartData.bar;
        
        this.currentChart = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: data.labels,
                datasets: data.datasets
            },
            options: {
                ...this.config,
                scales: {
                    y: {
                        beginAtZero: true,
                        grid: {
                            display: document.getElementById('show-grid').checked
                        }
                    },
                    x: {
                        grid: {
                            display: document.getElementById('show-grid').checked
                        }
                    }
                }
            }
        });
    },
    
    // 创建条形图（水平柱状图）
    createHorizontalBarChart: function(ctx) {
        const data = chartData.horizontalBar;
        this.currentChart = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: data.labels,
                datasets: data.datasets
            },
            options: {
                ...this.config,
                indexAxis: 'y',
                scales: {
                    x: {
                        beginAtZero: true,
                        grid: {
                            display: document.getElementById('show-grid').checked
                        }
                    },
                    y: {
                        grid: {
                            display: document.getElementById('show-grid').checked
                        }
                    }
                }
            }
        });
    },
    
    // 创建堆积面积图
    createAreaChart: function(ctx) {
        const data = chartData.area;
        this.currentChart = new Chart(ctx, {
            type: 'line',
            data: {
                labels: data.labels,
                datasets: data.datasets
            },
            options: {
                ...this.config,
                scales: {
                    y: {
                        stacked: true,
                        beginAtZero: true,
                        grid: {
                            display: document.getElementById('show-grid').checked
                        }
                    },
                    x: {
                        grid: {
                            display: document.getElementById('show-grid').checked
                        }
                    }
                },
                elements: {
                    line: {
                        tension: 0.4
                    }
                }
            }
        });
    },
    
    // 创建直方图
    createHistogramChart: function(ctx) {
        try {
            // 生成直方图数据
            const rawData = chartData.histogram.generateData();
            console.log("生成的原始数据:", rawData.length, "个数据点");
            
            // 计算直方图的箱子
            const binCount = 20;
            const min = Math.min(...rawData);
            const max = Math.max(...rawData);
            const binSize = (max - min) / binCount;
            
            console.log("数据范围:", min, "到", max, "箱子大小:", binSize);
            
            // 初始化箱子计数
            const bins = Array(binCount).fill(0);
            
            // 统计每个箱子的数量
            rawData.forEach(value => {
                const binIndex = Math.min(Math.floor((value - min) / binSize), binCount - 1);
                bins[binIndex]++;
            });
            
            console.log("箱子计数:", bins);
            
            // 生成箱子标签
            const binLabels = Array(binCount).fill(0).map((_, i) => {
                return `${Math.round(min + i * binSize)}`;
            });
            
            // 创建直方图（使用柱状图表示）
            this.currentChart = new Chart(ctx, {
                type: 'bar',
                data: {
                    labels: binLabels,
                    datasets: [{
                        label: '频率',
                        data: bins,
                        backgroundColor: 'rgba(75, 192, 192, 0.6)',
                        borderColor: 'rgba(75, 192, 192, 1)',
                        borderWidth: 1,
                        barPercentage: 1.0,
                        categoryPercentage: 1.0
                    }]
                },
                options: {
                    ...this.config,
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                        ...this.config.plugins,
                        tooltip: {
                            callbacks: {
                                title: function(tooltipItems) {
                                    const index = tooltipItems[0].dataIndex;
                                    const value = parseInt(binLabels[index]);
                                    return `灰度值: ${value} - ${value + Math.round(binSize)}`;
                                },
                                label: function(context) {
                                    return `频率: ${context.raw}`;
                                }
                            }
                        }
                    },
                    scales: {
                        y: {
                            beginAtZero: true,
                            title: {
                                display: true,
                                text: '频率'
                            },
                            grid: {
                                display: document.getElementById('show-grid').checked
                            }
                        },
                        x: {
                            title: {
                                display: true,
                                text: '灰度值'
                            },
                            grid: {
                                display: document.getElementById('show-grid').checked
                            }
                        }
                    }
                }
            });
        } catch (error) {
            console.error("创建直方图时出错:", error);
            // 创建一个错误提示
            document.getElementById('chart-title').textContent = "直方图加载失败";
            document.getElementById('chart-desc').textContent = "创建直方图时发生错误: " + error.message;
        }
    },
    
    // 创建饼图
    createPieChart: function(ctx) {
        const data = chartData.pie;
        
        // 判断是否为环形图
        const isDonut = false; // 默认使用饼图，不显示环形图
        
        this.currentChart = new Chart(ctx, {
            type: 'pie',
            data: {
                labels: data.labels,
                datasets: data.datasets
            },
            options: {
                ...this.config,
                cutout: isDonut ? 0 : '50%',
                plugins: {
                    ...this.config.plugins,
                    tooltip: {
                        callbacks: {
                            label: function(context) {
                                const label = context.label || '';
                                const value = context.raw || 0;
                                const total = context.chart.data.datasets[0].data.reduce((a, b) => a + b, 0);
                                const percentage = Math.round((value / total) * 100);
                                return `${label}: ${value}元 (${percentage}%)`;
                            }
                        }
                    }
                }
            }
        });
    }
};