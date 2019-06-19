<template>
  <div>
      <div style="padding:20px;">
        <el-card class="box-card">
          <div slot="header" class="clearfix">
            <i class="el-icon-menu" />
            <span>权限分配</span>
            <el-button
              style="float: right;margin-left: 10px"
              type="primary"
              icon="el-icon-plus"
              @click="addButton"
              v-if="$_Authorities.indexOf('添加权限')!==-1"
            >添加
            </el-button>
            <el-select v-model="valueSelect" placeholder="根据单位查询角色" style="float: right;" @change="change">
              <el-option
                v-for="item in optionsInquire"
                :key="item.id"
                :label="item.name"
                :value="item.id">
              </el-option>
            </el-select>
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
              align="center"
              prop="name"
              label="角色名"
            />
            <el-table-column
              align="center"
              prop="code"
              label="code"
            />
            <el-table-column
              align="center"
              prop="description"
              label="描述"
            />
            <el-table-column
              label="操作"
              align="center"
            >
              <template slot-scope="scope">
                <el-button
                  size="mini"
                  type="text"
                  @click="handleEdit(scope.$index, scope.row)"
                  v-if="$_Authorities.indexOf('编辑权限')!==-1"
                >编辑
                </el-button>
                <el-button
                  size="mini"
                  type="text"
                  @click="deleteUser(scope.$index, scope.row)"
                  v-if="$_Authorities.indexOf('删除权限')!==-1"
                >删除
                </el-button>
                <el-button
                  size="mini"
                  type="text"
                  @click="findRole(scope.$index, scope.row)"
                  v-if="$_Authorities.indexOf('选择角色权限')!==-1"
                >权限
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
      <el-dialog :title="title" width="600px" :visible.sync="dialogFormVisible">
        <el-form ref="form" :model="form" status-icon :rules="rules" label-width="100px" class="demo-ruleForm">
          <el-form-item label="角色名" :label-width="formLabelWidth" prop="Name">
            <el-input v-model="form.Name" autocomplete="off" />
          </el-form-item>
          <el-form-item label="单位" :label-width="formLabelWidth" v-if="title==='添加角色'">
            <!--<el-input ref="input" placeholder="请选择单位" v-model="form.className" autocomplete="off" />-->
            <el-select v-model="selectId" placeholder="请选择" @change="changeSelect" style="width: 100%">
              <el-option
                v-for="item in options"
                :key="item.id"
                :label="item.name"
                :value="item.id">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="code" :label-width="formLabelWidth" prop="Code">
            <el-input v-model="form.Code" autocomplete="off" />
          </el-form-item>
          <el-form-item label="描述" :label-width="formLabelWidth" prop="des">
            <el-input v-model="form.des" autocomplete="off" />
          </el-form-item>
          <el-form-item class="dialog-footer">
            <el-button @click="dialogFormVisible = false">取 消</el-button>
            <el-button type="primary" @click="addUser('form')">添加</el-button>
          </el-form-item>
        </el-form>
      </el-dialog>
      <el-dialog title="分配权限" width="500px" :visible.sync="dialogFormRole">
        <el-tree
          ref="tree"
          :data="data1"
          show-checkbox
          node-key="id"
          default-expand-all
          :props="defaultProps1"
        />
        <span slot="footer" class="dialog-footer">
          <el-button @click="dialogFormRole = false">取 消</el-button>
          <el-button type="primary" @click="()=>getCheckedKeys()">确 定</el-button>
        </span>
      </el-dialog>
      <!--<el-dialog :title="titleTree" width="600px" :visible.sync="dialogFormTree">-->
        <!--<el-input-->
          <!--placeholder="输入关键字进行过滤"-->
          <!--v-model="filterText">-->
        <!--</el-input>-->
        <!--<el-tree-->
          <!--class="filter-tree"-->
          <!--:data="dataTree"-->
          <!--:props="defaultProps"-->
          <!--:filter-node-method="filterNode"-->
          <!--@node-click="handleNodeClick"-->
          <!--ref="tree2">-->
        <!--</el-tree>-->
      <!--</el-dialog>-->
  </div>
</template>

