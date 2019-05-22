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
            label="账户ID"
            align="center"
          >
          </el-table-column>
          <el-table-column
            align="center"
            prop="username"
            label="单位logo"
          />
          <el-table-column
            align="center"
            prop="realname"
            label="单位名称"
          />
          <el-table-column
            align="center"
            prop="nickname"
            label="服务周到"
          />
          <el-table-column
            align="center"
            prop="phone"
            label="开通时间"
          />
          <el-table-column
            align="center"
            label="终止时间"
          >
          </el-table-column>
          <el-table-column
            align="center"
            prop="email"
            label="状态"
          />
          <el-table-column
            align="center"
            label="设备数"
          >
          </el-table-column>
          <el-table-column
            align="center"
            label="对接人"
          >
          </el-table-column>
          <el-table-column
            align="center"
            label="联系方式"
          >
          </el-table-column>
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
              >删除
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
        name: "unit-list"
    }
</script>

<style scoped>

</style>
