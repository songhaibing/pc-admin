<template>
  <div style="padding: 20px">
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <i class="el-icon-school" />
        <span>充值记录</span>
        <el-button
          style="float: right;padding: 6px;margin-right: 6px"
          type="primary"
          icon="el-icon-plus"
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
          label="名称"
          align="center"
        >
        </el-table-column>
        <el-table-column
          align="center"
          prop="username"
          label="订单号"
        />
        <el-table-column
          align="center"
          prop="realname"
          label="交易号"
        />
        <el-table-column
          align="center"
          prop="nickname"
          label="充值人"
        />
        <el-table-column
          align="center"
          prop="phone"
          label="充值金额"
        />
        <el-table-column
          align="center"
          prop="phone"
          label="状态"
        />
        <el-table-column align="center" label="操作" width="150">
          <template slot-scope="scope">
            <el-button
              size="mini"
              type="text"
              @click="handleEdit(scope.$index, scope.row)"
            >退回
            </el-button>
            <el-button
              size="mini"
              type="text"
              @click="changePassword(scope.$index, scope.row)"
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
    name: "commodity-list"
  }
</script>

<style scoped>

</style>
