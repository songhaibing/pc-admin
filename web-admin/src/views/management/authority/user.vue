<template>
  <div style="display: flex">
    <div class="left-main">
      <div class="boxLeftTop">
        <span class="menu_title">系统目录</span>
      </div>
      <el-tree
        :highlight-current="true"
        class="single-content"
        :data="data"
        :props="defaultProps"
        @node-click="handleNodeClick"
      />
    </div>
    <tip-message v-if="isShow" />
    <div v-else style="padding:20px;margin-left: 200px;width: 1250px">
      <el-card class="box-card">
        <div slot="header" class="clearfix">
          <i class="el-icon-menu" />
          <span>用户列表</span>
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
          <el-table-column
            align="center"
            label="序号"
            type="index"
            width="60"
          />
          <el-table-column
            label="头像"
            align="center"
            width="150"
          >
            <template scope="scope">
              <img
                v-if="scope.row.avatar"
                :src="'http://106.75.178.9:8080/resource/'+scope.row.avatar"
                class="head_pic"
              >
              <img v-else src="@/assets/avatar/mieba.png" class="head_pic">
            </template>
          </el-table-column>
          <el-table-column
            align="center"
            prop="username"
            width="100"
            label="用户名"
          />
          <el-table-column
            align="center"
            prop="realname"
            label="真实姓名"
            width="100"
          />
          <el-table-column
            align="center"
            prop="nickname"
            label="昵称"
            width="100"
          />
          <el-table-column
            align="center"
            prop="phone"
            label="手机号码"
            width="120"
          />
          <el-table-column
            align="center"
            label="部门"
            width="100"
          >
            <template slot-scope="scope">{{ scope.row.dept.name }}</template>
          </el-table-column>
          <el-table-column
            align="center"
            prop="email"
            label="邮箱"
            width="170"
          />
          <el-table-column
            align="center"
            label="是否禁止登陆"
            width="100"
          >
            <template slot-scope="scope">{{ scope.row.lockFlag?'是':'否' }}</template>
          </el-table-column>
          <el-table-column align="center" label="操作">
            <template slot-scope="scope">
              <el-button
                size="mini"
                type="text"
                @click="handleEdit(scope.$index, scope.row)"
              >编辑
              </el-button>
              <el-button
                size="mini"
                type="text"
                @click="deleteUser(scope.$index, scope.row)"
              >删除
              </el-button>
              <el-button
                size="mini"
                type="text"
                @click="changePassword(scope.$index, scope.row)"
              >修改密码
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
      <el-dialog :title="title" width="500px" :visible.sync="dialogFormVisible">
        <el-form ref="form" :model="form" status-icon :rules="rules" label-width="100px" class="demo-ruleForm">
          <el-form-item label="头像上传" :label-width="formLabelWidth">
            <el-upload
              class="avatar-uploader"
              action="http://106.75.178.9:8080/file/upload/file/avatar"
              :headers="{token}"
              :show-file-list="false"
              :on-success="handleAvatarSuccess"
              :before-upload="beforeAvatarUpload"
            >
              <img v-if="imageUrl" :src="imageUrl" class="avatar">
              <i v-else class="el-icon-plus avatar-uploader-icon" />
            </el-upload>
          </el-form-item>
          <el-form-item label="用户名" :label-width="formLabelWidth" prop="userName">
            <el-input v-model="form.userName" autocomplete="off" />
          </el-form-item>
          <el-form-item label="真实姓名" :label-width="formLabelWidth" prop="realName">
            <el-input v-model="form.realName" autocomplete="off" />
          </el-form-item>
          <el-form-item label="昵称" :label-width="formLabelWidth" prop="nickName">
            <el-input v-model="form.nickName" autocomplete="off" />
          </el-form-item>
          <el-form-item label="部门" :label-width="formLabelWidth" prop="dept">
            <el-select v-model="form.dept" placeholder="请选择部门" style="width: 100%">
              <el-option label="区域一" value="shanghai" />
              <el-option label="区域二" value="beijing" />
            </el-select>
          </el-form-item>
          <el-form-item label="邮箱" :label-width="formLabelWidth" prop="Email">
            <el-input v-model="form.Email" autocomplete="off" />
          </el-form-item>
          <el-form-item label="手机号" :label-width="formLabelWidth" prop="mobile">
            <el-input v-model="form.mobile" autocomplete="off" />
          </el-form-item>
          <el-form-item v-if="title==='添加用户'" label="密码" :label-width="formLabelWidth" prop="password">
            <el-input v-model="form.password" autocomplete="off" />
          </el-form-item>
          <el-form-item class="dialog-footer">
            <el-button @click="dialogFormVisible = false">取 消</el-button>
            <el-button type="primary" @click="addUser('form')">添加</el-button>
          </el-form-item>
        </el-form>
      </el-dialog>
      <el-dialog title="修改密码" width="500px" :visible.sync="dialogPwVisible">
        <el-form ref="formPw" :model="formPw" status-icon :rules="rulesPw" label-width="100px" class="demo-ruleForm">
          <el-form-item label="旧密码" :label-width="formLabelWidth" prop="password">
            <el-input v-model="formPw.password" autocomplete="off" />
          </el-form-item>
          <el-form-item label="新密码" :label-width="formLabelWidth" prop="newPassword">
            <el-input v-model="formPw.newPassword" autocomplete="off" />
          </el-form-item>
          <el-form-item label="确认密码" :label-width="formLabelWidth" prop="repeatPassword">
            <el-input v-model="formPw.repeatPassword" autocomplete="off" />
          </el-form-item>
          <el-form-item class="dialog-footer">
            <el-button @click="dialogPwVisible = false">取 消</el-button>
            <el-button type="primary" @click="sure('formPw')">确定</el-button>
          </el-form-item>
        </el-form>
      </el-dialog>
    </div>
  </div>
