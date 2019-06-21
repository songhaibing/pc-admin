<template>
  <div style="padding: 20px">
    <div style="display: flex;justify-content: space-between;margin-left: 10px">
      <div style="display: flex;flex-direction: column;">
        <div style="display: flex;align-items: center">
          <div>账户归属</div>
          <div >
            <select-tree width="300" style="width: 300px;margin-left: 20px;"
                         v-model="selected"
                         :options="selectedOptions"
                         :props="selectedProps" @selected="selectedDept"/>
          </div>
        </div>
        <div style="margin-top: 20px">
          <span>查询日期</span>
          <el-date-picker
            style="margin-left: 20px"
            type="daterange"
            value-format="timestamp"
            v-model="queryDate"
            align="right"
            unlink-panels
            range-separator="-"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
          />
          <el-input v-model="queryName" placeholder="请输入设备ID,设备名称等进行查询" style="width: 300px;margin-left: 20px"></el-input>
          <el-button
            type="success"
            style="margin-left: 10px"
            @click="query"
          >查询
          </el-button>
        </div>
      </div>
      <div style="margin-top: 120px">
        <el-button
          style="float: right;margin-right: 6px"
          type="primary"
          icon="el-icon-plus"
          @click="addButton"
          v-if="$_Authorities.indexOf('添加设备')!==-1"
        >添加
        </el-button>
      </div>
    </div>
    <el-card class="box-card" style="margin-top: 20px">
      <el-table
        v-loading="loading"
        :data="tableData"
        style="width: 100%"
      >
        <el-table-column align="center" label="序号" type="index"/>
        <el-table-column align="center" prop="deviceId" label="设备ID"/>
        <el-table-column align="center" prop="realname" label="外观图">
          <template scope="scope">
            <img
              v-if="scope.row.img"
              :src="'http://106.75.178.9:80/resource/'+scope.row.img"
              class="head_pic"
            >
            <img v-else src="@/assets/other/caomei.jpg" class="head_pic">
          </template>
        </el-table-column>
        <el-table-column align="center" prop="name" label="设备名称"/>
        <el-table-column align="center" prop="address" label="设备位置"/>
        <el-table-column align="center"  label="归属单位">
          <template slot-scope="scope" v-if="scope.row.dept">{{scope.row.dept.name}}</template>
        </el-table-column>
        <el-table-column align="center" prop="usingDate" label="启用时间"/>
        <el-table-column align="center" label="设备状态">
          <template slot-scope="scope">{{ statusCode[scope.row.state] }}</template>
        </el-table-column>
        <el-table-column align="center" label="操作" width="150">
          <template slot-scope="scope">
            <el-button size="mini" type="text"   v-if="$_Authorities.indexOf('编辑设备')!==-1" @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
            <el-button size="mini" type="text">报修</el-button>
            <el-button size="mini" type="text"  v-if="$_Authorities.indexOf('删除设备')!==-1" @click="deleteDevice(scope.$index, scope.row)">删除</el-button>
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
    <el-dialog :title="titleTree" width="600px" :visible.sync="dialogUnitTree">
      <el-input
        placeholder="输入关键字进行过滤"
        v-model="filterTextUnit">
      </el-input>
      <el-tree
        class="filter-tree"
        :data="unitTree"
        :props="defaultProps"
        :filter-node-method="filterNodeUnit"
        @node-click="handleNodeClickUnit"
        ref="treeUnit">
      </el-tree>
    </el-dialog>
    <el-dialog :title="title" width="600px" :visible.sync="dialogFormVisible">
      <el-form ref="form" :model="form" status-icon :rules="rules" label-width="100px" class="demo-ruleForm">
        <el-form-item label="外观图" :label-width="formLabelWidth">
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
        <el-form-item label="设备ID" :label-width="formLabelWidth" prop="id">
          <el-input v-model="form.id" autocomplete="off"/>
        </el-form-item>
        <el-form-item label="设备名称" :label-width="formLabelWidth" prop="name">
          <el-input v-model="form.name" autocomplete="off"/>
        </el-form-item>
        <el-form-item label="归属单位"  :label-width="formLabelWidth"  prop="unit">
          <el-input ref="inputUnit" v-model="form.unit" readonly="readonly" placeholder="请选择所属单位" autocomplete="off" @focus="clickUnit"/>
        </el-form-item>
        <el-form-item label="设备位置" :label-width="formLabelWidth" prop="address">
          <el-select v-model="form.valueAddress" placeholder="请选择商户" style="width: 100%">
            <el-option
              v-for="item in optionsAddress"
              :key="item.id"
              :label="item.name"
              :value="item.id">
            </el-option>
          </el-select>
          <el-input v-model="form.address" autocomplete="off"  placeholder="请输入具体位置，如一号窗口"/>
        </el-form-item>
        <el-form-item label="启用时间" :label-width="formLabelWidth" prop="time">
          <el-date-picker
            style="width: 100%"
            v-model="form.time"
            value-format="yyyy-MM-dd"
            type="date"
            placeholder="请选择启用时间">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="管理密码" :label-width="formLabelWidth" prop="pw">
          <el-input v-model="form.pw" type="text" onfocus="this.type='password'"   autocomplete="off"/>
        </el-form-item>
        <el-form-item label="设备状态" :label-width="formLabelWidth" prop="status">
          <el-select v-model="form.status" placeholder="请选择" style="width: 100%">
            <el-option
              v-for="item in options"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item class="dialog-footer">
          <el-button @click="dialogFormVisible = false">取 消</el-button>
          <el-tooltip class="item" effect="dark" content="重置密码为000000" placement="top">
            <el-button type="primary" @click="resetPassword">重置密码</el-button>
          </el-tooltip>
          <el-button type="primary" @click="addMerchant('form')">添加</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
  </div>
