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
          label="图片"
        />
        <el-table-column
          align="center"
          prop="realname"
          label="品名"
        />
        <el-table-column
          align="center"
          prop="nickname"
          label="类型"
        />
        <el-table-column
          align="center"
          prop="phone"
          label="定价"
        />
        <el-table-column
          align="center"
          prop="phone"
          label="可选日期"
        />
        <el-table-column
          align="center"
          prop="phone"
          label="预定时间"
        />
        <el-table-column
          align="center"
          prop="phone"
          label="好评率"
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
            >下架
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
  name: 'CommodityList'
}
</script>

<style scoped>

</style>
