/**
 * 数据可视化交互网站 - 事件处理函数
 * 负责处理用户交互和事件
 */

// 扩展ChartManager对象
Object.assign(ChartManager, {

    
    // 下载图表为图片
    downloadChart: function() {
        const canvas = document.getElementById('chart');
        const link = document.createElement('a');
        link.download = `${document.getElementById('chart-title').textContent}.png`;
        link.href = canvas.toDataURL('image/png');
        link.click();
    },
    
    // 应用图表选项
    applyOptions: function() {
        // 获取选项值
        const showLegend = document.getElementById('show-legend').checked;
        const showGrid = document.getElementById('show-grid').checked;
        const showDataLabels = document.getElementById('show-data-labels').checked;
        const animationSpeed = parseInt(document.getElementById('animation-speed').value);
        
        // 更新配置
        this.config.plugins.legend.display = showLegend;
        this.config.animation.duration = animationSpeed;
        
        // 重新创建图表以应用更改
        this.createChart();
    },
    
    // 编辑数据
    editData: function() {
        console.log('开始编辑数据模式');
        
        // 启用编辑模式
        document.getElementById('data-panel').classList.add('edit-mode');
        
        // 保存原始数据备份
        if (!this.originalData) {
            this.originalData = JSON.parse(JSON.stringify(this.currentData));
            console.log('原始数据已备份:', this.originalData);
        }
        
        // 使表格单元格可编辑
        const cells = document.querySelectorAll('#data-table tbody td:not(:first-child)');
        console.log('找到可编辑单元格数量:', cells.length);
        
        cells.forEach(cell => {
            cell.contentEditable = true;
            cell.classList.add('editable');
            
            // 添加输入事件监听器，实现实时同步
            cell.addEventListener('input', this.handleDataInput.bind(this));
            cell.addEventListener('blur', this.handleDataBlur.bind(this));
            
            console.log('单元格已设置为可编辑:', cell.textContent);
        });
        
        // 启用应用更改和重置数据按钮
        document.getElementById('apply-changes').disabled = false;
        document.getElementById('reset-data').disabled = false;
        
        // 禁用编辑数据按钮
        document.getElementById('edit-data').disabled = true;
        
        console.log('编辑模式已启用');
    },
    
    // 应用更改
    applyDataChanges: function() {
        // 获取编辑后的数据
        const table = document.getElementById('data-table');
        const rows = table.querySelectorAll('tbody tr');
        
        // 保存原始数据备份
        if (!this.originalData) {
            this.originalData = JSON.parse(JSON.stringify(this.currentData));
        }
        
        // 更新图表数据
        const newData = [];
        rows.forEach((row, index) => {
            const cells = row.querySelectorAll('td');
            const rowData = [];
            
            // 跳过第一列（通常是标签或索引）
            for (let i = 1; i < cells.length; i++) {
                const value = parseFloat(cells[i].textContent.trim());
                rowData.push(isNaN(value) ? 0 : value);
            }
            
            newData.push(rowData);
        });
        
        // 更新当前数据
        this.currentData = newData;
        
        // 重新创建图表以应用新数据
        this.createChart();
        
        // 显示成功消息
        this.showMessage('数据已成功应用！', 'success');
        
        // 退出编辑模式
        this.exitEditMode();
    },
    
    // 重置数据
    resetData: function() {
        if (this.originalData) {
            // 恢复原始数据
            this.currentData = JSON.parse(JSON.stringify(this.originalData));
            
            // 重新创建图表
            this.createChart();
            this.updateDataTable();
            
            // 显示成功消息
            this.showMessage('数据已重置为原始值！', 'success');
            
            // 退出编辑模式
            this.exitEditMode();
        }
    },
    
    // 退出编辑模式
    exitEditMode: function() {
        // 清除防抖定时器
        if (this.inputTimeout) {
            clearTimeout(this.inputTimeout);
            this.inputTimeout = null;
        }
        
        // 退出编辑模式
        document.getElementById('data-panel').classList.remove('edit-mode');
        
        // 使表格单元格不可编辑，并移除事件监听器
        const cells = document.querySelectorAll('#data-table tbody td:not(:first-child)');
        cells.forEach(cell => {
            cell.contentEditable = false;
            cell.classList.remove('editable');
            cell.style.border = ''; // 清除错误样式
            
            // 移除事件监听器
            cell.removeEventListener('input', this.handleDataInput);
            cell.removeEventListener('blur', this.handleDataBlur);
        });
        
        // 更新按钮状态
        document.getElementById('apply-changes').disabled = true;
        document.getElementById('reset-data').disabled = true;
        document.getElementById('edit-data').disabled = false;
        
        // 清除原始数据备份
        this.originalData = null;
        
        // 显示退出编辑模式提示
        this.showMessage('已退出编辑模式', 'info');
    },
    
    // 显示消息
    showMessage: function(message, type = 'info') {
        // 创建消息元素
        const messageDiv = document.createElement('div');
        messageDiv.className = `message ${type}`;
        messageDiv.textContent = message;
        
        // 添加样式
        messageDiv.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            padding: 12px 20px;
            border-radius: 4px;
            color: white;
            z-index: 1000;
            font-weight: bold;
            background-color: ${type === 'success' ? '#28a745' : '#007bff'};
            box-shadow: 0 2px 10px rgba(0,0,0,0.2);
        `;
        
        // 添加到页面
        document.body.appendChild(messageDiv);
        
        // 3秒后自动移除
        setTimeout(() => {
            messageDiv.style.opacity = '0';
            setTimeout(() => {
                document.body.removeChild(messageDiv);
            }, 500);
        }, 3000);
    },
    
    // 处理数据输入事件（实时同步）
    handleDataInput: function(event) {
        // 延迟执行，避免频繁更新
        if (this.inputTimeout) {
            clearTimeout(this.inputTimeout);
        }
        
        this.inputTimeout = setTimeout(() => {
            this.updateChartFromTable();
        }, 300); // 300ms防抖延迟
    },
    
    // 处理数据输入框失去焦点事件
    handleDataBlur: function(event) {
        // 立即更新图表
        this.updateChartFromTable();
        
        // 清除防抖定时器
        if (this.inputTimeout) {
            clearTimeout(this.inputTimeout);
            this.inputTimeout = null;
        }
    },
    
    // 从表格更新图表数据
    updateChartFromTable: function() {
        const table = document.getElementById('data-table');
        const rows = table.querySelectorAll('tbody tr');
        
        // 创建新的数据数组
        const newData = [];
        let hasError = false;
        
        rows.forEach((row, rowIndex) => {
            const cells = row.querySelectorAll('td');
            const rowData = [];
            
            // 跳过第一列（通常是标签或索引）
            for (let i = 1; i < cells.length; i++) {
                const cellText = cells[i].textContent.trim();
                // 如果是空字符串，使用0作为默认值
                if (cellText === '') {
                    rowData.push(0);
                    cells[i].style.border = ''; // 清除错误样式
                } else {
                    const value = parseFloat(cellText);
                    if (isNaN(value)) {
                        // 如果输入无效，标记为错误但继续处理
                        hasError = true;
                        rowData.push(0); // 默认值
                        cells[i].style.border = '1px solid red'; // 错误提示
                    } else {
                        rowData.push(value);
                        cells[i].style.border = ''; // 清除错误样式
                    }
                }
            }
            
            newData.push(rowData);
        });
        
        // 如果数据有效，更新图表
        if (!hasError) {
            // 更新当前数据
            this.currentData = newData;
            
            // 确保有图表实例
            if (!this.currentChart) {
                console.warn('当前没有图表实例，重新创建图表');
                this.createChart();
                return;
            }
            
            // 更新图表数据而不是重新创建整个图表
            if (this.currentChart && this.currentChart.data) {
                try {
                    // 根据当前图表类型更新数据
                    if (this.currentType === 'line' || this.currentType === 'bar') {
                        // 折线图和柱形图的数据结构 - 需要转置数据
                        const transposedData = [];
                        const numColumns = newData[0] ? newData[0].length : 0;
                        
                        for (let i = 0; i < numColumns; i++) {
                            const columnData = newData.map(row => row[i]).filter(val => val !== undefined);
                            transposedData.push(columnData);
                        }
                        
                        // 确保数据集数量匹配
                        while (this.currentChart.data.datasets.length < transposedData.length) {
                            this.currentChart.data.datasets.push({
                                ...this.currentChart.data.datasets[0],
                                data: []
                            });
                        }
                        
                        // 更新每个数据集的数据
                        transposedData.forEach((columnData, index) => {
                            if (this.currentChart.data.datasets[index]) {
                                this.currentChart.data.datasets[index].data = columnData;
                            }
                        });
                        
                    } else if (this.currentType === 'pie') {
                        // 饼图的数据结构
                        const pieData = [];
                        const labels = [];
                        
                        newData.forEach((row, index) => {
                            if (row[0] !== undefined) {
                                pieData.push(row[0]);
                                // 获取标签（从第一列）
                                const firstCell = table.querySelectorAll('tbody tr')[index].querySelector('td:first-child');
                                if (firstCell) {
                                    labels.push(firstCell.textContent.trim());
                                }
                            }
                        });
                        
                        if (this.currentChart.data.datasets[0]) {
                            this.currentChart.data.datasets[0].data = pieData;
                        }
                        if (labels.length > 0) {
                            this.currentChart.data.labels = labels;
                        }
                    } else {
                        // 其他图表类型，直接更新数据
                        newData.forEach((rowData, index) => {
                            if (this.currentChart.data.datasets[index]) {
                                this.currentChart.data.datasets[index].data = rowData;
                            }
                        });
                    }
                    
                    // 强制更新图表
                    this.currentChart.update('none'); // 禁用动画以获得更快的响应
                    
                    // 显示实时更新提示
                    this.showMessage('数据已实时更新！', 'success');
                    
                } catch (error) {
                    console.error('更新图表数据时出错:', error);
                    // 如果出错，重新创建整个图表
                    this.createChart();
                }
            }
        } else {
            this.showMessage('请检查数据格式，确保输入的是有效数字！', 'info');
        }
    }
});