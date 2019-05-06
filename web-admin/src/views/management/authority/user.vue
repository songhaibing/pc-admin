<template>
  <div style="padding:30px;">
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <i class="el-icon-menu"></i>
        <span>用户列表</span>
        <el-button style="float: right;padding: 6px;margin-right: 6px" type="primary" icon="el-icon-plus"
                   @click="dialogFormVisible = true">添加
        </el-button>
      </div>
      <el-table
        :data="tableData"
        v-loading="loading"
        stripe
        border
        style="width: 100%"
      >
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
          width="150">
        </el-table-column>
        <el-table-column
          align='center'
          prop="deptId"
          label="部门id"
          width="150">
        </el-table-column>
        <el-table-column
          align='center'
          prop="email"
          label="邮箱"
          width="170">
        </el-table-column>
        <el-table-column
          align='center'
          label="是否禁止登陆"
          width="100">
          <template slot-scope="scope">{{ scope.row.lockFlag?'是':'否' }}</template>
        </el-table-column>
        <el-table-column
          align='center'
          prop="nickname"
          label="昵称"
          width="100">
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
          width="100">
        </el-table-column>
        <el-table-column
          align='center'
          prop="username"
          width="150"
          label="用户名"
        >
        </el-table-column>
        <el-table-column align='center' label="操作">
          <template slot-scope="scope">
            <el-tooltip content="编辑" placement="top">
              <el-button
                size="mini"
                type="success"
                icon="el-icon-edit"
                @click="handleEdit(scope.$index, scope.row)"></el-button>
            </el-tooltip>
            <el-tooltip content="删除" placement="top">
              <el-button
                size="mini"
                type="danger"
                icon="el-icon-delete"
                @click="deleteUser(scope.$index, scope.row)"></el-button>
            </el-tooltip>
            <el-tooltip content="修改密码" placement="top">
              <el-button
                size="mini"
                type="warning"
                icon="el-icon-edit"
                @click="changePassword(scope.$index, scope.row)"></el-button>
            </el-tooltip>
          </template>
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
    <el-dialog :title="title" width="500px" :visible.sync="dialogFormVisible">
      <el-form :model="form" status-icon :rules="rules" ref="form" label-width="100px" class="demo-ruleForm">
        <el-form-item label="用户名" :label-width="formLabelWidth" prop="username">
          <el-input v-model="form.username" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="真实姓名" :label-width="formLabelWidth" prop="realname">
          <el-input v-model="form.realname" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="昵称" :label-width="formLabelWidth" prop="nickname">
          <el-input v-model="form.nickname" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="邮箱" :label-width="formLabelWidth" prop="email">
          <el-input v-model="form.email" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="手机号" :label-width="formLabelWidth" prop="phone">
          <el-input v-model="form.phone" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="密码" :label-width="formLabelWidth" prop="password" v-if="title==='添加用户'">
          <el-input v-model="form.password" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item class="dialog-footer">
          <el-button @click="dialogFormVisible = false">取 消</el-button>
          <el-button type="primary" @click="addUser('form')">添加</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
    <el-dialog title="修改密码" width="500px" :visible.sync="dialogPwVisible">
      <el-form :model="formPw" status-icon :rules="rulesPw" ref="formPw" label-width="100px" class="demo-ruleForm">
        <el-form-item label="密码" :label-width="formLabelWidth" prop="password">
          <el-input v-model="formPw.password" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="确认密码" :label-width="formLabelWidth" prop="newPassword" >
          <el-input v-model="formPw.newPassword" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item class="dialog-footer">
          <el-button @click="dialogPwVisible = false">取 消</el-button>
          <el-button type="primary" @click="sure('formPw')">确定</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
  </div>
</template>

