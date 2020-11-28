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

          <a-form-model :model="form" :label-col="labelCol" :wrapper-col="wrapperCol">

            <a-form-model-item label="作答群">
              <a-select mode="multiple" placeholder="请选择欲参与答题的群">
                <a-select-option
                    v-for="g in groupList"
                    :key="g.id"
                    :value="g.id"
                >
                  {{ g.name }}
                </a-select-option>
              </a-select>
            </a-form-model-item>

            <a-form-model-item label="题目">
              <a-input v-model="form.desc" type="textarea"/>
            </a-form-model-item>

            <a-form-model-item label="题目图片">
              <a-upload
                  action="/apis/upload/picture"
                  list-type="picture-card"
              >
                <div>
                  <a-icon type="plus"/>
                  <div class="ant-upload-text">
                    上传图片
                  </div>
                </div>
              </a-upload>

            </a-form-model-item>

            <a-form-model-item label="题目类型">
              <a-radio-group v-model="form.resource">
                <a-radio value="1">选择题</a-radio>
                <a-radio value="2">简答题</a-radio>
                <a-radio value="3">多选题</a-radio>
              </a-radio-group>
            </a-form-model-item>

            <a-form-model-item label="选项">
              <a-button type="dashed" @click="addDomain">
                <a-icon type="plus"/>
                新增选项
              </a-button>
              <a-button type="dashed" @click="removeOp">
                <a-icon type="plus"/>
                删除选项
              </a-button>
            </a-form-model-item>
            <a-form-model-item
                v-for="(domain, i) in dynamicValidateForm.domains"
                :label="abc[i]"
                :key="domain.key"
            >
              <a-input placeholder="请输入选项答案"/>
            </a-form-model-item>

            <a-form-model-item label="答案">

              <a-select default-value="A">
                <a-select-option
                    v-for="(opt, i) in dynamicValidateForm.domains"
                    :value="abc[i]"
                    :key="abc[i]"
                >
                  {{ abc[i] }}
                </a-select-option>
              </a-select>

            </a-form-model-item>

            <a-form-model-item label="分享至问题市场">
              <a-switch v-model="form.delivery"/>
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
      labelCol: {span: 4},
      wrapperCol: {span: 14},
      groupList: [],
      form: {
        name: '',
        region: undefined,
        date1: undefined,
        delivery: false,
        type: [],
        resource: '',
        desc: '',
      },


      abc: ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V',
        'W', 'X', 'Y', 'Z'],

      formItemLayout: {
        labelCol: {
          xs: {span: 24},
          sm: {span: 4},
        },
        wrapperCol: {
          xs: {span: 24},
          sm: {span: 20},
        },
      },
      formItemLayoutWithOutLabel: {
        wrapperCol: {
          xs: {span: 24, offset: 0},
          sm: {span: 20, offset: 4},
        },
      },
      dynamicValidateForm: {
        domains: [{
          value: '', key: Date.now(),
        }, {
          value: '', key: Date.now(),
        }],
      },

    }
  },
  methods: {
    uploadDocx(info) {
      console.log(info)
    },

    addDomain() {
      this.dynamicValidateForm.domains.push({
        value: '',
        key: Date.now(),
      });
    },
    removeOp() {
      this.dynamicValidateForm.domains.pop()
    },
    onSubmit(e) {
      console.log(e)
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