/**
 * 数据可视化交互网站 - 图表工具函数
 * 包含更多图表类型和辅助功能
 */

// 扩展ChartManager对象
Object.assign(ChartManager, {
    // 创建散点图
    createScatterChart: function(ctx) {
        const data = chartData.scatter;
        this.currentChart = new Chart(ctx, {
            type: 'scatter',
            data: {
                datasets: data.datasets
            },
            options: {
                ...this.config,
                scales: {
                    y: {
                        title: {
                            display: true,
                            text: '制动距离(m)'
                        },
                        grid: {
                            display: document.getElementById('show-grid').checked
                        }
                    },
                    x: {
                        title: {
                            display: true,
                            text: '车速(km/h)'
                        },
                        grid: {
                            display: document.getElementById('show-grid').checked
                        }
                    }
                }
            }
        });
    },
    
    // 创建箱形图（使用自定义绘制方法）
    createBoxPlotChart: function(ctx) {
        // 由于Chart.js本身不支持箱形图，这里使用自定义绘制方法
        const data = chartData.boxplot;
        
        // 创建基础柱状图作为背景
        this.currentChart = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: data.labels,
                datasets: [
                    {
                        // 最小值到最大值的范围（作为背景）
                        label: '数据范围',
                        data: data.datasets[0].data.map(d => d.max - d.min),
                        backgroundColor: 'rgba(54, 162, 235, 0.1)',
                        borderColor: 'rgba(54, 162, 235, 1)',
                        borderWidth: 1,
                        barPercentage: 0.5,
                        base: data.datasets[0].data.map(d => d.min)
                    }
                ]
            },
            options: {
                ...this.config,
                scales: {
                    y: {
                        title: {
                            display: true,
                            text: '发电量(亿千瓦时)'
                        },
                        min: Math.min(...data.datasets[0].data.map(d => d.min)) * 0.95, // 设置最小值
                        max: Math.max(...data.datasets[0].data.map(d => d.max)) * 1.05, // 设置最大值
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
                                const dataIndex = context.dataIndex;
                                const boxData = data.datasets[0].data[dataIndex];
                                return [
                                    `最大值: ${boxData.max}`,
                                    `上四分位: ${boxData.q3}`,
                                    `中位数: ${boxData.median}`,
                                    `下四分位: ${boxData.q1}`,
                                    `最小值: ${boxData.min}`
                                ];
                            }
                        }
                    }
                }
            }
        });
        
        // 添加自定义绘制函数，绘制箱形图的其他元素
        const originalDraw = this.currentChart.draw;
        this.currentChart.draw = function() {
            originalDraw.apply(this, arguments);
            
            const ctx = this.ctx;
            const boxplotData = data.datasets[0].data;
            
            boxplotData.forEach((boxData, index) => {
                const meta = this.getDatasetMeta(0);
                const bar = meta.data[index];
                
                // 获取柱子的位置和尺寸
                const x = bar.x;
                const barWidth = bar.width * 0.8; // 稍微窄一点
                
                // 获取Y轴比例尺
                const yScale = this.scales.y;
                
                // 计算各个位置的Y坐标
                const minY = yScale.getPixelForValue(boxData.min);
                const q1Y = yScale.getPixelForValue(boxData.q1);
                const medianY = yScale.getPixelForValue(boxData.median);
                const q3Y = yScale.getPixelForValue(boxData.q3);
                const maxY = yScale.getPixelForValue(boxData.max);
                
                // 绘制箱体（从Q1到Q3）
                ctx.save();
                ctx.fillStyle = 'rgba(54, 162, 235, 0.6)';
                ctx.fillRect(x - barWidth/2, q3Y, barWidth, q1Y - q3Y);
                ctx.strokeStyle = 'rgba(54, 162, 235, 1)';
                ctx.lineWidth = 1;
                ctx.strokeRect(x - barWidth/2, q3Y, barWidth, q1Y - q3Y);
                
                // 绘制中位数线
                ctx.beginPath();
                ctx.moveTo(x - barWidth/2, medianY);
                ctx.lineTo(x + barWidth/2, medianY);
                ctx.strokeStyle = 'rgba(0, 0, 0, 0.8)';
                ctx.lineWidth = 2;
                ctx.stroke();
                
                // 绘制从箱体到最大值的线
                ctx.beginPath();
                ctx.moveTo(x, q3Y);
                ctx.lineTo(x, maxY);
                ctx.strokeStyle = 'rgba(54, 162, 235, 1)';
                ctx.lineWidth = 1;
                ctx.stroke();
                
                // 绘制从箱体到最小值的线
                ctx.beginPath();
                ctx.moveTo(x, q1Y);
                ctx.lineTo(x, minY);
                ctx.stroke();
                
                // 绘制最大值和最小值的横线
                ctx.beginPath();
                ctx.moveTo(x - barWidth/3, maxY);
                ctx.lineTo(x + barWidth/3, maxY);
                ctx.stroke();
                
                ctx.beginPath();
                ctx.moveTo(x - barWidth/3, minY);
                ctx.lineTo(x + barWidth/3, minY);
                ctx.stroke();
                
                ctx.restore();
            });
        };
    },
    
    // 创建雷达图
    createRadarChart: function(ctx) {
        const data = chartData.radar;
        this.currentChart = new Chart(ctx, {
            type: 'radar',
            data: {
                labels: data.labels,
                datasets: data.datasets
            },
            options: {
                ...this.config,
                scales: {
                    r: {
                        beginAtZero: true,
                        min: 0,
                        max: 1,
                        ticks: {
                            stepSize: 0.2
                        },
                        grid: {
                            display: document.getElementById('show-grid').checked
                        }
                    }
                }
            }
        });
    },
    
    // 创建误差棒图（使用自定义绘制）
    createErrorBarChart: function(ctx) {
        const data = chartData.errorBar;
        
        // 创建基础柱状图
        this.currentChart = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: data.labels,
                datasets: data.datasets.map(dataset => {
                    return {
                        label: dataset.label,
                        data: dataset.data,
                        backgroundColor: dataset.backgroundColor,
                        borderColor: dataset.borderColor,
                        borderWidth: dataset.borderWidth
                    };
                })
            },
            options: {
                ...this.config,
                scales: {
                    y: {
                        beginAtZero: true,
                        title: {
                            display: true,
                            text: '细根生物量(g/m²)'
                        },
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
                                const datasetIndex = context.datasetIndex;
                                const dataIndex = context.dataIndex;
                                const value = context.raw;
                                const error = data.datasets[datasetIndex].errors[dataIndex];
                                return `${context.dataset.label}: ${value} ± ${error}`;
                            }
                        }
                    }
                }
            }
        });
        
        // 添加误差棒（在渲染后绘制）
        const originalDraw = this.currentChart.draw;
        this.currentChart.draw = function() {
            originalDraw.apply(this, arguments);
            
            const meta = this.getDatasetMeta(0);
            const ctx = this.ctx;
            
            // 为每个数据集绘制误差棒
            data.datasets.forEach((dataset, datasetIndex) => {
                const meta = this.getDatasetMeta(datasetIndex);
                
                dataset.data.forEach((value, index) => {
                    const error = dataset.errors[index];
                    const bar = meta.data[index];
                    
                    // 获取柱子的位置和尺寸
                    const x = bar.x;
                    const y = bar.y;
                    const barWidth = bar.width;
                    
                    // 计算误差棒的上下端点
                    const scale = this.scales.y;
                    const errorTopY = scale.getPixelForValue(value + error);
                    const errorBottomY = scale.getPixelForValue(value - error);
                    
                    // 绘制误差棒
                    ctx.save();
                    ctx.beginPath();
                    ctx.lineWidth = 2;
                    ctx.strokeStyle = dataset.borderColor;
                    
                    // 垂直线
                    ctx.moveTo(x, errorTopY);
                    ctx.lineTo(x, errorBottomY);
                    
                    // 顶部横线
                    ctx.moveTo(x - barWidth / 4, errorTopY);
                    ctx.lineTo(x + barWidth / 4, errorTopY);
                    
                    // 底部横线
                    ctx.moveTo(x - barWidth / 4, errorBottomY);
                    ctx.lineTo(x + barWidth / 4, errorBottomY);
                    
                    ctx.stroke();
                    ctx.restore();
                });
            });
        };
    },
    
    // 更新图表信息（标题和描述）
    updateChartInfo: function() {
        const chartTitle = document.getElementById('chart-title');
        const chartDesc = document.getElementById('chart-desc');
        
        // 设置图表标题
        switch(this.currentType) {
            case 'line':
                chartTitle.textContent = '未来15天最高气温和最低气温';
                break;
            case 'bar':
                chartTitle.textContent = '2013—2019财年阿里巴巴淘宝和天猫平台的GMV';
                break;
            case 'horizontalBar':
                chartTitle.textContent = '各商品种类的网购替代率';
                break;
            case 'area':
                chartTitle.textContent = '物流公司物流费用统计';
                break;
            case 'histogram':
                chartTitle.textContent = '人脸识别的灰度直方图';
                break;
            case 'pie':
                chartTitle.textContent = '支付宝月账单报告';
                break;
            case 'scatter':
                chartTitle.textContent = '汽车速度与制动距离的关系';
                break;
            case 'boxplot':
                chartTitle.textContent = '2017年和2018年全国发电量统计';
                break;
            case 'radar':
                chartTitle.textContent = '霍兰德职业兴趣测试';
                break;
            case 'errorBar':
                chartTitle.textContent = '4个树种不同季节的细根生物量';
                break;
        }
        
        // 设置图表描述
        chartDesc.textContent = chartData[this.currentType]?.description || '';
    }
});