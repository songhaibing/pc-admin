<template>
  <div style="padding:30px;">
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <i class="el-icon-menu"></i>
        <span>用户列表</span>
        <el-button style="float: right;padding: 6px;"  type="danger" icon="el-icon-delete">删除</el-button>
        <el-button style="float: right;padding: 6px;margin-right: 6px"  type="primary" icon="el-icon-plus" @click="dialogFormVisible = true">添加</el-button>
      </div>
      <el-table
        ref="multipleTable"
        :data="tableData"
        v-loading="loading"
        tooltip-effect="dark"
        stripe
        border
        style="width: 100%"
      >
        <el-table-column
          type="selection"
          width="55">
        </el-table-column>
        <el-table-column
          align='center'
          label="序号"
          type="index"
          width="50">
        </el-table-column>
        <el-table-column
          prop="avatar"
          label="头像"
          align='center'
          width="220">
        </el-table-column>
        <el-table-column
          align='center'
          prop="deptId"
          label="部门id"
          width="150">
        </el-table-column>
        <el-table-column
          align='center'
          prop="name"
          label="邮箱"
          width="150">
        </el-table-column>
        <el-table-column
          align='center'
          label="是否禁止登陆"
          width="150">
          <template slot-scope="scope">{{ scope.row.lockFlag?'是':'否' }}</template>
        </el-table-column>
        <el-table-column
          align='center'
          prop="nickname"
          label="昵称"
          width="150">
        </el-table-column>
        <el-table-column
          align='center'
          prop="phone"
          label="手机号码"
          width="150">
        </el-table-column>
        <el-table-column
          align='center'
          prop="realname"
          label="真实姓名"
          width="150">
        </el-table-column>
        <el-table-column
          align='center'
          prop="username"
          label="用户名"
        >
        </el-table-column>
      </el-table>
      <div class="block">
        <el-pagination
          background
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page.sync="currentPage"
          :page-sizes="[10, 20, 30]"
          :page-size=size
          style="float: right;margin: 10px 0"
          layout="sizes, prev, pager, next"
          :total=total>
        </el-pagination>
      </div>
    </el-card>
    <el-dialog title="添加用户" width="500px" :visible.sync="dialogFormVisible">
      <el-form :model="form">
        <el-form-item label="用户名" :label-width="formLabelWidth">
          <el-input v-model="form.username" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="真实姓名" :label-width="formLabelWidth">
          <el-input v-model="form.realname" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="昵称" :label-width="formLabelWidth">
          <el-input v-model="form.nickname" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="邮箱" :label-width="formLabelWidth">
          <el-input v-model="form.email" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="手机号" :label-width="formLabelWidth">
          <el-input v-model="form.phone" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="密码" :label-width="formLabelWidth">
          <el-input v-model="form.password" autocomplete="off"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="addUser">添加</el-button>
      </div>
    </el-dialog>

  </div>
</template>

<script>
  export default {
    name: "index",
    data(){
      return{
        loading:true,
        tableData: [],
        currentPage: 1,//当前多少页
        size:10,//每页多少条数据
        total:0,//总共多少数据
        dialogFormVisible: false,
        form: {
          username: '',
          realname: '',
          phone: '',
          password: '',
          email: '',
          nickname: '',
        },
        formLabelWidth: '80px'
      }
    },
    methods: {
      //初始化分页
      init(){
        this.$_HTTP.get(this.$_API.userList,{size:this.size,current:this.currentPage},res=> {
          this.tableData=res.records
          this.total=res.total
          this.loading=false
        })
      },
      handleSizeChange(val) {
        this.size=val
        this.init()
      },
      addUser(){
        this.$_HTTP.get(this.$_API.userExits+this.form.username,{},res=>{
          if(res){

          }
        })
      },
      handleCurrentChange(val) {
        this.currentPage=val
        this.init()
      },
    },
    created() {
      this.init()
    },
  }
</script>

<style scoped>
  .dialog-footer{
    text-align: center;
  }
  .box-card {
    width: 100%;
  }
</style>
