<template>
  <div style="padding: 20px">
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <i class="el-icon-s-custom"/>
        <span>管理员列表</span>
        <select-tree width="200" style="width: 300px;margin-right:-100px;float: right"
                     v-model="selected"
                     :options="selectedOptions"
                     :props="selectedProps" @selected="selectedDept"/>
      </div>
      <el-table
        :data="tableData"
        style="width: 100%"
      >
        <el-table-column
          label="账户ID"
          prop="id"
          align="center"
        />
        <el-table-column
          align="center"
          prop="realname"
          label="登录名"
        >
          <template slot-scope="scope">{{ scope.row.userVo.username }}</template>
        </el-table-column>
        <el-table-column
          align="center"

          label="角色"
        >
          <template slot-scope="scope" v-if="scope.row.userVo.roles.length!==0">{{ scope.row.userVo.roles[0].name }}
          </template>
        </el-table-column>
        <el-table-column
          align="center"
          label="归属单位"
          v-if="$_Authorities.indexOf('管理员归属单位')!==-1"
        >
          <template slot-scope="scope">{{ scope.row.userVo.dept.name }}</template>
        </el-table-column>
        <el-table-column
          align="center"
          label="状态"
        >
          <template slot-scope="scope">{{ scope.row.userVo.state==='1'?'正常':'禁用' }}</template>
        </el-table-column>
        <el-table-column
          align="center"
          label="上次登陆时间"
          prop="registryTime"
        />
        <el-table-column align="center" label="操作" width="150">
          <template slot-scope="scope">
            <el-button
              size="mini"
              type="text"
              @click="handleEdit(scope.$index, scope.row)"
            >编辑
            </el-button>
            <el-button
              size="mini"
              type="text"
              @click="deleteUser(scope.$index, scope.row)"
            >删除
            </el-button>
            <el-button size="mini" type="text" v-if="scope.row.userVo.state==='1'"
                       @click="disableUser(scope.$index, scope.row)">禁用
            </el-button>
            <el-button size="mini" type="text" v-if="scope.row.userVo.state==='2'"
                       @click="enableUser(scope.$index, scope.row)">启用
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
    <el-dialog :title="title" width="600px" :visible.sync="dialogFormVisible">
      <el-form ref="form" :model="form" status-icon :rules="rules" label-width="100px" class="demo-ruleForm">
        <el-form-item label="登录名" :label-width="formLabelWidth" prop="name">
          <el-input v-model="form.name" autocomplete="off" disabled/>
        </el-form-item>
        <el-form-item label="归属单位" :label-width="formLabelWidth" prop="className">
          <el-input
            v-model="form.className"
            readonly="readonly"
            placeholder="请选择单位"
            autocomplete="off"
            @focus="clickInput"
          />
        </el-form-item>
        <el-form-item label="角色" :label-width="formLabelWidth" prop="role">
          <el-select v-model="form.role" placeholder="请选择" clearable style="width: 100%">
            <el-option
              v-for="item in optionsRole"
              :key="item.id"
              :label="item.name"
              :value="item.id"
            />
          </el-select>
        </el-form-item>
        <el-form-item class="dialog-footer">
          <el-button @click="dialogFormVisible = false">取 消</el-button>
          <el-button type="primary" @click="addUser('form')">添加</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
    <el-dialog :title="titleTree" width="600px" :visible.sync="dialogFormTree">
      <el-input
        v-model="filterText"
        placeholder="输入关键字进行过滤"
      />
      <el-tree
        ref="tree2"
        class="filter-tree"
        :data="dataTree"
        default-expand-all
        :props="defaultProps"
        :filter-node-method="filterNode"
        @node-click="handleNodeClick"
      />
    </el-dialog>
  </div>
</template>

