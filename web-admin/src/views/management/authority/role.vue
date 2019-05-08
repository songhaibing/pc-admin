<template >
    <div style="display: flex">
      <div class="left-main">
          <div class="boxLeftTop">
            <span class="menu_title">系统目录</span>
          </div>
          <el-tree  class="single-content" :data="data" :props="defaultProps" @node-click="handleNodeClick"></el-tree>
      </div>
      <div style="padding:30px;width: 100%;margin-left: 200px">
        <el-card class="box-card">
          <div slot="header" class="clearfix">
            <i class="el-icon-menu"></i>
            <span>角色列表</span>
            <el-button style="float: right;padding: 6px;margin-right: 6px" type="primary" icon="el-icon-plus"
                       @click="addButton">添加
            </el-button>
          </div>
        <el-table
          :data="tableData"
          style="width: 100%">
          <el-table-column
            label="日期"
            width="180">
            <template slot-scope="scope">
              <i class="el-icon-time"></i>
              <span style="margin-left: 10px">{{ scope.row.date }}</span>
            </template>
          </el-table-column>
          <el-table-column
            label="姓名"
            width="180">
            <template slot-scope="scope">
              <el-popover trigger="hover" placement="top">
                <p>姓名: {{ scope.row.name }}</p>
                <p>住址: {{ scope.row.address }}</p>
                <div slot="reference" class="name-wrapper">
                  <el-tag size="medium">{{ scope.row.name }}</el-tag>
                </div>
              </el-popover>
            </template>
          </el-table-column>
          <el-table-column label="操作">
            <template slot-scope="scope">
              <el-button
                size="mini"
                @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
              <el-button
                size="mini"
                type="danger"
                @click="handleDelete(scope.$index, scope.row)">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
          <div class="block">
            <el-pagination
              background
              @size-change="handleSizeChange"
              @current-change="handleCurrentChange"
              :current-page.sync="currentPage"
              :page-sizes="[10, 20, 30]"
              :page-size=size
              style="float: right;margin: 10px 0"
              layout="sizes, prev, pager, next"
              :total=total>
            </el-pagination>
          </div>
        </el-card>
      </div>
    </div>
</template>

<script>
    export default {
        name: "role",
      data(){
          return{
            size:10,
            currentPage:1,
            total:0,
            data: [],
            defaultProps: {
              children: 'children',
              label: 'name'
            },
            tableData: [{
              date: '2016-05-02',
              name: '王小虎',
              address: '上海市普陀区金沙江路 1518 弄'
            }, {
              date: '2016-05-04',
              name: '王小虎',
              address: '上海市普陀区金沙江路 1517 弄'
            }, {
              date: '2016-05-01',
              name: '王小虎',
              address: '上海市普陀区金沙江路 1519 弄'
            }, {
              date: '2016-05-03',
              name: '王小虎',
              address: '上海市普陀区金沙江路 1516 弄'
            }]
          }
      },
      methods:{
        handleNodeClick(data){
          console.log(data)
        },
        handleEdit(index, row) {
          console.log(index, row);
        },
        handleDelete(index, row) {
          console.log(index, row);
        }
      },
      created() {
          this.$_HTTP.get(this.$_API.deptTree,{},res=>{
            this.data=res
            console.log(res)
          })
      }
    }
</script>

<style scoped lang="scss">
  .left-main{
    position: fixed;
    height: 100%;
    width: 200px;
    border-right: 1px solid #e0e1e3;
    .boxLeftTop{
      .menu_title{
        padding-left: 16px;
        background-color: #f8f8f8;
        font-size: 16px;
        line-height: 55px;
      }
    }
    .single-content{
      cursor: pointer;
      padding: 10px 0 0 16px;
      .title{
        font-size: 12px;
        font-family: Verdana, Arial, Helvetica, AppleGothic, sans-serif;
      }
    }

  }

</style>
