<template>
  <div>
    <el-upload
      v-loading="loading"
      :before-upload="beforeUpload"
      :file-list="fileList"
      :http-request="onHttpRequest"
      :limit="1"
      :on-change="onChange"
      :on-preview="onPreview"
      :on-remove="onRemove"
      action="#"
      class="uploadImg"
      list-type="picture-card"
    >
      <i class="el-icon-plus" />
    </el-upload>
    <el-dialog
      :visible.sync="previewDialog"
      title="图片预览"
      width="50%"
    >
      <img :src="previewImgUrl" alt="" style="width: 100%">
    </el-dialog>
  </div>
</template>

<script>
import COS from 'cos-js-sdk-v5'

const cos = new COS({
  SecretId: 'AKIDT6Yptv24vdEoXFpJdqxzSsGSc7ugO624',
  SecretKey: '4ExeCh4NlEYge2NXUEl6FJJbicLrDTTS'
})

console.log(COS)

export default {
  name: 'UploadImg',
  props: {
    defaultUrl: {
      type: String,
      default: () => ''
    }
  },
  data() {
    return {
      fileList: [],
      previewDialog: false,
      previewImgUrl: '',
      loading: false
    }
  },
  watch: {
    defaultUrl() {
      this.fileList.push({ name: 'default', url: this.defaultUrl })
    }
  },
  methods: {
    onPreview(file) {
      this.previewImgUrl = file.url
      this.previewDialog = true
    },
    onRemove(file, fileList) {
      this.fileList = fileList
    },
    // 文件状态改变时的钩子，添加文件、上传成功和上传失败时都会被调用
    onChange(file, fileList) {
      this.fileList = fileList
    },
    onHttpRequest({ file }) {
      this.loading = true
      cos.putObject({
        Bucket: 'hz-33-1259696257', /* 填入您自己的存储桶，必须字段 */
        Region: 'ap-nanjing', /* 存储桶所在地域，例如ap-beijing，必须字段 */
        Key: file.name, /* 存储在桶里的对象键（例如1.jpg，a/b/test.txt），必须字段 */
        Body: file, /* 必须，上传文件对象，可以是input[type="file"]标签选择本地文件后得到的file对象 */
        onProgress: function(progressData) {
          console.log(JSON.stringify(progressData))
        }
      }, (err, data) => {
        if (err) return this.$message.error('上传失败')
        this.loading = false
        this.$emit('on-success', { imgUrl: 'https://' + data.Location })
      })
    },
    beforeUpload(file) {
      // 文件类型
      const allowTypes = ['image/jpeg', 'image/png', 'image/gif']
      const isHas = allowTypes.includes(file.type)
      if (!isHas) {
        this.$message.error(`只能上传${allowTypes.join('、')}类型文件`)
        return false
      }
      // 限制上传大小
      const maxSize = 1024 * 1024 * 5
      if (file.size > maxSize) {
        this.$message.error('上传的图片不能超过1mb')
        return false
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.uploadImg {
  width: 148px;
  height: 148px;
  overflow: hidden;
}
</style>