</template>

<script>
  import mixins from '@/mixins/user'
  import statusCode from '@/libs/statusCode'
  import SelectTree from '@/components/widget/SelectTree.vue';
  export default {
    components: {
      SelectTree,
    },
    mixins: [mixins],
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
        queryName:'',
        queryDate:'',
        // 默认选中值
        selected: Number(localStorage.getItem('deptId')),
        // 数据默认字段
        selectedProps: {
          value: 'id',          // 唯一标识
          label: 'name',       // 标签显示
          children: 'children', // 子级
        },
        // 数据列表
        selectedOptions: JSON.parse(localStorage.getItem('current')),
        startTime:0,
        endTime:0,
        deptId:localStorage.getItem('deptId'),
        valueAddress:'',
        filterTextUnit:'',
        filterText: '',
        titleTree:'请选择分类',
        unitTree: JSON.parse(localStorage.getItem('current')),
        optionsAddress: [],
        defaultProps: {
          children: 'children',
          label: 'name'
        },
        dialogUnitTree:false,
        statusCode:statusCode,
        imageUrl: '',
        valueInput:'',
        base64: '',
        unitId:'',
        deviceId:'',
        data:[],
        avatar: require('@/assets/other/caomei.jpg'),
        token: localStorage.getItem('token'),
        formLabelWidth: '100px',
        tableData: [],
        dialogFormVisible: false,
        loading: true,
        title: '添加设备',
        currentPage: 1, // 当前多少页
        size: 10, // 每页多少条数据
        total: 0, // 总共多少数据
        value: '',
        options: [{
          value: '0',
          label: '使用中'
        }, {
          value: '1',
          label: '未使用'
        }, {
          value: '2',
          label: '报修中'
        }, {
          value: '3',
          label: '报废'
        }],
        form: {
          valueAddress:'',
          unit:'',
          id: '',
          name: '',
          address: '',
          time: '',
          pw: '',
          status: ''
        },
        rules: {
          id: [
            {required: true, message: '请输入设备id', trigger: 'blur'}
          ],
          unit: [
            {required: true, message: '请选择所属单位', trigger: 'blur'}
          ],
          name: [
            {required: true, message: '请输入设备名称', trigger: 'blur'}
          ],
        }
      }
    },
    created() {
      // this.$_HTTP.get(this.$_API.deptTree, {}, res => {
      //   this.unitTree=res
      // })
      this.init()
      this.$_HTTP.get(this.$_API.businessAll, {}, res => {
        this.optionsAddress=res
      })
    },
    methods: {
      clickUnit(){
        this.dialogUnitTree=true
        setTimeout(()=>{
          this.$refs.inputUnit.blur()
        },500)
      },
      //重置密码
      resetPassword(){
        this.form.pw='000000'
      },
      query(){
        this.startTime=this.queryDate?this.queryDate[0]:0
        this.endTime=this.queryDate?this.queryDate[1]:0
        this.init()
      },
      // 初始化分页
      init() {
        this.loading = true
        this.$_HTTP.get(this.$_API.airportDeviceList, {startTime:this.startTime,
          endTime:this.endTime, size: this.size,name:this.queryName,
          current: this.currentPage, deptId: this.deptId}, res => {
          this.tableData = res.records
          this.total = res.total
          this.loading = false
        })
      },
      filterNodeUnit(value, data) {
        if (!value) return true;
        return data.name.indexOf(value) !== -1;
      },
      handleNodeClickUnit(data) {
        this.form.unit=data.name
        this.unitId=data.id
        this.dialogUnitTree=false
      },
      handleEdit(index,row){
        this.deviceId = row.id
        if (row.img) {
          this.imageUrl = 'http://106.75.178.9:80/resource/' + row.img
        } else {
          this.imageUrl = this.avatar
        }
        this.title = '编辑设备'
        this.dialogFormVisible = true
        this.form.unit=row.dept?row.dept.name:''
        this.form.valueAddress=row.business.id
        this.form.id=row.deviceId
        this.form.name = row.name
        this.unitId=row.dept?row.dept.id:''
        this.form.address = row.address
        this.form.time = row.usingDate
        this.form.status = row.state
        this.form.pw = row.password
      },
      deleteDevice(index,row){
        this.$confirm('此操作将永久删除该设备, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.$_HTTP.delete(this.$_API.delAirportDevice + row.id, {}, res => {
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
      handleAvatarSuccess(res, file) {
        this.imageUrl = URL.createObjectURL(file.raw)
        this.getBase64(file.raw).then(res => {
          this.base64 = res
        })
      },
      isImageFormat(file) {
        return file.type === 'image/jpeg' || file.type === 'image/png'
      },
      beforeAvatarUpload(file) {
        const isImageFormat = this.isImageFormat(file)
        const isLt2M = file.size / 1024 / 1024 < 2

        if (!isImageFormat) {
          this.$message.error('上传头像图片只能是 JPG和PNG 格式!')
        }
        if (!isImageFormat) {
          this.$message.error('上传头像图片大小不能超过 2MB!')
        }
        return isImageFormat && isLt2M
      },
      selectedDept(val){
        this.deptId=val
        this.init()
      },
      addButton() {
        this.form.name = ''
        this.form.id=''
        this.form.address = ''
        this.form.time = ''
        this.form.pw = ''
        this.imageUrl = ''
        this.form.status = ''
        this.title = '添加设备'
        this.dialogFormVisible = true
      },
      addMerchant(form) {
        this.$refs[form].validate((valid) => {
          if (valid) {
            const params = {
              name: this.form.name,
              address: this.form.address,
              deptId: this.unitId,
              usingDate: this.form.time,
              password:this.form.pw,
              img:this.base64,
              businessId:this.form.valueAddress,
              deviceId:this.form.id,
              state:this.form.status
            }
            if (this.title === '添加设备') {
              this.$_HTTP.post(this.$_API.addAirportDevice, params, res => {
                if (res.code === 1) {
                  this.dialogFormVisible = false
                  this.$message({
                    message: '添加设备成功',
                    type: 'success'
                  })
                  this.init()
                }
              })
            } else {
              this.$_HTTP.put(this.$_API.editAirportDevice + this.deviceId, params, res => {
                if (res.code === 1) {
                  this.dialogFormVisible = false
                  this.$message({
                    message: '修改设备成功',
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

