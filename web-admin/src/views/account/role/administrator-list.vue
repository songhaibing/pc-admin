<template>
  <div style="padding: 20px">
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <i class="el-icon-s-custom"/>
        <span>管理员列表</span>
        <select-tree width="200" style="width: 300px;margin-right:-100px;float: right"
                     v-model="selected"
                     :options="selectedOptions"
                     :props="selectedProps" @selected="selectedDept"/>
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
          label="状态"
        >
          <template slot-scope="scope">{{ scope.row.userVo.state==='1'?'正常':'禁用' }}</template>
        </el-table-column>
        <el-table-column
          align="center"
          label="上次登陆时间"
          prop="registryTime"
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
            <el-button
              size="mini"
              type="text"
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
  </div>
</template>

<script>
  import SelectTree from '@/components/widget/SelectTree.vue';
  export default {
    name: 'AdministratorList',
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
        deptId:localStorage.getItem('deptId'),
        loading: true,
        tableData: [],
        currentPage: 1, // 当前多少页
        size: 10, // 每页多少条数据
        total: 0 // 总共多少数据
      }
    },
    components: { SelectTree },
    created() {
      this.init()
    },
    methods: {
      selectedDept(val){
        this.deptId=val
        this.init()
      },
      // 初始化分页
      init() {
        this.loading = true
        this.$_HTTP.get(this.$_API.registryRecordList, {deptId:this.deptId,size: this.size, current: this.currentPage}, res => {
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
