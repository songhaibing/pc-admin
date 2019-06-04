
<template>
  <!--退款查询-->
  <div style="padding: 20px">
    <div style="margin-left: 10px">
      <div style="display: flex;flex-direction: column;">
        <div>
          <span>账户归属</span>
          <el-select placeholder="请选择" style="width: 300px;margin-left: 20px">

          </el-select>
        </div>
        <div style="margin-top: 20px">
          <span>查询日期</span>
          <el-date-picker
            v-model="value"
            style="margin-left: 20px"
            type="daterange"
            align="right"
            unlink-panels
            range-separator="-"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            :picker-options="pickerOptions"
          />
          <el-button
            type="success"
            style="margin-left: 10px"
          >查询
          </el-button>
        </div>
      </div>
      <el-tabs v-model="activeName" style="margin-top: 20px">
        <el-tab-pane label="全部订单" name="first"></el-tab-pane>
        <el-tab-pane label="已处理" name="second"></el-tab-pane>
        <el-tab-pane label="待处理" name="third"></el-tab-pane>
        <el-tab-pane label="已拒绝" name="fourth"></el-tab-pane>
      </el-tabs>
    </div>
    <el-card class="box-card">
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
          label="退款金额"
        />
        <el-table-column
          align="center"
          prop="phone"
          label="退款状态"
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
            <el-button
              size="mini"
              type="text"
            >拒绝
            </el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
  </div>
</template>

<script>
  export default {
    name: 'FundBill',
    data() {
      return {
        activeName:'first',
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
  .box-card{

  }
</style>

