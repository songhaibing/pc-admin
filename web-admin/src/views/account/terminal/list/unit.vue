<template>
  <div style="padding: 20px">
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <i class="el-icon-school" />
        <span>单位列表</span>
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
          label="设备编号"
          align="center"
        >
        </el-table-column>
        <el-table-column
          align="center"
          prop="username"
          label="外观图"
        />
        <el-table-column
          align="center"
          prop="realname"
          label="设备名称"
        />
        <el-table-column
          align="center"
          prop="nickname"
          label="设备位置"
        />
        <el-table-column
          align="center"
          prop="phone"
          label="启用时间"
        />
        <el-table-column
          align="center"
          prop="phone"
          label="管理密码"
        />
        <el-table-column
          align="center"
          prop="phone"
          label="设备状态"
        />
        <el-table-column align="center" label="操作" width="150">
          <template slot-scope="scope">
            <el-button
              size="mini"
              type="text"
              @click="handleEdit(scope.$index, scope.row)"
            >编辑
            </el-button>
            <el-button
              size="mini"
              type="text"
              @click="deleteUser(scope.$index, scope.row)"
            >报修
            </el-button>
            <el-button
              size="mini"
              type="text"
              @click="changePassword(scope.$index, scope.row)"
            >修改密码
            </el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
  </div>
</template>

<script>
  export default {
    name: "unit"
  }
</script>

<style scoped>

</style>
