<template>
  <div>
    <el-card>
      <chartPie></chartPie>
    </el-card>
    <el-container>
      <el-col :span="12">
      </el-col>
      <el-col :span="12">
      </el-col>
    </el-container>
    <el-card >
      <chartBar></chartBar>
    </el-card>
    <el-card>
        <div id="LineId" style="width: 750px; height: 350px"></div>
    </el-card>

  </div>
</template>
<script>
// 1 导入echarts
import echarts from 'echarts'
import chartPie from './chartPie'
import chartBar from './chartBar'
// const echarts = require('echarts')
export default {
  data () {
    return {
      // 需要合并的数据
      options: { },
      lineChart: null
    }
  },
  components: { chartPie, chartBar },
  // 执行到这个周期函数，此时页面上的元素已经被渲染完毕
  created () {
    this.initial()
  },
  mounted () {
    // 3 基于准备好的dom，初始化echarts实例

    this.lineChart = echarts.init(document.getElementById('LineId'))
    // 4 准备数据
    this.getData()
  },
  methods: {
    initial () {
    },
    getData () {
      this.dawLine()
    },

    dawLine (data) {
      const option = {
        title: {
          text: '堆叠区域图'
        },
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'cross',
            label: {
              backgroundColor: '#6a7985'
            }
          }
        },
        legend: {
          data: ['邮件营销', '联盟广告', '视频广告', '直接访问', '搜索引擎']
        },
        // toolbox: {
        //   feature: {
        //     saveAsImage: {}
        //   }
        // },
        grid: {
          left: '3%',
          right: '4%',
          bottom: '3%',
          containLabel: true
        },
        xAxis: [
          {
            type: 'category',
            boundaryGap: false,
            data: ['周一', '周二', '周三', '周四', '周五', '周六', '周日']
          }
        ],
        yAxis: [
          {
            type: 'value'
          }
        ],
        series: [
          {
            name: '邮件营销',
            type: 'line',
            stack: '总量',
            areaStyle: {},
            emphasis: {
              focus: 'series'
            },
            data: [120, 132, 101, 134, 90, 230, 210]
          },
          {
            name: '联盟广告',
            type: 'line',
            stack: '总量',
            areaStyle: {},
            emphasis: {
              focus: 'series'
            },
            data: [220, 182, 191, 234, 290, 330, 310]
          },
          {
            name: '视频广告',
            type: 'line',
            stack: '总量',
            areaStyle: {},
            emphasis: {
              focus: 'series'
            },
            data: [150, 232, 201, 154, 190, 330, 410]
          },
          {
            name: '直接访问',
            type: 'line',
            stack: '总量',
            areaStyle: {},
            emphasis: {
              focus: 'series'
            },
            data: [320, 332, 301, 334, 390, 330, 320]
          },
          {
            name: '搜索引擎',
            type: 'line',
            stack: '总量',
            label: {
              show: true,
              position: 'top'
            },
            areaStyle: {},
            emphasis: {
              focus: 'series'
            },
            data: [820, 932, 901, 934, 1290, 1330, 1320]
          }
        ]

      }
      this.lineChart.setOption(option)
    }
  }
}
</script>
<style lang="less" scoped>
</style>
