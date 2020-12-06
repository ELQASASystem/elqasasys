<template>
  <main class="wrapper">

    <a-page-header
        title="问答列表"
        sub-title="存储您所有的问答数据"
        @back="() => $router.push({path: '/home'})"
    >
      <template slot="extra">
        <a-button type="primary">
          <router-link to="/teacher/qa/market/list">问题市场</router-link>
        </a-button>
        <a-button type="primary">
          <router-link to="/teacher/qa/new">新增问答</router-link>
        </a-button>
      </template>
    </a-page-header>

    <div class="list">
      <a-list item-layout="horizontal" :data-source="questionList" :loading="questionListLoad">
        <a-list-item slot="renderItem" slot-scope="item">
          <a-list-item-meta>

            <router-link slot="title" :to="questionAddr(item.id)">
              <a-tag :color="tipColor(item.status)">{{ tipText(item.status) }}</a-tag>
              <a-tag>{{ groupNameTip(item.target) }}</a-tag>
              {{ questionText(item.question) }}
            </router-link>

          </a-list-item-meta>
        </a-list-item>
      </a-list>
    </div>

  </main>
</template>

<script src="./List.js"/>

<style scoped>
.list {
  padding: 0 24px;
}
</style>
