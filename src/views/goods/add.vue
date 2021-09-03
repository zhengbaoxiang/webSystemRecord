<template>
    <div>
        <!-- 面包屑导航区域 -->
        <el-breadcrumb separator-class="el-icon-arrow-right">
            <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item>商品管理</el-breadcrumb-item>
            <el-breadcrumb-item>添加商品</el-breadcrumb-item>
        </el-breadcrumb>
        <!-- 卡片视图 -->
        <el-card>
            <!-- 头部警告区域 -->
            <el-alert
                title="添加商品信息"
                center
                type="info"
                :closable="false"
                show-icon
            ></el-alert>
            <!-- 步骤条 -->
            <el-steps :active="activeIndex - 0" finish-status="success" align-center>
                <el-step title="基本信息"></el-step>
                <el-step title="商品参数"></el-step>
                <el-step title="商品属性"></el-step>
                <el-step title="商品图片"></el-step>
                <el-step title="商品内容"></el-step>
                <el-step title="完成"></el-step>
            </el-steps>
            <!-- tab栏 -->
            <el-form
                :model="addForm"
                :rules="addFormRules"
                ref="addFormRuleForm"
                label-width="100px"
                label-position="top"
            >
                <el-tabs
                    :tab-position="'left'"
                    v-model="activeIndex"
                    :before-leave="beforeChangeTab"
                    @tab-click="tabClick"
                >
                    <el-tab-pane label="基本信息" name="0">
                        <el-form-item label="商品名称" prop="goods_name">
                            <el-input v-model="addForm.goods_name"></el-input>
                        </el-form-item>
                        <el-form-item label="商品价格" prop="goods_price">
                            <el-input v-model="addForm.goods_price" type="number"></el-input>
                        </el-form-item>
                        <el-form-item label="商品重量" prop="goods_weight">
                            <el-input v-model="addForm.goods_weight" type="number"></el-input>
                        </el-form-item>
                        <el-form-item label="商品数量" prop="goods_weight">
                            <el-input v-model="addForm.goods_number" type="number"></el-input>
                        </el-form-item>
                        <el-form-item label="商品分类" prop="goods_cat">
                            <el-cascader
                                v-model="addForm.goods_cat"
                                :options="catelist"
                                :props="{
                                    expandTrigger: 'hover',
                                    label: 'cat_name',
                                    value: 'cat_id',
                                    children: 'children',
                                }"
                                @change="handleChange"
                            ></el-cascader>
                        </el-form-item>
                    </el-tab-pane>

                    <el-tab-pane label="商品参数" name="1">
                        <el-form-item
                            :label="item.attr_name"
                            v-for="item in manyTableData"
                            :key="item.attrId"
                        >
                            <!-- 复选框 -->
                            <el-checkbox-group v-model="item.attr_vals">
                                <el-checkbox
                                    border
                                    :label="singleItem"
                                    v-for="(singleItem, index) in item.attr_vals"
                                    :key="index"
                                ></el-checkbox>
                            </el-checkbox-group>
                        </el-form-item>
                    </el-tab-pane>

                    <el-tab-pane label="商品属性" name="2">
                        <el-form-item
                            :label="item.attr_name"
                            v-for="item in onlyTableData"
                            :key="item.attrId"
                        >
                            <el-input v-model="item.attr_vals"></el-input>
                        </el-form-item>
                    </el-tab-pane>

                    <el-tab-pane label="商品图片" name="3">
                        <!-- action 表示图片要上传到的后台API地址 -->
                        <el-upload
                            action="http://127.0.0.1:8888/api/private/v1/upload"
                            :on-preview="handlePreview"
                            :on-remove="handleRemove"
                            list-type="picture"
                            :headers="headerObj"
                            :on-success="handleSuccess"
                        >
                            <el-button size="small" type="primary">点击上传</el-button>
                        </el-upload>
                    </el-tab-pane>

                    <el-tab-pane label="商品内容" name="4">
                        <!-- 富文本编辑器组件 -->
                        <quill-editor v-model="addForm.goods_introduce"></quill-editor>
                        <!-- 添加商品的按钮 -->
                        <el-button type="primary" style="margin-top: 20px" @click="add">
                            添加商品
                        </el-button>
                    </el-tab-pane>
                </el-tabs>
            </el-form>
        </el-card>
        <!-- 图片预览 -->
        <el-dialog title="图片预览" :visible.sync="previewVisible" width="50%">
            <img :src="previewPath" alt="" class="previewImg" />
        </el-dialog>
    </div>
