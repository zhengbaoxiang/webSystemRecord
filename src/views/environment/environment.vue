<template>
<div>
  <!-- 卡片视图 -->
  <el-card>
    <el-form :inline="true"  class="search-form" label-width="70px">
      <el-form-item label="查询" label-width="48px">
         <el-input  v-model="keyWord" placeholder="请输入内容" maxlength="15" clearable
              @input="keyWord = inputChange(keyWord)"
              @change="inputFished"
              class="searchInput"
            >
              <el-button slot="append" icon="el-icon-search"  @click="searchData(keyWord)"></el-button>
            </el-input>
      </el-form-item>
      <el-form-item label="支付方式" label-width="80px">
        <el-select v-model="payWay" placeholder="请选择" clearable @change="optionChange" >
          <el-option
            v-for="item in payOptions"
            :key="item.value"
            :label="item.label"
            :value="item.value"
            >
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-date-picker
          class="ml20"
          v-model="dateSelected"
          type="daterange"
          align="right"
          unlink-panels
          range-separator="至"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
          :picker-options="pickerOptions"
          @change="dateChange"
          value-format="yyyy-MM-dd"
          >
          <!--选中值返回的格式 value-format="yyyy-MM-dd" 或  value-format="timestamp" -->
          <!--选中值显示的格式 format="yyyy-MM-dd" 或  format="timestamp" -->
        </el-date-picker>
      </el-form-item>
      <el-form-item>
        <!-- <el-button type="primary" @click="onSubmit">查询</el-button> -->
        <el-button  @click="reset" class="ml20">重置</el-button>
      </el-form-item>
      <el-form-item class="fr">
        <el-button  @click="createItem" type="primary">新增</el-button>
      </el-form-item>
    </el-form>
    <!-- 订单列表数据 , 边框 ，斑马纹 -->
    <el-table :data="dataList" border stripe max-height="700"
     @selection-change="handleSelectionChange" empty-text="暂时没有数据。">
      <!-- selection 添加勾选框，fixed固定在左侧 -->
        <el-table-column type="selection" label="#" align="center" fixed="left"></el-table-column>
        <el-table-column type="index" label="#" align="center" fixed="left"></el-table-column>
        <!-- show-overflow-tooltip 宽度过小时显示tooltips -->
        <el-table-column   label="订单标号" prop="reciptNo" width="120"  show-overflow-tooltip   align="center" ></el-table-column>

        <el-table-column   label="联系方式"  prop="phone" width="130"  align="center" >
        </el-table-column>
        <el-table-column   label="下单人"  prop="userName" width="100" align="center" >
        </el-table-column>
        <el-table-column label="是否付钱" prop="status" width="100" align="center">
            <!-- 自定义显示的模板 -->
            <template slot-scope="scope">
                <el-tag type="success" v-if="scope.row.status === 1">已付款</el-tag>
                <el-tag type="danger" v-if="scope.row.status === 0">未付款</el-tag>
            </template>
        </el-table-column>
        <!-- sortable支持排序,,可以使用sort-method或者sort-by使用自定义的排序规则，
            formatter格式化显示内容 -->
        <el-table-column label="下单时间" prop="createTime" width="200" align="center" sortable :formatter="formatter">
        </el-table-column>
        <el-table-column   label="付款方式" prop="payWay" min-width="70"    align="center" :formatter="formatter" ></el-table-column>
        <el-table-column   label="其他字段" prop="reciptNo" min-width="100" align="center" ></el-table-column>
        <el-table-column   label="其他字段" prop="reciptNo" min-width="170" align="center" ></el-table-column>
        <el-table-column label="操作" width="200"  align="center" fixed="right">
            <template slot-scope="scope">
                <el-button
                    icon="el-icon-edit"
                    type="primary"
                    size="mini"
                    @click="editData(scope.row)"
                ></el-button>
                <el-button
                    icon="el-icon-delete"
                    type="danger"
                    size="mini"
                    @click="deleteData(scope)"
                ></el-button>
            </template>
        </el-table-column>
    </el-table>

    <!-- 分页区域 -->
    <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="queryInfo.pagenum"
        :page-sizes="[5, 10, 20]"
        :page-size="queryInfo.pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
    ></el-pagination>
  </el-card>
  <!-- 修改地址的对话框 -->
  <el-dialog
      :title="dialogTitle"
      :visible.sync="dialogVisible"
      width="50%"
      @close="dialogClosed"
  >
      <el-form
          :model="dialogForm"
          ref="dialogFormRef"
          label-width="100px"
      >
          <el-form-item label="用户名称">
            <el-input v-model="dialogForm.name"></el-input>
          </el-form-item>
          <el-form-item label="活动区域">
            <el-select v-model="dialogForm.region" placeholder="请选择活动区域">
              <el-option label="区域一" value="shanghai"></el-option>
              <el-option label="区域二" value="beijing"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="活动时间">
            <el-col :span="11">
              <el-date-picker type="date" placeholder="选择日期" v-model="dialogForm.date1" style="width: 100%;"></el-date-picker>
            </el-col>
            <el-col class="line" :span="2">-</el-col>
            <el-col :span="11">
              <el-time-picker placeholder="选择时间" v-model="dialogForm.date2" style="width: 100%;"></el-time-picker>
            </el-col>
          </el-form-item>
          <el-form-item label="即时配送">
            <el-switch v-model="dialogForm.delivery"></el-switch>
          </el-form-item>
          <el-form-item label="活动性质">
            <el-checkbox-group v-model="dialogForm.type">
              <el-checkbox label="美食/餐厅线上活动" name="type"></el-checkbox>
              <el-checkbox label="地推活动" name="type"></el-checkbox>
              <el-checkbox label="线下主题活动" name="type"></el-checkbox>
              <el-checkbox label="单纯品牌曝光" name="type"></el-checkbox>
            </el-checkbox-group>
          </el-form-item>
          <el-form-item label="特殊资源">
            <el-radio-group v-model="dialogForm.resource">
              <el-radio label="线上品牌商赞助"></el-radio>
              <el-radio label="线下场地免费"></el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item label="活动形式">
            <el-input type="textarea" v-model="dialogForm.desc"></el-input>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="confirm(dialogForm)">立即创建</el-button>
            <el-button>取消</el-button>
          </el-form-item>

      </el-form>
      <span slot="footer" class="dialog-footer">
          <el-button @click="dialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="confirm(dialogForm)">确 定</el-button>
      </span>
  </el-dialog>
  <!-- 展示物流进度的对话框 -->
  <el-dialog title="物流进度" :visible.sync="progressVisible" width="50%">
      <el-timeline :reverse="reverse">
          <el-timeline-item
              v-for="(activity, index) in timeList"
              :key="index"
              :timestamp="activity.ftime"
          >
              {{ activity.context }}
          </el-timeline-item>
      </el-timeline>
  </el-dialog>
