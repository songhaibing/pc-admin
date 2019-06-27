<template>
  <!--补助发放-->
  <div style="padding: 20px">
    <div style="margin-left: 10px">
      <div style="display: flex;flex-direction: column;">
        <div>
          <div style="display: flex;align-items: center">
            <span>搜索查询</span>
            <el-input v-model="input" placeholder="按交易单号或姓名筛选" style="width: 300px;margin-left: 20px;"/>
            <select-tree width="200" style="margin-left: 10px;margin-top: 5px"
                         v-model="selected"
                         :options="selectedOptions"
                         :props="selectedProps" @selected="selectedDept"/>
            <el-select v-model="moneyValue" placeholder="请选择钱包类型" clearable style="margin-left: 20px" @change="getMoneyValue">
              <el-option
                v-for="item in optionsMoney"
                :key="item.id"
                :label="item.name"
                :value="item.id"
              />
            </el-select>
          </div>
        </div>
        <div style="margin-top: 20px">
          <span>查询日期</span>
          <el-date-picker
            v-model="queryDate"
            style="margin-left: 20px"
            type="daterange"
            value-format="timestamp"
            align="right"
            unlink-panels
            range-separator="-"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            :picker-options="pickerOptions"
          />
          <el-button
            type="success"
            style="margin-left: 30px"
            @click="query"
          >查询
          </el-button>
        </div>
        <div>
          <el-button
            style="margin-left:10px;float: right"
            type="primary"
            icon="el-icon-download"
            @click="exportSubsidy"
          >导出清单
          </el-button>
          <el-button
            style="float: right"
            type="success"
            icon="el-icon-s-promotion"
            @click="release"
          >一键发放
          </el-button>
          <el-button
            style="float: right"
            type="warning"
            icon="el-icon-share"
            @click="importUser"
          >导入名单
          </el-button>
          <el-button
            style="float: right"
            type="primary"
            icon="el-icon-download"
            @click="exportTemplate"
          >导出模版
          </el-button>

        </div>
      </div>
      <el-tabs v-model="activeName" style="margin-top: 20px" @tab-click="handleClick">
        <el-tab-pane label="未发放" name="first" />
        <el-tab-pane label="已发放" name="second" />
      </el-tabs>
    </div>
    <el-card class="box-card">
      <el-table v-loading="loading" :data="tableData" style="width: 100%">
        <el-table-column align="center" label="序号" type="index" />
        <el-table-column align="center" prop="username" label="姓名">
          <template slot-scope="scope">{{ scope.row.userVo.realname }}</template>
        </el-table-column>
        <el-table-column align="center" prop="realname" label="身份证号">
          <template slot-scope="scope">{{ scope.row.userVo.idCard }}</template>
        </el-table-column>
        <el-table-column align="center" prop="nickname" label="归属单位">
          <template slot-scope="scope">{{ scope.row.userVo.dept.name }}</template>
        </el-table-column>
        <el-table-column align="center" prop="money" label="补助金额" />
        <el-table-column align="center" prop="createTime" label="发放时间" />
        <el-table-column align="center"  label="状态">
          <template slot-scope="scope">{{ scope.row.state==='0'?'已发放':'未发放' }}</template>
        </el-table-column>
        <el-table-column align="center" label="操作">
          <template slot-scope="scope">
            <el-button
              size="mini"
              type="text"
              @click="handleEdit(scope.$index, scope.row)"
            >查看
            </el-button>
            <el-button
              size="mini"
              type="text"
              v-if="activeName==='first'"
              @click="singleSubsidies(scope.$index, scope.row)"
            >单个发放
            </el-button>
            <el-button
              size="mini"
              type="text"
              v-if="activeName==='second'&&scope.row.createTime.substring(0,10)===nowTime"
              @click="handleSubsidies(scope.$index, scope.row)"
            >撤回补助
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
        />
      </div>
    </el-card>
    <el-dialog :title="titleMoney" width="600px" :visible.sync="dialogForm">
      <el-form ref="form" :model="form" status-icon :rules="rules" label-width="100px" class="demo-ruleForm">
        <el-form-item label="补助金额" :label-width="formLabelWidth" prop="money">
          <el-input v-model="form.money" autocomplete="off" />
        </el-form-item>
        <el-form-item label="入账钱包" :label-width="formLabelWidth" prop="value">
          <el-select v-model="form.value" placeholder="请选择" style="width: 100%">
            <el-option
              v-for="item in options"
              :key="item.id"
              :label="item.name"
              :value="item.id"
            />
          </el-select>
        </el-form-item>
        <el-form-item class="dialog-footer">
          <el-button @click="dialogFormVisible = false">取 消</el-button>
          <el-button type="primary" @click="subsidy('form')">发放</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
    <el-dialog title="查看补助信息" width="600px" :visible.sync="dialogFormMsg">
      <el-form  :model="formMsg"  label-width="100px" class="demo-ruleForm">
        <el-form-item label="姓名" :label-width="formLabelWidth" prop="name">
          <el-input v-model="formMsg.name" autocomplete="off" disabled/>
        </el-form-item>
        <el-form-item label="身份证号" :label-width="formLabelWidth" prop="idCard">
        <el-input v-model="formMsg.idCard" autocomplete="off" disabled/>
      </el-form-item>
        <el-form-item label="归属单位" :label-width="formLabelWidth" prop="unit">
          <el-input v-model="formMsg.unit" autocomplete="off" disabled/>
        </el-form-item>
        <el-form-item label="补助金额" :label-width="formLabelWidth" prop="money">
          <el-input v-model="formMsg.money" autocomplete="off" disabled/>
        </el-form-item>
        <el-form-item label="发放时间" :label-width="formLabelWidth" prop="time">
          <el-input v-model="formMsg.time" autocomplete="off" disabled/>
        </el-form-item>
        <el-form-item label="状态" :label-width="formLabelWidth" prop="status">
          <el-input v-model="formMsg.status" autocomplete="off" disabled/>
        </el-form-item>
        <el-form-item class="dialog-footer">
          <el-button @click="dialogFormMsg = false">取 消</el-button>
          <el-button type="primary" @click="dialogFormMsg = false">确定</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
    <el-dialog :title="titleExport" width="600px" :visible.sync="dialogFormImport">
      <import-form :import-api="api" @export="exportTab" />
    </el-dialog>
  </div>
