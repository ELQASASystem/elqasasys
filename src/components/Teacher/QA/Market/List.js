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

            Axios.get(`/apis/market/${i}/copy?u=${this.$cookies.get('user')}&t=` + g).then(res => {

                if (res.message === 'no') {
                    throw '系统失败'
                }

                this.$notification.success({message: '成功复制问题', description: '群号：' + g})
                this.closeEdit()
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