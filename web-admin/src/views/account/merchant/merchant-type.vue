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
        :data="tableData"
        style="width: 100%"
      >
        <el-table-column align="center" label="序号" type="index"/>
        <el-table-column label="ID" prop="id" align="center"/>
        <el-table-column align="center" prop="name" label="分类名"/>
        <el-table-column align="center" prop="createTime" label="创建时间"/>
        <el-table-column align="center" label="操作" width="150">
          <template slot-scope="scope">
            <el-button
              size="mini"
              type="text"
            >编辑
            </el-button>
            <el-button
              size="mini"
              type="text"
            >删除
            </el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
    <el-dialog :title="title" width="600px" :visible.sync="dialogFormVisible">
      <el-form ref="form" :model="form" status-icon :rules="rules" label-width="100px" class="demo-ruleForm">
        <el-form-item label="商户名称" :label-width="formLabelWidth" prop="name">
          <el-input v-model="form.name" autocomplete="off"/>
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
    name: 'MerchantType',
    data() {
      return {
        title: '添加商户分类',
        formLabelWidth: '100px',
        form: {
          status: '',
          name: '',
          category: '',
          principal: '',
          phone: '',
          num: '',
          time: ''
        },
        rules: {
          status: [
            {required: true, message: '请选择类型', trigger: 'blur'}
          ],
          name: [
            {required: true, message: '请输入商户名称', trigger: 'blur'}
          ],
          category: [
            {required: true, message: '请输入主营类目', trigger: 'blur'}
          ],
          principal: [
            {required: true, message: '请输入商户负责人', trigger: 'blur'}
          ],
          num: [
            {required: true, message: '请输入设备数', trigger: 'blur'}
          ],
          time: [
            {required: true, message: '请输入到期时间', trigger: 'blur'}
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
          this.tableData = res.records
          console.log(res)
          this.total = res.total
          this.loading = false
        })
      },
      addButton() {
        this.dialogFormVisible=true
      }
    }
  }
</script>

<style scoped>

</style>