</template>

<script>
import axios from 'axios'
import ImportForm from '../../../components/importForm/index'
import SelectTree from '@/components/widget/SelectTree.vue';
export default {
  name: 'SubsidyGrant',
  components: { ImportForm,SelectTree },
  data() {
    return {
      nowTime:'',
      moneyValue:'',
      optionsMoney:[],
      queryDate:'',
      startTime:0,
      endTime:0,
      state:1,
      deptId:localStorage.getItem('deptId'),
      selected: Number(localStorage.getItem('deptId')),
      // 数据默认字段
      selectedProps: {
        value: 'id',          // 唯一标识
        label: 'name',       // 标签显示
        children: 'children', // 子级
      },
      // 数据列表
      selectedOptions:  JSON.parse(localStorage.getItem('current')),
      moneyId:'',
      titleMoney:'一键发放',
      valueSelect: '',
      optionsInquire:[],
      dialogFormMsg:false,
      formLabelWidth: '100px',
      options: [],
      dialogForm: false,
      tableData: [],
      loading: true,
      formMsg:{
        name:'',
        idCard:'',
        unit:'',
        money:'',
        time:'',
        status:''
      },
      form: {
        money: '',
        value: ''
      },
      rules: {
        money: [
          { required: true, message: '请输入补助金额', trigger: 'blur' }
        ],
        value: [
          { required: true, message: '请输入补助金额', trigger: 'blur' }
        ]
      },
      purseId:0,
      selectId:0,
      currentPage: 1, // 当前多少页
      size: 10, // 每页多少条数据
      total: 0, // 总共多少数据
      api: 'subsidy/importSubsidyInfo',
      input: '',
      titleExport: '批量导入',
      dialogFormImport: false,
      activeName: 'first',
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
  created() {
    this.issuedInit()
    this.$_HTTP.get(this.$_API.deptTree, {}, res => {
      this.optionsInquire = res
    })
    this.$_HTTP.get(this.$_API.purseTypeAll, {}, res => {
      this.options = res
      this.optionsMoney=res
    })
  },
  watch: {
    activeName(){
      this.getNowTime();
    }
  },
  methods: {
    //获取现在时间
    getNowTime(){
      const day = new Date();
      day.setTime(day.getTime());
      const nowTime = day.getFullYear()+"-" + (day.getMonth()+1) + "-" + day.getDate();
      this.nowTime=nowTime
    },
    query(){
      this.startTime=this.queryDate?this.queryDate[0]:0
      this.endTime=this.queryDate?this.queryDate[1]:0
      this.issuedInit()
    },
    selectedDept(val){
      this.deptId=val
      this.issuedInit()
    },
    handleEdit(index,row){
      this.dialogFormMsg=true
      this.formMsg.name=row.userVo.username
      this.formMsg.idCard=row.userVo.idCard
      this.formMsg.unit=row.userVo.dept.name
      this.formMsg.money=row.money
      this.formMsg.time=row.createTime
      this.formMsg.status=row.state==='0'?'已发放':'未发放'
    },
    handleClick(tab, event) {
      if (tab.name === 'first') {
        this.state=1
        this.issuedInit()
      } else {
        this.state=0
        this.issuedInit()
      }
    },
    exportTab(val) {
      this.dialogFormImport = val
      this.state=1
      this.issuedInit()
    },
    getMoneyValue(val){
      console.log(val)
      this.purseId=val
      this.issuedInit()
    },
    issuedInit() {
      this.loading = true
      this.$_HTTP.get(this.$_API.subsidyList, { purseId:this.purseId,username:this.input,endTime:this.endTime,startTime:this.startTime,state:this.state,deptId: this.deptId, size: this.size, current: this.currentPage }, res => {
        this.tableData = res.records
        this.total = res.total
        this.loading = false
      })
    },
    singleSubsidies(index,row){
      console.log(row)
      this.moneyId=row.userVo.id
      this.form.money=''
      this.form.value=''
      this.titleMoney='单个发放'
      this.dialogForm = true
    },
    //撤回补助
    handleSubsidies(index,row){
      this.$confirm('此操作将撤回补助, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$_HTTP.put(this.$_API.subsidyEdit + row.id, {}, res => {
          if (res.code === 1) {
            this.$message({
              type: 'success',
              message: '撤回补助成功!'
            })
            this.issuedInit()
          }
        })
      }).catch(() => {

      })
    },

    change(val) {
      this.selectId = val
      this.init()
    },
    // 一键发放
    release() {
      this.titleMoney==='一键发放'
      this.form.money=''
      this.form.value=''
      this.dialogForm = true
    },
    // 补助分发
    subsidy(form) {
      this.$refs[form].validate((valid) => {
        if (valid) {
          if(this.titleMoney==='一键发放'){
            this.$_HTTP.put(this.$_API.subsidySend + this.form.value + '/' + this.form.money+'/'+0, {}, res => {
              if (res.code === 1) {
                this.$message({
                  type: 'success',
                  message: '补助发放成功!'
                })
                this.dialogForm=false
                this.issuedInit()
                this.activeName = 'second'
              }
            })
          }else{
            this.$_HTTP.put(this.$_API.subsidySend + this.form.value + '/' + this.form.money+'/'+this.moneyId, {}, res => {
              if (res.code === 1) {
                this.$message({
                  type: 'success',
                  message: '补助发放成功!'
                })
                this.dialogForm=false
                this.state=0
                this.issuedInit()
                this.activeName = 'second'
              }
            })
          }
        }
      })
    },
    // 导出补助名单
    exportSubsidy() {
      const token = localStorage.getItem('token')
      axios.get(this.$_API.subsidyExport, {
        params: {
          purseId:this.purseId,
          username:this.input,
          endTime:this.endTime,
          startTime:this.startTime,
          deptId: this.deptId,
        },
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          'Authorization': `Bearer ${token}`// 请求的数据类型为form data格式
        },
        'responseType': 'blob' // 设置响应的数据类型为一个包含二进制数据的 Blob 对象，必须设置！！！
      }).then(function(response) {
        const blob = new Blob([response.data])
        const fileName = '已发放人员名单.xls'
        const linkNode = document.createElement('a')

        linkNode.download = fileName // a标签的download属性规定下载文件的名称
        linkNode.style.display = 'none'
        linkNode.href = URL.createObjectURL(blob) // 生成一个Blob URL
        document.body.appendChild(linkNode)
        linkNode.click() // 模拟在按钮上的一次鼠标单击
        URL.revokeObjectURL(linkNode.href) // 释放URL 对象
        document.body.removeChild(linkNode)
      }).catch(function(error) {
        console.log(error)
      })
    },
    // 导出模版
    exportTemplate() {
      const token = localStorage.getItem('token')
      axios.get(this.$_API.exportSubsidyTemplate, {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          'Authorization': `Bearer ${token}`// 请求的数据类型为form data格式
        },
        'responseType': 'blob' // 设置响应的数据类型为一个包含二进制数据的 Blob 对象，必须设置！！！
      }).then(function(response) {
        const blob = new Blob([response.data])
        const fileName = '待发放人员名单.xls'
        const linkNode = document.createElement('a')

        linkNode.download = fileName // a标签的download属性规定下载文件的名称
        linkNode.style.display = 'none'
        linkNode.href = URL.createObjectURL(blob) // 生成一个Blob URL
        document.body.appendChild(linkNode)
        linkNode.click() // 模拟在按钮上的一次鼠标单击
        URL.revokeObjectURL(linkNode.href) // 释放URL 对象
        document.body.removeChild(linkNode)
      }).catch(function(error) {
        console.log(error)
      })
    },
    importUser() {
      this.dialogFormImport = true
    }
  }
}
</script>

<style scoped>
  .box-card {

  }
</style>

