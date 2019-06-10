
<template>
  <!--补助发放-->
  <div style="padding: 20px">
    <div style="margin-left: 10px">
      <div style="display: flex;flex-direction: column;">
        <div>
          <span>搜索查询</span>
          <el-input v-model="input" placeholder="按交易单号或姓名筛选" style="width: 300px;margin-left: 20px"></el-input>
          <el-button
            type="success"
            style="margin-left: 10px"
          >查询
          </el-button>
          <el-input v-model="input" placeholder="按单位筛选" style="width: 300px;margin-left: 20px"></el-input>
          <el-button
            type="success"
            style="margin-left: 10px"
          >查询
          </el-button>
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
        <div style="margin-top: -30px">
          <el-button
            style="margin-right: 6px;float: right"
            type="text"
            icon="el-icon-download"
          >导入名单
          </el-button>
          <el-button
            style="margin-right: 6px;float: right"
            type="text"
            icon="el-icon-download"
          >一键发放
          </el-button>
          <el-button
            style="margin-right: 6px;float: right"
            type="text"
            icon="el-icon-download"
          >导出补助名单
          </el-button>
        </div>
      </div>
      <el-tabs v-model="activeName" style="margin-top: 20px">
        <el-tab-pane label="已发放" name="first"></el-tab-pane>
        <el-tab-pane label="未发放" name="second"></el-tab-pane>
        <el-tab-pane label="不发放" name="third"></el-tab-pane>
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
          label="交易流水号"
          align="center"
        />
        <el-table-column
          align="center"
          prop="username"
          label="姓名"
        />
        <el-table-column
          align="center"
          prop="realname"
          label="身份证号"
        />
        <el-table-column
          align="center"
          prop="nickname"
          label="归属单位"
        />
        <el-table-column
          align="center"
          prop="phone"
          label="补助金额"
        />
        <el-table-column
          align="center"
          prop="phone"
          label="发放时间"
        />
        <el-table-column
          align="center"
          prop="phone"
          label="状态"
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
          <template slot-scope="scope">
            <el-button
              size="mini"
              type="text"
              @click="handleEdit(scope.$index, scope.row)"
            >修改
            </el-button>
          </template>
          <template slot-scope="scope">
            <el-button
              size="mini"
              type="text"
              @click="handleEdit(scope.$index, scope.row)"
            >撤回补助
            </el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
  </div>
</template>

<script>
  export default {
    name: 'subsidy-grant',
    data() {
      return {
        input:'',
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


