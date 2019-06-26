

<template>
  <!--退款申请-->
  <div style="padding: 20px">
    <div style="margin-left: 10px">
      <div style="display: flex;flex-direction: column;">
       <div style="display: flex;align-items: center">
          <span>账户归属</span>
          <div >
            <select-tree width="300" style="width: 300px;margin-left: 20px;"
                         v-model="selected"
                         :options="options"
                         :props="defaultProps" @selected="selectedDept"/>
          </div>
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
      <el-tab-pane label="全部申请" name="first"></el-tab-pane>
      <el-tab-pane label="退款中" name="second"></el-tab-pane>
      <el-tab-pane label="退款成功" name="third"></el-tab-pane>
      <el-tab-pane label="退款失败" name="fourth"></el-tab-pane>
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
          label="交易单号"
        />
        <el-table-column
          align="center"
          prop="realname"
          label="商户流水号"
        />
        <el-table-column
          align="center"
          prop="nickname"
          label="退款金额"
        />
        <el-table-column
          align="center"
          prop="phone"
          label="申请人"
        />
        <el-table-column
          align="center"
          prop="phone"
          label="支付场景"
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
              @click="handleEdit(scope.$index, scope.row)"
            >查看
            </el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
  </div>
</template>

<script>
  import SelectTree from '@/components/widget/SelectTree.vue';
  export default {
    name: 'FundBill',
    components: {
      SelectTree,
    },
    data() {
      return {
        selected: Number(localStorage.getItem('deptId')),
        // 数据列表
        options: JSON.parse(localStorage.getItem('current')),
        // 数据默认字段
        defaultProps: {
          value: 'id',          // 唯一标识
          label: 'name',       // 标签显示
          children: 'children', // 子级
        },
        loading:false,
        tableData:[],
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
    methods:{
      selectedDept(val){

      },
    }
  }
</script>

<style scoped>
  .box-card{

  }
</style>


