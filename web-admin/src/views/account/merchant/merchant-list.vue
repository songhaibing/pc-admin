<template>
  <div style="padding: 20px">
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <i class="el-icon-school" />
        <span>商户列表</span>
        <el-button
          style="float: right;padding: 6px;margin-right: 6px"
          type="primary"
          icon="el-icon-plus"
          @click="addButton"
        >添加
        </el-button>
      </div>
      <el-table
        v-loading="loading"
        :data="tableData"
        style="width: 100%"
      >
        <el-table-column align="center" label="序号" type="index" width="50" />
        <el-table-column label="ID" align="center" prop="id" width="50" />
        <el-table-column align="center" prop="name" label="商户名称" />
        <el-table-column align="center" prop="categories" label="主营类目" />
        <el-table-column align="center" prop="email" label="状态">
          <template slot-scope="scope">{{ scope.row.businessState==='0'?'营业中':'已清退' }}</template>
        </el-table-column>
        <el-table-column align="center" label="商户负责人" prop="head" />
        <el-table-column align="center" label="联系电话" prop="phoneNumber" />
        <el-table-column align="center" label="设备数" prop="deviceNumber" />
        <el-table-column align="center" label="到期时间" prop="expireTime" />
        <el-table-column align="center" label="操作">
          <template slot-scope="scope">
            <el-button size="mini" type="text">编辑</el-button>
            <el-button size="mini" type="text">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <div class="block">
        <el-pagination
          background
          :current-page.sync="currentPage"
          :page-sizes="[10, 20, 30]"
          :page-size="size"
          style="float: right;margin: 10px 0"
          layout="sizes, prev, pager, next"
          :total="total"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
        />
      </div>
    </el-card>
    <el-dialog :title="title" width="600px" :visible.sync="dialogFormVisible">
      <el-form ref="form" :model="form" status-icon :rules="rules" label-width="100px" class="demo-ruleForm">
        <el-form-item label="账户ID" :label-width="formLabelWidth" prop="id">
          <el-input v-model="form.id" autocomplete="off" />
        </el-form-item>
        <el-form-item label="商户名称" :label-width="formLabelWidth" prop="name">
          <el-input v-model="form.name" autocomplete="off" />
        </el-form-item>
        <el-form-item label="主营类目" :label-width="formLabelWidth" prop="category">
          <el-input v-model="form.category" autocomplete="off" />
        </el-form-item>
        <el-form-item label="状态" :label-width="formLabelWidth" prop="status">
          <el-select v-model="form.status" placeholder="请选择" style="width: 100%" @change="change">
            <el-option label="营业中" value="0" />
            <el-option label="已清退" value="1" />
          </el-select>
        </el-form-item>
        <el-form-item label="商户负责人" :label-width="formLabelWidth" prop="principal">
          <el-input v-model="form.principal" autocomplete="off" />
        </el-form-item>
        <el-form-item label="联系电话" :label-width="formLabelWidth" prop="phone">
          <el-input v-model="form.phone" autocomplete="off" />
        </el-form-item>
        <el-form-item label="设备数" :label-width="formLabelWidth" prop="num">
          <el-input v-model="form.num" autocomplete="off" />
        </el-form-item>
        <el-form-item label="到期时间" :label-width="formLabelWidth" prop="time">
          <el-input v-model="form.time" autocomplete="off" />
        </el-form-item>
        <el-form-item class="dialog-footer">
          <el-button @click="dialogFormVisible = false">取 消</el-button>
          <el-button type="primary" @click="addMerchant('form')">添加</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: 'MerchantList',
  data() {
    return {
      formLabelWidth: '100px',
      tableData: [],
      dialogFormVisible: false,
      loading: true,
      title: '添加商户',
      currentPage: 1, // 当前多少页
      size: 10, // 每页多少条数据
      total: 0, // 总共多少数据
      value: '',
      form: {
        id: '',
        status: '',
        name: '',
        category: '',
        principal: '',
        phone: '',
        num: '',
        time: ''
      },
      rules: {
        id: [
          { required: true, message: '请输入商户id', trigger: 'blur' }
        ],
        status: [
          { required: true, message: '请选择类型', trigger: 'blur' }
        ],
        name: [
          { required: true, message: '请输入商户名称', trigger: 'blur' }
        ],
        category: [
          { required: true, message: '请输入主营类目', trigger: 'blur' }
        ],
        principal: [
          { required: true, message: '请输入商户负责人', trigger: 'blur' }
        ],
        phone: [
          { required: true, message: '请输入联系电话', trigger: 'blur' }
        ],
        num: [
          { required: true, message: '请输入设备数', trigger: 'blur' }
        ],
        time: [
          { required: true, message: '请输入到期时间', trigger: 'blur' }
        ]
      }
    }
  },
  created() {
    this.init()
  },
  methods: {
    change() {
      console.log(this.form.status)
    },
    // 初始化分页
    init() {
      this.loading = true
      this.$_HTTP.get(this.$_API.businessList, { size: this.size, current: this.currentPage }, res => {
        this.tableData = res.records
        console.log(res)
        this.total = res.total
        this.loading = false
      })
    },
    handleSizeChange(val) {
      this.size = val
      this.init()
    },
    handleCurrentChange(val) {
      this.currentPage = val
      this.init()
    },
    addButton() {
      this.form.name = ''
      this.form.status = ''
      this.form.name = ''
      this.form.category = ''
      this.form.principal = ''
      this.form.num = ''
      this.form.time = ''
      this.form.phone = ''
      this.title = '添加商户'
      this.dialogFormVisible = true
    },
    addMerchant(form) {
      this.$refs[form].validate((valid) => {
        if (valid) {
          const params = {
            name: this.form.name,
            type: this.form.type,
            value: this.form.value,
            remarks: this.form.remarks
          }
          if (this.title === '添加商户') {
            this.$_HTTP.post(this.$_API.addBusiness, params, res => {
              if (res.code === 1) {
                this.dialogFormVisible = false
                this.$message({
                  message: '添加字典成功',
                  type: 'success'
                })
                this.init()
              }
            })
          } else {
            this.$_HTTP.put(this.$_API.editDict + this.dictId, params, res => {
              if (res.code === 1) {
                this.dialogFormVisible = false
                this.$message({
                  message: '修改字典成功',
                  type: 'success'
                })
                this.init()
              }
            })
          }
        }
      })
    }
  }
}
</script>

<style scoped>

</style>
