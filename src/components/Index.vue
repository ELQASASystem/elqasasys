<template>
  <div class="wrapper">
    <header class="header">
      <a href="/" class="logo">ELQASA</a>
      <div>
        <ul class="menu">
          <li><a href="/">产品官网</a></li>
          <li><a :href="GitHubAddr">GitHub Project</a></li>
          <li><a href="/">About us</a></li>
        </ul>
      </div>
      <div></div>
    </header>
    <main>

      <div class="banner">
        <div class="banner-text">
          <h1>在线教育问答统计深度学习分析系统</h1>
          <span>ELQASASystem 是帮助教师、家长和学生在线学习，易于使用的教育跟踪深度学习分析系统</span>
          <div class="banner-btn">
            <router-link to="/home" class="banner-btn1">开始使用</router-link>
            <a :href="GitHubAddr" class="banner-btn2">了解更多</a>
          </div>
        </div>
        <div class="banner-img">
          <img :src="BannerImg" alt="宣传图">
        </div>

      </div>

      <div class="login">

        <div class="login-form">
          <a-form
              layout="inline"
              :form="form"
              @submit="handleSubmit"
          >

            <a-form-item>
              <a-input
                  v-decorator="['userName', {rules: [{required: true, message: '请输入用户名!' }]}]"
                  placeholder="用户名"
              >
                <a-icon slot="prefix" type="user" style="color: rgba(0,0,0,.25)"/>
              </a-input>
            </a-form-item>
            <a-form-item>
              <a-input
                  v-decorator="['password', {rules: [{required: true, message: '请输入密码!'}]}]"
                  type="password"
                  placeholder="密码"
              >
                <a-icon slot="prefix" type="lock" style="color: rgba(0,0,0,.25)"/>
              </a-input>
            </a-form-item>

            <a-form-item>
              <a-button type="primary" html-type="submit">登录</a-button>
            </a-form-item>

          </a-form>
        </div>

        <div class="login-banner">登录后开始使用...</div>

      </div>


      <div class="features">
        我们的功能
      </div>
    </main>
  </div>
</template>

<script>
import Axios from 'axios'

export default {
  name: "Index",
  data() {
    return {
      GitHubAddr: 'https://github.com/ELQASASystem/app',
      BannerImg: require('../assets/images/Index/banner.png'),
      form: this.$form.createForm(this, {})
    }
  },
  methods: {
    handleSubmit(e) {

      e.preventDefault()
      this.form.validateFields((err, values) => {

        if (err) {
          console.log("登录失败：", err)
          return
        }

        console.log("登录请求：", values)
        this.login(values.userName, values.password)
      })
    },

    login(u, p) {

      Axios.post(`/apis/login/${u}?p=` + p).then(() => {
        this.$notification.success({message: '登录成功', description: ''})
        this.$router.push({path: '/teacher/qa/list'})
      }).catch(err => {
        console.log("登录失败：", err)
        this.$notification.error({message: '登录失败', description: '请检查帐号密码是否有误'})
      })
    }
  }
}
</script>

<style scoped src="./Index.css"/>
