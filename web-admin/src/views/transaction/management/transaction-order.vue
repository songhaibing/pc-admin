<template>
  <!--交易订单-->
  <div style="padding: 20px">
    <div style="margin-left: 10px">
      <div style="display: flex;flex-direction: column;">
        <div style="display: flex;align-items: center">
          <div>账户归属</div>
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
            value-format="timestamp"
            v-model="queryDate"
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
            @click="query"
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
          <template slot-scope="scope" v-if="scope.row.userVo">{{ scope.row.userVo.username }}</template>
        </el-table-column>
        <el-table-column
          align="center"
          label="支付场景"
        >
          <template slot-scope="scope">{{ scope.row.business.name}}</template>
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
              @click="view(scope.$index, scope.row)"
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
    <el-dialog :title="title" width="600px" :visible.sync="dialogFormView">
      <el-form ref="form" :model="formView"   label-width="100px" class="demo-ruleForm">
        <el-form-item label="创建时间" :label-width="formLabelWidth" >
          <el-input v-model="formView.createTime" autocomplete="off" disabled/>
        </el-form-item>
        <el-form-item label="支付单号" :label-width="formLabelWidth" >
          <el-input v-model="formView.order" autocomplete="off" disabled/>
        </el-form-item>
        <el-form-item label="消费人" :label-width="formLabelWidth" >
          <el-input v-model="formView.name" autocomplete="off" disabled/>
        </el-form-item>
        <el-form-item label="购买物品" :label-width="formLabelWidth" >
          <div v-for="(item,index) in goodsArr" :key="index">
            <span>{{item.goodsName}},</span>
            <span>{{item.goodsNum}}份,</span>
            <span>{{item.goodsPrice}}元;</span>
          </div>
        </el-form-item>
        <el-form-item label="支付场景" :label-width="formLabelWidth" >
          <el-input v-model="formView.payment" autocomplete="off" disabled/>
        </el-form-item>
        <el-form-item label="订单金额" :label-width="formLabelWidth" >
          <el-input v-model="formView.money" autocomplete="off" disabled/>
        </el-form-item>
        <el-form-item label="交易状态" :label-width="formLabelWidth" >
          <el-input v-model="formView.status" autocomplete="off" disabled/>
        </el-form-item>
        <el-form-item class="dialog-footer">
          <el-button @click="dialogFormView = false">取 消</el-button>
          <el-button type="primary" @click="dialogFormView = false">确定</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
  </div>
</template>

<script>
  import status from '@/libs/orderCode'
  import SelectTree from '@/components/widget/SelectTree.vue';
  import code from '@/libs/payCode'
  export default {
    name: 'FundBill',
    components: {
      SelectTree,
    },
    data() {
      return {
        queryDate:'',
        goodsArr:[],
        formLabelWidth:'100px',
        formView:{
          createTime:"",
          name:'',
          order:'',
          payment:'',
        },
        endTime:0,
        startTime:0,
        title:'订单详情',
        dialogFormView:false,
        code:code,
        orderType:-1,
        deptId:localStorage.getItem('deptId'),
        // 默认选中值
        selected: Number(localStorage.getItem('deptId')),
        // 数据默认字段
        defaultProps: {
          value: 'id',          // 唯一标识
          label: 'name',       // 标签显示
          children: 'children', // 子级
        },
        // 数据列表
        options: JSON.parse(localStorage.getItem('current')),
        deptValue:'',
        deptOptions:[],
        status:status,
        loading:true,
        tab:{
          name:'first'
        },
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
      }
    },
    created(){
      this.issuedInit()
      this.$_HTTP.get(this.$_API.getCurrentTree,{}, res => {
       this.deptOptions=res
      })
    },
    methods:{
      query(){
        this.startTime=this.queryDate?this.queryDate[0]:0
        this.endTime=this.queryDate?this.queryDate[1]:0
        console.log(this.tab.name)
        if (this.tab.name === 'first') {
          this.orderType=-1
          this.issuedInit()
        } else {
          this.orderType=1
          this.issuedInit()
        }
      },
      selectedDept(val){
        this.deptId=val
        if (this.tab.name === 'first') {
          this.orderType=-1
          this.issuedInit()
        } else {
          this.orderType=1
          this.issuedInit()
        }
      },
      //查看
      view(index,row){
        console.log(row)
         this.formView.order=row.orderId
        this.formView.createTime=row.createTime
        this.formView.name=row.userVo?row.userVo.username:''
        this.formView.payment=code[row.type]
        this.formView.money=row.price
        const article=row.article.split('|')
        this.goodsArr= article.map(item=>{
          // console.log(item.split(','))
          return{
            goodsName:item.split(',')[0],
            goodsNum:item.split(',')[1],
            goodsPrice:item.split(',')[2]
          }
        })
        console.log(this.goodsArr)
        this.formView.status=status[row.orderType]
        this.dialogFormView=true
      },
      issuedInit() {
        this.loading = true
        this.$_HTTP.get(this.$_API.orderPayPage, { endTime:this.endTime,startTime:this.startTime,
          deptId: this.deptId,orderType: this.orderType,
          size: this.size, current: this.currentPage }, res => {
          this.tableData = res.records
          this.total = res.total
          this.loading = false
        })
      },
      handleClick(tab, event) {
        this.tab=tab
        if (this.tab.name === 'first') {
          this.orderType=-1
          this.issuedInit(this.orderType)
        } else {
          this.orderType=1
          this.issuedInit(this.orderType)
        }
      },
      handleSizeChange(val) {
        this.size = val
        if (this.tab.name === 'first') {
          this.orderType=-1
          this.issuedInit(this.orderType)
        } else {
          this.orderType=1
          this.issuedInit(this.orderType)
        }
      },
      handleCurrentChange(val) {
        this.currentPage = val
        if (this.tab.name === 'first') {
          this.orderType=-1
          this.issuedInit(this.orderType)
        } else {
          this.orderType=1
          this.issuedInit(this.orderType)
        }
      },
    }
  }
</script>

<style scoped>
  .box-card{

  }
</style>

