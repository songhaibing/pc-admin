<template>
  <!--钱包管理-->
  <div style="padding: 20px">
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <i class="el-icon-school" />
        <span>钱包管理</span>
        <!--<el-button-->
          <!--style="float: right;padding: 6px;margin-right: 6px"-->
          <!--type="primary"-->
          <!--icon="el-icon-plus"-->
          <!--@click="addButton"-->
        <!--&gt;添加-->
        <!--</el-button>-->
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
          label="是否允许充值"
        >
          <!--<template slot-scope="scope">{{ scope.row.isAllow?'是':'否' }}</template>-->
          <template slot-scope="scope">
            <el-switch :active-value="activeValue" :inactive-value="false"
                       active-color="#13ce66"
                       v-model="scope.row.isAllow" @change='change(scope.row,scope.row.isAllow)'/>
          </template>
        </el-table-column>
        <el-table-column align="center" label="操作" width="150">
          <template slot-scope="scope">
            <!--<el-button-->
              <!--size="mini"-->
              <!--type="text"-->
            <!--&gt;修改-->
            <!--</el-button>-->
            <el-button
              size="mini"
              type="text"
            >禁用
            </el-button>
            <!--<el-button-->
              <!--size="mini"-->
              <!--type="text"-->
            <!--&gt;删除-->
            <!--</el-button>-->
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
    <!--<el-dialog :title="title" width="600px" :visible.sync="dialogFormVisible">-->
      <!--<el-form ref="form" :model="form" status-icon :rules="rules" label-width="100px" class="demo-ruleForm">-->
        <!--<el-form-item label="类型" :label-width="formLabelWidth" prop="type">-->
          <!--<el-select v-model="form.type" placeholder="请选择" style="width: 100%"  @change="change">-->
            <!--<el-option-->
              <!--v-for="item in options"-->
              <!--:key="item.id"-->
              <!--:label="item.name"-->
              <!--:value="item.id">-->
            <!--</el-option>-->
          <!--</el-select>-->
        <!--</el-form-item>-->
        <!--<el-form-item label="持有人姓名" :label-width="formLabelWidth" prop="name">-->
          <!--<el-input v-model="form.name" autocomplete="off" />-->
        <!--</el-form-item>-->
        <!--<el-form-item label="手机号" :label-width="formLabelWidth" prop="name">-->
          <!--<el-input v-model="form.phone" autocomplete="off" />-->
        <!--</el-form-item>-->
        <!--<el-form-item label="账户余额" :label-width="formLabelWidth" prop="balance">-->
          <!--<el-input v-model="form.balance" autocomplete="off" />-->
        <!--</el-form-item>-->
        <!--<el-form-item label="归属单位" :label-width="formLabelWidth" prop="unit">-->
          <!--<el-input v-model="form.unit" autocomplete="off" />-->
        <!--</el-form-item>-->
        <!--<el-form-item label="是否允许充值" :label-width="formLabelWidth" prop="isRecharge">-->
          <!--<el-switch-->
            <!--v-model="form.isRecharge"-->
            <!--active-text="是"-->
            <!--inactive-text="否">-->
          <!--</el-switch>-->
        <!--</el-form-item>-->
        <!--<el-form-item class="dialog-footer">-->
          <!--<el-button @click="dialogFormVisible = false">取 消</el-button>-->
          <!--<el-button type="primary" @click="addClass('form')">添加</el-button>-->
        <!--</el-form-item>-->
      <!--</el-form>-->
    <!--</el-dialog>-->
  </div>
</template>

<script>
export default {
  name: 'WalletManagement',
  data() {
    return {
      inactiveValue:false,
      activeValue:true,
      selectId:'',
      title:'添加钱包',
      formLabelWidth: '100px',
      loading:true,
      tableData:[],
      currentPage: 1, // 当前多少页
      size: 10, // 每页多少条数据
      total: 0, // 总共多少数据
      number: '',
      dialogFormVisible: false,
      options:[],
      // form: {
      //   name: '',
      //   status:'',
      //   balance:'',
      //   unit:'',
      //   isRecharge:''
      // },
      // rules: {
      //   name: [
      //     { required: true, message: '请输入分类名称', trigger: 'blur' }
      //   ],
      //   phone: [
      //     { required: true, message: '请选择分类状态', trigger: 'blur' }
      //   ]
      // },
      value: ''
    }
  },
  created(){
    this.init()
    //获取钱包分类
    // this.$_HTTP.get(this.$_API.purseTypeList, {size: 10, current: 1}, res => {
    //   this.options=res.records
    // })
  },
  methods:{
    // 初始化分页
    init() {
      this.loading = true
      this.$_HTTP.get(this.$_API.walletList, {size: this.size, current: this.currentPage}, res => {
        this.tableData = res.records
        this.total = res.total
        this.loading = false
      })
    },
    change(row, data) {
      this.$_HTTP.put(this.$_API.editWallet + row.id, {isAllow: data}, res => {
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
    },
  }
}
</script>

<style scoped>

</style>
