<template>
  <main class="wrapper">

    <a-page-header
        title="词云详情"
        sub-title="实时统计一段时间内词汇频次"
        @back="() => $router.push({path: '/teacher/ws/list'})"
    >
    </a-page-header>

    <div id="container"></div>

  </main>
</template>

<script>
import DataSet from 'set';
import {Chart, registerShape, Util} from 'g2';

export default {
  name: "WordStatisticsDetail",
  data() {
    return {
      id: this.$route.params.id,
      words: [],
      chart: undefined
    }
  },
  methods: {
    newDv(d) {

      let dv = new DataSet.View().source(d)
      dv.transform({
        type: 'tag-cloud',
        fields: ['x', 'value'],
        font: 'Verdana',
        fontSize(d) {
          if (d.value) {
            const range = dv.range('value')
            return ((d.value - range[0]) / (range[1] - range[0])) * (80 - 24) + 24
          }
          return 0
        }
      })

      return dv.rows
    },

    init() {

      registerShape('point', 'cloud', {
        draw(cfg, container) {
          const attrs = getTextAttrs(cfg)
          const textShape = container.addShape('text', {attrs: {...attrs, x: cfg.x, y: cfg.y}})
          if (cfg.data.rotate) {
            Util.rotate(textShape, cfg.data.rotate * Math.PI / 180)
          }
          return textShape
        }
      })

      const chart = new Chart({
        container: 'container',
        autoFit: true,
        height: 480,
        padding: 0
      })
      chart.data(this.newDv([]))
      chart.tooltip({showTitle: false, showMarkers: false})
      chart.coordinate().reflect()
      chart.point()
          .position('x*y')
          .color('CornflowerBlue')
          .shape('cloud')
          .tooltip('value*category')
      chart.render()

      this.chart = chart
    },
    openWs() {

      let ws = new WebSocket(this.address() + '/stream/word_statistics')
      ws.onopen = () => {
        ws.send(this.id)
        setInterval(() => {
          ws.send('keep heart');
          console.log('WS保持连接');
        }, 50000);
      }
      ws.onmessage = msg => {

        const data = JSON.parse(msg.data)
        console.log('服务器推送数据：', data)

        for (let i = 0; i < data.length; i++) {
          this.words.push(data[i])
        }

        console.log(this.words)
        this.calc()
      }
      ws.onclose = () => {
        console.error('WS连接已关闭')
      }
    },

    calc() { // 计算所有相同的元素

      let middle = {},
          data = []

      for (let i = 0; i < this.words.length; i++) {

        if (middle[this.words[i]] === undefined) {
          try {
            middle[this.words[i]] = 1
          } catch (e) {
            console.error("没错就是我报错")
          }

          continue
        }

        middle[this.words[i]]++
      }

      const k = Object.keys(middle)
      for (let i = 0; i < k.length; i++) {
        data.push({
          x: k[i], value: middle[k[i]]
        })
      }

      this.chart.changeData(this.newDv(data))
    },

    address() {
      let p = 'wss:'
      switch (location.protocol) {
        case 'http:':
          p = 'ws:'
          break
      }

      return p + '//' + location.host
    }
  },
  mounted() {
    this.init()
    this.openWs()
  }
}

function getTextAttrs(cfg) {
  return {
    ...cfg.defaultStyle,
    ...cfg.style,
    fontSize: cfg.data.size,
    text: cfg.data.text,
    textAlign: 'center',
    fontFamily: cfg.data.font,
    fill: cfg.color || cfg.defaultStyle.stroke,
    textBaseline: 'Alphabetic'
  };
}

</script>

<style scoped>

</style>