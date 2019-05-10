<template>
  <div style="padding:30px;">
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <i class="el-icon-menu" />
        <span>字典列表</span>
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
          align="center"
          prop="name"
          width="200"
          label="姓名"
        />
        <el-table-column
          align="center"
          prop="type"
          label="类型"
          width="200"
        />
        <el-table-column
          align="center"
          prop="value"
          label="值"
          width="200"
        />
        <el-table-column
          align="center"
          prop="remarks"
          label="备注"
          width="200"
        />
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
        <el-form-item label="性名" :label-width="formLabelWidth" prop="name">
          <el-input v-model="form.name" autocomplete="off" />
        </el-form-item>
        <el-form-item label="类型" :label-width="formLabelWidth" prop="type">
          <el-input v-model="form.type" autocomplete="off" />
        </el-form-item>
        <el-form-item label="值" :label-width="formLabelWidth" prop="value">
          <el-input v-model="form.value" autocomplete="off" />
        </el-form-item>
        <el-form-item label="备注" :label-width="formLabelWidth" prop="remarks">
          <el-input v-model="form.remarks" autocomplete="off" />
        </el-form-item>
        <el-form-item class="dialog-footer">
          <el-button @click="dialogFormVisible = false">取 消</el-button>
          <el-button type="primary" @click="addDic('form')">添加</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
  </div>
</template>

<script>

export default {
  name: 'Index',
  data() {
    return {
      loading: true,
      tableData: [],
      dictId: '',
      currentPage: 1, // 当前多少页
      size: 10, // 每页多少条数据
      total: 0, // 总共多少数据
      dialogFormVisible: false,
      title: '添加字典',
      form: {
        name: '',
        type: '',
        value: '',
        remarks: ''
      },
      formLabelWidth: '80px',
      rules: {
        name: [
          { required: true, message: '请输入姓名', trigger: 'blur' }
        ],
        type: [
          { required: true, message: '请输入类型', trigger: 'blur' }
        ],
        value: [
          { required: true, message: '请输入值', trigger: 'blur' }
        ],
        remarks: [
          { required: true, message: '请输入备注', trigger: 'blur' }
        ]
      }
    }
  },
  created() {
    this.init()
  },
  methods: {
    // 初始化分页
    init() {
      this.loading = true
      this.$_HTTP.get(this.$_API.dictList, { size: this.size, current: this.currentPage }, res => {
        this.tableData = res.records
        this.total = res.total
        this.loading = false
      })
    },
    handleEdit(index, row) {
      this.title = '编辑字典'
      this.dialogFormVisible = true
      this.dictId = row.id
      this.form.name = row.name
      this.form.value = row.value
      this.form.type = row.type
      this.form.remarks = row.remarks
    },
    // 删除
    deleteUser(index, row) {
      this.$confirm('此操作将永久删除该字典, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$_HTTP.delete(this.$_API.deleteDict + row.id, {}, res => {
          if (res.code === 1) {
            this.$message({
              type: 'success',
              message: '删除成功!'
            })
            this.init()
          }
        })
      }).catch(() => {

      })
    },
    addButton() {
      this.form.name = ''
      this.form.remarks = ''
      this.form.value = ''
      this.form.type = ''
      this.title = '添加字典'
      this.dialogFormVisible = true
    },
    handleSizeChange(val) {
      this.size = val
      this.init()
    },
    addDic(form) {
      this.$refs[form].validate((valid) => {
        if (valid) {
          const params = {
            name: this.form.name,
            type: this.form.type,
            value: this.form.value,
            remarks: this.form.remarks
          }
          if (this.title === '添加字典') {
            this.$_HTTP.post(this.$_API.addDict, params, res => {
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
    },
    handleCurrentChange(val) {
      this.currentPage = val
      this.init()
    }
  }
}
</script>

<style scoped>
  .dialog-footer {
    text-align: center;
  }
  .box-card {
    width: 100%;
  }
</style>
