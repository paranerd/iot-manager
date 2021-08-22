<template>
  <div class="nav-wrapper">
    <span>IoT-Manager</span>
    <div class="username">paranerd</div>
  </div>
  <!--<div id="nav"><router-link to="/">Home</router-link></div>-->
</template>

<script>
export default {};
</script>

<style lang="scss" scoped>
.nav-wrapper {
  position: fixed;
  top: 0;
  width: 100%;
  height: 5rem;
  padding: 1.5rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  color: white;
  background: #001f3f;
  box-sizing: border-box;
}

.username {
  margin-left: auto;
}
</style>
