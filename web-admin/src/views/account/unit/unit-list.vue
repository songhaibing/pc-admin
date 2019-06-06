<template>
  <div style="padding: 20px">
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <i class="el-icon-school"/>
        <span>单位列表</span>
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
        <el-table-column
          label="账户ID"
          align="center"
          prop="id"
        >
        </el-table-column>
        <el-table-column
          align="center"
          label="单位logo"
        >
          <template scope="scope">
            <img
              v-if="scope.row.logo"
              :src="'http://106.75.178.9:80/resource/'+scope.row.logo"
              class="head_pic"
            >
            <img v-else src="@/assets/avatar/mieba.png" class="head_pic">
          </template>
        </el-table-column>
        <el-table-column
          align="center"
          prop="name"
          label="单位名称"
        />
        <el-table-column
          align="center"
          prop="servicePeriod"
          label="服务周期"
        />
        <el-table-column
          align="center"
          prop="startTime"
          label="开通时间"
        />
        <el-table-column
          align="center"
          prop="endTime"
          label="终止时间"
        >
        </el-table-column>
        <el-table-column
          align="center"
          prop="email"
          label="状态"
        />
        <el-table-column
          align="center"
          prop="deviceNum"
          label="设备数"
        >
        </el-table-column>
        <el-table-column
          align="center"
          prop="username"
          label="对接人"
        >
        </el-table-column>
        <el-table-column
          align="center"
          prop="phone"
          label="联系电话"
        >
        </el-table-column>
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
        <el-form-item label="单位logo" :label-width="formLabelWidth">
          <el-upload
            class="avatar-uploader"
            action="http://106.75.178.9:80/file/upload/file/avatar"
            :headers="{token}"
            :show-file-list="false"
            :on-success="handleAvatarSuccess"
            :before-upload="beforeAvatarUpload"
          >
            <img v-if="imageUrl" :src="imageUrl" class="avatar">
            <i v-else class="el-icon-plus avatar-uploader-icon"/>
          </el-upload>
        </el-form-item>
        <el-form-item label="单位名称" :label-width="formLabelWidth" prop="unitName">
          <el-input v-model="form.unitName" autocomplete="off"/>
        </el-form-item>
        <el-form-item label="开通时间" :label-width="formLabelWidth" prop="openingTime">
          <el-date-picker
            style="width: 100%"
            v-model="form.openingTime"
            value-format="yyyy-MM-dd HH:mm:ss"
            type="datetime"
            placeholder="选择开通时间">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="终止时间" :label-width="formLabelWidth" prop="stopTime">
          <!--<el-input  placeholder="请选择终止时间" v-model="form.stopTime" autocomplete="off"/>-->
          <el-date-picker
            style="width: 100%"
            v-model="form.stopTime"
            value-format="yyyy-MM-dd HH:mm:ss"
            type="datetime"
            placeholder="请选择终止时间">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="状态" :label-width="formLabelWidth" prop="status">
          <!--<el-input v-model="form.status" autocomplete="off"/>-->
          <el-select v-model="form.status" placeholder="请选择" style="width: 100%" @change="change">
            <el-option
              v-for="item in options"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="设备数" :label-width="formLabelWidth" prop="num">
          <el-input v-model="form.num" autocomplete="off"/>
        </el-form-item>
        <el-form-item label="对接人" :label-width="formLabelWidth" prop="dockingPeople">
          <el-input v-model="form.dockingPeople" autocomplete="off"/>
        </el-form-item>
        <el-form-item label="联系电话" :label-width="formLabelWidth" prop="mobile">
          <el-input v-model="form.mobile" autocomplete="off"/>
        </el-form-item>
        <el-form-item class="dialog-footer">
          <el-button @click="dialogFormVisible = false">取 消</el-button>
          <el-button type="primary" @click="addUser('form')">添加</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
  </div>
</template>

