<template>
  <div style="display: flex">
    <div class="left-main">
      <div class="boxLeftTop">
        <span class="menu_title">系统目录</span>
      </div>
      <el-tree :highlight-current="true" class="single-content" :data="data" :props="defaultProps" @node-click="handleNodeClick" />
    </div>
    <tip-message v-if="isShow" />
    <div v-else style="padding:20px;margin-left: 200px;width: 1250px">
      <el-card class="box-card">
        <div slot="header" class="clearfix">
          <i class="el-icon-menu" />
          <span>角色列表</span>
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
            prop="name"
            label="姓名"
            width="150"
          />
          <el-table-column
            align="center"
            prop="code"
            label="code"
            width="150"
          />
          <el-table-column
            align="center"
            prop="description"
            label="描述"
            width="400"
          />
          <el-table-column
            label="操作"
            align="center"
          >
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
    </div>
    <el-dialog :title="title" width="500px" :visible.sync="dialogFormVisible">
      <el-form ref="form" :model="form" status-icon :rules="rules" label-width="100px" class="demo-ruleForm">
        <el-form-item label="姓名" :label-width="formLabelWidth" prop="Name">
          <el-input v-model="form.Name" autocomplete="off" />
        </el-form-item>
        <el-form-item label="code" :label-width="formLabelWidth" prop="Code">
          <el-input v-model="form.Code" autocomplete="off" />
        </el-form-item>
        <el-form-item label="描述" :label-width="formLabelWidth" prop="des">
          <el-input v-model="form.des" autocomplete="off" />
        </el-form-item>
        <el-form-item class="dialog-footer">
          <el-button @click="dialogFormVisible = false">取 消</el-button>
          <el-button type="primary" @click="addUser('form')">添加</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
  </div>
</template>

<script>
import TipMessage from '../../../components/tipMessage/tipMessage'
export default {
  name: 'Role',
  components: { TipMessage },
  data() {
    return {
      isShow: true,
      loading: true,
      dialogFormVisible: false,
      title: '添加角色',
      id: '', // 部门id
      roleId: '', // 角色id
      records: [],
      size: 10,
      currentPage: 1,
      total: 0,
      data: [],
      defaultProps: {
        children: 'children',
        label: 'name'
      },
      form: {
        Name: '',
        Code: '',
        des: ''
      },
      rules: {
        Name: [
          { required: true, message: '请输入姓名', trigger: 'blur' }
        ],
        Code: [
          { required: true, message: '请输入code', trigger: 'blur' }
        ],
        des: [
          { required: true, message: '请输入描述信息', trigger: 'blur' }
        ]
      },
      tableData: [],
      formLabelWidth: '80px'
    }
  },
  created() {
    this.$_HTTP.get(this.$_API.deptTree, {}, res => {
      this.data = res
    })
  },
  methods: {
    addButton() {
      this.dialogFormVisible = true
      this.title = '添加角色'
      this.form.Name = ''
      this.form.Code = ''
      this.form.des = ''
    },
    handleNodeClick(data) {
      this.isShow = false
      const id = data.id
      this.id = id
      this.findDept(id)
    },
    // 初始化角色列表分页
    findDept(id) {
      this.loading = true
      this.$_HTTP.get(this.$_API.findDept + id, { size: this.size, current: this.currentPage }, res => {
        this.tableData = res.records
        this.total = res.total
        this.loading = false
      })
    },
    addUser(form) {
      this.$refs[form].validate((valid) => {
        if (valid) {
          const data = {
            name: this.form.Name,
            code: this.form.Code,
            description: this.form.des,
            deptId: this.id
          }
          if (this.title === '添加角色') {
            this.$_HTTP.post(this.$_API.addRole, data, res => {
              if (res.code === 1) {
                this.dialogFormVisible = false
                this.findDept(this.id)
              }
            })
          } else {
            this.$_HTTP.put(this.$_API.editRole + this.roleId, data, res => {
              if (res.code === 1) {
                this.dialogFormVisible = false
                this.findDept(this.id)
              }
            })
          }
        }
      })
    },
    handleSizeChange(val) {
      this.size = val
      this.findDept(this.id)
    },
    handleCurrentChange(val) {
      this.currentPage = val
      this.findDept(this.id)
    },
    handleEdit(index, row) {
      this.roleId = row.id
      this.title = '编辑角色'
      this.dialogFormVisible = true
      this.form.Name = row.name
      this.form.des = row.description
      this.form.Code = row.code
    },
    deleteUser(index, row) {
      this.$confirm('此操作将永久删除该角色, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$_HTTP.delete(this.$_API.deleteRole + row.id, {}, res => {
          if (res.code === 1) {
            this.$message({
              type: 'success',
              message: '删除成功!'
            })
            this.findDept(this.id)
          }
        })
      }).catch(() => {

      })
      console.log(index, row)
    }
  }
}
</script>

<style scoped lang="scss">
  .left-main{
    position: fixed;
    height: 100%;
    width: 200px;
    border-right: 1px solid #e0e1e3;
    .boxLeftTop{
      .menu_title{
        padding-left: 16px;
        background-color: #f8f8f8;
        font-size: 16px;
        line-height: 55px;
      }
    }
    .single-content{
      cursor: pointer;
      padding: 10px 0 0 16px;
      .title{
        font-size: 12px;
        font-family: Verdana, Arial, Helvetica, AppleGothic, sans-serif;
      }
    }

  }

</style>
