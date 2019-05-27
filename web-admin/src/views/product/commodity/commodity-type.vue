<template>
  <!--商品列表-->
  <div style="padding: 20px">
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <el-button
          style="padding: 6px;"
          type="primary"
          icon="el-icon-plus"
        >添加
        </el-button>
        <el-button
          style="padding: 6px;margin-right: 6px"
          type="danger"
          icon="el-icon-plus"
        >批量删除
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
            >添加子类
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
  name: 'CommodityType'
}
</script>

<style scoped>

</style>
