<template>
  <div style="padding: 20px">
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <i class="el-icon-school"/>
        <span>商户列表</span>
        <el-button
          style="float: right;padding: 6px;margin-right: 6px"
          type="primary"
          icon="el-icon-plus"
          @click="addButton"
          v-if="$_Authorities.indexOf('添加商户')!==-1"
        >添加
        </el-button>
      </div>
      <el-table
        v-loading="loading"
        :data="tableData"
        style="width: 100%"
      >
        <el-table-column label="ID" align="center" prop="id" width="50"/>
        <el-table-column align="center" prop="name" label="商户名称"/>
        <el-table-column align="center" prop="categories" label="主营类目"/>
        <el-table-column align="center" prop="businessType.name" label="类型"/>
        <el-table-column align="center" label="状态">
          <template slot-scope="scope">{{ scope.row.businessState==='0'?'营业中':'已禁用' }}</template>
        </el-table-column>
        <el-table-column align="center" label="商户负责人" prop="head"/>
        <el-table-column align="center" label="归属单位" v-if="$_Authorities.indexOf('商户归属单位')!==-1" prop="dept.name"/>
        <el-table-column align="center" label="联系电话" prop="phoneNumber"/>
        <el-table-column align="center" label="设备数" prop="deviceNumber"/>
        <el-table-column align="center" label="到期时间" prop="expireTime"/>
        <el-table-column align="center" label="操作">
          <template slot-scope="scope">
            <el-button size="mini" type="text"   v-if="$_Authorities.indexOf('编辑商户')!==-1" @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
            <el-button size="mini" type="text"   v-if="scope.row.businessState==='0'&&$_Authorities.indexOf('禁用商户')!==-1" @click="disableMechant(scope.$index, scope.row)">禁用</el-button>
            <el-button size="mini" type="text"   v-if="scope.row.businessState==='1'&&$_Authorities.indexOf('禁用商户')!==-1" @click="enableMechant(scope.$index, scope.row)">启用</el-button>
            <el-button size="mini" type="text"   v-if="$_Authorities.indexOf('删除商户')!==-1" @click="handleDelete(scope.$index, scope.row)">删除</el-button>
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
    <el-dialog :title="title" width="600px" :visible.sync="dialogFormVisible">
      <el-form ref="form" :model="form" status-icon :rules="rules" label-width="100px" class="demo-ruleForm">
        <el-form-item label="商户名称" :label-width="formLabelWidth" prop="name">
          <el-input v-model="form.name" autocomplete="off" :disabled="disabled"/>
        </el-form-item>
        <el-form-item label="所属分类"  :label-width="formLabelWidth" prop="className">
          <el-input ref="input" v-model="form.className"  placeholder="请选择所属分类" autocomplete="off" @focus="clickInput"/>
        </el-form-item>
        <el-form-item label="主营类目" :label-width="formLabelWidth" prop="category">
          <el-input v-model="form.category" autocomplete="off"/>
        </el-form-item>
        <el-form-item label="所属单位"   :label-width="formLabelWidth" prop="unit">
          <el-input ref="inputUnit" v-model="form.unit" readonly="readonly" placeholder="请选择所属单位" autocomplete="off" @focus="clickUnit"/>
        </el-form-item>
        <el-form-item label="状态" :label-width="formLabelWidth" prop="status" v-if="title==='编辑商户'">
          <el-select v-model="form.status" placeholder="请选择状态" style="width: 100%">
            <el-option label="营业中" value="0"/>
            <el-option label="已禁用" value="1"/>
          </el-select>
        </el-form-item>
        <el-form-item label="商户负责人" :label-width="formLabelWidth" prop="principal">
          <el-input v-model="form.principal" autocomplete="off"/>
        </el-form-item>
        <el-form-item label="联系电话" :label-width="formLabelWidth" prop="phone">
          <el-input v-model="form.phone" autocomplete="off"/>
        </el-form-item>
        <el-form-item label="设备数" :label-width="formLabelWidth" prop="num" v-if="title==='编辑商户'">
          <el-input v-model="form.num" autocomplete="off" disabled/>
        </el-form-item>
        <el-form-item label="到期时间" :label-width="formLabelWidth" prop="time">
          <el-date-picker
            style="width: 100%"
            v-model="form.time"
            value-format="yyyy-MM-dd HH:mm:ss"
            type="datetime"
            placeholder="选择日期时间">
          </el-date-picker>
        </el-form-item>
        <el-form-item class="dialog-footer">
          <el-button @click="dialogFormVisible = false">取 消</el-button>
          <el-button type="primary" @click="addMerchant('form')">添加</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
    <el-dialog :title="titleTree" width="600px" :visible.sync="dialogFormTree">
      <el-input
        placeholder="输入关键字进行过滤"
        v-model="filterText">
      </el-input>
      <el-tree
        default-expand-all
        class="filter-tree"
        :data="dataTree"
        :props="defaultProps"
        :filter-node-method="filterNode"
        @node-click="handleNodeClick"
        ref="tree2">
      </el-tree>
    </el-dialog>
    <el-dialog :title="titleTree" width="600px" :visible.sync="dialogUnitTree">
      <el-input
        placeholder="输入关键字进行过滤"
        v-model="filterTextUnit">
      </el-input>
      <el-tree
        default-expand-all
        class="filter-tree"
        :data="unitTree"
        :props="defaultProps"
        :filter-node-method="filterNodeUnit"
        @node-click="handleNodeClickUnit"
        ref="treeUnit">
      </el-tree>
    </el-dialog>
  </div>
