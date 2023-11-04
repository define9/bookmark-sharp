<template>
  <a-spin :size="32" :loading="loading.spin" :tip="loading.tip">
    <a-row>
      <a-col>
        <a-upload draggable :show-file-list="false" :on-before-upload="beforeUpload" />
      </a-col>
    </a-row>
  </a-spin>
  <a-row>
    <a-col>
      <a-alert>选择您的书签文件，重复上传则覆盖，<a href="javascript:void(0);" @click="jumpGithub">查看案例</a></a-alert>
    </a-col>
  </a-row>
  <a-row v-if="file.valid">
    <a-alert type="success">已检测到您的书签文件：{{ file.fileInfo.name }}</a-alert>
  </a-row>
</template>
  
<script>
import { preprocess } from "../../common/search";
import { DBKey } from "../../common";

export default {
  data() {
    return {
      loading: {
        spin: false,
        tip: '',
      },
      file: {
        content: '',
        fileInfo: {},
        valid: false,
      },
    };
  },
  methods: {
    beforeUpload(f) {
      this.loading.spin = true
      this.loading.tip = '正在读取文件'

      // 1. 读取文件
      const { name, path, size, type, lastModified } = f;
      this.file.fileInfo = { name, path, size, type, lastModified }
      console.log("fileInfo:", this.file);
      const reader = new FileReader();
      reader.onload = (e) => {
        this.file.content = JSON.parse(e.target.result);

        this.contentHandle()
        this.loading.spin = false
      };

      reader.readAsText(f);
    },
    contentHandle() {
      // 2. 预处理文件
      this.loading.tip = '数据正在预处理'
      let bookmark_bar = this.file.content.roots?.bookmark_bar
      console.log("bookmark_bar:", bookmark_bar);
      let ans = []
      this.folderHandle(ans, bookmark_bar, '')
      let processedAns = preprocess(ans)

      // 3. 存入DB
      this.loading.tip = '正在写入数据库'
      this.file.valid = true
      rubick.db.remove(DBKey.origin)
      rubick.db.remove(DBKey.flattening)
      rubick.db.remove(DBKey.processed)
      console.log("file::", this.file)
      rubick.db.bulkDocs([
        {
          _id: DBKey.origin,
          data: JSON.stringify(this.file),
        },
        {
          _id: DBKey.flattening,
          data: ans,
        },
        {
          _id: DBKey.processed,
          data: processedAns,
        }
      ])
    },
    folderHandle(ans, folder, path) {
      folder.children?.forEach(el => {
        if (el.type == 'folder') {
          this.folderHandle(ans, el, path ? path + ' - ' + el.name : el.name)
        } else if (el.type == 'url') {
          ans.push({
            title: el.name || '',
            description: (path ? '「' + path + '」' : '') + el.url,
            url: el.url,
          })
        }
      });
    },
    jumpGithub() {
      rubick.shellOpenExternal('https://github.com/define9/bookmark-sharp')
    },
  },
  mounted() {
    let file = rubick.db.get(DBKey.origin)?.data
    if (file) {
      this.file = JSON.parse(file)
      console.log(this.file)
    }
  },
}
</script>
  
  <!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
* {
  overflow: hidden;
}

.arco-spin {
  display: block;
  margin: 10px 0;
}
</style>
  