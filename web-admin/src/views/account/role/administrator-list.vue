<template>
  <div style="padding: 20px">
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <i class="el-icon-s-custom" />
        <span>管理员列表</span>
      </div>
      <el-table
        :data="tableData"
        style="width: 100%"
      >
        <el-table-column
          label="账户ID"
          prop="id"
          align="center"
        />
        <el-table-column
          align="center"
          prop="realname"
          label="登录名"
        >
          <template slot-scope="scope">{{ scope.row.userVo.username }}</template>
        </el-table-column>
        <el-table-column
          align="center"

          label="角色"
        >
          <template slot-scope="scope">{{ scope.row.userVo.roles[0].name }}</template>
        </el-table-column>
        <el-table-column
          align="center"
          label="归属单位"
          v-if="$_Authorities.indexOf('管理员归属单位')!==-1"
        >
          <template slot-scope="scope">{{ scope.row.userVo.dept.name }}</template>
        </el-table-column>
        <el-table-column
          align="center"
          label="上次登陆时间"
          prop="registryTime"
        />
        <el-table-column
          align="center"
          label="状态"
        >
          <template slot-scope="scope">{{ scope.row.userVo.state==='1'?'正常':'禁用' }}</template>
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
</template>

<script>
export default {
  name: 'AdministratorList',
  data() {
    return {
      loading: true,
      tableData: [],
      currentPage: 1, // 当前多少页
      size: 10, // 每页多少条数据
      total: 0 // 总共多少数据
    }
  },
  created() {
    this.init()
  },
  methods: {
    // 初始化分页
    init() {
      this.loading = true
      this.$_HTTP.get(this.$_API.registryRecordList, { size: this.size, current: this.currentPage }, res => {
        this.tableData = res.records
        this.total = res.total
        this.loading = false
      })
    },
    handleSizeChange(val) {
      this.size = val
      this.init()
    },
    handleCurrentChange(val) {
      this.currentPage = val
      this.init()
    }
  }

}
</script>

<style scoped>

</style>
