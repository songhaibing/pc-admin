<template>
  <!--补助发放-->
  <div style="padding: 20px">
    <div style="margin-left: 10px">
      <div style="display: flex;flex-direction: column;">
        <div>
          <span>搜索查询</span>
          <el-input v-model="input" placeholder="按交易单号或姓名筛选" style="width: 300px;margin-left: 20px"></el-input>
          <el-input v-model="input" placeholder="按单位筛选" style="width: 300px;margin-left: 20px"></el-input>
        </div>
        <div style="margin-top: 20px">
          <span>查询日期</span>
          <el-date-picker
            v-model="value"
            style="margin-left: 20px"
            type="daterange"
            align="right"
            unlink-panels
            range-separator="-"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            :picker-options="pickerOptions"
          />
          <el-button
            type="success"
            style="margin-left: 10px"
          >查询
          </el-button>
        </div>
        <div style="margin-top: -30px">
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
      <el-tabs v-model="activeName" style="margin-top: 20px">
        <el-tab-pane label="未发放" name="first"></el-tab-pane>
        <el-tab-pane label="已发放" name="second"></el-tab-pane>
      </el-tabs>
    </div>
    <el-card class="box-card">
      <el-table v-loading="loading" :data="tableData" style="width: 100%">
        <el-table-column align="center" label="序号" type="index"/>
        <el-table-column label="交易流水号" align="center"/>
        <el-table-column align="center" prop="username" label="姓名">
          <template slot-scope="scope">{{ scope.row.userVo.realname }}</template>
        </el-table-column>
        <el-table-column align="center" prop="realname" label="身份证号">
          <template slot-scope="scope">{{ scope.row.userVo.idCard }}</template>
        </el-table-column>
        <el-table-column align="center" prop="nickname" label="归属单位">
          <template slot-scope="scope">{{ scope.row.userVo.dept.name }}</template>
        </el-table-column>
        <el-table-column align="center" prop="money" label="补助金额"/>
        <el-table-column align="center" prop="createTime" label="发放时间"/>
        <el-table-column align="center" prop="phone" label="状态"/>
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
              @click="handleEdit(scope.$index, scope.row)"
            >修改
            </el-button>
            <el-button
              size="mini"
              type="text"
              @click="handleEdit(scope.$index, scope.row)"
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
    <el-dialog title="设置补贴信息" width="600px" :visible.sync="dialogForm">
      <el-form ref="form" :model="form" status-icon :rules="rules" label-width="100px" class="demo-ruleForm">
        <el-form-item label="补助金额" :label-width="formLabelWidth" prop="money">
          <el-input v-model="form.money" autocomplete="off"/>
        </el-form-item>
        <el-form-item label="入账钱包" :label-width="formLabelWidth" prop="value">
          <el-select v-model="form.value" placeholder="请选择" style="width: 100%">
            <el-option
              v-for="item in options"
              :key="item.id"
              :label="item.name"
              :value="item.id">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item class="dialog-footer">
          <el-button @click="dialogFormVisible = false">取 消</el-button>
          <el-button type="primary" @click="subsidy('form')">发放</el-button>
        </el-form-item>
      </el-form>

    </el-dialog>
    <el-dialog :title="titleExport" width="600px" :visible.sync="dialogFormImport">
      <import-form :importApi="api"></import-form>
    </el-dialog>
  </div>
</template>

<script>
  import axios from 'axios'
  import ImportForm from "../../../components/importForm/index";

  export default {
    name: 'subsidy-grant',
    components: {ImportForm},
    data() {
      return {
        formLabelWidth:'100px',
        options: [],
        dialogForm: false,
        tableData: [],
        loading: true,
        form: {
          money: '',
          value: ''
        },
        rules: {
          money: [
            {required: true, message: '请输入补助金额', trigger: 'blur'}
          ],
          value:[
            {required: true, message: '请输入补助金额', trigger: 'blur'}
          ],
        },
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
      this.init()
      this.$_HTTP.get(this.$_API.purseTypeAll, {}, res => {
        this.options=res
      })
    },
    methods: {
      // 初始化分页
      init() {
        this.loading = true
        this.$_HTTP.get(this.$_API.subsidyPage, {deptId: 0, size: this.size, current: this.currentPage}, res => {
          this.tableData = res.records
          this.total = res.total
          this.loading = false
        })
      },
      //一键发放
      release() {
        this.dialogForm = true
      },
      //补助分发
      subsidy(form) {
        this.$refs[form].validate((valid) => {
          if (valid) {
              this.$_HTTP.put(this.$_API.subsidySend +this.form.value+'/'+ this.form.money, {}, res => {


              })
            }
        })
      },
      //导出补助名单
      exportSubsidy(){
        const token = localStorage.getItem('token')
        axios.get(this.$_API.subsidyExport, {
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            'Authorization': `Bearer ${token}`//请求的数据类型为form data格式
          },
          'responseType': 'blob'  //设置响应的数据类型为一个包含二进制数据的 Blob 对象，必须设置！！！
        }).then(function (response) {
          const blob = new Blob([response.data]);
          const fileName = 'table.xls';
          const linkNode = document.createElement('a');

          linkNode.download = fileName; //a标签的download属性规定下载文件的名称
          linkNode.style.display = 'none';
          linkNode.href = URL.createObjectURL(blob); //生成一个Blob URL
          document.body.appendChild(linkNode);
          linkNode.click();  //模拟在按钮上的一次鼠标单击
          URL.revokeObjectURL(linkNode.href); // 释放URL 对象
          document.body.removeChild(linkNode);

        }).catch(function (error) {
          console.log(error);
        });
      },
      //导出模版
      exportTemplate() {
        const token = localStorage.getItem('token')
        axios.get(this.$_API.exportSubsidyTemplate, {
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            'Authorization': `Bearer ${token}`//请求的数据类型为form data格式
          },
          'responseType': 'blob'  //设置响应的数据类型为一个包含二进制数据的 Blob 对象，必须设置！！！
        }).then(function (response) {
          const blob = new Blob([response.data]);
          const fileName = 'table.xls';
          const linkNode = document.createElement('a');

          linkNode.download = fileName; //a标签的download属性规定下载文件的名称
          linkNode.style.display = 'none';
          linkNode.href = URL.createObjectURL(blob); //生成一个Blob URL
          document.body.appendChild(linkNode);
          linkNode.click();  //模拟在按钮上的一次鼠标单击
          URL.revokeObjectURL(linkNode.href); // 释放URL 对象
          document.body.removeChild(linkNode);

        }).catch(function (error) {
          console.log(error);
        });
      },
      importUser() {
        this.dialogFormImport = true
      },
    }
  }
</script>

<style scoped>
  .box-card {

  }
</style>


