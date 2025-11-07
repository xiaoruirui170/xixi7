const chartData = {
  // 折线图数据
  line: {
    labels: ["第1天", "第2天", "第3天", "第4天", "第5天", "第6天", "第7天", "第8天", "第9天", "第10天", "第11天", "第12天", "第13天", "第14天", "第15天"],
    datasets: [
      {
        label: "最高气温",
        data: [32, 33, 34, 34, 33, 31, 30, 29, 30, 29, 26, 23, 21, 25, 31],
        borderColor: 'rgb(255, 99, 132)',
        backgroundColor: 'rgba(255, 99, 132, 0.5)',
        tension: 0.1
      },
      {
        label: "最低气温",
        data: [19, 19, 20, 22, 22, 21, 22, 16, 18, 18, 17, 14, 15, 16, 16],
        borderColor: 'rgb(54, 162, 235)',
        backgroundColor: 'rgba(54, 162, 235, 0.5)',
        tension: 0.1
      }
    ],
    description: "这是一个折线图示例，展示了未来15天的最高气温和最低气温变化趋势。"
  },

  // 柱形图数据
  bar: {
    labels: ["FY2013", "FY2014", "FY2015", "FY2016", "FY2017", "FY2018", "FY2019"],
    datasets: [{
      label: "GMV(亿元)",
      data: [10770, 16780, 24440, 30920, 37670, 48200, 57270],
      backgroundColor: 'rgba(54, 162, 235, 0.6)'
    }],
    description: "2013—2019财年阿里巴巴淘宝和天猫平台的GMV数据。"
  },

  // 多组柱形图数据
  multiBar: {
    labels: ["a", "b", "c", "d", "e"],
    datasets: [
      {
        label: "第一组",
        data: [10, 8, 7, 11, 13],
        backgroundColor: 'rgba(255, 99, 132, 0.6)'
      },
      {
        label: "第二组",
        data: [9, 6, 5, 10, 12],
        backgroundColor: 'rgba(54, 162, 235, 0.6)'
      }
    ],
    description: "多组数据柱形图示例。"
  },

  // 条形图数据
  horizontalBar: {
    labels: ["家政服务", "机票火车票", "家具", "手机", "电脑", "汽车用品", "充值", "护理用品", "书报杂志", "餐饮旅游", "家电", "食品", "日用品", "保险票务", "服装", "数码产品", "其他", "工艺品"],
    datasets: [{
      label: "替代率",
      data: [0.959, 0.951, 0.935, 0.924, 0.893, 0.892, 0.865, 0.863, 0.860, 0.856, 0.854, 0.835, 0.826, 0.816, 0.798, 0.765, 0.763, 0.67],
      backgroundColor: 'rgba(75, 192, 192, 0.6)'
    }],
    description: "各商品种类的网购替代率数据。"
  },

  // 堆积面积图数据
  area: {
    labels: ["1月", "2月", "3月", "4月", "5月", "6月", "7月", "8月", "9月", "10月", "11月", "12月"],
    datasets: [
      {
        label: "物流A",
        data: [198, 215, 245, 222, 200, 236, 201, 253, 236, 200, 266, 290],
        backgroundColor: 'rgba(255, 99, 132, 0.5)',
        borderColor: 'rgba(255, 99, 132, 1)',
        fill: true
      },
      {
        label: "物流B",
        data: [203, 236, 200, 236, 269, 216, 298, 333, 301, 349, 360, 368],
        backgroundColor: 'rgba(54, 162, 235, 0.5)',
        borderColor: 'rgba(54, 162, 235, 1)',
        fill: true
      },
      {
        label: "物流C",
        data: [185, 205, 226, 199, 238, 200, 250, 209, 246, 219, 253, 288],
        backgroundColor: 'rgba(75, 192, 192, 0.5)',
        borderColor: 'rgba(75, 192, 192, 1)',
        fill: true
      }
    ],
    description: "物流公司物流费用统计数据。"
  },

  // 直方图数据生成器
  histogram: {
    generateData: function() {
      // 模拟Python的RandomState(19680801)行为
      function seededRandom(seed) {
        let x = Math.sin(seed) * 10000;
        return x - Math.floor(x);
      }
      
      // 生成正态分布随机数 (Box-Muller变换)
      function normalRandom(seed) {
        let u = 0, v = 0;
        while(u === 0) u = seededRandom(seed++);
        while(v === 0) v = seededRandom(seed++);
        return Math.sqrt(-2.0 * Math.log(u)) * Math.cos(2.0 * Math.PI * v);
      }
      
      const randomData = [];
      let seed = 19680801;
      
      // 生成10000个正态分布随机数，并映射到0-255范围
      for (let i = 0; i < 10000; i++) {
        const val = normalRandom(seed++) * 50 + 128; // 均值128，标准差50
        randomData.push(Math.max(0, Math.min(255, Math.round(val))));
      }
      
      return randomData;
    },
    description: "人脸识别的灰度直方图数据，使用正态分布模拟人脸灰度值。"
  },

  // 饼图数据
  pie: {
    labels: ["购物", "人情往来", "餐饮美食", "通信物流", "生活日用", "交通出行", "休闲娱乐", "其他"],
    datasets: [{
      data: [800, 100, 1000, 200, 300, 200, 200, 200],
      backgroundColor: [
        'rgba(255, 99, 132, 0.7)',
        'rgba(54, 162, 235, 0.7)',
        'rgba(255, 206, 86, 0.7)',
        'rgba(75, 192, 192, 0.7)',
        'rgba(153, 102, 255, 0.7)',
        'rgba(255, 159, 64, 0.7)',
        'rgba(199, 199, 199, 0.7)',
        'rgba(83, 102, 255, 0.7)'
      ],
      borderColor: [
        'rgba(255, 99, 132, 1)',
        'rgba(54, 162, 235, 1)',
        'rgba(255, 206, 86, 1)',
        'rgba(75, 192, 192, 1)',
        'rgba(153, 102, 255, 1)',
        'rgba(255, 159, 64, 1)',
        'rgba(199, 199, 199, 1)',
        'rgba(83, 102, 255, 1)'
      ],
      borderWidth: 1
    }],
    description: "支付宝月账单报告数据。"
  },

  // 散点图数据
  scatter: {
    datasets: [{
      label: "汽车速度与制动距离",
      data: [
        {x: 10, y: 0.5},
        {x: 20, y: 2.0},
        {x: 30, y: 4.4},
        {x: 40, y: 7.9},
        {x: 50, y: 12.3},
        {x: 60, y: 17.7},
        {x: 70, y: 24.1},
        {x: 80, y: 31.5},
        {x: 90, y: 39.9},
        {x: 100, y: 49.2},
        {x: 110, y: 59.5},
        {x: 120, y: 70.8},
        {x: 130, y: 83.1},
        {x: 140, y: 96.4},
        {x: 150, y: 110.7},
        {x: 160, y: 126.0},
        {x: 170, y: 142.2},
        {x: 180, y: 159.4},
        {x: 190, y: 177.6},
        {x: 200, y: 196.8}
      ],
      backgroundColor: 'rgba(255, 99, 132, 0.7)',
      pointRadius: 6
    }],
    description: "汽车速度与制动距离的关系数据。"
  },

  // 箱形图数据
  boxplot: {
    labels: ["2018年", "2017年"],
    datasets: [{
      label: "发电量统计",
      data: [
        {
          min: 5107.8,
          q1: 5254.5,
          median: 5330.2,
          q3: 5550.6,
          max: 6404.9
        },
        {
          min: 4605.2,
          q1: 4710.3,
          median: 5038.1,
          q3: 5219.6,
          max: 6047.4
        }
      ]
    }],
    description: "2017年和2018年全国发电量统计数据。"
  },

  // 雷达图数据
  radar: {
    labels: ["研究型(I)", "艺术型(A)", "社会型(S)", "企业型(E)", "传统型(C)", "现实型(R)"],
    datasets: [
      {
        label: "测试者1",
        data: [0.40, 0.32, 0.35, 0.30, 0.30, 0.88],
        backgroundColor: 'rgba(255, 99, 132, 0.2)',
        borderColor: 'rgba(255, 99, 132, 1)',
        pointBackgroundColor: 'rgba(255, 99, 132, 1)',
        pointBorderColor: '#fff',
        pointHoverBackgroundColor: '#fff',
        pointHoverBorderColor: 'rgba(255, 99, 132, 1)'
      },
      {
        label: "测试者2",
        data: [0.85, 0.35, 0.30, 0.40, 0.40, 0.30],
        backgroundColor: 'rgba(54, 162, 235, 0.2)',
        borderColor: 'rgba(54, 162, 235, 1)',
        pointBackgroundColor: 'rgba(54, 162, 235, 1)',
        pointBorderColor: '#fff',
        pointHoverBackgroundColor: '#fff',
        pointHoverBorderColor: 'rgba(54, 162, 235, 1)'
      },
      {
        label: "测试者3",
        data: [0.43, 0.89, 0.30, 0.28, 0.22, 0.30],
        backgroundColor: 'rgba(75, 192, 192, 0.2)',
        borderColor: 'rgba(75, 192, 192, 1)',
        pointBackgroundColor: 'rgba(75, 192, 192, 1)',
        pointBorderColor: '#fff',
        pointHoverBackgroundColor: '#fff',
        pointHoverBorderColor: 'rgba(75, 192, 192, 1)'
      }
    ],
    description: "霍兰德职业兴趣测试数据，显示三个测试者的结果。"
  },

  // 误差棒图数据
  errorBar: {
    labels: ["春季", "夏季", "秋季"],
    datasets: [
      {
        label: "树种A",
        data: [2.04, 1.57, 1.63],
        errors: [0.16, 0.08, 0.10],
        backgroundColor: 'rgba(255, 99, 132, 0.6)',
        borderColor: 'rgba(255, 99, 132, 1)',
        borderWidth: 1
      },
      {
        label: "树种B",
        data: [1.69, 1.61, 1.64],
        errors: [0.27, 0.14, 0.14],
        backgroundColor: 'rgba(54, 162, 235, 0.6)',
        borderColor: 'rgba(54, 162, 235, 1)',
        borderWidth: 1
      },
      {
        label: "树种C",
        data: [4.65, 4.99, 4.94],
        errors: [0.34, 0.32, 0.29],
        backgroundColor: 'rgba(75, 192, 192, 0.6)',
        borderColor: 'rgba(75, 192, 192, 1)',
        borderWidth: 1
      },
      {
        label: "树种D",
        data: [3.39, 2.33, 4.10],
        errors: [0.23, 0.23, 0.39],
        backgroundColor: 'rgba(153, 102, 255, 0.6)',
        borderColor: 'rgba(153, 102, 255, 1)',
        borderWidth: 1
      }
    ],
    description: "4个树种不同季节的细根生物量数据。"
  }
};