<template>
  <div style="padding: 20px">
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <i class="el-icon-school" />
        <span>终端设备列表</span>
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
        <el-table-column align="center" label="序号" type="index" />
        <el-table-column label="ID" align="center" />
        <el-table-column align="center" prop="username" label="设备ID" />
        <el-table-column align="center" prop="realname" label="外观图" />
        <el-table-column align="center" prop="nickname" label="设备名称" />
        <el-table-column align="center" prop="phone" label="归属单位" />
        <el-table-column align="center" prop="phone" label="设备位置" />
        <el-table-column align="center" prop="phone" label="启用时间" />
        <el-table-column align="center" prop="phone" label="管理密码" />
        <el-table-column align="center" prop="phone" label="设备状态" />
        <el-table-column align="center" label="操作" width="150">
          <template slot-scope="scope">
            <el-button size="mini" type="text">修改</el-button>
            <el-button size="mini" type="text">报修</el-button>
            <el-button size="mini" type="text">改密</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
    <el-dialog :title="title" width="600px" :visible.sync="dialogFormVisible">
      <el-form ref="form" :model="form" status-icon :rules="rules" label-width="100px" class="demo-ruleForm">
        <el-form-item label="ID" :label-width="formLabelWidth" prop="id">
          <el-input v-model="form.id" autocomplete="off" />
        </el-form-item>
        <el-form-item label="品名" :label-width="formLabelWidth" prop="name">
          <el-input v-model="form.name" autocomplete="off" />
        </el-form-item>
        <el-form-item label="类型" :label-width="formLabelWidth" prop="status">
          <el-select v-model="form.status" placeholder="请选择" style="width: 100%">
            <el-option label="营业中" value="shanghai" />
            <el-option label="已清退" value="beijing" />
          </el-select>
        </el-form-item>
        <el-form-item label="定价" :label-width="formLabelWidth" prop="principal">
          <el-input v-model="form.principal" autocomplete="off" />
        </el-form-item>
        <el-form-item label="可选日期" :label-width="formLabelWidth" prop="phone">
          <el-input v-model="form.phone" autocomplete="off" />
        </el-form-item>
        <el-form-item label="预定时间" :label-width="formLabelWidth" prop="num">
          <el-input v-model="form.num" autocomplete="off" />
        </el-form-item>
        <el-form-item label="好评率" :label-width="formLabelWidth" prop="time">
          <el-input v-model="form.time" autocomplete="off" />
        </el-form-item>
        <el-form-item class="dialog-footer">
          <el-button @click="dialogFormVisible = false">取 消</el-button>
          <el-button type="primary" @click="addMerchant('form')">添加</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
  </div>
</template>

<script>
  export default {
    data() {
      return {
        formLabelWidth: '100px',
        tableData: [],
        dialogFormVisible: false,
        loading: true,
        title: '添加商品',
        currentPage: 1, // 当前多少页
        size: 10, // 每页多少条数据
        total: 0, // 总共多少数据
        value: '',
        form: {
          id: '',
          status: '',
          name: '',
          category: '',
          principal: '',
          phone: '',
          num: '',
          time: ''
        },
        rules: {
          id: [
            { required: true, message: '请输入商户id', trigger: 'blur' }
          ],
          status: [
            { required: true, message: '请选择类型', trigger: 'blur' }
          ],
          name: [
            { required: true, message: '请输入商户名称', trigger: 'blur' }
          ],
          category: [
            { required: true, message: '请输入主营类目', trigger: 'blur' }
          ],
          principal: [
            { required: true, message: '请输入商户负责人', trigger: 'blur' }
          ],
          phone: [
            { required: true, message: '请输入联系电话', trigger: 'blur' }
          ],
          num: [
            { required: true, message: '请输入设备数', trigger: 'blur' }
          ],
          time: [
            { required: true, message: '请输入签约周期', trigger: 'blur' }
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
        this.$_HTTP.get(this.$_API.goodsList, { size: this.size, current: this.currentPage }, res => {
          this.tableData = res.records
          console.log(res)
          this.total = res.total
          this.loading = false
        })
      },
      addButton() {
        this.form.name = ''
        this.form.remarks = ''
        this.form.value = ''
        this.form.type = ''
        this.title = '添加商品'
        this.dialogFormVisible = true
      },
      addMerchant(form) {
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
      }
    }
  }
</script>

<style scoped>

</style>
