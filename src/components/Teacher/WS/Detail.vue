<template>
  <main class="wrapper">

    <a-page-header
        title="词云详情"
        sub-title="实时统计一段时间内词汇频次"
        @back="() => $router.push({path: '/teacher/ws/list'})"
    >
    </a-page-header>

    <a-button
        type="danger"
        @click="deleteData"
    >
      清除数据
    </a-button>
    <div id="container"></div>

  </main>
</template>

<script src="./Detail.js"></script>

<style scoped>
#container {
  margin: 16px 0;
}
</style>