</template>

<script>
  import {checkPhone} from '@/libs/regular.js'

  export default {
    name: 'MerchantList',
    watch: {
      filterText(val) {
        this.$refs.tree2.filter(val);
      },
      filterTextUnit(val){
        this.$refs.treeUnit.filter(val);
      }
    },
    data() {
      return {
        unitId:'',
        filterTextUnit:'',
        unitTree:[],
        filterText: '',
        dataTree:[],
        defaultProps: {
          children: 'children',
          label: 'name'
        },
        classId:'',
        dialogFormTree:false,
        dialogUnitTree:false,
        data: [],
        titleTree:'请选择分类',
        valueId: '', // 初始ID（可选）
        props: { // 配置项（必选）
          value: 'id',
          label: 'name',
          children: 'children'
        },
        disabled: false,
        merchantId: '',
        formLabelWidth: '100px',
        tableData: [],
        dialogFormVisible: false,
        loading: true,
        title: '添加商户',
        currentPage: 1, // 当前多少页
        size: 10, // 每页多少条数据
        total: 0, // 总共多少数据
        value: '',
        form: {
          status: '',
          name: '',
          category: '',
          principal: '',
          phone: '',
          num: 0,
          time: '',
          className:''
        },
        rules: {
          // unit: [
          //   {required: true, message: '请选择所属单位', trigger: 'blur'}
          // ],
          name: [
            {required: true, message: '请输入商户名称', trigger: 'blur'}
          ],
          principal: [
            {required: true, message: '请输入商户负责人', trigger: 'blur'}
          ],
          phone: [
            {required: true, validator: checkPhone, trigger: 'blur'}
          ],
          time: [
            {required: true, message: '请输入到期时间', trigger: 'blur'}
          ]
        }
      }
    },
    created() {
      this.init()
    },
    methods: {
      handleNodeClick(data) {
        this.form.className=data.name
        this.classId=data.id
        this.dialogFormTree=false
      },
      handleNodeClickUnit(data) {
        this.form.unit=data.name
        this.unitId=data.id
        this.dialogUnitTree=false
      },
      filterNodeUnit(value, data) {
        if (!value) return true;
        return data.name.indexOf(value) !== -1;
      },
      filterNode(value, data) {
        if (!value) return true;
        return data.name.indexOf(value) !== -1;
      },
      clickInput(){
        this.dialogFormTree=true
        setTimeout(()=>{
          this.$refs.input.blur()
        },500)
      },
      clickUnit(){
        this.dialogUnitTree=true
        setTimeout(()=>{
          this.$refs.inputUnit.blur()
        },500)
      },
      getValue(value) {
        this.valueId = value
      },
      // 初始化分页
      init() {
        this.loading = true
        this.$_HTTP.get(this.$_API.businessList, {size: this.size, current: this.currentPage}, res => {
          this.tableData = res.records
          this.total = res.total
          this.loading = false
        })
        this.$_HTTP.get(this.$_API.businessAllTree, {}, res => {
          this.dataTree = res
        })
        this.$_HTTP.get(this.$_API.getCurrentTree, {}, res => {
          this.unitTree=res
        })
      },
      handleSizeChange(val) {
        this.size = val
        this.init()
      },
      handleCurrentChange(val) {
        this.currentPage = val
        this.init()
      },
      addButton() {
        this.form.unit=''
        this.form.className=''
        this.form.name = ''
        this.form.status = ''
        this.form.category = ''
        this.form.principal = ''
        this.form.time = ''
        this.form.phone = ''
        this.disabled = false
        this.title = '添加商户'
        this.dialogFormVisible = true
      },
      handleEdit(index, row) {
        this.classId=row.businessTypeId
        this.unitId=row.deptId
        this.disabled = true
        this.title = '编辑商户'
        this.merchantId = row.id
        this.form.unit=row.dept.name
        this.form.className=row.businessType?row.businessType.name:null
        this.form.name = row.name
        this.form.status = row.businessState
        this.form.category = row.categories
        this.form.principal = row.head
        this.form.num = row.deviceNumber
        this.form.time = row.expireTime
        this.form.phone = row.phoneNumber
        this.dialogFormVisible = true
      },
      //禁用商户
      disableMechant(index,row){
          this.$confirm('此操作将禁用该商户, 是否继续?', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
            this.$_HTTP.put(this.$_API.editBusiness +row.id,{businessState:'1'}, res => {
              if (res.code === 1) {
                this.dialogFormVisible = false
                this.$message({
                  message: '修改商户状态成功',
                  type: 'success'
                })
                this.init()
              } else {
                this.$message({
                  message: '修改商户状态失败',
                  type: 'error'
                })
              }
            })
          }).catch(() => {

          })
      },
      enableMechant(index,row){
        this.$confirm('此操作将启用该用户, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.$_HTTP.put(this.$_API.editBusiness +row.id,{businessState:'0'}, res => {
            if (res.code === 1) {
              this.dialogFormVisible = false
              this.$message({
                message: '修改商户状态成功',
                type: 'success'
              })
              this.init()
            } else {
              this.$message({
                message: '修改商户状态失败',
                type: 'error'
              })
            }
          })
        }).catch(() => {

        })
      },
      handleDelete(index, row) {
        this.$confirm('此操作将永久删除该商户, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.$_HTTP.delete(this.$_API.delBusiness + row.id, {}, res => {
            if (res.code === 1) {
              this.$message({
                type: 'success',
                message: '删除成功!'
              })
              this.init()
            }
          })
        }).catch(() => {

        })
      },
      addMerchant(form) {
        this.$refs[form].validate((valid) => {
          if (valid) {
            const params = {
              name: this.form.name,
              deptId:this.unitId,
              categories: this.form.category,
              expireTime: this.form.time,
              head: this.form.principal,
              phoneNumber: this.form.phone,
              businessTypeId:this.classId,
            }
            const paramsEdit = {
              name: this.form.name,
              deptId:this.unitId,
              categories: this.form.category,
              expireTime: this.form.time,
              head: this.form.principal,
              phoneNumber: this.form.phone,
              businessTypeId:this.classId,
              businessState:this.form.status
            }
            if (this.title === '添加商户') {
              this.$_HTTP.post(this.$_API.addBusiness, params, res => {
                if (res.code === 1) {
                  this.dialogFormVisible = false
                  this.$message({
                    message: '添加商户成功',
                    type: 'success'
                  })
                  this.init()
                } else if (res.code === 2) {
                  this.$message({
                    message: res.msg,
                    type: 'error'
                  })
                }
              })
            } else {
              this.$_HTTP.put(this.$_API.editBusiness + this.merchantId,paramsEdit, res => {
                if (res.code === 1) {
                  this.dialogFormVisible = false
                  this.$message({
                    message: '修改商户成功',
                    type: 'success'
                  })
                  this.init()
                } else {
                  this.$message({
                    message: '修改商户失败',
                    type: 'error'
                  })
                }
              })
            }
          }
        })
      }
    }
  }
</script>

<style scoped>

</style>