<script>
  import {checkPhone, checkEmail} from '@/libs/regular.js'

  export default {
    name: "index",
    data() {
      const checkUserName = (rule, value, callback) => {
        if (!value) {
          return callback(new Error('请输入用户名'));
        }
        if (this.title === '编辑用户') {
          callback();
        }
          setTimeout(() => {
            //检测用户名是否重复
            this.$_HTTP.get(this.$_API.userExits + this.form.username, {}, res => {
              if (res) {
                callback(new Error('用户名重复'));
              } else {
                callback();
              }
            })
          }, 1000);
      };
      const checkPw = (rule, value, callback) => {
        if (!value) {
          return callback(new Error('请输入确认密码'));
        }
        if(this.formPw.password===this.formPw.newPassword){
          callback();
        }else {
          callback(new Error('密码不一致'));
        }
      };
      return {
        loading: true,
        tableData: [],
        currentPage: 1,//当前多少页
        size: 10,//每页多少条数据
        total: 0,//总共多少数据
        dialogFormVisible: false,
        dialogPwVisible:false,
        isNameRepeat: true,
        idArr: [],
        userName:'',
        title:'添加用户',
        form: {
          username: '',
          realname: '',
          phone: '',
          password: '',
          email: '',
          nickname: '',
        },
        formPw:{
          password:'',
          newPassword:''
        },
        formLabelWidth: '80px',
        rulesPw:{
          password: [
            {required: true, message: '请输入密码', trigger: 'blur'},
            {min: 6, message: '密码必须大于6位', trigger: 'blur'}
          ],
          newpassword: [
            {required: true, validator: checkPw, trigger: 'blur'}
          ],
        },
        rules: {
          username: [
            {required: true, validator: checkUserName, trigger: 'blur'}
          ],
          realname: [
            {required: true, message: '请输入真实姓名', trigger: 'blur'}
          ],
          phone: [
            {required: true, validator: checkPhone, trigger: 'blur'}
          ],
          password: [
            {required: true, message: '请输入密码', trigger: 'blur'},
            {min: 6, message: '密码必须大于6位', trigger: 'blur'}
          ],
          email: [
            {required: true, validator: checkEmail, trigger: 'blur'}
          ],
          nickname: [
            {required: true, message: '请输入昵称', trigger: 'blur'}
          ],
        }
      }
    },
    methods: {
      //初始化分页
      init() {
        this.loading = true
        this.$_HTTP.get(this.$_API.userList, {size: this.size, current: this.currentPage}, res => {
          this.tableData = res.records
          this.total = res.total
          this.loading = false
        })
      },
      //编辑
      handleEdit(index,row){
       this.title='编辑用户'
        this.dialogFormVisible=true
        this.form=row
      },
      //删除
      deleteUser(index,row) {
        this.$confirm('此操作将永久删除该用户, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.$_HTTP.delete(this.$_API.deleteUser+row.id, {}, res => {
            if (res.code === 1) {
              this.$message({
                type: 'success',
                message: '删除成功!'
              });
              this.init()
            }
          })
        }).catch(() => {

        });
      },
      changePassword(index,row){
        console.log(row)
          this.dialogPwVisible=true
          this.userName=row.username
      },
      handleSizeChange(val) {
        this.size = val
        this.init()
      },
      sure(){
        this.$_HTTP.put(this.$_API.editUser+this.userName,this.formPw, res => {
          if (res.code === 1) {
            this.dialogPwVisible = false
            this.$message({
              message: '修改密码成功',
              type: 'success'
            });
          }
        })
      },
      addUser(form) {
        this.$refs[form].validate((valid) => {
          if (valid) {
            let params = {
              username: this.form.username,
              realname: this.form.realname,
              phone: this.form.phone,
              password: this.form.password,
              email: this.form.email,
              nickname: this.form.nickname
            }
            if(this.title==='添加用户'){
              this.$_HTTP.post(this.$_API.addUser, params, res => {
                console.log(res.code)
                if (res.code === 1) {
                  this.dialogFormVisible = false
                  this.$message({
                    message: '添加用户成功',
                    type: 'success'
                  });
                  this.init()
                }
              })
            }else {
              this.$_HTTP.put(this.$_API.editUser+this.form.username, params, res => {
                if (res.code === 1) {
                  this.dialogFormVisible = false
                  this.$message({
                    message: '修改用户成功',
                    type: 'success'
                  });
                  this.init()
                }
              })
            }
          }
        });
      },
      handleCurrentChange(val) {
        this.currentPage = val
        this.init()
      },
    },
    created() {
      this.init()
    },
  }
</script>

<style scoped>
  .dialog-footer {
    text-align: center;
  }
.el-icon-unlock{
  width: 12px;
  height: 13px;
}
  .box-card {
    width: 100%;
  }
</style>
