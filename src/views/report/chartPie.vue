<template>
  <div class="tempLateContainer clearfix">
    <el-col :span="8">
      <!-- 2 为 ECharts 准备一个具备大小（宽高）的 DOM -->
        <div id="pieId1" class="chartCon"></div>
    </el-col>
    <el-col :span="16">
      <div id="pieId2" class="chartCon"></div>
    </el-col>
  </div>
</template>
<script>
// 1 导入echarts
import echarts from 'echarts'
export default {
  name: 'chartPie',
  data () {
    return {
      pieChart1: null,
      pieChart2: null
    }
  },
  created () {
    this.initial()
  },
  mounted () {
    // 3 基于准备好的dom，初始化echarts实例
    this.pieChart1 = echarts.init(document.getElementById('pieId1'))
    this.pieChart2 = echarts.init(document.getElementById('pieId2'))
    // 4 准备数据
    this.getData()
  },
  methods: {
    initial () {
      console.log('初始化')
    },
    getData () {
      console.log('获取图表数据')
      this.drawPie1()
      this.drawPie2()
    },
    drawPie1 (data) {
      // 5 配置项
      const option = {
        title: {
          show: true,
          top: '42%',
          left: 'center',
          text: 'titleName',
          subtext: 'subtitleName',
          padding: 0,
          itemGap: 0,
          // textAlign: 'center',
          textStyle: {
            color: '#4A4A4A',
            height: 0,
            lineHeight: 20,
            fontSize: 16,
            fontFamily: 'DINPro-Medium'
          },
          subtextStyle: {
            color: '#8D929E',
            height: 17,
            lineHeight: 17,
            fontSize: 12,
            fontFamily: 'PingFangSC-Regular'
          }

        },
        tooltip: {
          show: true,
          trigger: 'item',
          transitionDuration: 0, // 无需提示框的动画
          padding: 20, // 设置提示框内边距
          alwaysShowContent: false // 设置提示框永久展示
          // 自定义提示框的格式
          // formatter: '{a} <br/>{b}: {c} ({d}%)',
        },
        textStyle: {
          color: 'grey',
          fontSize: 10,
          height: 16,
          lineHeight: 16
        },
        legend: {
          show: false,
          id: 1786,
          // type: 'scroll', // 滚动图例，只能设置单方的尺寸
          orient: 'horizontal',
          // orient: 'vertical',
          // type: 'plain', // 默认平铺，图例可设置宽高，
          // height: 800,
          width: 300,
          top: 0,
          selectedMode: true, // 'single' multiple ,true,单选多选，切换显隐
          icon: 'circle',
          itemHeight: 12,
          itemWidth: 12
        },
        series: [
          {
            type: 'pie',
            id: 'seriesId',
            name: 'serierName',
            // roseType: 'radius',
            selectedOffset: 10,
            selectedMode: 'single',
            hoverAnimation: false,
            hoverOffset: 10,
            animationDuration: 10,
            avoidLabelOverlap: false,
            stillShowZeroSum: false, // 和为零 不显示

            label: {
              show: false,
              position: 'center',
              color: 'red'
            },
            labelLine: {
              show: false
            },
            // 高亮扇区
            emphasis: {
              label: {
                show: false,
                color: 'red'
              }
            },
            radius: ['50%', '70%'],
            center: ['50%', '50%'],
            data: [
              { value: 1048, name: '搜索引擎' },
              { value: 735, name: '直接访问' },
              { value: 580, name: '邮件营销' },
              { value: 484, name: '联盟广告' },
              { value: 300, name: '视频广告' }
            ]
          }
        ]

      }
      // 6 展示数据
      this.pieChart1.setOption(option)
    },
    drawPie2 (data) {
      // 5 配置项
      const option = {
        title: {
          text: '南丁格尔玫瑰图',
          subtext: '纯属虚构',
          left: 'center'
        },
        tooltip: {
          trigger: 'item',
          formatter: '{a} <br/>{b} : {c} ({d}%)'
        },
        legend: {
          left: 'center',
          top: 'bottom',
          data: ['rose1', 'rose2', 'rose3', 'rose4', 'rose5', 'rose6', 'rose7', 'rose8']
        },
        toolbox: {
          show: false,
          feature: {
            mark: { show: true },
            dataView: { show: true, readOnly: false },
            restore: { show: true },
            saveAsImage: { show: true }
          }
        },
        series: [
          {
            name: '半径模式',
            type: 'pie',
            radius: [35, 140],
            center: ['25%', '50%'],
            roseType: 'radius',
            itemStyle: {
              borderRadius: 5
            },
            label: {
              show: false
            },
            emphasis: {
              label: {
                show: true
              }
            },
            data: [
              { value: 40, name: 'rose 1' },
              { value: 33, name: 'rose 2' },
              { value: 28, name: 'rose 3' },
              { value: 22, name: 'rose 4' },
              { value: 20, name: 'rose 5' },
              { value: 15, name: 'rose 6' },
              { value: 12, name: 'rose 7' },
              { value: 10, name: 'rose 8' }
            ]
          },
          {
            name: '面积模式',
            type: 'pie',
            radius: [20, 140],
            center: ['75%', '50%'],
            roseType: 'area',
            itemStyle: {
              borderRadius: 5
            },
            data: [
              { value: 30, name: 'rose 1' },
              { value: 28, name: 'rose 2' },
              { value: 26, name: 'rose 3' },
              { value: 24, name: 'rose 4' },
              { value: 22, name: 'rose 5' },
              { value: 20, name: 'rose 6' },
              { value: 18, name: 'rose 7' },
              { value: 16, name: 'rose 8' }
            ]
          }
        ]
      }
      // 6 展示数据
      this.pieChart2.setOption(option)
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
      height: 300px;
    }
  }
}
</style>
