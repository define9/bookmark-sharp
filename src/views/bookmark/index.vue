<template>
  <div class="bookmark" ref="bookmark">
    <a-list hoverable :scrollbar="true" :max-height="listStyle.maxHeight" size="small">
      <a-list-item v-for="(bookmark, i) in interestedBookmarks" :key="i" @click="clickHandle(bookmark)">
        <a-row>
          <a-col :span="21">
            <a-row class="title">
              <a-tag color="arcoblue" :default-checked="true">
                {{ bookmark.title }}
              </a-tag>
            </a-row>
            <a-row class="desc">
              <a-typography-paragraph :ellipsis="descEllipsis">
                {{ bookmark.description }}
              </a-typography-paragraph>
            </a-row>
          </a-col>
          <a-col :span="3">
            <a-tag v-if="i == 0">Enter</a-tag>
          </a-col>
        </a-row>
      </a-list-item>
    </a-list>
  </div>
</template>

<script>
import { DBKey, Config } from "@/common";
import { Search } from "@/common/search";

export default {
  data() {
    return {
      interestedBookmarks: [],
      recentlyBookmarks: [],
      bookmarkArray: [],
      input: '',
      search: null,
      listStyle: {
        maxHeight: 240,
      },
      descEllipsis: {
        rows: 1,
      }
    }
  },
  methods: {
    markRecent(bookmark) {
      this.recentlyBookmarks = this.recentlyBookmarks?.filter(x => x.name != bookmark.name)
      this.recentlyBookmarks?.unshift(bookmark)
      if (this.recentlyBookmarks?.length > Config.MaxRecentlyRecordCount)
        this.recentlyBookmarks.pop()

      let recentDB = rubick.db.get(DBKey.recently)
      rubick.db.put({
        _id: DBKey.recently,
        data: JSON.stringify(this.recentlyBookmarks),
        _rev: recentDB?._rev,
      })
    },
    clickHandle(bookmark) {
      this.markRecent(bookmark)
      rubick.shellOpenExternal(bookmark.url)
    },
    activeFirst() {
      this.clickHandle(this.interestedBookmarks[0])
    },
    keydown(e) {
      switch (e.code) {
        case 'Enter':
          this.activeFirst()
        default:
          break;
      }
    }
  },
  mounted() {
    this.listStyle.maxHeight = this.$refs.bookmark.offsetHeight
    this.bookmarkArray = rubick.db.get(DBKey.processed)?.data
    this.search = new Search(this.bookmarkArray)

    rubick.setSubInput(({ text }) => {
      this.input = text.trim()
      if (this.input) {
        this.interestedBookmarks = this.search.search(this.input).map(x => x.item)
      } else {
        this.interestedBookmarks = this.recentlyBookmarks
      }
    }, '搜索您的书签')

    document.onkeydown = this.keydown

    let file = rubick.db.get(DBKey.origin)?.data
    if (!file) {
      rubick.showNotification('没有检测到书签，请先进入setting进行设置')
    } else {
      let recentStr = rubick.db.get(DBKey.recently)?.data
      if (recentStr)
        this.recentlyBookmarks = JSON.parse(recentStr)
      if (!this.recentlyBookmarks?.length)
        this.recentlyBookmarks = this.bookmarkArray.slice(0, 10)
      this.interestedBookmarks = this.recentlyBookmarks
    }
  },
}
</script>
  
  <!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.bookmark {
  height: 97vh;
}

.title .arco-tag {
  font-size: 18px;
}

.arco-list-item-content {
  background-color: aquamarine;
  border-radius: 5px;
}

.arco-list-item:hover {
  cursor: pointer;
}
</style>
  