<template>
  <div>
    <el-row>
      <el-col>
        <div class="left-main">
          <div class="boxLeftTop">
            <span class="menu_title">所属部门</span>
          </div>
          <el-tree
            default-expand-all
            :highlight-current="true"
            class="single-content"
            :data="data2"
            :props="defaultProps2"
            @node-click="handleNodeClick2"
          />
        </div>
      </el-col>
      <el-col v-if="isShow">
        <tip-message />
      </el-col>
      <div v-else style="padding:20px;margin-left: 200px;">
        <el-card class="box-card">
          <div slot="header" class="clearfix">
            <el-button
              v-if="$_Authorities.indexOf('添加用户')!==-1"
              style="padding: 6px;"
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
            <el-table-column
              align="center"
              label="序号"
              type="index"
            />
            <el-table-column align="center" label="卡号">
              <template slot-scope="scope">
                <el-form :model="scope.row">
                  <el-input v-model="scope.row.code" placeholder="卡号" @focus="focus(scope.row)" @blur="blur(scope.row)" />
                </el-form>
              </template>
              <!--<template v-if="scope.row.smartCardVo" slot-scope="scope">{{ scope.row.smartCardVo.code}}</template>-->
            </el-table-column>
            <el-table-column align="center" prop="user.username" label="姓名" width="180" />
            <el-table-column align="center" prop="user.idCard" label="身份证号" />

            <el-table-column align="center" label="状态">
              <template slot-scope="scope">{{ scope.row.user && scope.row.user.state==='1'?'正常':'禁用' }}</template>
            </el-table-column>

            <el-table-column align="center" prop="deptId" label="归属部门" />

            <el-table-column align="center" label="操作" width="150">
              <template slot-scope="scope">
                <el-button
                  v-if="$_Authorities.indexOf('编辑用户')!==-1"
                  size="mini"
                  type="text"
                  @click="handleEdit(scope.$index, scope.row)"
                >编辑
                </el-button>
                <el-button
                  v-if="scope.row.user && scope.row.user.state==='1'&&$_Authorities.indexOf('禁用用户')!==-1"
                  size="mini"
                  type="text"
                  @click="disableUser(scope.$index, scope.row)"
                >禁用
                </el-button>
                <el-button
                  v-if="scope.row.user && scope.row.user.state==='2'&&$_Authorities.indexOf('禁用用户')!==-1"
                  size="mini"
                  type="text"
                  @click="enableUser(scope.$index, scope.row)"
                >启用
                </el-button>
                <el-button
                  v-if="$_Authorities.indexOf('删除用户')!==-1"
                  size="mini"
                  type="text"
                  @click="fronzeAccount()"
                >冻结
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
            <el-form-item label="卡号" :label-width="formLabelWidth" prop="cardNum">
              <el-input v-model="form.code" autocomplete="off" />
            </el-form-item>
            <el-form-item label="姓名" :label-width="formLabelWidth" prop="realName">
              <el-input v-model="form.realName" autocomplete="off" />
            </el-form-item>
            <el-form-item label="身份证号" :label-width="formLabelWidth" prop="idCard">
              <el-input v-model="form.idCard" autocomplete="off" />
            </el-form-item>
            <el-form-item label="归属部门" :label-width="formLabelWidth" prop="className">
              <el-input
                v-model="form.className"
                readonly="readonly"
                placeholder="请选择单位"
                autocomplete="off"
                @focus="clickInput"
              />
            </el-form-item>
            <el-form-item class="dialog-footer">
              <el-button @click="dialogFormVisible = false">取 消</el-button>
              <el-button type="primary" @click="handleConfirm">{{ title == '添加用户' ? '添加' : '确认编辑' }}</el-button>
            </el-form-item>
          </el-form>
        </el-dialog>
      </div>
    </el-row>
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
import { checkPhone } from '@/libs/regular.js'
import exportForm from '@/mixins/exportForm'
import SelectTree from '@/components/widget/SelectTree.vue'
import axios from 'axios'
import ImportForm from '../../../components/importForm/index'
import mixins from '@/mixins/user'
import TipMessage from '../../../components/tipMessage/tipMessage'