</div>
</template>
<script>
export default {
  name: 'list',
  data () {
    return {
      descripts: '列表过滤，以及单个数据的增删改查',
      keyWord: '', // 模糊查询
      payWay: '', //  1,2,3,null表示全部
      startTime: '',
      endTime: '',

      queryInfo: {
        pagenum: 1, // 页码
        pagesize: 10 // 每页显示条数

      },
      payOptions: [
        {
          value: '1',
          label: '支付宝'
        }, {
          value: '2',
          label: '微信'
        }, {
          value: '3',
          label: '银行卡'
        }, {
          value: '4',
          label: '现金'
        }
      ],
      dateSelected: null,
      pickerOptions: {
        shortcuts: [{
          text: '最近一周',
          onClick (picker) {
            const end = new Date()
            const start = new Date()
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 7)
            picker.$emit('pick', [start, end])
          }
        }, {
          text: '最近一个月',
          onClick (picker) {
            const end = new Date()
            const start = new Date()
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 30)
            picker.$emit('pick', [start, end])
          }
        }, {
          text: '最近三个月',
          onClick (picker) {
            const end = new Date()
            const start = new Date()
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 90)
            picker.$emit('pick', [start, end])
          }
        }]
      },

      dataList: [],
      total: 0,

      dialogVisible: false,
      dialogTitle: '',
      handleType: 'create', // edit , view
      dialogForm: {
        name: '',
        region: '',
        date1: '',
        date2: '',
        delivery: false,
        type: [],
        resource: '',
        desc: ''
      },
      progressVisible: false,
      reverse: false,
      timeList: []
    }
  },
  created () {
    this.getdataList()
  },
  mounted () {

  },
  methods: {
    // 增删改查
    createItem () {
      console.log('create')
      // 弹出form表单窗口
      this.dialogVisible = true
      this.dialogTitle = '新增数据'
      this.handleType = 'create'
    },
    confirm (formData) {
      if (this.handleType === 'create') {
        console.log('新增数据', formData)
        formData = {
          userName: '新增',
          status: 0,
          createTime: new Date()
        }
        this.dataList.unshift(formData)
      } else if (this.handleType === 'edit') {
        console.log('更新数据')
      } else {
        // 查看无需操作
        console.log('查看关闭')
      }
      this.dialogVisible = false
    },

    getdataList () {
      const params = {
        keyWord: this.keyWord,
        payWay: this.payWay,
        startTime: this.startTime,
        endTime: this.endTime,
        pagenum: this.queryInfo.pagenum,
        pagesize: this.queryInfo.pagesize
      }
      // console.log(params)
      // 调接口 todo
      const respData = [
        { id: 1, reciptNo: '20212301212312123123', userName: '棉宝', phone: '18222331000', status: 0, payWay: '1', createTime: '2021-04-14' },
        { id: 2, reciptNo: '20212301212312123123', userName: '2223', phone: '18222331281', status: 1, payWay: '2', createTime: '2021-04-13' },
        { id: 3, reciptNo: '11111111111111111111', userName: '2232', phone: '13532392392', status: 0, payWay: '3', createTime: '2021-04-14' },
        { id: 4, reciptNo: '20000000000000000000', userName: '2422', phone: '13532392392', status: 0, payWay: '4', createTime: '2021-04-15' },
        { id: 5, reciptNo: '20212301212312123123', userName: '2522', phone: '13532392392', status: 1, payWay: '1', createTime: '2021-04-16' },
        { id: 5, reciptNo: '20212301212312123123', userName: '2522', phone: '13532392392', status: 1, payWay: '2', createTime: '2021-04-17' },
        { id: 5, reciptNo: '20212301212312123123', userName: '2菲2', phone: '13532392392', status: 1, payWay: '3', createTime: '2021-04-18' },
        { id: 5, reciptNo: '20212301212312123123', userName: '2622', phone: '13532392392', status: 1, payWay: '3', createTime: '2021-04-19' },
        { id: 5, reciptNo: '20212301212312123123', userName: '2262', phone: '13532392392', status: 1, payWay: '4', createTime: '2021-04-20' },
        { id: 6, reciptNo: '20212301212312123123', userName: '2822', phone: '13532392392', status: 1, payWay: '1', createTime: '2021-04-22' }
      ]
      this.dataList = respData
      // 用前台实现过滤
      this.dataList = this.filter(this.dataList, params)
      this.total = this.dataList.length
      this.$message.closeAll()
      this.$message({
        type: 'success',
        message: '更新数据',
        showClose: true
      })
    },
    filter (dataList, params) {
      let filterData = dataList
      //
      if (params.keyWord) {
        filterData = filterData.filter(item => {
          if (item.reciptNo.includes(params.keyWord)) {
            return true
          } else if (item.userName.includes(params.keyWord)) {
            return true
          } else if (item.phone.includes(params.keyWord)) {
            return true
          } else {
            return false
          }
        })
      }
      //
      if (params.payWay) {
        filterData = filterData.filter(item => {
          if (item.payWay === params.payWay) {
            return true
          } else {
            return false
          }
        })
      }
      if (params.startTime && params.endTime) {
        filterData = filterData.filter(item => {
          if (params.startTime <= item.createTime && item.createTime <= params.endTime) {
            return true
          } else {
            return false
          }
        })
      }

      // console.log('过滤后的列表', filterData)
      return filterData
    },
    // 搜索框事件
    inputChange (value = '') {
      let newValue = value.trim() // 去两端空格
      var pattern = /[^A-Za-z0-9\u4e00-\u9fa5]/g // 只允许输入中英文数字
      newValue = value.replace(pattern, '')
      // console.log('持续正则校验，过滤前', '|' + value + '|')
      // console.log('过滤后', '|' + newValue + '|')
      // 实时搜索可以在这里调用getData
      return newValue
    },
    inputFished (value) {
      // console.log('失去焦点触发：', value)
      // 此时可以调用search,或getData
      this.searchData(value)
    },
    searchData (keyWord) {
      console.log('keyword：', '|' + keyWord + '|')
      this.getdataList()
    },

    // 筛选事件
    optionChange (value) {
      console.log('value:', '|' + value + '|')
      this.getdataList()
    },
    // 日期pick事件
    dateChange (value) {
      value = value || []
      console.log(value)
      console.log(this.dateSelected)
      this.startTime = value[0] || null
      this.endTime = value[1] || null
      this.getdataList()
    },
    // 重置选中条件，重新调取数据
    reset () {
      this.keyWord = ''
      this.status = null
      this.dateSelected = []
      this.startTime = ''
      this.endTime = ''
      this.queryInfo = {
        pagenum: 1,
        pagesize: 10
      }
      this.getdataList()
    },
    // 选中事件
    handleSelectionChange (sel) {
      console.log('selec', sel)
    },
    // 格式化处理某一列的数据，例如时间格式化
    formatter (row, column) {
      // console.log(row, column.property)
      if (column.property === 'createTime' && row.createTime) {
        // const temp = new Date(row.createTime).getTime() // 时间戳
        const timeStr = new Date(row.createTime).dateFormat('yyyy-MM-dd hh:mm:ss')
        // console.log(temp, timeStr)
        return timeStr
      }
      if (column.property === 'payWay') {
        let temp
        if (row.payWay === '1') {
          temp = '支付宝'
        } else if (row.payWay === '2') {
          temp = '微信'
        } else if (row.payWay === '3') {
          temp = '银行卡'
        } else {
          temp = '现金'
        }
        return temp
      }
      return '无'
    },

    view (item) {
      console.log(item)
      this.dialogVisible = true
      this.dialogTitle = '查看数据'
      this.handleType = 'view'
    },
    editData (item) {
      console.log(item)
      this.dialogVisible = true
      this.dialogTitle = '编辑数据'
      this.handleType = 'edit'
    },
    deleteData (scope) {
      // console.log('delete', scope)
      const index = scope.$index
      this.dataList.splice(index, 1)
      this.$message.closeAll()
      this.$message.success('删除数据')
    },
    // 分页组件事件
    handleSizeChange (newSize) {
      this.queryInfo.pagesize = newSize
      this.getdataList()
    },
    handleCurrentChange (newPage) {
      this.queryInfo.pagenum = newPage
      this.getdataList()
    },
    dialogClosed (par) {
      console.log('dialogClosed:', par)
    }

  }
}
</script>
<style lang="less" >
.search-form{
  color: yellow;
  .el-form-item{
    color: blue;
    .searchInput{
      width: 230px;
    }
    .el-select{
      width: 100px;
    }
    .el-range-editor{
      width: 280px;
    }
  }

}
</style>
