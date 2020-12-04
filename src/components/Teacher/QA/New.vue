<template>
  <main class="wrapper">

    <a-page-header
        title="新建问答"
        sub-title="新建一个问答"
        @back="() => $router.push({path: '/teacher/qa/list'})"
    >
      <template slot="extra">
        <router-link to="/teacher/qa/list">
          <a-button type="primary">问答列表</a-button>
        </router-link>
      </template>
    </a-page-header>

    <div class="detail">

      <a-tabs default-active-key="1">
        <a-tab-pane key="1" tab="单个新建">

          <a-form-model :model="form" :label-col="{span: 4}" :wrapper-col="{span: 14}">

            <a-form-model-item label="作答群">
              <a-select v-model="form.target" mode="multiple" placeholder="请选择欲参与答题的群">
                <a-select-option v-for="g in groupList" :key="g.id" :value="g.id">
                  {{ g.name }}
                </a-select-option>
              </a-select>
            </a-form-model-item>

            <a-form-model-item label="题目">
              <a-input v-model="form.question" type="textarea"/>
            </a-form-model-item>

            <a-form-model-item label="题目图片">
              <a-upload action="/apis/upload/picture" list-type="picture-card">
                <div>
                  <a-icon type="plus"/>
                  <div class="ant-upload-text">上传图片</div>
                </div>
              </a-upload>
            </a-form-model-item>

            <a-form-model-item label="题目类型">
              <a-radio-group v-model="form.type">
                <a-radio value="0">选择题</a-radio>
                <a-radio value="1">简答题</a-radio>
                <a-radio value="2">多选题</a-radio>
              </a-radio-group>
            </a-form-model-item>

            <a-form-model-item label="选项">
              <a-button type="dashed" @click="addOptions">
                <a-icon type="plus"/>
                新增选项
              </a-button>
              <a-button type="dashed" @click="removeOptions">
                <a-icon type="plus"/>
                删除选项
              </a-button>
            </a-form-model-item>

            <a-form-model-item
                v-for="(opt, i) in form.options"
                :label="opt.type"
                :key="opt.type"
            >
              <a-input v-model="form.options[i].body" placeholder="请输入选项答案"/>
            </a-form-model-item>

            <a-form-model-item label="答案">

              <a-select v-model="form.key" default-value="A">
                <a-select-option
                    v-for="opt in form.options"
                    :value="opt.type"
                    :key="opt.type"
                >
                  {{ opt.type }}
                </a-select-option>
              </a-select>

            </a-form-model-item>

            <a-form-model-item label="分享至问题市场">
              <a-switch v-model="form.market"/>
            </a-form-model-item>

            <a-form-model-item :wrapper-col="{ span: 14, offset: 4 }">
              <a-button type="primary" @click="onSubmit">
                创建新题目
              </a-button>
            </a-form-model-item>
          </a-form-model>

        </a-tab-pane>

        <a-tab-pane key="2" tab="批量新建">

          <div class="upload">
            <a-upload-dragger
                accept=".docx"
                action="/apis/upload/docx"
                @change="uploadDocx"
            >
              <p class="ant-upload-drag-icon">
                <a-icon type="inbox"/>
              </p>
              <p class="ant-upload-text">
                点击或拖拽文件到这里上传
              </p>
              <p class="ant-upload-hint">
                仅支持单个（.docx）文件上传
              </p>
            </a-upload-dragger>
          </div>

        </a-tab-pane>

      </a-tabs>

    </div>

  </main>
</template>


<script>
import Axios from 'axios'

export default {
  name: "New",
  data() {
    return {
      groupList: [],
      form: {
        type: 0,
        question: '',
        target: [],
        options: [{type: 'A', body: ''}, {type: 'B', body: ''}],
        key: '',
        market: false
      },

      abc: ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V',
        'W', 'X', 'Y', 'Z'],
    }
  },
  methods: {
    uploadDocx(info) {
      console.log(info)
    },

    addOptions() {
      this.form.options.push({
        type: this.abc[this.form.options.length],
        body: ''
      });
    },
    removeOptions() {
      this.form.options.pop()
    },
    onSubmit() {
      console.log(this.form)
      this.$notification.success({message: '题目创建成功', description: ''})
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

</style>