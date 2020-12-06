import Axios from 'axios'

export default {
    name: "List",
    data() {
        return {
            groupList: {},
            questionListLoad: true,
            questionList: []
        }
    },
    methods: {
        fetchQuestionList() {

            Axios.get('/apis/questions/list?u=' + this.$cookies.get('user')).then(res => {

                for (let i = 0; i < res.data.groups.length; i++) {
                    this.groupList[res.data.groups[i].id] = res.data.groups[i].name
                }

                console.log("成功拉取群列表：", this.groupList)

                this.questionList = res.data.questions
                this.questionListLoad = false

                console.log("成功拉取问答数据：", res.data.questions)

            }).catch(err => {
                console.error("获取数据失败：", err)
                this.questionListLoad = false
            })
        },

        questionText(a) {

            a = JSON.parse(a)
            let text = ""

            for (let i = 0; i < a.length; i++) {
                if (a[i].type === "img") {
                    text += "[图片]"
                    continue
                }

                text += a[i].text
            }

            return text
        },
        questionAddr(s) {
            return "/teacher/qa/q/" + s
        },
        tipText(s) {
            return {0: '未开始', 1: '答题中', 2: '已结束'}[s]
        },
        tipColor(s) {
            return {0: '#87d068', 1: '#2db7f5', 2: '#f50'}[s]
        },
        groupNameTip(s) {
            return this.groupList[s]
        }
    },
    mounted() {
        this.fetchQuestionList()
    }
}