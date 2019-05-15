<template>
  <div style="display: flex">
    <div class="left-main">
      <div class="boxLeftTop">
        <span class="menu_title">部门目录</span>
      </div>
      <el-tree
        :highlight-current="true"
        class="single-content"
        :data="data"
        :props="defaultProps"
        @node-click="handleNodeClick"
      />
    </div>
    <tip-message v-if="isShow" />
    <div v-else style="padding:20px;margin-left: 200px;width: 1250px">
      <el-card class="box-card">
        <div slot="header" class="clearfix">
          <i class="el-icon-menu" />
          <span>系统部门</span>
          <el-button
            style="float: right;padding: 6px;margin-right: 6px"
            type="primary"
            icon="el-icon-plus"
            @click="add"
          >添加
          </el-button>
          <el-button
            style="float: right;padding: 6px;margin-right: 6px"
            type="success"
            icon="el-icon-edit"
            @click="edit"
          >编辑
          </el-button>
          <el-button
            style="float: right;padding: 6px;"
            type="danger"
            icon="el-icon-delete"
            @click="del"
          >删除
          </el-button>
        </div>
        <el-form ref="form" :model="form" status-icon :rules="rules" label-width="100px" class="demo-ruleForm">
          <el-form-item label="部门名称" prop="name">
            <el-input v-model="form.name" autocomplete="off" :disabled="disabled" />
          </el-form-item>
          <el-form-item label="描述" prop="des">
            <el-input v-model="form.des" autocomplete="off" :disabled="disabled" />
          </el-form-item>
          <el-form-item class="dialog-footer">
            <el-button>取 消</el-button>
            <el-button type="primary" @click="sure">确定</el-button>
          </el-form-item>
        </el-form>
      </el-card>
    </div>
  </div>
</template>

<script>
import TipMessage from '../../../components/tipMessage/tipMessage'
export default {
  name: 'Department',
  components: { TipMessage },
  data() {
    return {
      isShow: true,
      disabled: true,
      deptId: '',
      title: '',
      data: [],
      defaultProps: {
        children: 'children',
        label: 'name'
      },
      form: {
        node: '',
        name: '',
        des: ''
      },
      rules: {
        name: [
          { required: true, message: '请输入部门名称', trigger: 'blur' }
        ]
      }
    }
  },
  created() {
    this.getDept()
  },
  methods: {
    handleNodeClick(data) {
      this.isShow = false
      this.form.name = data.name
      this.form.des = data.description
      this.deptId = data.id
      console.log(data)
    },
    sure() {
      const params = {
        name: this.form.name,
        description: this.form.des,
        parentId: this.deptId
      }
      const params1 = {
        name: this.form.name,
        description: this.form.des
      }
      if (this.title === '添加') {
        this.$_HTTP.post(this.$_API.addDept, params, res => {
          if (res.code === 1) {
            this.$message({
              type: 'success',
              message: '添加成功!'
            })
            this.disabled = true
            this.getDept()
          }
        })
      } else if (this.title === '编辑') {
        this.$_HTTP.put(this.$_API.editDept + this.deptId, params1, res => {
          if (res.code === 1) {
            this.$message({
              type: 'success',
              message: '编辑成功!'
            })
            this.disabled = true
            this.getDept()
          }
        })
      }
    },
    getDept() {
      this.$_HTTP.get(this.$_API.deptTree, {}, res => {
        this.data = res
      })
    },
    add() {
      this.title = '添加'
      this.form.name = ''
      this.form.des = ''
      this.disabled = false
    },
    edit() {
      this.title = '编辑'
      this.disabled = false
    },
    del() {
      this.$confirm('此操作将永久删除该部门, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$_HTTP.delete(this.$_API.deleteDept + this.deptId, {}, res => {
          if (res.code === 1) {
            this.$message({
              type: 'success',
              message: '删除成功!'
            })
            this.getDept()
          }
        })
      }).catch(() => {

      })
    }
  }
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
    width: 178px;
    height: 178px;
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
    width: 178px;
    height: 178px;
    line-height: 178px;
    text-align: center;
  }

  .avatar {
    width: 178px;
    height: 178px;
    display: block;
  }

  .head_pic {
    border-radius: 50%;
    width: 70px;
    height: 70px;
  }
</style>