</template>
<script>
import _ from 'lodash'
export default {
  data () {
    return {
      activeIndex: '0',
      tabPosition: 'left',
      addForm: {
        goods_name: '',
        goods_price: 0,
        goods_weight: 0,
        goods_number: 0,
        goods_cat: [], // 商品所属的分类数组
        pics: [], // 图片的数组
        goods_introduce: '', // 商品详情描述
        attrs: []
      },
      addFormRules: {
        goods_name: [
          {
            required: true,
            message: '请输入商品名称',
            trigger: 'blur'
          }
        ],
        goods_price: [
          {
            required: true,
            message: '请输入商品价格',
            trigger: 'blur'
          }
        ],
        goods_weight: [
          {
            required: true,
            message: '请输入商品重量',
            trigger: 'blur'
          }
        ],
        goods_number: [
          {
            required: true,
            message: '请输入商品数量',
            trigger: 'blur'
          }
        ],
        goods_cat: [{ required: true, message: '请选择商品分类', trigger: 'blur' }]
      },
      catelist: [],
      manyTableData: [], // 动态参数列表
      onlyTableData: [], // 商品静态属性列表
      // 图片上上传组件的headers请求头对象
      headerObj: {
        Authorization: window.sessionStorage.getItem('token')
      },
      previewPath: '',
      previewVisible: false
    }
  },
  created () {
    this.getCateList()
  },
  methods: {
    // 获取所有商品数据
    getCateList () {
      this.$http.get('categories').then(res => {
        if (res.data.meta.status !== 200) {
          return this.$message.error('获取商品列表失败！！！')
        }
        console.log(res.data.data)
        this.catelist = res.data.data
      })
    },
    handleChange () {
      console.log(this.addForm.goods_cat)
      // 表示没有选中三级分类
      if (this.addForm.goods_cat.length !== 3) {
        this.addForm.goods_cat = []
      }
    },
    beforeChangeTab (activeName, oldActiveName) {
      // console.log('即将进入的标签页', activeName);
      // console.log('即将离开的标签页', oldActiveName);
      if (oldActiveName === 0 && this.addForm.goods_cat.length !== 3) {
        // 表示从第一项开始跳
        this.$message.error('请选择商品分类！！！')
        return false
      }
    },
    tabClick () {
      console.log(this.activeIndex)
      // 1表示选择的是  商品参数  这一项
      if (this.activeIndex === '1') {
        this.$http
          .get(`categories/${this.cateId}/attributes`, {
            params: {
              sel: 'many'
            }
          })
          .then(res => {
            if (res.data.meta.status !== 200) {
              return this.$message.error('获取动态参数失败！！！')
            }
            res.data.data.forEach(item => {
              item.attr_vals =
                                item.attr_vals.length === 0 ? [] : item.attr_vals.split(',')
            })
            console.log('111111111111111', res.data.data)

            this.manyTableData = res.data.data
          })
      } else if (this.activeIndex === '2') {
        this.$http
          .get(`categories/${this.cateId}/attributes`, {
            params: {
              sel: 'only'
            }
          })
          .then(res => {
            if (res.data.meta.status !== 200) {
              return this.$message.error('获取静态属性失败！！！')
            }
            console.log('222222222222', res.data.data)
            this.onlyTableData = res.data.data
          })
      }
    },
    // 处理图片预览效果
    handlePreview (file) {
      console.log(file)
      this.previewPath = file.response.data.url
      this.previewVisible = true
    },
    // 处理移除图片的操作
    handleRemove (file) {
      console.log(file)
      // 1 获取要删除的图片的临时路径
      const filePath = file.response.data.tmp_path
      // 2 从pics数组中找到这个图片对应的索引值
      const serchIndex = this.addForm.pics.findIndex(x => x.pic === filePath)
      // 3 调用数组的splice方法，把图片信息对象，从pics中删除
      this.addForm.pics.splice(serchIndex, 1)
      console.log(this.addForm)
    },
    // 图片上传成功的事件
    handleSuccess (response) {
      // console.log(response);
      // 1 拼接得到一个图片信息对象
      const picInfo = { pic: response.data.tmp_path }
      // 2 将图片信息对象push到pics数组中
      this.addForm.pics.push(picInfo)
      console.log(this.addForm)
    },
    add () {
      // console.log(this.addForm);
      this.$refs.addFormRuleForm.validate(valid => {
        if (!valid) {
          return this.$message.error('请填写必要的表单项!')
        }
        // 执行表单添加的逻辑
        // lodash.cloneDeep 深拷贝
        const forms = _.cloneDeep(this.addForm)
        forms.goods_cat = forms.goods_cat.join(',')
        // console.log(this.addForm);
        // 处理动态参数
        this.manyTableData.forEach(item => {
          const newInfo = { attrId: item.attrId, attr_value: item.attr_vals.join(',') }
          this.addForm.attrs.push(newInfo)
        })
        // 处理静态属性
        this.onlyTableData.forEach(item => {
          const newInfo = { attrId: item.attrId, attr_value: item.attr_vals }
          this.addForm.attrs.push(newInfo)
        })

        forms.attrs = this.addForm.attrs
        console.log(forms)

        // 发起请求,添加商品,商品名称必须是唯一的
        this.$http.post('goods', forms).then(res => {
          console.log('返回结果', res)
          if (res.data.meta.status !== 201) {
            return this.$message.error('添加商品失败!!!')
          }
          this.$message.success('添加商品成功!!!')
          this.$router.push('/goods')
        })
      })
    }
  },
  computed: {
    cateId () {
      if (this.addForm.goods_cat.length === 3) {
        return this.addForm.goods_cat[2]
      }
      return null
    }
  }
}
</script>
<style lang="less" scoped>
.el-checkbox {
    margin: 0 5px 0 !important;
}
.previewImg {
    width: 100%;
}
</style>
