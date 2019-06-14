<template>
  <div style="padding: 20px">
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <i class="el-icon-s-custom"/>
        <span>角色列表</span>
        <el-button
          style="float: right;padding: 6px;margin-right: 6px"
          type="primary"
          icon="el-icon-plus"
        >添加
        </el-button>
      </div>
      <el-table
        :data="tableData"
        style="width: 100%"
      >
        <el-table-column
          align="center"
          label="序号"
          type="index"
        />
        <el-table-column
          label="账户ID"
          prop="id"
          align="center"
        >
        </el-table-column>
        <el-table-column
          align="center"
          prop="realname"
          label="登录名"
        />
        <el-table-column
          align="center"
          prop="nickname"
          label="角色"
        />
        <el-table-column
          align="center"
          label="归属单位"
        >
        </el-table-column>
        <el-table-column
          align="center"
          label="上次登陆时间"
        >
        </el-table-column>
        <el-table-column
          align="center"
          label="状态"
        >
        </el-table-column>
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
            >禁用
            </el-button>
            <el-button
              size="mini"
              type="text"
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
        />
      </div>
    </el-card>
  </div>
</template>

<script>
  export default {
    name: "administrator-list",
    data(){
      return{
        loading:true,
        tableData:[],
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
        this.$_HTTP.get(this.$_API.roleList, {size: this.size, current: this.currentPage}, res => {
          this.tableData = res.records
          this.total = res.total
          this.loading = false
        })
        this.$_HTTP.get(this.$_API.businessAllTree, {}, res => {
          this.dataTree = res
        })
      },
    },
    handleSizeChange(val) {
      this.size = val
      this.init()
    },
    handleCurrentChange(val) {
      this.currentPage = val
      this.init()
    },
  }
</script>

<style scoped>

</style>
