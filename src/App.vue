<template>
  <div id="app">
    <router-view/>
    <footer class="footer">
      Copyright ©2020 <a href="https://github.com/ELQASASystem">ELQASASystem</a>. All Rights Reserved.<br>
      第 13 届龙岩市青少年科技创新大赛作品. 版权所有，侵权必究.
    </footer>
  </div>
</template>

<style>
body {
  margin: 0;
  padding: 0;
}

#app {
  display: flex;
  flex-flow: column;
  align-items: center;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
}

.wrapper {
  box-sizing: border-box;
  padding: 0 12px;
  max-width: 1333px;
  width: 100%;
}

.footer {
  margin: 16px;
  text-align: center;
  word-break: break-all;
}
</style>