export default {
  components: { ImportForm, SelectTree, TipMessage },
  mixins: [exportForm, mixins],
  data() {
    return {
      userId: '',
      id: '',
      disableFont: '禁用',
      selected: Number(localStorage.getItem('deptId')),
      deptId: localStorage.getItem('deptId'),
      api: 'smartCard/importInfo',
      disabled: false,
      dataTree: [],
      filterText: '',
      titleTree: '请选择',
      valueId: '', // 初始ID（可选）
      loading: true,
      data: [],
      data2: [],
      defaultProps2: {
        children: 'children',
        label: 'name'
      },
      optionsRole: [],
      defaultProps: {
        children: 'children',
        label: 'name'
      },
      id: '',
      isShow: true,
      tableData: [],
      dialogFormTree: false,
      currentPage: 1, // 当前多少页
      size: 10, // 每页多少条数据
      total: 0, // 总共多少数据
      dialogFormVisible: false,
      userName: '',
      title: '添加用户',
      base64: '',
      avatar: require('@/assets/avatar/mieba.png'),
      form: {
        role: '',
        idCard: '',
        code: '',
        cardNum: '',
        userName: '',
        realName: '',
        mobile: '',
        className: '',
        status: ''
      },
      formLabelWidth: '80px',
      rules: {
        cardNum: [
          { required: true, message: '请输入卡号', trigger: 'blur' }
        ],
        idCard: [
          { required: true, message: '请输入身份证号', trigger: 'blur' }
        ],
        realName: [
          { required: true, message: '请输入真实姓名', trigger: 'blur' }
        ],
        className: [
          { required: true, message: '请选择', trigger: 'blur' }
        ],
        mobile: [
          { required: true, validator: checkPhone, trigger: 'blur' }
        ]
      }
    }
  },
  watch: {
    filterText(val) {
      this.$refs.tree2.filter(val)
    }
  },
  created() {
    this.init()
    this.$_HTTP.get(this.$_API.getCurrentTree, {}, res => {
      this.dataTree = res
      this.data2 = res
    })
  },
  methods: {
    handleNodeClick2(data) {
      this.isShow = false
      this.deptId = data.id
      this.init()
    },
    focus(row) {
      console.log(row)
    },
    blur(row) {

      // this.$_HTTP.post(this.$_API.addCard, { code: row.smartCardCode,idCard:row.idCard,name:row.realname,userId:row.id }, res => {
      // })
    },
    selectedDept(val) {
      this.deptId = val
      this.init()
    },
    clickInput() {
      this.dialogFormTree = true
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
    roleFind(id) {
      this.$_HTTP.get(this.$_API.roleFindDept + id, {}, res => {
        this.optionsRole = res.records
      })
    },
    // 初始化分页
    init() {
      this.loading = true
      this.$_HTTP.get(this.$_API.getCardList, { deptId: this.deptId, size: this.size, current: this.currentPage }, res => {
        this.tableData = res.records
        console.log(res)
        this.total = res.total
        this.loading = false
      })
    },
    // 编辑
    handleEdit(index, row) {
      this.dialogFormVisible = true
      this.form.realName = row.user ? row.user.username : ''
      this.form.idCard = row.user ? row.user.idCard : ''
      this.form.code = row.code
      this.title = '编辑用户'
      // console.log(row)
    },
    // 删除
    deleteUser(index, row) {
      console.log(row)
      this.$confirm('此操作将永久删除该用户, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$_HTTP.delete(this.$_API.deleteSmartCard + row.id, {}, res => {
          console.log(res)
          // if (res.code === 1) {
          //   this.init()
          //   this.$message({
          //     type: 'success',
          //     message: '删除成功!'
          //   })
          // }
        })
      }).catch(() => {

      })
    },
    fronzeAccount() {

    },
    // 禁用用户
    disableUser(index, row) {
      this.$confirm('此操作将禁用该用户, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$_HTTP.put(this.$_API.editSmartCard + row.id, { state: '2' }, res => {
          console.log(res)
          // if (res.code === 1) {
          //   this.dialogFormVisible = false
          //   this.init()
          //   this.disableFont = '启用'
          //   this.$message({
          //     message: '禁用用户成功',
          //     type: 'success'
          //   })
          // }
        })
      }).catch(() => {
      })
    },
    // 启用用户
    enableUser(index, row) {
      this.$confirm('此操作将启用该用户, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$_HTTP.put(this.$_API.editUser + row.username, { state: '1' }, res => {
          if (res.code === 1) {
            this.dialogFormVisible = false
            this.init()
            this.disableFont = '禁用'
            this.$message({
              message: '启用用户成功',
              type: 'success'
            })
          }
        })
      }).catch(() => {

      })
    },
    addButton() {
      this.disabled = false
      this.form.className = ''
      this.form.realName = ''
      this.title = '添加用户'
      this.form.code = ''
      this.dialogFormVisible = true
    },
    handleSizeChange(val) {
      this.size = val
      this.init()
    },
    handleConfirm() {
      console.log(this.form)

      const params = {
        code: this.form.code,
        username: this.form.username,
        idCard: this.form.idCard

      }
      if (this.title == '添加用户') {

      } else {

      }

      // this.$refs[form].validate((valid) => {
      //   if (valid) {
      //     const params = {
      //       code:'1123',
      //       username: '111',
      //       deptId: this.valueId,
      //       idCard: this.form.idCard
      //     }
      //     if (this.title === '添加用户') {
      //       this.$_HTTP.post(this.$_API.addUser, params, res => {
      //         if (res.code === 1) {
      //           this.dialogFormVisible = false
      //           this.init()
      //           this.$message({
      //             message: '添加用户成功',
      //             type: 'success'
      //           })
      //         }
      //       })
      //     } else {
      //       this.$_HTTP.put(this.$_API.editUser + this.form.userName, params, res => {
      //         if (res.code === 1) {
      //           this.dialogFormVisible = false
      //           this.init()
      //           this.$message({
      //             message: '修改用户成功',
      //             type: 'success'
      //           })
      //         }
      //       })
      //     }
      //   }
      // })
    },
    handleCurrentChange(val) {
      this.currentPage = val
      this.init()
    }
  }
}
</script>

<style lang="scss" scoped>

</style>
