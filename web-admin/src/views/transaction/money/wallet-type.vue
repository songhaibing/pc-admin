<template>
  <!--商品分类-->
  <div style="padding: 20px">
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <i class="el-icon-school" />
        <span>钱包分类</span>
        <el-button
          style="float: right;padding: 6px;margin-right: 6px"
          type="primary"
          icon="el-icon-plus"
          @click="addButton"
        >添加
        </el-button>
      </div>
      <el-table
        v-loading="loading"
        :data="tableData"
        style="width: 100%"
      >
        <el-table-column align="center" label="序号" type="index"/>
        <el-table-column label="ID" align="center" prop="id"/>
        <el-table-column align="center" prop="name" label="分类名"/>
        <el-table-column align="center" prop="businessType.name" label="商户分类"/>
        <el-table-column align="center" prop="createTime" label="创建时间"/>
        <el-table-column align="center" label="操作" >
          <template slot-scope="scope">
            <el-button size="mini" type="text" @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
            <el-button size="mini" type="text" @click="handleDelete(scope.$index, scope.row)">删除</el-button>
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
        <el-form-item label="分类名" :label-width="formLabelWidth" prop="name">
          <el-input v-model="form.name" autocomplete="off" />
        </el-form-item>
        <el-form-item label="商户类型" :label-width="formLabelWidth" prop="className">
          <el-input ref="input" v-model="form.className"  placeholder="请选择商户类型" autocomplete="off" @focus="clickInput"/>
        </el-form-item>
        <el-form-item class="dialog-footer">
          <el-button @click="dialogFormVisible = false">取 消</el-button>
          <el-button type="primary" @click="addClass('form')">添加</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
    <el-dialog :title="titleTree" width="600px" :visible.sync="dialogFormTree">
      <el-input
        placeholder="输入关键字进行过滤"
        v-model="filterText">
      </el-input>
      <el-tree
        class="filter-tree"
        :data="dataTree"
        :props="defaultProps"
        :filter-node-method="filterNode"
        @node-click="handleNodeClick"
        ref="tree2">
      </el-tree>
    </el-dialog>
  </div>
</template>

<script>
  export default {
    name: 'Commodity-type',
    watch: {
      filterText(val) {
        this.$refs.tree2.filter(val);
      }
    },
    data(){
      return{
        dataTree:[],
        defaultProps: {
          children: 'children',
          label: 'name'
        },
        classId:'',
        filterText: '',
        dialogFormTree:false,
        titleTree:'请选择类型',
        options:[],
        loading:true,
        merchantId:'',
        formLabelWidth: '100px',
        title:'添加钱包分类',
        tableData: [],
        currentPage: 1, // 当前多少页
        size: 10, // 每页多少条数据
        total: 0, // 总共多少数据
        dialogFormVisible: false,
        form: {
          name: '',
          className:''
        },
        rules: {
          name: [
            { required: true, message: '请输入分类名称', trigger: 'blur' }
          ]
        }
      }
    },
    created(){
      this.init()
      //获取商户分类
      this.$_HTTP.get(this.$_API.businessAllTree, {}, res => {
        console.log('res',res)
        this.dataTree = res
      })
    },
    methods:{
      // 初始化分页
      init() {
        this.loading = true
        this.$_HTTP.get(this.$_API.purseTypeList, {size: this.size, current: this.currentPage}, res => {
          this.tableData = res.records
          this.total = res.total
          this.loading = false
        })
      },
      handleNodeClick(data) {
        console.log(data)
        this.form.className=data.name
        this.classId=data.id
        this.dialogFormTree=false
      },
      filterNode(value, data) {
        if (!value) return true;
        return data.name.indexOf(value) !== -1;
      },
      handleEdit(index,row){
        console.log(row)
        this.title='编辑钱包分类'
        this.classId=row.businessType.id
        this.form.className=row.businessType.name
        this.form.name = row.name
        this.merchantId=row.id
        this.dialogFormVisible = true
      },
      clickInput(){
        this.dialogFormTree=true
        setTimeout(()=>{
          this.$refs.input.blur()
        },500)
      },
      handleDelete(index,row){
        this.$confirm('此操作将永久删除该商户分类, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.$_HTTP.delete(this.$_API.delGoodstype + row.id, {}, res => {
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
      addClass(form){
        this.$refs[form].validate((valid) => {
          if (valid) {
            const params = {
              name: this.form.name,
              businessTypeId:this.classId
            }
            if (this.title === '添加钱包分类') {
              this.$_HTTP.post(this.$_API.addPurseType, params, res => {
                if (res.code === 1) {
                  this.dialogFormVisible = false
                  this.$message({
                    message: '添加钱包分类成功',
                    type: 'success'
                  })
                  this.init()
                }else if(res.code===2){
                  this.$message({
                    message: res.msg,
                    type: 'error'
                  })
                }
              })
            } else {
              this.$_HTTP.put(this.$_API.editPurseType + this.merchantId, params, res => {
                if (res.code === 1) {
                  this.dialogFormVisible = false
                  this.$message({
                    message: '修改钱包分类成功',
                    type: 'success'
                  })
                  this.init()
                }else{
                  this.$message({
                    message: '修改钱包分类失败',
                    type: 'error'
                  })
                }
              })
            }
          }
        })
      },
      handleDelete(index,row){
        this.$confirm('此操作将永久删除该钱包分类, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.$_HTTP.delete(this.$_API.delPurseType + row.id, {}, res => {
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
      handleSizeChange(val) {
        this.size = val
        this.init()
      },
      handleCurrentChange(val) {
        this.currentPage = val
        this.init()
      },
      addButton(){
        this.title='添加钱包分类'
        this.form.name=''
        this.form.className=''
        this.dialogFormVisible=true
      }
    }
  }
</script>

<style scoped>

</style>
