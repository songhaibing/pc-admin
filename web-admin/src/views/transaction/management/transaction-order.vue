<template>
  <!--交易订单-->
  <div style="padding: 20px">
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <el-button
          style="float: right"
          type="success"
        >查询
        </el-button>
        <el-input v-model="number" style="width: 150px;float: right;margin-right: 5px" placeholder="请输入用户名" />
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
          label="创建时间"
          align="center"
        />
        <el-table-column
          align="center"
          prop="username"
          label="商户流水号"
        />
        <el-table-column
          align="center"
          prop="realname"
          label="支付单号"
        />
        <el-table-column
          align="center"
          prop="nickname"
          label="消费人"
        />
        <el-table-column
          align="center"
          prop="phone"
          label="支付场景"
        />
        <el-table-column
          align="center"
          prop="phone"
          label="订单金额"
        />
        <el-table-column
          align="center"
          prop="phone"
          label="交易状态"
        />
        <el-table-column align="center" label="操作" width="150">
          <template slot-scope="scope">
            <el-button
              size="mini"
              type="text"
            >查看
            </el-button>
            <el-button
              size="mini"
              type="text"
            >退款
            </el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
  </div>
</template>

<script>
export default {
  name: 'CommodityList',
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
