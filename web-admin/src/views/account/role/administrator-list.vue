<template>
  <div style="padding: 20px">
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <i class="el-icon-s-custom"/>
        <span>管理员列表</span>
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
    </el-card>
  </div>
</template>

<script>
  export default {
    name: "administrator-list",
    data(){
      return{
        tableData:[]
      }
    }
  }
</script>

<style scoped>

</style>
