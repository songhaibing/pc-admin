<template>
  <!--商户分类-->
  <div style="padding: 20px">
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <i class="el-icon-school" />
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
        <el-table-column
          align="center"
          label="序号"
          type="index"
        />
        <el-table-column
          label="ID"
          align="center"
        />
        <el-table-column
          align="center"
          prop="username"
          label="分类名"
        />
        <el-table-column
          align="center"
          prop="realname"
          label="排序"
        />
        <el-table-column
          align="center"
          prop="nickname"
          label="状态"
        />
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
  </div>
</template>

<script>
export default {
  name: 'MerchantType',
  data() {
    return {
      loading: true,
      tableData: [],
      currentPage: 1, // 当前多少页
      size: 10, // 每页多少条数据
      total: 0, // 总共多少数据
    }
  },
  created(){
    this.init()
  },
  methods:{
    // 初始化分页
    init() {
      this.loading = true
      this.$_HTTP.get(this.$_API.businesstypeList, { size: this.size, current: this.currentPage }, res => {
        this.tableData = res.records
        console.log(res)
        this.total = res.total
        this.loading = false
      })
    },
    addButton(){

    }
  }
}
</script>

<style scoped>

</style>
