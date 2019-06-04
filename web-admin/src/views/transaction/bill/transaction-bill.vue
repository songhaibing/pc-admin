<template>
  <div style="padding: 20px;">
    <el-card style="display: flex;padding: 20px 20px 20px 40px">
      <div>* 请确保设备联网正常，同时完成数据同步后获取账单</div>
      <div style="margin-top: 40px">
        <span>对账单归属</span>
        <el-select placeholder="请选择" style="width: 250px;margin-left: 20px">

        </el-select>
      </div>
      <div style="margin-top: 40px">
        <span>对账单归属</span>
        <el-radio-group v-model="radio" style="width: 300px;margin-left: 20px">
          <el-radio :label="3">所有账单</el-radio>
          <el-radio :label="6">支付账单</el-radio>
          <el-radio :label="9">退款账款</el-radio>
        </el-radio-group>
      </div>
      <div style="margin-top: 40px">
        <span>对账单时间</span>
        <el-date-picker
          style="width: 300px;margin-left: 20px"
          v-model="value"
          type="daterange"
          align="right"
          unlink-panels
          range-separator="-"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
          :picker-options="pickerOptions"
        />
      </div>
      <div style="text-align: center;margin-top: 40px">
        <el-button type="success">下载数据</el-button>
      </div>
    </el-card>

  </div>
</template>

<script>
  export default {
    name: "transaction-bill",
    data() {
      return {
        radio: 3,
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
