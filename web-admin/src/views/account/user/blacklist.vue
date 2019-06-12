<template>
    <div>
      <el-upload
        action="http://106.75.178.9:80/smartcard/smartCard/importInfo"
        list-type="picture-card"
        :on-preview="handlePictureCardPreview"
        :headers="{token}"
        :on-success="handleAvatarSuccess"
        :on-remove="handleRemove">
        <i class="el-icon-plus"></i>
      </el-upload>
      <el-dialog :visible.sync="dialogVisible">
        <img width="100%" :src="dialogImageUrl" alt="">
      </el-dialog>
    </div>
</template>

<script>
    export default {
        name: "blacklist",
      data() {
        return {
          token: localStorage.getItem('token'),
          dialogImageUrl: '',
          dialogVisible: false
        };
      },
      methods: {
        handleAvatarSuccess(res,file) {
        console.log(res,file)
        },
        handleRemove(file, fileList) {
          console.log(file, fileList);
        },
        handlePictureCardPreview(file) {
          this.dialogImageUrl = file.url;
          this.dialogVisible = true;
        }
      }
    }
</script>

<style scoped>

</style>


