<style lang="scss" scoped>
  * {
    margin: 0;
    padding: 0;
  }

  li {
    list-style: none;
  }
  .iconfont {
    font-family: "iconfont" !important;
    font-size: 16px;
    font-style: normal;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
  }

  .icon-shangchuan:before {
    content: "\e632";
  }


  .iconfont {
    font-family: "iconfont";
    font-size: 18px;
    font-style: normal;
    -webkit-font-smoothing: antialiased;
    -webkit-text-stroke-width: 0.2px;
    -moz-osx-font-smoothing: grayscale;
    padding-left: 20px
  }

  .uploadBox {
    width: 400px;
    border: 1px solid #ccc;
    margin: 60px auto;
  }

  .fileBox,
  .fileInfo {
    margin: 16px;
    height: 60px;
    line-height: 60px;
    border: 1px solid #ccc;
    padding-left: 16px;
    font-size: 16px;
  }

  .inputfile {
    width: 0.1px;
    height: 0.1px;
    opacity: 0;
    overflow: hidden;
    position: absolute;
    z-index: -1;
  }

  /*E + F 毗邻元素选择器，匹配所有紧随E元素之后的同级元素F*/

  .inputfile+label {
    color: #3e97df;
    display: inline-block;
  }

  .inputfile:focus+label,
  .inputfile+label:hover {
    color: #0c89f0;
  }

  h3 {
    padding: 10px 0 0 16px;
    font-weight: normal;
    font-size: 18px;
    color: #666;
  }

  .filePart {
    line-height: 30px;
    overflow: hidden;
    float: left;
    text-overflow: ellipsis;
    white-space: nowrap;
    font-size: 12px;
    height: 30px;
  }

  .fileStatus {
    overflow: hidden;
    float: left;
    height: 20px;
    font-size: 10px;
    line-height: 20px;
  }

  .ml10 {
    margin-left: 10px;
  }

  .fileName {
    width: 200px;
  }

  .fileSize {
    width: 120px;
    text-align: center;
  }

  .uploadFail {
    color: #ff0800d3;
  }

  .uploadSuccess {
    color: #2c832c;
  }

  /*对应CSS*/

  .progress {
    position: relative;
    width: 80%;
    height: 8px;
    border: 1px solid #ccc;
    border-radius: 5px;
    overflow: hidden;
    /*注意这里*/
    box-shadow: 0 0 1px 0px #ddd inset;
  }

  .progress span {
    position: absolute;
    display: inline-block;
    width: 10%;
    height: 100%;
    background-color: #3e97df;
  }
</style>
<template>
  <div id="app" class="m-5">
    <div class="uploadBox">
      <h3>上传文件</h3>
      <div class="fileBox">
        <input type="file" id="myFile" class="inputfile" @change="uploadSub($event)">
        <label for="myFile">
          <i class="el-icon-upload el-icon--right"></i>
          点击上传本地文件
        </label>
      </div>
      <ul class="files">
        <li v-for="(file,index) in files">
          <div class="fileInfo">
            <div class="fileName filePart">
              {{ file.name }}
            </div>
            <div class="fileSize filePart ml10">
              {{file.size}}
            </div>
            <!--进度条-->
            <div class="progress">
              <!--<span :style="{width:file.uploadPercentage,backgroundColor:file.uploadStatus==1 ||file.uploadStatus==2?'':'red'}"></span>-->
              <span :style="{width:'100%',backgroundColor:file.uploadStatus==1 ||file.uploadStatus==2?'':'red'}"></span>
            </div>
            <div class="fileStatus">
              <span v-if="file.uploadStatus == -1" class="uploadFail">出错啦，请重新上传或者删除</span>
              <span v-if="file.uploadStatus == 2" class="uploadSuccess"> 已上传</span>
              <span v-if="file.uploadStatus == 1" class="uploadSuccess"> 上传中...</span>
              <span v-if="file.uploadStatus == -2" class="uploadFail">出错啦，文件类型不符合要求</span>
              <span v-if="file.uploadStatus == -3" class="uploadFail">出错啦，文件大小超出限制</span>
            </div>
          </div>
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
  import axios from 'axios'
  export default {
    name:'importForm',
    data() {
      return{
        files: [],
        uploadSuccess: 0
      }
    },
    props:{
      importApi: {
        type: String,
        required: true
      },
    },
    methods: {
      uploadSub(e) {
        //获取选定的文件
        let tFiles = e.target.files;
        let len = tFiles.length;
        for (let i = 0; i < len; i++) {
          //开始上传每一个文件
          const item = {
            name: tFiles[i].name,
            uploadPercentage: 1,
            size: this.formatFileSize(tFiles[i].size, 0),
            uploadStatus: 0
          }
          console.log(item)
          this.files.push(item);
          //开始上传文件 新建一个formData
          let param = new FormData();
          param.append("name", "table");
          //通过append向form对象添加数据
          param.append("importInfo", tFiles[i]);
          //FormData私有类对象，访问不到，可以通过get判断值是否传进去
          console.log(param.get("file"));
          //判断大小
          if (!this.checkFileSize(tFiles[i].size)) {
            item.uploadStatus = -3;
            return false;
          }
          if (!this.checkFileType(tFiles[i].name.split('.')[1])) {
            item.uploadStatus = -2;
            return false;
          }
          //通过axios上传文件
          //配置
          const token = localStorage.getItem('token')
          let config = {
            //添加请求头
            headers: {
              "Content-Type": "multipart/form-data",
              'Authorization':`Bearer ${token}`
            },
            //添加上传进度监听事件
            // onUploadProgress: e => {
            //   const completeProgress = ((e.loaded / e.total * 100) | 0) + "%";
            //   console.log('files',this.files)
            //   item.uploadPercentage = completeProgress;
            // }
          };
          axios.post('http://106.75.178.9:80/smartcard/'+this.importApi, param, config).then(response=>{
              console.log('res',response);
              if(response.data.code===1){
                this.$emit('export',false)
                this.$message({
                  type: 'success',
                  message: '导入成功!'
                })
                item.uploadStatus = 2;
              }else {
                this.$message({
                  type: 'error',
                  message: '导入失败请重试!'
                })
                item.uploadStatus = -1;
              }
            }).catch(error=> {
            this.$message({
              type: 'error',
              message: '导入失败请重试!'
            })
            item.uploadStatus = -1;
          });
        }
      },
      formatFileSize: function (fileSize, idx) {
        const units = ["B", "KB", "MB", "GB"];
        idx = idx || 0;
        if (fileSize < 1024 || idx === units.length - 1) {
          return fileSize.toFixed(1) +
            units[idx];
        }
        return this.formatFileSize(fileSize / 1024, ++idx);
      },
      checkFileType: function (fileType) {
        const acceptTypes = ['xlsx','xls'];
        for (let i = 0; i < acceptTypes.length; i++) {
          if (fileType === acceptTypes[i]) {
            return true;
          }
        }
        return false;
      },
      checkFileSize: function (fileSize) {
        //2M
        const MAX_SIZE = 2 * 1024 * 1024;
        if (fileSize > MAX_SIZE) {
          return false;
        }
        return true;
      }
    }
  }

</script>

