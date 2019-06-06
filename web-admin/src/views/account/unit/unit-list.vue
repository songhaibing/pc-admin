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
          prop="username"
          label="单位logo"
        />
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
            action="http://106.75.178.9:8080/file/upload/file/avatar"
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
          <el-input v-model="form.status" autocomplete="off"/>
        </el-form-item>
        <el-form-item label="设备数" :label-width="formLabelWidth" prop="num">
          <el-input v-model="form.num" autocomplete="off"/>
        </el-form-item>
        <el-form-item label="对接人" :label-width="formLabelWidth" prop="dockingPeople">
          <el-input v-model="form.dockingPeople" autocomplete="off" />
        </el-form-item>
        <el-form-item label="联系电话" :label-width="formLabelWidth" prop="mobile">
          <el-input v-model="form.mobile" autocomplete="off" />
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
  export default {
    name: "unit-list",
    data() {
      return {
        token: localStorage.getItem('token'),
        formLabelWidth:'100px'  ,
        title: '添加单位',
        dialogFormVisible: false,
        loading: true,
        tableData: [],
        currentPage: 1, // 当前多少页
        size: 10, // 每页多少条数据
        total: 0, // 总共多少数据
        form: {
          unitName: '',
          mobile: '',
          openingTime: '',
          stopTime: '',
          status: '',
          num:'',
          dockingPeople:''
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
      handleSizeChange(val) {
        this.size = val
        this.init()
      },
      addUser(form) {
        this.$refs[form].validate((valid) => {
          if (valid) {
            const params = {
              name: this.form.unitName,
              businessState: this.form.status,
              categories: this.form.category,
              deviceNumber: this.form.num,
              expireTime: this.form.time,
              head: this.form.principal,
              phoneNumber: this.form.phone,
              businessTypeId:this.classId
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
              this.$_HTTP.put(this.$_API.delUnit + this.merchantId, params, res => {
                if (res.code === 1) {
                  this.dialogFormVisible = false
                  this.$message({
                    message: '修改单位成功',
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
      },
      handleCurrentChange(val) {
        this.currentPage = val
        this.init()
      },
      addButton() {
        this.title = '添加单位'
        this.dialogFormVisible = true
      },
    },
  }
</script>

<style lang="scss" scoped>
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
  .dialog-footer {
    text-align: center;
  }

  .box-card {
    width: 100%;
  }

  .avatar-uploader {
    width: 100px;
    height: 100px;
    border: 1px dashed #d9d9d9;
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
  }

  .avatar-uploader:hover {
    border-color: #409EFF;
  }

  .avatar-uploader-icon {
    font-size: 28px;
    color: #8c939d;
    width: 100px;
    height: 100px;
    line-height: 100px;
    text-align: center;
  }

  .avatar {
    width: 100px;
    height: 100px;
    display: block;
  }

  .head_pic {
    border-radius: 50%;
    width: 70px;
    height: 70px;
  }
</style>
