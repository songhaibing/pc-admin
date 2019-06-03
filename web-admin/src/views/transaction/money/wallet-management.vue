<template>
  <!--钱包管理-->
  <div style="padding: 20px">
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <el-button
          style="float: right;padding: 6px;margin-right: 6px"
          type="primary"
          icon="el-icon-plus"
          @click="addButton"
        >添加
        </el-button>
        <!--<el-button-->
          <!--style="float: right"-->
          <!--type="success"-->
        <!--&gt;查询-->
        <!--</el-button>-->
        <!--<el-input v-model="number" style="width: 150px;float: right;margin-right: 5px" placeholder="请输入交易单号" />-->
        <!--<el-date-picker-->
          <!--v-model="value"-->
          <!--type="daterange"-->
          <!--align="right"-->
          <!--style="float: right;margin-right: 5px"-->
          <!--unlink-panels-->
          <!--range-separator="-"-->
          <!--start-placeholder="开始日期"-->
          <!--end-placeholder="结束日期"-->
          <!--:picker-options="pickerOptions"-->
        <!--/>-->
      </div>
      <el-table
        v-loading="loading"
        :data="tableData"
        style="width: 100%"
      >
        <el-table-column
          align="center"
          label="序号"
          type="index"
        />
        <el-table-column
          label="账户ID"
          prop="id"
          align="center"
        />
        <el-table-column
          align="center"
          prop="purseTypeVo.name"
          label="类型"
        />
        <el-table-column
          align="center"
          prop="userVo.username"
          label="持有人姓名"
        />
        <el-table-column
          align="center"
          prop="userVo.phone"
          label="手机号"
        />
        <el-table-column
          align="center"
          prop="balance"
          label="账户余额"
        />
        <el-table-column
          align="center"
          prop="userVo.dept.name"
          label="归属单位"
        />
        <el-table-column
          align="center"
          prop="phone"
          label="是否允许充值"
        >
          <template slot-scope="scope">{{ scope.row.isAllow?'是':'否' }}</template>
        </el-table-column>
        <el-table-column align="center" label="操作" width="150">
          <template slot-scope="scope">
            <el-button
              size="mini"
              type="text"
            >修改
            </el-button>
            <el-button
              size="mini"
              type="text"
            >禁用
            </el-button>
            <el-button
              size="mini"
              type="text"
            >删除
            </el-button>
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
        <el-form-item label="类型" :label-width="formLabelWidth" prop="name">
          <el-input v-model="form.name" autocomplete="off" />
        </el-form-item>
        <el-form-item label="持有人姓名" :label-width="formLabelWidth" prop="name">
          <el-input v-model="form.name" autocomplete="off" />
        </el-form-item>
        <el-form-item label="手机号" :label-width="formLabelWidth" prop="name">
          <el-input v-model="form.name" autocomplete="off" />
        </el-form-item>
        <el-form-item label="账户余额" :label-width="formLabelWidth" prop="name">
          <el-input v-model="form.name" autocomplete="off" />
        </el-form-item>
        <el-form-item label="归属单位" :label-width="formLabelWidth" prop="name">
          <el-input v-model="form.name" autocomplete="off" />
        </el-form-item>
        <el-form-item label="是否允许充值" :label-width="formLabelWidth" prop="name">
          <el-input v-model="form.name" autocomplete="off" />
        </el-form-item>
        <el-form-item class="dialog-footer">
          <el-button @click="dialogFormVisible = false">取 消</el-button>
          <el-button type="primary" @click="addClass('form')">添加</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: 'WalletManagement',
  data() {
    return {
      loading:true,
      tableData:[],
      currentPage: 1, // 当前多少页
      size: 10, // 每页多少条数据
      total: 0, // 总共多少数据
      number: '',
      dialogFormVisible: false,
      form: {
        name: '',
        status:''
      },
      rules: {
        name: [
          { required: true, message: '请输入分类名称', trigger: 'blur' }
        ],
        status: [
          { required: true, message: '请选择分类状态', trigger: 'blur' }
        ]
      },
      pickerOptions: {
        shortcuts: [{
          text: '最近一周',
          onClick(picker) {
            const end = new Date()
            const start = new Date()
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 7)
            picker.$emit('pick', [start, end])
          }
        }, {
          text: '最近一个月',
          onClick(picker) {
            const end = new Date()
            const start = new Date()
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 30)
            picker.$emit('pick', [start, end])
          }
        }, {
          text: '最近三个月',
          onClick(picker) {
            const end = new Date()
            const start = new Date()
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 90)
            picker.$emit('pick', [start, end])
          }
        }]
      },
      value: ''
    }
  },
  created(){
    this.init()
  },
  methods:{
    // 初始化分页
    init() {
      this.loading = true
      this.$_HTTP.get(this.$_API.walletList, {size: this.size, current: this.currentPage}, res => {
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
    addButton(){
      this.dialogFormVisible=true
    }
  }
}
</script>

<style scoped>

</style>
