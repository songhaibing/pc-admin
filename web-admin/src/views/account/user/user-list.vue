<template>
  <div style="padding: 20px">
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <i class="el-icon-s-custom"/>
        <span>用户列表</span>
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
          label="头像"
        />
        <el-table-column
          align="center"
          prop="nickname"
          label="用户名"
        />
        <el-table-column
          align="center"
          prop="email"
          label="姓名"
        />
        <el-table-column
          align="center"
          label="手机号"
        >
        </el-table-column>
        <el-table-column
          align="center"
          label="账户余额"
        >
        </el-table-column>
        <el-table-column
          align="center"
          label="绑定卡号"
        >
        </el-table-column>
        <el-table-column
          align="center"
          label="归属单位"
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
    name: "user-list",
    data(){
      return{
        tableData:[]
      }
    }
  }
</script>

<style scoped>

</style>
