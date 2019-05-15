<template>
  <div style="display: flex">
    <div class="left-main">
      <div class="boxLeftTop">
        <span class="menu_title">菜单目录</span>
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
    <div v-else style="padding:30px;margin-left: 200px;width: 1200px">
      <el-card class="box-card">
        <div slot="header" class="clearfix">
          <i class="el-icon-menu" />
          <span>系统菜单</span>
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
          <el-form-item label="标题" prop="title">
            <el-input v-model="form.title" autocomplete="off" :disabled="disabled" />
          </el-form-item>
          <el-form-item label="组件名称" prop="name">
            <el-input v-model="form.name" autocomplete="off" :disabled="disabled" />
          </el-form-item>
          <el-form-item label="前端组件" prop="component">
            <el-input v-model="form.component" autocomplete="off" :disabled="disabled" />
          </el-form-item>
          <el-form-item label="图标" prop="icon">
            <el-input v-model="form.icon" autocomplete="off" :disabled="disabled" />
          </el-form-item>
          <el-form-item label="类型" prop="icon">
            <el-select v-model="value" placeholder="请选择" :disabled="disabled" style="width: 100%">
              <el-option
                v-for="item in options"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
          </el-form-item>
          <el-form-item label="前端路径" prop="path">
            <el-input v-model="form.path" autocomplete="off" :disabled="disabled" />
          </el-form-item>
          <el-form-item label="重定向路径" prop="redirect">
            <el-input v-model="form.redirect" autocomplete="off" :disabled="disabled" />
          </el-form-item>
          <el-form-item class="dialog-footer">
            <el-button @click="cancel">取 消</el-button>
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
  name: 'Menu',
  components: { TipMessage },
  data() {
    return {
      isShow: true,
      data: [],
      parentId: '',
      disabled: true,
      singleData: '',
      menuId: '',
      title: '',
      res: [],
      options: [{
        value: '1',
        label: '菜单'
      }, {
        value: '2',
        label: '按钮'
      }],
      value: '1',
      form: {
        title: '',
        name: '',
        component: '',
        path: '',
        redirect: '',
        icon: ''
      },
      rules: {
        title: [
          { required: true, message: '请输入标题', trigger: 'blur' }
        ],
        name: [
          { required: true, message: '请输入组件名称', trigger: 'blur' }
        ],
        component: [
          { required: true, message: '请输入前端组件', trigger: 'blur' }
        ],
        path: [
          { required: true, message: '请输入前端路径', trigger: 'blur' }
        ],
        redirect: [
          { message: '请输入前端路径', trigger: 'blur' }
        ]
      },
      defaultProps: {
        children: 'children',
        label: 'label'
      }
    }
  },

  created() {
    this.getMenu()
  },
  methods: {
    getMenu() {
      this.$_HTTP.get(this.$_API.getMenu, {}, res => {
        this.data = this.toTreeData(res)
        this.res = res
      })
    },
    toTreeData(menu) {
      return menu.map(data => {
        return {
          label: data.meta.title,
          children: this.toTreeData(data.children),
          icon: data.meta.icon,
          name: data.name,
          component: data.component,
          path: data.path,
          redirect: data.redirect,
          id: data.id,
          type: data.type
        }
      })
    },
    add() {
      this.title = '添加'
      this.disabled = false
      this.form.title = ''
      this.form.name = ''
      this.form.component = ''
      this.form.path = ''
      this.form.icon = ''
      this.form.redirect = ''
    },
    edit() {
      this.title = '编辑'
      this.disabled = false
      this.getData()
    },
    del() {
      this.$confirm('此操作将永久删除该菜单, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$_HTTP.delete(this.$_API.deleteMenu + this.menuId, {}, res => {
          if (res.code === 1) {
            this.$message({
              type: 'success',
              message: '删除成功!'
            })
            this.getMenu()
          }
        })
      }).catch(() => {

      })
    },
    cancel() {
      this.disabled = true
    },
    // 确定
    sure() {
      const params = {
        component: this.form.component,
        icon: this.form.icon,
        name: this.form.title,
        path: this.form.path,
        redirect: this.form.redirect,
        parentId: this.menuId,
        type: this.value
      }
      const params1 = {
        component: this.form.component,
        icon: this.form.icon,
        name: this.form.title,
        path: this.form.path,
        redirect: this.form.redirect,
        type: this.value
      }

      if (this.title === '添加') {
        this.$_HTTP.post(this.$_API.addMenu, params, res => {
          if (res.code === 1) {
            this.$message({
              type: 'success',
              message: '添加成功!'
            })
            this.disabled = true
            this.getMenu()
          }
        })
      } else if (this.title === '编辑') {
        this.$_HTTP.put(this.$_API.editMenu + this.menuId, params1, res => {
          if (res.code === 1) {
            this.$message({
              type: 'success',
              message: '编辑成功!'
            })
            this.disabled = true
            this.getMenu()
          }
        })
      }
    },
    handleNodeClick(data) {
      this.isShow = false
      console.log(data)
      this.singleData = data
      this.menuId = data.id
      this.getData()
    },
    getData() {
      this.form.title = this.singleData.label
      this.form.name = this.singleData.name
      this.form.component = this.singleData.component
      this.form.path = this.singleData.path
      this.form.icon = this.singleData.icon
      this.form.redirect = this.singleData.redirect
      this.value = this.singleData.type
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
