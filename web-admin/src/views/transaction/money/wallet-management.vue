<template>
  <!--钱包管理-->
  <div style="padding: 20px">
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <el-button
          style="float: right"
          type="success"
        >查询
        </el-button>
        <el-input v-model="number" style="width: 150px;float: right;margin-right: 5px" placeholder="请输入交易单号" />
        <el-date-picker
          v-model="value"
          type="daterange"
          align="right"
          style="float: right;margin-right: 5px"
          unlink-panels
          range-separator="-"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
          :picker-options="pickerOptions"
        />
      </div>
      <el-table
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
        />
        <el-table-column
          align="center"
          prop="username"
          label="类型"
        />
        <el-table-column
          align="center"
          prop="realname"
          label="持有人姓名"
        />
        <el-table-column
          align="center"
          prop="nickname"
          label="手机号"
        />
        <el-table-column
          align="center"
          prop="phone"
          label="账户余额"
        />
        <el-table-column
          align="center"
          prop="phone"
          label="归属单位"
        />
        <el-table-column
          align="center"
          prop="phone"
          label="是否允许充值"
        />
        <el-table-column align="center" label="操作" width="150">
          <template slot-scope="scope">
            <el-button
              size="mini"
              type="text"
            >修改
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
  name: 'WalletManagement',
  data() {
    return {
      number: '',
      pickerOptions: {
        shortcuts: [{
          text: '最近一周',
          onClick(picker) {
            const end = new Date()
            const start = new Date()
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 7)
            picker.$emit('pick', [start, end])
          }
        }, {
          text: '最近一个月',
          onClick(picker) {
            const end = new Date()
            const start = new Date()
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 30)
            picker.$emit('pick', [start, end])
          }
        }, {
          text: '最近三个月',
          onClick(picker) {
            const end = new Date()
            const start = new Date()
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 90)
            picker.$emit('pick', [start, end])
          }
        }]
      },
      value: ''
    }
  }
}
</script>

<style scoped>

</style>
