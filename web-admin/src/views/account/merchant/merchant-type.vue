<template>
  <!--商户分类-->
  <div style="padding: 20px">
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <i class="el-icon-school"/>
        <span>商户分类</span>
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
        row-key="id"
        :data="tableData"
        style="width: 100%"
      >
        <el-table-column align="center" prop="id" label="ID"/>
        <el-table-column align="center" prop="name" label="分类名"/>
        <el-table-column align="center" label="操作">
          <template slot-scope="scope">
            <el-button size="mini" type="text" @click="addSubclass(scope.$index, scope.row)">添加子分类</el-button>
            <el-button size="mini" type="text" @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
            <el-button size="mini" type="text" @click="handleDelete(scope.$index, scope.row)">删除</el-button>
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
        <el-form-item label="分类名" :label-width="formLabelWidth" prop="name">
          <el-input v-model="form.name" autocomplete="off"/>
        </el-form-item>
        <!--<el-form-item label="状态" :label-width="formLabelWidth" prop="status">-->
          <!--<el-select v-model="form.status" placeholder="请选择" style="width: 100%">-->
            <!--<el-option label="显示" value="0"/>-->
            <!--<el-option label="隐藏" value="1"/>-->
          <!--</el-select>-->
        <!--</el-form-item>-->
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
    name: 'MerchantType',
    data() {
      return {
        sortId:'',
        parentId: '',
        merchantId: '',
        title: '添加商户分类',
        formLabelWidth: '100px',
        form: {
          name: '',
        },
        rules: {
          name: [
            {required: true, message: '请输入商户分类', trigger: 'blur'}
          ]
        },
        dialogFormVisible: false,
        loading: true,
        tableData: [],
        currentPage: 1, // 当前多少页
        size: 10, // 每页多少条数据
        total: 0, // 总共多少数据
      }
    },
    created() {
      this.init()
    },
    methods: {
      // 初始化分页
      init() {
        this.loading = true
        this.$_HTTP.get(this.$_API.businesstypeList, {size: this.size, current: this.currentPage}, res => {
          console.log(res.records)
          this.tableData = res.records
          this.total = res.total
          this.loading = false
        })
      },
      focus(row){
        this.sortId=row.id
      },
      blur(row){
        this.$_HTTP.put(this.$_API.editBusinesstype +this.sortId, {sort: row.sort}, res => {
        })
      },
      change(row,data){
        this.$_HTTP.put(this.$_API.editBusinesstype +row.id, {businessTypeState:data}, res => {
        })
        },
      addSubclass(index, row) {
        this.parentId = row.id
        this.title = '添加商户子类'
        this.form.name = ""
        this.merchantId = row.id
        this.dialogFormVisible = true
      },
      handleSizeChange(val) {
        this.size = val
        this.init()
      },
      handleCurrentChange(val) {
        this.currentPage = val
        this.init()
      },
      handleEdit(index, row) {
        this.title = '编辑商户分类'
        this.form.name = row.name
        this.merchantId = row.id
        this.dialogFormVisible = true
      },
      handleDelete(index, row) {
        this.$confirm('此操作将永久删除该商户分类, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.$_HTTP.delete(this.$_API.delBusinesstype + row.id, {}, res => {
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
      addClass(form) {
        this.$refs[form].validate((valid) => {
          if (valid) {
            const params = {
              name: this.form.name,
            }
            const childParams = {
              name: this.form.name,
              parentId: this.parentId,
            }
            if (this.title === '添加商户分类') {
              this.$_HTTP.post(this.$_API.addBusinesstype, params, res => {
                if (res.code === 1) {
                  this.dialogFormVisible = false
                  this.$message({
                    message: '添加商户分类成功',
                    type: 'success'
                  })
                  this.init()
                } else if (res.code === 2) {
                  this.$message({
                    message: res.msg,
                    type: 'error'
                  })
                }
              })
            } else if (this.title === '编辑商户分类') {
              this.$_HTTP.put(this.$_API.editBusinesstype + this.merchantId, params, res => {
                if (res.code === 1) {
                  this.dialogFormVisible = false
                  this.$message({
                    message: '修改商户成功',
                    type: 'success'
                  })
                  this.init()
                } else {
                  this.$message({
                    message: '修改商户失败',
                    type: 'error'
                  })
                }
              })
            } else {
              this.$_HTTP.post(this.$_API.addBusinesstype, childParams, res => {
                if (res.code === 1) {
                  this.dialogFormVisible = false
                  this.$message({
                    message: '添加商户子分类成功',
                    type: 'success'
                  })
                  this.init()
                } else if (res.code === 2) {
                  this.$message({
                    message: res.msg,
                    type: 'error'
                  })
                }
              })
            }
          }
        })
      },
      addButton() {
        this.title = '添加商户分类'
        this.form.name = ''
        this.dialogFormVisible = true
      }
    }
  }
</script>

<style scoped>

</style>
