<template>
  <div>
    <el-row>
      <div style="padding:20px">
        <el-card class="box-card">
          <div slot="header" class="clearfix">
            <el-button
              style="padding: 6px;"
              type="primary"
              icon="el-icon-download"
              @click="exportTemplate"
            >导出模版
            </el-button>
            <el-button
              style="padding: 6px;"
              type="warning"
              icon="el-icon-share"
              @click="importUser"
            >导入用户
            </el-button>
            <el-button
              style="padding: 6px;"
              type="primary"
              icon="el-icon-plus"
              @click="addButton"
              v-if="$_Authorities.indexOf('添加用户')!==-1"
            >添加
            </el-button>
            <!--<el-select v-model="valueSelect" placeholder="根据单位查询角色" style="float: right;" @change="change">-->
              <!--<el-option-->
                <!--v-for="item in optionsInquire"-->
                <!--:key="item.id"-->
                <!--:label="item.name"-->
                <!--:value="item.id"-->
              <!--/>-->
            <!--</el-select>-->
            <select-tree width="200" style="width: 300px;margin-right:-100px;float: right"
                         v-model="selected"
                         :options="selectedOptions"
                         :props="selectedProps" @selected="selectedDept"/>
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
              label="头像"
              align="center"
            >
              <template scope="scope">
                <img
                  v-if="scope.row.avatar"
                  :src="'http://106.75.178.9:80/resource/'+scope.row.avatar"
                  class="head_pic"
                >
                <img v-else src="@/assets/avatar/mieba.png" class="head_pic">
              </template>
            </el-table-column>
            <el-table-column align="center" prop="username" label="用户名" />
            <el-table-column align="center" prop="realname" label="姓名" />
            <el-table-column align="center" prop="sex" label="性别">
              <template v-if="scope.row.sex" slot-scope="scope">{{ scope.row.sex==='1'?'男':'女' }}</template>
            </el-table-column>
            <el-table-column align="center" prop="idCard" label="身份证号" />
            <el-table-column align="center" prop="smartCardVo" label="卡号" />
            <el-table-column align="center" prop="phone" label="手机号码" />
            <el-table-column align="center" label="归属单位"  v-if="$_Authorities.indexOf('用户归属单位')!==-1">
              <template v-if="scope.row.dept" slot-scope="scope">{{ scope.row.dept.name }}</template>
            </el-table-column>
            <el-table-column align="center" label="状态">
              <template slot-scope="scope">{{ scope.row.state==='1'?'正常':'禁用' }}</template>
            </el-table-column>
            <el-table-column align="center" label="操作" width="150">
              <template slot-scope="scope">
                <el-button
                  size="mini"
                  type="text"
                  @click="handleEdit(scope.$index, scope.row)"
                  v-if="$_Authorities.indexOf('编辑用户')!==-1"
                >编辑
                </el-button>
                <el-button
                  size="mini"
                  type="text"
                  @click="deleteUser(scope.$index, scope.row)"
                  v-if="$_Authorities.indexOf('删除用户')!==-1"
                >删除
                </el-button>
                <el-button
                  size="mini"
                  type="text"
                  @click="disableUser(scope.$index, scope.row)"
                  v-if="$_Authorities.indexOf('禁用用户')!==-1"
                >禁用
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
            <el-form-item label="头像上传" :label-width="formLabelWidth">
              <el-upload
                class="avatar-uploader"
                action="http://106.75.178.9:80/file/upload/file/avatar"
                :headers="{token}"
                :show-file-list="false"
                :on-success="handleAvatarSuccess"
                :before-upload="beforeAvatarUpload"
              >
                <img v-if="imageUrl" :src="imageUrl" class="avatar">
                <i v-else class="el-icon-plus avatar-uploader-icon" />
              </el-upload>
            </el-form-item>
            <el-form-item v-if="title==='编辑用户'" label="用户名" :label-width="formLabelWidth" prop="userName">
              <el-input v-model="form.userName" autocomplete="off" :disabled="disabled" />
            </el-form-item>
            <el-form-item label="姓名" :label-width="formLabelWidth" prop="realName">
              <el-input v-model="form.realName" autocomplete="off" />
            </el-form-item>
            <el-form-item label="性别" :label-width="formLabelWidth" prop="status">
              <el-select v-model="form.status" placeholder="请选择" style="width: 100%">
                <el-option label="男" value="1" />
                <el-option label="女" value="2" />
              </el-select>
            </el-form-item>
            <el-form-item label="身份证号" :label-width="formLabelWidth" prop="idCard">
              <el-input v-model="form.idCard" autocomplete="off" />
            </el-form-item>
            <el-form-item label="归属单位" :label-width="formLabelWidth" prop="className">
              <el-input
                v-model="form.className"
                readonly="readonly"
                placeholder="请选择单位"
                autocomplete="off"
                @focus="clickInput"
              />
            </el-form-item>
            <el-form-item label="角色" :label-width="formLabelWidth" prop="role">
              <el-select v-model="form.role" placeholder="请选择" style="width: 100%">
                <el-option
                  v-for="item in optionsRole"
                  :key="item.id"
                  :label="item.name"
                  :value="item.id"
                />
              </el-select>
            </el-form-item>
            <el-form-item label="手机号码" :label-width="formLabelWidth" prop="mobile">
              <el-input v-model="form.mobile" autocomplete="off" />
            </el-form-item>
            <el-form-item class="dialog-footer">
              <el-button @click="dialogFormVisible = false">取 消</el-button>
              <el-button type="primary" @click="addUser('form')">添加</el-button>
            </el-form-item>
          </el-form>
        </el-dialog>
      </div>
    </el-row>
    <el-dialog :title="titleTree" width="600px" :visible.sync="dialogFormTree">
      <el-input
        v-model="filterText"
        placeholder="输入关键字进行过滤"
      />
      <el-tree
        ref="tree2"
        class="filter-tree"
        :data="dataTree"
        :props="defaultProps"
        :filter-node-method="filterNode"
        @node-click="handleNodeClick"
      />
    </el-dialog>
    <el-dialog :title="titleExport" width="600px" :visible.sync="dialogFormImport">
      <import-form :import-api="api" @export="exportTab" />
    </el-dialog>
  </div>