<script>
  import SelectTree from '@/components/widget/SelectTree.vue';

  export default {
    name: 'AdministratorList',
    watch: {
      filterText(val) {
        this.$refs.tree2.filter(val)
      }
    },
    data() {
      return {
        dataTree: [],
        titleTree: '请选择',
        filterText: '',
        dialogFormTree: false,
        title: '编辑管理员',
        form: {
          name: "",
          className: '',
          role: '',
        },
        defaultProps: {
          children: 'children',
          label: 'name'
        },
        optionsRole: [],
        rules: {
          className: [
            {required: true, message: '请选择归属单位', trigger: 'blur'}
          ],
        },
        formLabelWidth: '80px',
        dialogFormVisible: false,
        selected: Number(localStorage.getItem('deptId')),
        // 数据默认字段
        selectedProps: {
          value: 'id',          // 唯一标识
          label: 'name',       // 标签显示
          children: 'children', // 子级
        },
        // 数据列表
        selectedOptions: JSON.parse(localStorage.getItem('current')),
        deptId: localStorage.getItem('deptId'),
        loading: true,
        tableData: [],
        currentPage: 1, // 当前多少页
        size: 10, // 每页多少条数据
        total: 0 // 总共多少数据
      }
    },
    components: {SelectTree},
    created() {
      this.init()
      this.$_HTTP.get(this.$_API.getCurrentTree, {}, res => {
        this.dataTree = res
      })
    },
    methods: {
      //禁用用户
      disableUser(index, row) {
        this.$confirm('此操作将禁用该用户, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.$_HTTP.put(this.$_API.editUser + row.userVo.username, {state: '2'}, res => {
            if (res.code === 1) {
              this.init()
              this.$message({
                message: '禁用用户成功',
                type: 'success'
              })
            }
          })
        }).catch(() => {
        })
      },
      //启用用户
      enableUser(index, row) {
        this.$confirm('此操作将启用该用户, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.$_HTTP.put(this.$_API.editUser + row.userVo.username, {state: '1'}, res => {
            if (res.code === 1) {
              this.init()
              this.$message({
                message: '启用用户成功',
                type: 'success'
              })
            }
          })
        }).catch(() => {

        })
      },
      // 删除
      deleteUser(index, row) {
        console.log(row)
        this.$confirm('此操作将永久删除该管理员, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.$_HTTP.delete(this.$_API.deleteUser + row.userVo.id, {}, res => {
            if (res.code === 1) {
              this.init()
              this.$message({
                type: 'success',
                message: '删除成功!'
              })
            }
          })
        }).catch(() => {

        })
      },
      roleFind(id) {
        this.$_HTTP.get(this.$_API.roleFindDept + id, {}, res => {
          this.optionsRole = res.records
        })
      },
      clickInput() {
        this.dialogFormTree = true
      },
      selectedDept(val) {
        this.deptId = val
        this.init()
      },
      // 编辑
      handleEdit(index, row) {
        this.form.className = row.userVo.dept.name
        this.dialogFormVisible = true
        this.form.name = row.userVo.username
        this.valueId = row.userVo.dept.id
        this.roleFind(row.userVo.dept.id)
        this.form.role = row.userVo.roles.length !== 0 ? row.userVo.roles[0].id : ''
      },
      addUser(form) {
        this.$refs[form].validate((valid) => {
          if (valid) {
            const params = {
              deptId: this.valueId,
              roleIds: [this.form.role],
            }
            this.$_HTTP.put(this.$_API.editUser + this.form.name, params, res => {
              if (res.code === 1) {
                this.dialogFormVisible = false
                this.init()
                this.$message({
                  message: '修改管理员成功',
                  type: 'success'
                })
              }
            })
          }
        })
      },
      // 初始化分页
      init() {
        this.loading = true
        this.$_HTTP.get(this.$_API.registryRecordList, {
          deptId: this.deptId,
          size: this.size,
          current: this.currentPage
        }, res => {
          this.tableData = res.records
          this.total = res.total
          this.loading = false
        })
      },
      filterNode(value, data) {
        if (!value) return true
        return data.name.indexOf(value) !== -1
      },
      handleNodeClick(data) {
        this.form.className = data.name
        this.valueId = data.id
        this.dialogFormTree = false
        this.roleFind(data.id)
      },
      handleSizeChange(val) {
        this.size = val
        this.init()
      },
      handleCurrentChange(val) {
        this.currentPage = val
        this.init()
      }
    }

  }
</script>

<style scoped>

</style>