<script>
  export default {
    name: 'Role',
    watch: {
      filterText(val) {
        this.$refs.tree2.filter(val);
      }
    },
    data() {
      return {
        selectId:'',
        valueId:'',
        filterText:'',
        titleTree:'请选择',
        dialogFormTree:false,
        options: [],
        optionsInquire:[],
        valueSelect:'',
        permissionId: '',
        defaultProps: {
          children: 'children',
          label: 'name'
        },
        data1: [],
        defaultProps1: {
          children: 'children',
          label: 'permission'
        },
        dialogFormRole: false,
        isShow: true,
        loading: true,
        dialogFormVisible: false,
        title: '添加角色',
        id: '', // 部门id
        roleId: '', // 角色id
        records: [],
        size: 10,
        currentPage: 1,
        total: 0,
        form: {
          Name: '',
          Code: '',
          des: ''
        },
        rules: {
          Name: [
            { required: true, message: '请输入姓名', trigger: 'blur' }
          ],
          Code: [
            { required: true, message: '请输入code', trigger: 'blur' }
          ],
          des: [
            { required: true, message: '请输入描述信息', trigger: 'blur' }
          ]
        },
        tableData: [],
        formLabelWidth: '100px'
      }
    },
    created() {
      this.$_HTTP.get(this.$_API.deptTree, {}, res => {
        this.optionsInquire=res
        this.optionsInquire.unshift({id:'',name:'全部'})
      })
      this.$_HTTP.get(this.$_API.deptTree, {}, res => {
        this.options=res
      })

      // this.$_HTTP.get(this.$_API.getAllMenu, {}, res => {
      //  console.log('res',res)
      //   // this.data1=res
      // })
      this.getMenu()
      this.init()
    },
    methods: {
      getMenu() {
        this.$_HTTP.get(this.$_API.getAllMenu, {}, res => {
          console.log("this.toTreeData(res)",this.toTreeData(res))
          this.data1=this.toTreeData(res)
        })
      },
      toTreeData(menu) {
        return menu.map(data => {
          return {
            permission: data.meta.title,
            id:data.id,
            children: this.toTreeData(data.children),
          }
        })
      },
      //分页查询角色
      init(){
        this.$_HTTP.get(this.$_API.roleList, {size: this.size, current: this.currentPage}, res => {
          this.loading=true
          this.tableData = res.records
          this.total = res.total
          this.loading=false
        })
      },
      changeSelect(val){
        console.log(val)
      },
      filterNode(value, data) {
        if (!value) return true;
        return data.name.indexOf(value) !== -1;
      },
      handleNodeClick(data) {
        console.log(data)
        this.form.className=data.name
        this.valueId=data.id
        this.dialogFormTree=false
      },
      getCheckedKeys() {
        const data = this.$refs.tree.getCheckedNodes(false, true).map(item => {
          return item.permission
        })
        this.$_HTTP.put(this.$_API.editRole + this.permissionId, { authorities: data }, res => {
          if (res.code === 1) {
            this.dialogFormRole = false
            this.$message({
              message: '修改角色权限成功',
              type: 'success'
            })
          }
        })
      },
      change(val){
        this.selectId=val
        if(val){
          this.findDept(val)
        }else{
          this.init()
        }
      },
      addButton() {
        this.dialogFormVisible = true
        this.title = '添加角色'
        this.selectId=''
        this.form.Name = ''
        this.form.Code = ''
        this.form.des = ''
      },
      // 初始化角色列表分页
      findDept(id) {
        this.loading = true
        this.$_HTTP.get(this.$_API.findDept + id, { size: this.size, current: this.currentPage }, res => {
          this.tableData = res.records
          this.total = res.total
          this.loading = false
        })
      },
      addUser(form) {
        this.$refs[form].validate((valid) => {
          if (valid) {
            const data = {
              name: this.form.Name,
              code: this.form.Code,
              description: this.form.des,
              deptId: this.selectId
            }
            if (this.title === '添加角色') {
              this.$_HTTP.post(this.$_API.addRoleMsg, data, res => {
                if (res.code === 1) {
                  this.dialogFormVisible = false
                  if(this.selectId){
                    this.findDept(this.selectId)
                  }else{
                    this.init()
                  }
                  this.$message({
                    type: 'success',
                    message: '添加角色成功!'
                  })
                }
              })
            } else {
              this.$_HTTP.put(this.$_API.editRole + this.roleId, data, res => {
                if (res.code === 1) {
                  this.dialogFormVisible = false
                  if(this.selectId){
                    this.findDept(this.selectId)
                  }else{
                    this.init()
                  }
                  this.$message({
                    type: 'success',
                    message: '编辑角色成功!'
                  })
                }
              })
            }
          }
        })
      },
      handleSizeChange(val) {
        this.size = val
        if(this.id){
          this.findDept(this.id)
        }else{
          this.init()
        }
      },
      handleCurrentChange(val) {
        this.currentPage = val
        if(this.id){
          this.findDept(this.id)
        }else{
          this.init()
        }
      },
      handleEdit(index, row) {
        this.roleId = row.id
        this.title = '编辑角色'
        this.dialogFormVisible = true
        this.form.Name = row.name
        this.form.des = row.description
        this.form.Code = row.code
      },
      deleteUser(index, row) {
        this.$confirm('此操作将永久删除该角色, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.$_HTTP.delete(this.$_API.deleteRole + row.id, {}, res => {
            if (res.code === 1) {
              this.$message({
                type: 'success',
                message: '删除成功!'
              })
              if(this.selectId){
                this.findDept(this.selectId)
              }else{
                this.init()
              }
            }
          })
        }).catch(() => {

        })
      },
      async findRole(index, row) {
        this.permissionId = row.id
        await this.$_HTTP.get(this.$_API.findRole + row.id, {}, res => {
          const temp = res.authorities
          this.getTreeId(this.data1, temp).forEach(item => {
            this.$refs.tree.setChecked(item, true, false)
            console.log('item',item)
          })
        })
        this.dialogFormRole = true
      },
      getTreeId(data, authorities) {
        return data.filter(item => {
          return authorities.includes(item.permission)
        }).reduce((arr, item) => {
          arr.push(item.id)
          if (item.children && item.children.length > 0) {
            const temp = this.getTreeId(item.children, authorities)
            arr = arr.concat(temp)
          }
          return arr
        }, [])
      }
    }
  }
</script>

<style scoped lang="scss">
  .left-main {
    position: fixed;
    height: 100%;
    width: 200px;
    border-right: 1px solid #e0e1e3;

    .boxLeftTop {
      .menu_title {
        padding-left: 16px;
        background-color: #f8f8f8;
        font-size: 16px;
        line-height: 55px;
      }
    }

    .single-content {
      cursor: pointer;
      padding: 10px 0 0 16px;

      .title {
        font-size: 12px;
        font-family: Verdana, Arial, Helvetica, AppleGothic, sans-serif;
      }
    }

  }

</style>
