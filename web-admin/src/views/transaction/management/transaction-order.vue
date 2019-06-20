<template>
  <!--交易订单-->
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
      <el-tabs v-model="activeName" style="margin-top: 20px" @tab-click="handleClick">
        <el-tab-pane label="全部订单" name="first"></el-tab-pane>
        <el-tab-pane label="已支付" name="second"></el-tab-pane>
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
          prop="createTime"
        />
        <el-table-column
          align="center"
          prop="orderId"
          label="支付单号"
        />
        <el-table-column
          align="center"
          prop="nickname"
          label="消费人"
        >
          <template slot-scope="scope">{{ scope.row.user.username }}</template>
        </el-table-column>
        <el-table-column
          align="center"
          prop="phone"
          label="支付场景"
        >
          <template slot-scope="scope" v-if="scope.row.business">{{ scope.row.business.name }}</template>
        </el-table-column>
        <el-table-column
          align="center"
          prop="price"
          label="订单金额"
        />
        <el-table-column
          align="center"
          prop="phone"
          label="交易状态"
        >
          <template slot-scope="scope" >{{ status[scope.row.orderType] }}</template>
        </el-table-column>
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
      <div class="block">
        <el-pagination
          background
          :current-page.sync="currentPage"
          :page-sizes="[10, 20, 30]"
          :page-size="size"
          style="float: right;margin: 10px 0"
          layout="sizes, prev, pager, next"
          :total="total"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
        />
      </div>
    </el-card>
  </div>
</template>

<script>
  import status from '@/libs/orderCode'
  export default {
    name: 'FundBill',
    data() {
      return {
        status:status,
        loading:true,
        tableData:[],
        currentPage: 1, // 当前多少页
        size: 10, // 每页多少条数据
        total: 0, // 总共多少数据
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
    },
    created(){
      this.init()
    },
    methods:{
      // 初始化分页
      init() {
        this.loading = true
        this.$_HTTP.get(this.$_API.orderPayList, {deptId:localStorage.getItem('deptId'),businessId:0,size: this.size, current: this.currentPage}, res => {
          this.tableData = res.records
          this.total = res.total
          this.loading = false
        })
      },
      handleClick(tab, event) {
        if (tab.name === 'first') {
          this.init()
        } else {
          this.issuedInit()
        }
      },
      handleSizeChange(val) {
        this.size = val
        this.init()
      },
      handleCurrentChange(val) {
        this.currentPage = val
        this.init()
      },
    }
  }
</script>

<style scoped>
  .box-card{

  }
</style>

