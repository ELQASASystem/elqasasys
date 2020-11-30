<template>
  <main class="wrapper">

    <a-page-header
        title="词云列表"
        sub-title="选择您欲使用词云的群"
        @back="() => $router.push({path: '/home'})"
    >
    </a-page-header>

    <div class="list">
      <router-link
          v-for="g in groupList"
          :key="g.id"
          :to="'/teacher/ws/detail/'+g.id"
          class="card"
      >
        <a-card hoverable>
          {{ g.name }}
        </a-card>
      </router-link>
    </div>
  </main>
</template>

<script>
import Axios from 'axios'

export default {
  name: "WSList",
  data() {
    return {
      groupList: [],
      listLoad: true
    }
  },
  mounted() {
    Axios.get('/apis/group/list').then(res => {
      this.groupList = res.data
    }).catch(err => {
      console.error('获取群列表错误：', err)
    })
  }
}
</script>

<style scoped>
.list {
  padding: 0 24px;
}

.card {
  display: block;
  margin: 8px 0;
  width: 100%;
}
</style>