<script>
  import mixins from '@/mixins/user'

  export default {
    mixins: [mixins],
    name: "unit-list",
    data() {
      return {
        unitId: '',
        selectId: '',
        imageUrl: '',
        base64: '',
        avatar: require('@/assets/avatar/mieba.png'),
        token: localStorage.getItem('token'),
        formLabelWidth: '100px',
        title: '添加单位',
        dialogFormVisible: false,
        loading: true,
        tableData: [],
        currentPage: 1, // 当前多少页
        size: 10, // 每页多少条数据
        total: 0, // 总共多少数据
        options: [{
          value: 0,
          label: '正常'
        }, {
          value: 1,
          label: '已到期'
        }, {
          value: 9,
          label: '禁用'
        }],
        form: {
          unitName: '',
          mobile: '',
          openingTime: '',
          stopTime: '',
          status: '',
          num: '',
          dockingPeople: ''
        },
        rules: {
          unitName: [
            {required: true, message: '请输入单位名称', trigger: 'blur'}
          ],
          mobile: [
            {required: true, message: '请输入手机号', trigger: 'blur'}
          ],
          stopTime: [
            {required: true, message: '请输入终止时间', trigger: 'blur'}
          ],
          openingTime: [
            {required: true, message: '请输入开通时间', trigger: 'blur'}
          ],
          status: [
            {required: true, message: '请选择状态', trigger: 'blur'}
          ],
          num: [
            {required: true, message: '请输入设备数', trigger: 'blur'}
          ],
          dockingPeople: [
            {required: true, message: '请输入对接人', trigger: 'blur'}
          ],
        }
      }
    },
    created() {
      this.init()
    },
    methods: {
      // 初始化分页
      init() {
        this.loading = true
        this.$_HTTP.get(this.$_API.unitList, {size: this.size, current: this.currentPage}, res => {
          this.tableData = res.records
          this.total = res.total
          this.loading = false
        })
      },
      change(val) {
        this.selectId = val
        console.log(val)
      },
      handleSizeChange(val) {
        this.size = val
        this.init()
      },
      handleAvatarSuccess(res, file) {
        this.imageUrl = URL.createObjectURL(file.raw)
        this.getBase64(file.raw).then(res => {
          this.base64 = res
        })
      },
      beforeAvatarUpload(file) {
        const isJPG = file.type === 'image/jpeg'
        const isLt2M = file.size / 1024 / 1024 < 2

        if (!isJPG) {
          this.$message.error('上传头像图片只能是 JPG 格式!')
        }
        if (!isLt2M) {
          this.$message.error('上传头像图片大小不能超过 2MB!')
        }
        return isJPG && isLt2M
      },
      handleEdit(index, row) {
        this.unitId = row.id
        if (row.logo) {
          this.imageUrl = 'http://106.75.178.9:80/resource/' + row.logo
        } else {
          this.imageUrl = this.avatar
        }
          this.title = '编辑单位'
          this.form.unitName = row.name,
          this.form.mobile = row.phone,
          this.form.num = row.deviceNum,
          this.form.openingTime = row.startTime,
          this.form.stopTime = row.endTime,
          this.selectId = row.deptState,
          this.form.dockingPeople = row.username,
          this.dialogFormVisible = true
        console.log(index, row)
      },
      deleteUser(index, row) {
        this.$confirm('此操作将永久删除该单位, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.$_HTTP.delete(this.$_API.delUnit + row.id, {}, res => {
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
      addUser(form) {
        this.$refs[form].validate((valid) => {
          if (valid) {
            const params = {
              name: this.form.unitName,
              logo: this.base64,
              phone: this.form.mobile,
              deviceNum: this.form.num,
              startTime: this.form.openingTime,
              endTime: this.form.stopTime,
              deptState: this.selectId,
              username: this.form.dockingPeople,
            }
            if (this.title === '添加单位') {
              this.$_HTTP.post(this.$_API.addUnit, params, res => {
                if (res.code === 1) {
                  this.dialogFormVisible = false
                  this.$message({
                    message: '添加单位成功',
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
              this.$_HTTP.put(this.$_API.editUnit + this.unitId, params, res => {
                if (res.code === 1) {
                  this.dialogFormVisible = false
                  this.$message({
                    message: '修改单位成功',
                    type: 'success'
                  })
                  this.init()
                } else {
                  this.$message({
                    message: '修改单位失败',
                    type: 'error'
                  })
                }
              })
            }
          }
        })
      },
      handleCurrentChange(val) {
        this.currentPage = val
        this.init()
      },
      addButton() {
        this.form.unitName = ''
        this.imageUrl = ''
        this.form.mobile = ''
        this.form.num = ''
        this.form.openingTime = ''
        this.form.stopTime = ''
        this.form.status = ''
        this.form.dockingPeople = ''
        this.title = '添加单位'
        this.dialogFormVisible = true
      },
    },
  }
</script>

<style lang="scss" scoped>

</style>