</template>

<script>
import { checkPhone, checkEmail, checkPw, checkRenewPw } from '@/libs/regular.js'
import exportForm from '@/mixins/exportForm'
import SelectTree from '@/components/widget/SelectTree.vue';
import axios from 'axios'
import ImportForm from '../../../components/importForm/index'
import mixins from '@/mixins/user'
export default {
  name: 'UserList',
  components: { ImportForm,SelectTree },
  mixins: [exportForm, mixins],
  data() {
    return {
      selected: Number(localStorage.getItem('deptId')),
      // 数据默认字段
      selectedProps: {
        value: 'id',          // 唯一标识
        label: 'name',       // 标签显示
        children: 'children', // 子级
      },
      // 数据列表
      selectedOptions:  JSON.parse(localStorage.getItem('current')),
      selectId: '',
      deptId:localStorage.getItem('deptId'),
      optionsInquire: [],
      valueSelect: '',
      api: 'smartCard/importInfo',
      dialogFormImport: false,
      titleExport: '批量导入',
      disabled: false,
      dataTree: [],
      filterText: '',
      titleTree: '请选择',
      valueId: '', // 初始ID（可选）
      token: localStorage.getItem('token'),
      loading: true,
      data: [],
      optionsRole: [],
      defaultProps: {
        children: 'children',
        label: 'name'
      },
      id: '',
      isShow: true,
      tableData: [],
      dialogFormTree: false,
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
        role: '',
        idCard: '',
        userName: '',
        realName: '',
        mobile: '',
        className: '',
        status: ''
      },
      formLabelWidth: '80px',
      rules: {
        idCard: [
          { required: true, message: '请输入身份证号', trigger: 'blur' }
        ],
        status: [
          { required: true, message: '请选择性别', trigger: 'blur' }
        ],
        realName: [
          { required: true, message: '请输入真实姓名', trigger: 'blur' }
        ],
        className: [
          { required: true, message: '请选择', trigger: 'blur' }
        ],
        mobile: [
          { required: true, validator: checkPhone, trigger: 'blur' }
        ]
      }
    }
  },
  watch: {
    filterText(val) {
      this.$refs.tree2.filter(val)
    }
  },
  created() {
    this.init()
    this.$_HTTP.get(this.$_API.deptTree, {}, res => {
      this.dataTree = res
    })
  },
  methods: {
    selectedDept(val){
      this.deptId=val
      this.init()
    },
    exportTab(val) {
      this.dialogFormImport = val
      this.init()
    },
    clickInput() {
      this.dialogFormTree = true
    },
    // 导出模版
    exportTemplate() {
      const token = localStorage.getItem('token')
      axios.get(this.$_API.exportTemplate, {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          'Authorization': `Bearer ${token}`// 请求的数据类型为form data格式
        },
        'responseType': 'blob' // 设置响应的数据类型为一个包含二进制数据的 Blob 对象，必须设置！！！
      }).then(function(response) {
        const blob = new Blob([response.data])
        const fileName = '新增人员名单.xls'
        const linkNode = document.createElement('a')
        linkNode.download = fileName // a标签的download属性规定下载文件的名称
        linkNode.style.display = 'none'
        linkNode.href = URL.createObjectURL(blob) // 生成一个Blob URL
        document.body.appendChild(linkNode)
        linkNode.click() // 模拟在按钮上的一次鼠标单击
        URL.revokeObjectURL(linkNode.href) // 释放URL 对象
        document.body.removeChild(linkNode)
      }).catch(function(error) {

      })
    },
    importUser() {
      this.dialogFormImport = true
    },
    filterNode(value, data) {
      if (!value) return true
      return data.name.indexOf(value) !== -1
    },
    handleNodeClick(data) {
      this.form.className = data.name
      this.valueId = data.id
      this.dialogFormTree = false
      this.roleFind(data.id)
    },
    roleFind(id) {
      this.$_HTTP.get(this.$_API.roleFindDept + id,{}, res => {
        this.optionsRole = res.records
      })
    },
    // 初始化分页
    init() {
      this.loading = true
      this.$_HTTP.get(this.$_API.userList, { deptId:this.deptId,size: this.size, current: this.currentPage }, res => {
        this.tableData = res.records
        this.total = res.total
        this.loading = false
      })
    },
    // 编辑
    handleEdit(index, row) {
      this.disabled = true
      this.valueId = row.dept.id
      this.form.className = row.dept.name
      if (row.avatar) {
        this.imageUrl = 'http://106.75.178.9:80/resource/' + row.avatar
      } else {
        this.imageUrl = this.avatar
      }
      this.roleFind(row.dept.id)
      this.title = '编辑用户'
      this.dialogFormVisible = true
      this.form.status = row.sex
      this.form.idCard = row.idCard
      this.form.userName = row.username
      this.form.realName = row.realname
      this.form.mobile = row.phone
      this.form.role = row.roles.length!==0?row.roles[0].id:''
      this.form.Email = row.email
      this.form.nickName = row.nickname
    },
    // 删除
    deleteUser(index, row) {
      console.log(row)
      this.$confirm('此操作将永久删除该用户, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$_HTTP.delete(this.$_API.deleteUser + row.id, {}, res => {
          if (res.code === 1) {
            this.init()
            this.$message({
              type: 'success',
              message: '删除成功!'
            })
          }
        })
      }).catch(() => {

      })
    },
    //禁用用户
    disableUser(index,row){
      this.$confirm('此操作将禁用该用户, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$_HTTP.put(this.$_API.editUser + row.username,{state:'2'}, res => {
          if (res.code === 1) {
            this.dialogFormVisible = false
            this.init()
            this.$message({
              message: '禁用用户成功',
              type: 'success'
            })
          }
        })
      }).catch(() => {

      })
    },
    addButton() {
      this.disabled = false
      this.form.className = ''
      this.form.realName = ''
      this.form.mobile = ''
      this.imageUrl = ''
      this.title = '添加用户'
      this.dialogFormVisible = true
    },
    handleSizeChange(val) {
      this.size = val
      this.init()
    },
    handleAvatarSuccess(res, file) {
      this.imageUrl = URL.createObjectURL(file.raw)
      this.getBase64(file.raw).then(res => {
        this.base64 = res
      })
    },
    isImageFormat(file) {
      return file.type === 'image/jpeg' || file.type === 'image/png'
    },
    beforeAvatarUpload(file) {
      const isImageFormat = this.isImageFormat(file)
      const isLt2M = file.size / 1024 / 1024 < 2
      if (!isImageFormat) {
        this.$message.error('上传头像图片只能是 JPG和PNG 格式!')
      }
      if (!isLt2M) {
        this.$message.error('上传头像图片大小不能超过 2MB!')
      }
      return isImageFormat && isLt2M
    },
    addUser(form) {
      this.$refs[form].validate((valid) => {
        if (valid) {
          const params = {
            sex: this.form.status,
            username: '111',
            password: '2233eereerr',
            realname: this.form.realName,
            phone: this.form.mobile,
            avatar: this.base64,
            deptId: this.valueId,
            roleIds: [this.form.role],
            idCard: this.form.idCard
          }
          if (this.title === '添加用户') {
            this.$_HTTP.post(this.$_API.addUser, params, res => {
              if (res.code === 1) {
                this.dialogFormVisible = false
                this.init()
                this.$message({
                  message: '添加用户成功',
                  type: 'success'
                })
              }
            })
          } else {
            this.$_HTTP.put(this.$_API.editUser + this.form.userName, params, res => {
              if (res.code === 1) {
                this.dialogFormVisible = false
                this.init()
                this.$message({
                  message: '修改用户成功',
                  type: 'success'
                })
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

</style>