</template>

<script>
import TipMessage from '../../../components/tipMessage/tipMessage'
import { checkPhone, checkEmail, checkPw, checkRenewPw } from '@/libs/regular.js'
import mixins from '@/mixins/user'

export default {
  name: 'User',
  components: { TipMessage },
  mixins: [mixins],
  data() {
    const checkUserName = (rule, value, callback) => {
      if (!value) {
        return callback(new Error('请输入用户名'))
      }
      if (this.title === '编辑用户') {
        callback()
      }
      setTimeout(() => {
        // 检测用户名是否重复
        this.$_HTTP.get(this.$_API.userExits + this.form.userName, {}, res => {
          if (res) {
            callback(new Error('用户名重复'))
          } else {
            callback()
          }
        })
      }, 1000)
    }
    const checkRepeatPw = (rule, value, callback) => {
      if (!value) {
        return callback(new Error('请输入确认密码'))
      }
      if (this.formPw.repeatPassword !== this.formPw.newPassword) {
        return callback(new Error('密码不一致'))
      } else {
        callback()
      }
    }
    return {
      token: localStorage.getItem('token'),
      loading: true,
      data: [],
      defaultProps: {
        children: 'children',
        label: 'name'
      },
      id: '',
      isShow: true,
      tableData: [],
      currentPage: 1, // 当前多少页
      size: 10, // 每页多少条数据
      total: 0, // 总共多少数据
      dialogFormVisible: false,
      dialogPwVisible: false,
      isNameRepeat: true,
      idArr: [],
      userName: '',
      title: '添加用户',
      imageUrl: '',
      base64: '',
      avatar: require('@/assets/avatar/mieba.png'),
      form: {
        userName: '',
        realName: '',
        mobile: '',
        password: '',
        Email: '',
        nickName: '',
        dept: ''
      },
      formPw: {
        password: '',
        newPassword: '',
        repeatPassword: ''
      },
      formLabelWidth: '80px',
      rulesPw: {
        password: [
          { required: true, message: '请输入密码', trigger: 'blur' },
          { min: 6, message: '密码必须大于6位字符', trigger: 'blur' }
        ],
        newPassword: [
          { required: true, validator: checkPw, trigger: 'blur' }
        ],
        repeatPassword: [
          { required: true, validator: checkRepeatPw, trigger: 'blur' }
        ]
      },
      rules: {
        userName: [
          { required: true, validator: checkUserName, trigger: 'blur' }
        ],
        realName: [
          { required: true, message: '请输入真实姓名', trigger: 'blur' }
        ],
        mobile: [
          { required: true, validator: checkPhone, trigger: 'blur' }
        ],
        password: [
          { required: true, validator: checkPw, trigger: 'blur' }
        ],
        Email: [
          { required: true, validator: checkEmail, trigger: 'blur' }
        ],
        nickName: [
          { required: true, message: '请输入昵称', trigger: 'blur' }
        ],
        dept: [
          { required: true, message: '请选择部门', trigger: 'blur' }
        ]
      }
    }
  },
  created() {
    this.$_HTTP.get(this.$_API.deptTree, {}, res => {
      this.data = res
      res.map(item => {
        console.log(item.name)
      })
    })
  },
  methods: {
    // 初始化分页
    init(id) {
      this.loading = true
      this.$_HTTP.get(this.$_API.userList, { deptId: id, size: this.size, current: this.currentPage }, res => {
        this.tableData = res.records
        this.total = res.total
        this.loading = false
      })
    },
    handleNodeClick(data) {
      this.isShow = false
      this.id = data.id
      this.init(data.id)
    },
    // 编辑
    handleEdit(index, row) {
      if (row.avatar) {
        this.imageUrl = 'http://106.75.178.9:8080/resource/' + row.avatar
      } else {
        this.imageUrl = this.avatar
      }
      this.title = '编辑用户'
      this.dialogFormVisible = true
      this.form.userName = row.username
      this.form.realName = row.realname
      this.form.mobile = row.phone
      this.form.Email = row.email
      this.form.nickName = row.nickname
    },
    // 删除
    deleteUser(index, row) {
      this.$confirm('此操作将永久删除该用户, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$_HTTP.delete(this.$_API.deleteUser + row.id, {}, res => {
          if (res.code === 1) {
            this.$message({
              type: 'success',
              message: '删除成功!'
            })
            this.init(this.id)
          }
        })
      }).catch(() => {

      })
    },
    changePassword(index, row) {
      this.dialogPwVisible = true
      this.userName = row.username
    },
    addButton() {
      this.form.userName = ''
      this.form.realName = ''
      this.form.mobile = ''
      this.form.Email = ''
      this.form.nickName = ''
      this.imageUrl = ''
      this.title = '添加用户'
      this.dialogFormVisible = true
    },
    handleSizeChange(val) {
      this.size = val
      this.init(this.id)
    },
    sure(formPw) {
      this.$refs[formPw].validate((valid) => {
        if (valid) {
          this.$_HTTP.put(this.$_API.editUser + this.userName, this.formPw, res => {
            if (res.code === 1) {
              this.dialogPwVisible = false
              this.$message({
                message: '修改密码成功',
                type: 'success'
              })
            }
          })
        }
      })
    },
    handleAvatarSuccess(res, file) {
      this.imageUrl = URL.createObjectURL(file.raw)
      this.getBase64(file.raw).then(res => {
        this.base64 = res
      })
    },
    beforeAvatarUpload(file) {
      const isJPG = file.type === 'image/jpeg'
      const isLt2M = file.size / 1024 / 1024 < 2

      if (!isJPG) {
        this.$message.error('上传头像图片只能是 JPG 格式!')
      }
      if (!isLt2M) {
        this.$message.error('上传头像图片大小不能超过 2MB!')
      }
      return isJPG && isLt2M
    },
    addUser(form) {
      this.$refs[form].validate((valid) => {
        if (valid) {
          const params = {
            username: this.form.userName,
            realname: this.form.realName,
            phone: this.form.mobile,
            password: this.form.password,
            email: this.form.Email,
            nickname: this.form.nickName,
            avatar: this.base64,
            deptId: this.id
          }
          if (this.title === '添加用户') {
            this.$_HTTP.post(this.$_API.addUser, params, res => {
              if (res.code === 1) {
                this.dialogFormVisible = false
                this.$message({
                  message: '添加用户成功',
                  type: 'success'
                })
                this.init(this.id)
              }
            })
          } else {
            this.$_HTTP.put(this.$_API.editUser + this.form.userName, params, res => {
              if (res.code === 1) {
                this.dialogFormVisible = false
                this.$message({
                  message: '修改用户成功',
                  type: 'success'
                })
                this.init(this.id)
              }
            })
          }
        }
      })
    },
    handleCurrentChange(val) {
      this.currentPage = val
      this.init()
    }
  }
}
</script>

<style lang="scss" scoped>
  .left-main {
    position: fixed;
    height: 100%;
    width: 200px;
    border-right: 1px solid #e0e1e3;

    .boxLeftTop {
      .menu_title {
        padding-left: 16px;
        background-color: #f8f8f8;
        font-size: 16px;
        line-height: 55px;
      }
    }

    .single-content {
      cursor: pointer;
      padding: 10px 0 0 16px;

      .title {
        font-size: 12px;
        font-family: Verdana, Arial, Helvetica, AppleGothic, sans-serif;
      }
    }

  }

  .dialog-footer {
    text-align: center;
  }

  .box-card {
    width: 100%;
  }

  .avatar-uploader {
    width: 178px;
    height: 178px;
    border: 1px dashed #d9d9d9;
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
  }

  .avatar-uploader:hover {
    border-color: #409EFF;
  }

  .avatar-uploader-icon {
    font-size: 28px;
    color: #8c939d;
    width: 178px;
    height: 178px;
    line-height: 178px;
    text-align: center;
  }

  .avatar {
    width: 178px;
    height: 178px;
    display: block;
  }

  .head_pic {
    border-radius: 50%;
    width: 70px;
    height: 70px;
  }
</style>
