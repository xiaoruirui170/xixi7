/**
 * 数据可视化交互网站 - 表格处理函数
 * 负责更新和管理数据表格
 */

// 扩展ChartManager对象
Object.assign(ChartManager, {
    // 更新数据表格
    updateDataTable: function() {
        const tableBody = document.querySelector('#data-table tbody');
        tableBody.innerHTML = '';
        
        // 根据不同图表类型，生成不同的数据表格
        switch(this.currentType) {
            case 'line':
                this.updateLineChartTable(tableBody);
                break;
            case 'bar':
                this.updateBarChartTable(tableBody);
                break;
            case 'horizontalBar':
                this.updateHorizontalBarChartTable(tableBody);
                break;
            case 'area':
                this.updateAreaChartTable(tableBody);
                break;
            case 'histogram':
                // 直方图数据是动态生成的，隐藏表头和不显示表格
                document.querySelector('#data-table thead tr').innerHTML = '';
                tableBody.innerHTML = '<tr><td colspan="3">直方图数据是随机生成的，不提供数据表格。</td></tr>';
                break;
            case 'pie':
                this.updatePieChartTable(tableBody);
                break;
            case 'scatter':
                this.updateScatterChartTable(tableBody);
                break;
            case 'boxplot':
                this.updateBoxPlotChartTable(tableBody);
                break;
            case 'radar':
                this.updateRadarChartTable(tableBody);
                break;
            case 'errorBar':
                this.updateErrorBarChartTable(tableBody);
                break;
        }
    },
    
    // 更新折线图数据表格
    updateLineChartTable: function(tableBody) {
        const data = chartData.line;
        const headers = document.querySelector('#data-table thead tr');
        headers.innerHTML = '<th>日期</th><th>最高气温(°C)</th><th>最低气温(°C)</th>';
        
        data.labels.forEach((label, index) => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${label}</td>
                <td>${data.datasets[0].data[index]}</td>
                <td>${data.datasets[1].data[index]}</td>
            `;
            tableBody.appendChild(row);
        });
    },
    
    // 更新柱形图数据表格
    updateBarChartTable: function(tableBody) {
        const data = chartData.bar;
        const headers = document.querySelector('#data-table thead tr');
        
        headers.innerHTML = '<th>财年</th><th>GMV (亿元)</th><th></th>';
        
        data.labels.forEach((label, index) => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${label}</td>
                <td>${data.datasets[0].data[index]}</td>
                <td></td>
            `;
            tableBody.appendChild(row);
        });
    },
    
    // 更新条形图数据表格
    updateHorizontalBarChartTable: function(tableBody) {
        const data = chartData.horizontalBar;
        const headers = document.querySelector('#data-table thead tr');
        headers.innerHTML = '<th>商品种类</th><th>网购替代率</th><th></th>';
        
        data.labels.forEach((label, index) => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${label}</td>
                <td>${data.datasets[0].data[index]}</td>
                <td></td>
            `;
            tableBody.appendChild(row);
        });
    },
    
    // 更新堆积面积图数据表格
    updateAreaChartTable: function(tableBody) {
        const data = chartData.area;
        const headers = document.querySelector('#data-table thead tr');
        headers.innerHTML = '<th>月份</th><th>公司A</th><th>公司B</th><th>公司C</th>';
        
        data.labels.forEach((label, index) => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${label}</td>
                <td>${data.datasets[0].data[index]}</td>
                <td>${data.datasets[1].data[index]}</td>
                <td>${data.datasets[2].data[index]}</td>
            `;
            tableBody.appendChild(row);
        });
    },
    
    // 更新饼图数据表格
    updatePieChartTable: function(tableBody) {
        const data = chartData.pie;
        const headers = document.querySelector('#data-table thead tr');
        headers.innerHTML = '<th>消费类别</th><th>金额(元)</th><th>占比(%)</th>';
        
        const total = data.datasets[0].data.reduce((sum, value) => sum + value, 0);
        
        data.labels.forEach((label, index) => {
            const value = data.datasets[0].data[index];
            const percentage = ((value / total) * 100).toFixed(1);
            
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${label}</td>
                <td>${value}</td>
                <td>${percentage}%</td>
            `;
            tableBody.appendChild(row);
        });
    },
    
    // 更新散点图数据表格
    updateScatterChartTable: function(tableBody) {
        const data = chartData.scatter;
        const headers = document.querySelector('#data-table thead tr');
        headers.innerHTML = '<th>车速(km/h)</th><th>制动距离(m)</th><th></th>';
        
        data.datasets[0].data.forEach(point => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${point.x}</td>
                <td>${point.y}</td>
                <td></td>
            `;
            tableBody.appendChild(row);
        });
    },
    
    // 更新箱形图数据表格
    updateBoxPlotChartTable: function(tableBody) {
        const data = chartData.boxplot;
        const headers = document.querySelector('#data-table thead tr');
        headers.innerHTML = '<th>年份</th><th>最小值</th><th>下四分位</th><th>中位数</th><th>上四分位</th><th>最大值</th>';
        
        data.labels.forEach((label, index) => {
            const boxData = data.datasets[0].data[index];
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${label}</td>
                <td>${boxData.min}</td>
                <td>${boxData.q1}</td>
                <td>${boxData.median}</td>
                <td>${boxData.q3}</td>
                <td>${boxData.max}</td>
            `;
            tableBody.appendChild(row);
        });
    },
    
    // 更新雷达图数据表格
    updateRadarChartTable: function(tableBody) {
        const data = chartData.radar;
        const headers = document.querySelector('#data-table thead tr');
        headers.innerHTML = '<th>维度</th><th>测试者A</th><th>测试者B</th><th>测试者C</th>';
        
        data.labels.forEach((label, index) => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${label}</td>
                <td>${data.datasets[0].data[index].toFixed(2)}</td>
                <td>${data.datasets[1].data[index].toFixed(2)}</td>
                <td>${data.datasets[2].data[index].toFixed(2)}</td>
            `;
            tableBody.appendChild(row);
        });
    },
    
    // 更新误差棒图数据表格
    updateErrorBarChartTable: function(tableBody) {
        const data = chartData.errorBar;
        const headers = document.querySelector('#data-table thead tr');
        headers.innerHTML = '<th>季节</th><th>树种A</th><th>误差</th><th>树种B</th><th>误差</th><th>树种C</th><th>误差</th><th>树种D</th><th>误差</th>';
        
        data.labels.forEach((label, index) => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${label}</td>
                <td>${data.datasets[0].data[index]}</td>
                <td>±${data.datasets[0].errors[index]}</td>
                <td>${data.datasets[1].data[index]}</td>
                <td>±${data.datasets[1].errors[index]}</td>
                <td>${data.datasets[2].data[index]}</td>
                <td>±${data.datasets[2].errors[index]}</td>
                <td>${data.datasets[3].data[index]}</td>
                <td>±${data.datasets[3].errors[index]}</td>
            `;
            tableBody.appendChild(row);
        });
    }
});