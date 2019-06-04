<template>
  <div style="padding: 20px">
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <i class="el-icon-s-shop"/>
        <span>商品列表</span>
        <el-button
          style="float: right;padding: 6px;margin-right: 6px"
          type="primary"
          icon="el-icon-plus"
          @click="addButton"
        >添加
        </el-button>
        <el-button
          style="float: right;padding: 6px;margin-right: 6px"
          type="danger"
          icon="el-icon-delete"
          @click="addButton"
        >批量删除
        </el-button>
      </div>
      <el-table
        v-loading="loading"
        :data="tableData"
        style="width: 100%"
      >
        <el-table-column
          type="selection"
          width="55">
        </el-table-column>
        <el-table-column label="ID" prop="id" align="center" width="50"/>
        <el-table-column align="center" label="图片">
          <template scope="scope">
            <img
              v-if="scope.row.picture"
              :src="'http://106.75.178.9:8080/resource/'+scope.row.picture"
              class="head_pic"
            >
            <img v-else src="@/assets/other/caomei.jpg" class="head_pic">
          </template>
        </el-table-column>
        <el-table-column align="center" prop="name" label="品名"/>
        <el-table-column align="center" prop="goodsType.name" label="类型" width="50"/>
        <el-table-column align="center" label="状态">
          <template slot-scope="scope">{{ scope.row.goodsState==='0'?'上架':'下架' }}</template>
        </el-table-column>
        <el-table-column align="center" prop="price" label="定价"/>
        <el-table-column align="center" prop="optionalDate" label="可选日期"/>
        <el-table-column align="center" prop="dueDate" label="预定时间"/>
        <el-table-column align="center" prop="rate" label="好评率" />
        <el-table-column align="center" label="操作" width="150">
          <template slot-scope="scope">
            <el-button size="mini" type="text"  @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
            <el-button size="mini" type="text" @click="obtained(scope.$index, scope.row)">{{font}}</el-button>
            <el-button size="mini" type="text" @click="deleteUser(scope.$index, scope.row)">删除</el-button>
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
        <el-form-item label="图片上传" :label-width="formLabelWidth">
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
        <el-form-item label="品名" :label-width="formLabelWidth" prop="name">
          <el-input v-model="form.name" autocomplete="off"/>
        </el-form-item>
        <el-form-item label="状态" :label-width="formLabelWidth" prop="status">
          <el-select v-model="form.status" placeholder="请选择" style="width: 100%">
            <el-option label="上架" value="0"/>
            <el-option label="下架" value="1"/>
          </el-select>
        </el-form-item>
        <el-form-item label="类型" :label-width="formLabelWidth" prop="className">
          <el-input ref="input" placeholder="请选择商品类型" v-model="form.className" autocomplete="off" @focus="clickInput"/>
        </el-form-item>
        <el-form-item label="定价" :label-width="formLabelWidth" prop="price">
          <el-input v-model="form.price" autocomplete="off"/>
        </el-form-item>
        <el-form-item label="可选日期" :label-width="formLabelWidth" prop="week">
          <el-select v-model="form.week" multiple placeholder="请选择"  style="width: 100%">
            <el-option
              v-for="item in options"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="预定时间" :label-width="formLabelWidth" prop="scheduledTime">
          <el-date-picker
            style="width: 100%"
            v-model="form.scheduledTime"
            value-format="yyyy-MM-dd HH:mm:ss"
            type="datetime"
            placeholder="请选择今天以后的时间">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="好评率" :label-width="formLabelWidth" prop="rate">
          <el-input v-model="form.rate" autocomplete="off">
            <template slot="append">%</template>
          </el-input>
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
  import SelectTree from '@/components/treeSelect/treeSelect.vue'
  import mixins from '@/mixins/user'
  export default {
    name: 'CommodityList',
    mixins: [mixins],
    components: { SelectTree },
    watch: {
      filterText(val) {
        this.$refs.tree2.filter(val);
      }
    },
    data() {
      return {
        filterText: '',
        classId:'',
        dialogFormTree:false,
        dataTree:[],
        titleTree:'请选择',
        defaultProps: {
          children: 'children',
          label: 'name'
        },
        data: [],
        isClearable: true, // 可清空（可选）
        isAccordion: true, // 可收起（可选）
        valueId: '', // 初始ID（可选）
        props: { // 配置项（必选）
          value: 'id',
          label: 'name',
          children: 'children'
        },
        options: [{
          value: '星期一',
          label: '星期一'
        }, {
          value: '星期二',
          label: '星期二'
        }, {
          value: '星期三',
          label: '星期三'
        }, {
          value: '星期四',
          label: '星期四'
        }, {
          value: '星期五',
          label: '星期五'
        },
          {
            value: '星期六',
            label: '星期六'
          },
          {
            value: '星期天',
            label: '星期天'
          }
        ],
        goodId:'',
        imageUrl: '',
        base64: '',
        font:'下架',
        token: localStorage.getItem('token'),
        avatar: require('@/assets/other/caomei.jpg'),
        formLabelWidth: '80px',
        tableData: [],
        dialogFormVisible: false,
        loading: true,
        title: '添加商品',
        currentPage: 1, // 当前多少页
        size: 10, // 每页多少条数据
        total: 0, // 总共多少数据
        value: '',
        form: {
          week:[],
          scheduledTime:'',
          status: '',
          name: '',
          rate:'99.9',
          price:'',
          className:''
        },
        rules: {
          status: [
            {required: true, message: '请选择状态', trigger: 'blur'}
          ],
          name: [
            {required: true, message: '请输入商品名称', trigger: 'blur'}
          ],
          scheduledTime: [
            {required: true, message: '请选择预定时间', trigger: 'blur'}
          ],
          week: [
            {required: true, message: '请选择可选时间', trigger: 'blur'}
          ],
          rate: [
            {required: true, message: '请输入好评率', trigger: 'blur'}
          ],
          price: [
            {required: true, message: '请输入定价', trigger: 'blur'}
          ]
        }
      }
    },
    created() {
      this.init()
    },
    methods: {
      clickInput(){
        this.dialogFormTree=true
        setTimeout(()=>{
          this.$refs.input.blur()
        },500)
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
      getValue(value) {
        this.valueId = value
        console.log(this.valueId)
      },
      // 初始化分页
      init() {
        this.loading = true
        this.$_HTTP.get(this.$_API.goodsList, {size: this.size, current: this.currentPage}, res => {
          this.tableData = res.records
          console.log(res)
          this.total = res.total
          this.loading = false
        })
        this.$_HTTP.get(this.$_API.goodsAllTree, {}, res => {
          this.dataTree = res
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
      addButton() {
        this.form.className=''
        this.form.status = ''
        this.form.name = ''
        this.form.scheduledTime = ''
        this.form.week = []
        this.form.price = ''
        this.imageUrl = ''
        this.title = '添加商品'
        this.dialogFormVisible = true
      },
      handleEdit(index,row){
        this.goodId = row.id
        if (row.picture) {
          this.imageUrl = 'http://106.75.178.9:8080/resource/' + row.picture
        } else {
          this.imageUrl = this.avatar
        }
        this.title = '编辑商品'
        this.classId=row.goodsTypeId
        if(row.optionalDate){
          this.form.week=row.optionalDate.split(',')
        }
        this.dialogFormVisible = true
        this.form.className=row.goodsType.name
        this.form.name = row.name
        this.form.scheduledTime = row.dueDate
        this.form.rate = row.rate
        this.form.price = row.price
        this.form.status = row.goodsState
      },
      deleteUser(index, row) {
        this.$confirm('此操作将永久删除该商品, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.$_HTTP.delete(this.$_API.delGoods + row.id, {}, res => {
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
      //上下架
      obtained(index,row){
        if(this.font==='下架'){
          this.$confirm('此操作将下架此商品, 是否继续?', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
            this.$_HTTP.put(this.$_API.editGoods+ row.id, {goodsState:'1'}, res => {
              if (res.code === 1) {
                this.$message({
                  type: 'success',
                  message: '商品下架成功!'
                })
                this.init()
                this.font='上架'
              }
            })
          }).catch(() => {

          })
        }else{
          this.$confirm('此操作将上架此商品, 是否继续?', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
            this.$_HTTP.put(this.$_API.editGoods+ row.id, {goodsState:'0'}, res => {
              if (res.code === 1) {
                this.$message({
                  type: 'success',
                  message: '商品上架成功!'
                })
                this.init()
                this.font='下架'
              }
            })
          }).catch(() => {

          })
        }

      },
      addMerchant(form) {
        this.$refs[form].validate((valid) => {
          if (valid) {
            const params = {
              name: this.form.name,
              goodsState: this.form.status,
              picture: this.base64,
              optionalDate: this.form.week.join(','),
              dueDate: this.form.scheduledTime,
              rate:this.form.rate,
              price:this.form.price,
              goodsTypeId:this.classId
            }
            if (this.title === '添加商品') {
              this.$_HTTP.post(this.$_API.addGoods, params, res => {
                if (res.code === 1) {
                  this.dialogFormVisible = false
                  this.$message({
                    message: '添加商品成功',
                    type: 'success'
                  })
                  this.init()
                }
              })
            } else {
              this.$_HTTP.put(this.$_API.editGoods + this.goodId, params, res => {
                if (res.code === 1) {
                  this.dialogFormVisible = false
                  this.$message({
                    message: '修改商品成功',
                    type: 'success'
                  })
                  this.init()
                }
              })
            }
          }
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

  .head_pic {
    width: 50px;
    height: 50px;
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
