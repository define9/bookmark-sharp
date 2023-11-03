<template>
  <div class="container">
    <Bookmark v-if="pageType == PageType.Bookmark"></Bookmark>
    <Setting v-if="pageType == PageType.Setting"></Setting>
    <About v-if="pageType == PageType.About"></About>

    <transition name="fade">
      <a-row v-if="pageType == PageType.None">
        <Loading class="loading"></Loading>
      </a-row>
    </transition>
  </div>
</template>

<script>
import Bookmark from './views/bookmark';
import Setting from './views/setting';
import About from './views/about';
import Loading from './components/Loading.vue';
import { PageType } from "./common";

export default {
  name: 'App',
  components: {
    Bookmark,
    Setting,
    About,
    Loading,
  },
  data() {
    return {
      PageType: PageType,
      pageType: PageType.None
    }
  },
  mounted() {
    rubick.onPluginReady(({ code, type, payload }) => {
      switch (code) {
        case 'bookmark':
          this.pageType = PageType.Bookmark
          break;
        case 'setting':
          this.pageType = PageType.Setting
          break;
        default:
          this.PageType = PageType.About
      }
    })
  }
}
</script>

<style scoped>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}

.loading {
  margin: 50px auto;
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.5s;
}

.fade-enter,
.fade-leave-to {
  opacity: 0;
}
</style>
