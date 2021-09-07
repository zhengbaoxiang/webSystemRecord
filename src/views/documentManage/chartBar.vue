<template>
  <div class="tempLateContainer clearfix">
    <el-col :span="12">
        <div id="barId2" class="chartCon"></div>
    </el-col>
    <el-col :span="12">
      <div id="barId" class="chartCon"></div>
    </el-col>
  </div>
</template>
<script>
// 1 导入echarts
import echarts from 'echarts'
export default {
  name: 'chartBar',
  data () {
    return {
      barChart: null,
      barChart2: null
    }
  },
  created () {
    this.initial()
  },
  mounted () {
    // 3 基于准备好的dom，初始化echarts实例
    this.barChart = echarts.init(document.getElementById('barId'))
    this.barChart2 = echarts.init(document.getElementById('barId2'))
    // 4 准备数据
    this.getData()
  },
  methods: {
    initial () {
      console.log('初始化')
    },
    getData () {
      console.log('获取图表数据')
      const data = [
        { name: '中国', value: 7999, value2: 1.5 },
        { name: '美国', value: 5512, value2: 0.8 },
        { name: '韩国', value: 2512, value2: 0.7 },
        { name: '意大利', value: 577, value2: 0.6 },
        { name: '法国', value: 298, value2: 0.5 }
      ]
      this.drawBar(data)
      this.drawBar2(data)
    },
    drawBar2 () {
      const option = {
        // 左右上下间距
        grid: {
          top: '15%',
          left: '3%',
          right: '8%',
          bottom: '3%',
          containLabel: true
        },
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'cross',
            crossStyle: {
              color: '#999'
            }
          }
        },
        toolbox: {
          feature: {
            dataView: { show: true, readOnly: false },
            magicType: { show: true, type: ['line', 'bar'] },
            restore: { show: true },
            saveAsImage: { show: true }
          }
        },
        legend: {
          data: ['蒸发量', '降水量', '平均温度']
        },
        xAxis: [
          {
            type: 'category',
            data: ['1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月', '12月'],
            axisPointer: {
              type: 'shadow'
            }
          }
        ],
        yAxis: [
          {
            type: 'value',
            name: '水量',
            min: 0,
            max: 250,
            interval: 50,
            axisLabel: {
              formatter: '{value} ml'
            }
          },
          {
            type: 'value',
            name: '温度',
            min: 0,
            max: 25,
            interval: 5,
            axisLabel: {
              formatter: '{value} °C'
            }
          }
        ],
        series: [
          {
            name: '蒸发量',
            type: 'bar',
            data: [2.0, 4.9, 7.0, 23.2, 25.6, 76.7, 135.6, 162.2, 32.6, 20.0, 6.4, 3.3]
          },
          {
            name: '降水量',
            type: 'bar',
            data: [2.6, 5.9, 9.0, 26.4, 28.7, 70.7, 175.6, 182.2, 48.7, 18.8, 6.0, 2.3]
          },
          {
            name: '平均温度',
            type: 'line',
            yAxisIndex: 1,
            data: [2.0, 2.2, 3.3, 4.5, 6.3, 10.2, 20.3, 23.4, 23.0, 16.5, 12.0, 6.2]
          }
        ]
      }

      this.barChart2.setOption(option)
    },
    drawBar (data) {
      const maxData = data[0].value
      const option = {
        title: {
          text: '表的title',
          subtext: '数据来自网络',
          textStyle: {
            fontSize: 14,
            align: 'left',
            color: 'rgba(0, 0, 0, 0.85)',
            fontWeight: 400
          },
          left: '50%',
          top: 5
        },
        // 左右上下间距
        grid: {
          left: '3%',
          right: '15%',
          bottom: '5%',
          containLabel: true
        },
        yAxis: {
          type: 'category',
          inverse: true.valueOf,
          // 坐标数据
          data: data.map((item) => item.name),
          axisLabel: {
            interval: 0,
            rotate: 0,
            margin: 110,
            formatter: (value) => {
              if (value.length > 6) {
                return value.substr(0, 6) + '...'
              }
              return value
            },
            fontSize: 14,
            align: 'left',
            color: 'rgba(0, 0, 0, 0.85)'
          },
          axisLine: {
            show: true
          },
          axisTick: {
            show: true
          }
        },
        xAxis: {
          type: 'value',
          position: 'top',
          boundaryGap: [0, 0.01],
          max: 'dataMax',
          show: true,
          axisLine: {
            show: true
          },
          axisTick: {
            show: true
          },
          splitLine: {
            show: false
          }
        },

        // tooltip: {
        //   trigger: 'axis',
        //   axisPointer: {
        //     type: 'shadow'
        //   }
        // },
        legend: {
          data: ['图例标题']
        },
        series: [
          {
            name: '系列名',
            type: 'bar',
            data: data.map((item) => {
              const port = (maxData * 100 / item.value).toFixed(5) + '%'
              // console.log(port)
              const tempObj = {
                value: item.value,
                label: {
                  show: true,
                  position: [port, '50%']
                }
              }
              return tempObj
            }),
            // 默认的数据条颜色
            itemStyle: {
            // color: "#2BFBAC",
              color: new echarts.graphic.LinearGradient(
                0, 1, 1, 1,
                [
                  { offset: 0, color: '#13E3F5' },
                  { offset: 1, color: '#2BFBAC' }
                ]
              )
            },
            barWidth: 12,
            barCategoryGap: 20,
            // barMinWidth: 12,
            // barMaxWidth: 14,
            label: {
              show: true,
              color: 'rgba(0, 0, 0, 0.85)',
              fontSize: 14,
              // position: 'right',
              // position: [10, 10],
              position: ['100%', '50%'],
              align: 'left',
              verticalAlign: 'middle',
              offset: [ 20, 2 ],
              valueAnimation: true,
              formatter: (p) => {
                // console.log(p)
                let value = '' + p.value
                value = value.padStart(6, ' ')
                return value
              }
            },
            silent: true,
            showBackground: true,
            backgroundStyle: {
              color: 'rgba(0, 0, 0, 0.2)'
            }
          },
          {
            type: 'scatter', //
            data: data.map((item) => item.value), // 坐标的数据
            // 默认的数据颜色
            itemStyle: {
              color: 'rgba(251, 199, 32, 1)',
              borderColor: '#fff',
              borderWidth: 2
            },
            symbolSize: 18,
            cursor: 'auto',
            animation: false,
            silent: true
          }

        ]

      }

      this.barChart.setOption(option)
    }

  }
}
</script>

<style lang="less" scoped>
.tempLateContainer{
  width: 100%;
  height: 100%;
  .el-col{
    height: 100%;
    color: red;
    div.chartCon{
      height: 400px;
    }
  }
}

</style>
