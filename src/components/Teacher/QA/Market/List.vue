<template>
  <main class="wrapper">

    <a-page-header
        title="问题市场"
        sub-title="挑选您喜爱的问题并加入答题列表"
        @back="() => $router.push({path: '/teacher/qa/list'})"
    >
      <template slot="extra">
        <a-button type="primary">
          <router-link to="/teacher/qa/list">问答列表</router-link>
        </a-button>
      </template>
    </a-page-header>

    <div class="list">

      <a-radio-group
          default-value="1"
          v-model="subject"
          button-style="solid"
          @change="onSubjectChange"
      >
        <a-radio-button value="1">语文</a-radio-button>
        <a-radio-button value="2">数学</a-radio-button>
        <a-radio-button value="3">英语</a-radio-button>
        <a-radio-button value="4">物理</a-radio-button>
        <a-radio-button value="5">历史</a-radio-button>
        <a-radio-button value="6">化学</a-radio-button>
        <a-radio-button value="7">生物</a-radio-button>
        <a-radio-button value="8">地理</a-radio-button>
        <a-radio-button value="9">政治</a-radio-button>
        <a-radio-button value="10">其他</a-radio-button>
      </a-radio-group>

      <a-list item-layout="horizontal" :data-source="questionList" :loading="questionListLoad">
        <a-list-item slot="renderItem" slot-scope="item">

          <div>
            <div v-for="q in JSON.parse(item.question)" :key="q.id">
              <template v-if="q.type === 'text'">{{ q.text }}</template>
              <img v-else :src="'/assets/question/pictures/'+q.path" class="question-img" alt="问题图片"><br>
              <template>
                <a-tag
                    color="purple"
                    v-for="opt in JSON.parse(item.options)"
                    :key="opt.type"
                >
                  {{ opt.type + "：" + opt.body }}
                </a-tag>

              </template>
            </div>
          </div>
          <a-button
              @click="edit(item.id)"
              class="btn-add">添加
          </a-button>

        </a-list-item>
      </a-list>
    </div>

    <a-drawer
        title="创建新问题"
        width="480"
        :visible="editDrawer"
        @close="closeEdit"
    >
      <h3>作答群：</h3>
      <a-select
          mode="multiple"
          placeholder="请选择欲参与答题的群"
          @change="changeEdit"
          class="select"
      >
        <a-select-option
            v-for="g in groupList"
            :key="g.id"
            :value="g.id"
        >
          {{ g.name }}
        </a-select-option>
      </a-select>

      <div class="edit-btn">
        <a-button type="primary" @click="submitEdit">提交</a-button>
        <a-button @click="closeEdit">取消</a-button>
      </div>

    </a-drawer>

  </main>
</template>

<script>
import Axios from 'axios'

export default {
  name: "QAMarketList",
  data() {
    return {
      subject: 1,
      questionList: [],
      questionListLoad: true,
      groupList: [],
      editDrawer: false,
      selectedQuestion: 0,
      selectedGroup: []
    }
  },
  methods: {
    fetchMarket() {

      Axios.get(`/apis/market/${this.subject}/list`).then(res => {

        if (res.data === null) {
          throw '数据为空'
        }

        console.log('成功获取问题市场数据：', res.data)
        this.questionList = res.data

      }).catch(err => {

        console.error('获取问题市场失败：', err)
        this.$notification.error({message: '这个领域还没有人上传哦', description: ''})
        this.questionList = []

      }).finally(() => {
        this.questionListLoad = false
      })
    },
    onSubjectChange() {
      this.fetchMarket()
    },

    edit(i) {
      this.editDrawer = true
      this.selectedQuestion = i
    },
    closeEdit() {
      this.editDrawer = false
    },
    changeEdit(v) {
      this.selectedGroup = v
    },
    submitEdit() {
      for (let i = 0; i < this.selectedGroup.length; i++) {
        this.copy(this.selectedQuestion, this.selectedGroup[i])
      }
    },

    copy(i, g) {

      Axios.get(`/apis/market/${i}/copy?u=${this.$cookies.get('account')}&t=` + g).then(res => {

        if (res.message === 'no') {
          throw '系统失败'
        }

        this.$notification.success({message: '成功复制问题', description: '群号：' + g})
      }).catch(err => {
        console.error('复制问题失败：', err)
        this.$notification.error({message: '现在无法完成问题复制', description: ''})
      })
    }
  },
  mounted() {
    this.fetchMarket()

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

.question-img {
  max-width: 100%;
  max-height: 320px;
}

.btn-add {
  margin: 0 8px;
}

.select {
  width: 100%
}

.edit-btn {
  margin-top: 64px;
}

.edit-btn > button {
  margin: 0 8px;
}
</style>