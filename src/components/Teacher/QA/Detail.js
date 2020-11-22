import Axios from 'axios'
import {Chart} from '@antv/g2'

export default {
    name: "Detail",
    data() {
        return {
            Question: { // 题目信息
                loading: true, // 加载状态
                id: this.$route.params.id, // ID
                object: {}, // 对象
                type: '', // 类型
                text: [], // 题干
                optionsDisplay: true, // 是否显示选项
                options: [], // 选项[仅选择题]
                key: '' // 答案
            },
            groupName: '', // 群名称
            groupMemList: [], // 群成员

            Status: { // 状态信息
                Tab: {
                    0: {label: '等待发布答题', color: 'green', badge: 'success'},
                    1: {label: '正在答题中', color: 'blue', badge: 'processing'},
                    2: {label: '答题已结束', color: 'red', badge: 'error'}
                },

                status: 0, // 状态值
                answererCount: 0, // 答题人数
                sliderValue: 0, // 状态条值
                sliderLabel: {0: '准备作答', 1: '允许作答', 2: '停止作答'}, // 说明标签

            },
            Statistics: {
                rightRate: 0, // 正确率
                rightCount: 0, // 正确人数
                wrongRate: 0, // 错误率
                wrongCount: 0, // 错误人数
                rightStus: [], // 回答正确的学生
                wrongStus: {}, // 回答错误的学生
                wrongList: [{type: '暂无数据', value: 0}] // 回答错误有序列表
            },

            CHARTData: {}
        }
    },
    methods: {
        fetchData() { // API 获取数据

            Axios.get('/apis/questions/question/' + this.Question.id).then(res => {

                console.log('成功获取问答数据：', res.data)

                let list = {}
                for (let i = 0; i < res.data.mems.length; i++) {
                    list[res.data.mems[i].id] = res.data.mems[i]
                }

                console.log("群成员数据：", list)
                this.groupMemList = list


                if (res.data.answer === null) {
                    console.log('没有作答')
                    res.data.answer = []
                }
                this.Question.object = res.data

                try {
                    this.displayQuestion()
                    console.log('数据初始化成功')
                } catch (e) {
                    console.error('数据初始化失败：' + e)
                }

                this.Question.loading = false

            }).catch(err => {
                console.error('获取问答数据失败：' + err)
                this.Question.loading = false
            })

            this.openws()
        },
        openws() { // 开启 WS 连接

            let ws = new WebSocket(`wss://${location.host}/question`)
            ws.onopen = () => {
                ws.send(String(this.Question.id))
                setInterval(() => {
                    ws.send('keep heart');
                    console.log('WS保持连接');
                }, 50000);
            }
            ws.onmessage = msg => {

                const data = JSON.parse(msg.data)

                console.log('服务器推送问答数据：')
                console.log(data)

                if (data.answer === null) {
                    console.log('没有作答')
                    data.answer = []
                }
                this.Question.object = data

                try {
                    this.uploadQuestion()
                    console.log('数据更新成功')
                } catch (e) {
                    console.error('数据更新失败：' + e)
                }

            }
            ws.onclose = () => {
                console.error('WS连接已关闭')
            }

        },

        displayQuestion() { // 显示问答数据

            { // 题目
                this.Question.type = {0: '选择题', 1: '简答题'}[this.Question.object.type] // 类型
                this.groupName = this.Question.object.group_name // 群名称

                this.Question.text = JSON.parse(this.Question.object.question) // 题目
                this.Question.key = this.Question.object.key // 选项

                if (this.Question.object.type === 1) {
                    this.Question.optionsDisplay = false
                } else {
                    this.Question.options = JSON.parse(this.Question.object.options)
                }
            }

            this.updateHeader()
            this.calc()

            { // 图表
                this.histogram(0, 'data-chart-right_count', [{
                    type: '正确人数 ' + this.Statistics.rightCount, value: this.Statistics.rightCount
                }])
                this.histogram(1, 'data-chart-wrong_count', [{
                    type: '错误人数 ' + this.Statistics.wrongCount, value: this.Statistics.wrongCount
                }])
                this.histogram(2, 'data-chart-easy_wrong', this.Statistics.wrongList)
            }

        },
        uploadQuestion() {

            this.updateHeader()
            this.calc()

            { // 图表
                this.updateHistogram(0, [{
                    type: '正确人数 ' + this.Statistics.rightCount, value: this.Statistics.rightCount
                }])
                this.updateHistogram(1, [{
                    type: '错误人数 ' + this.Statistics.wrongCount, value: this.Statistics.wrongCount
                }])
                this.updateHistogram(2, 'data-chart-easy_wrong', this.Statistics.wrongList)
            }

        },
        updateHeader() {
            { // 状态
                this.Status.status = this.Question.object.status
                this.Status.answererCount = this.Question.object.answer.length
                this.Status.sliderValue = this.Question.object.status
            }
        },

        calc() {

            const answer = this.Question.object.answer, options = this.Question.options
            let rightCount = 0, wrongCount = 0, rightStus = [], wrongStus = {}

            for (let i = 0; i < answer.length; i++) {

                if (answer[i].answer === this.Question.key) {
                    rightCount++
                    rightStus.push(answer[i].answerer_id)
                } else {
                    wrongCount++

                    // 寻找错误的选项
                    for (let ii = 0; ii < options.length; ii++) {
                        if (options[ii].type !== answer[i].answer) {
                            continue
                        }

                        let list = wrongStus[options[ii].type]
                        if (list === undefined) {
                            list = []
                        }

                        list.push(answer[i].answerer_id)
                        wrongStus[options[ii].type] = list
                    }
                }
            }

            this.Statistics.rightCount = rightCount
            this.Statistics.wrongCount = wrongCount
            this.Statistics.rightStus = rightStus
            this.Statistics.wrongStus = wrongStus

            this.Statistics.rightRate = Math.floor(rightCount / this.Status.answererCount * 100)
            this.Statistics.wrongRate = 100 - this.Statistics.rightRate


            const d = this.Statistics.wrongStus, keys = Object.keys(d)
            let res = []

            for (let i = 0; i < keys.length; i++) {
                res.push({type: keys[i], value: d[keys[i]].length})
            }

            res.sort((a, b) => {
                return a.value - b.value
            })
            res.reverse()

            try {
                res[0].type
                this.Statistics.wrongList = res
            } catch {
                this.Statistics.wrongList = [{type: '暂无数据', value: 0}]
            }
        },

        histogram(id, elm, data) {

            const chart = new Chart({
                container: elm,
                autoFit: true,
                width: 240
            })

            chart.data(data)
            chart.scale('sales', {nice: true})
            chart.interval().position('type*value')

            chart.render()
            this.CHARTData[id] = chart

        },
        updateHistogram(id, data) {
            this.CHARTData[id].changeData(data)
        },

        changeStatus() {

            const text = ['准备答题', '发布答题', '停止答题']
            const c = this.Status.sliderValue

            console.log(text[c])

            Axios.put(`/apis/questions/question/${this.Question.id}/status?c=` + c).then(() => {
                this.$notification.success({message: `成功${text[c]}`, description: ''})
            }).catch(err => {
                console.error(`${text[c]}失败：`, err)
                this.$notification.error({message: `${text[c]}失败`, description: ''})
            })

            this.$notification.info({message: `正在${text[c]}中...`, description: ''})
            this.Status.status = this.Status.sliderValue

        },
        cancelChangeStatus() {
            this.Status.sliderValue = this.Status.status
        },

        praise() {
            Axios.get(`/apis/group/${this.Question.object.target}/praise?mem=${JSON.stringify(this.Statistics.rightStus)}`).then(() => {
                this.$notification.success({message: '表扬成功', description: ''})
            }).catch(err => {
                this.$notification.success({message: '表扬失败', description: ''})
                console.error('表扬失败：' + err)
            })
        }

    },
    mounted() {
        this.fetchData()
    }
}