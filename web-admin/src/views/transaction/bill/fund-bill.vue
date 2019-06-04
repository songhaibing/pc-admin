<template>
  <!--账单资金-->
  <div style="padding: 20px">
    <div style="display: flex;justify-content: space-between;margin-left: 10px">
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
      <div style="margin-top: 60px">
        <el-button
          style="margin-right: 6px;float: right"
          type="text"
          icon="el-icon-download"
        >批量下载明细
        </el-button>
        <el-button
          style="margin-right: 6px;float: right"
          type="text"
          icon="el-icon-download"
        >批量下载汇总
        </el-button>
      </div>
    </div>
    <el-card class="box-card">
      <el-table
        v-loading="loading"
        :data="tableData"
        style="width: 100%"
      >
        <el-table-column
          label="日期"
          align="center"
        />
        <el-table-column
          align="center"
          prop="username"
          label="期初余额(元)"
        />
        <el-table-column
          align="center"
          prop="realname"
          label="收入(元)"
        />
        <el-table-column
          align="center"
          prop="nickname"
          label="收入笔数"
        />
        <el-table-column
          align="center"
          prop="phone"
          label="支出(元)"
        />
        <el-table-column
          align="center"
          prop="phone"
          label="支出笔数"
        />
        <el-table-column
          align="center"
          prop="phone"
          label="日终余额(元)"
        />
        <el-table-column align="center" label="下载账单" width="150">
          <template slot-scope="scope">
            <el-button
              size="mini"
              type="text"
              @click="handleEdit(scope.$index, scope.row)"
            >明细
            </el-button>
            <el-button
              size="mini"
              type="text"
              @click="changePassword(scope.$index, scope.row)"
            >汇总
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
    margin-top: 20px;
  }
</style>
