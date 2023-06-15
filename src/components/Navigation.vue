<template>
<header class="flex">
  <div class="branding flex">
    <img src="../assets/file-invoice-dollar-solid.svg" alt="">
  </div>
</header>
</template>

<script>
export default {
  name: "Navigation"
}
</script>

<style lang="scss" scoped>
header {
  z-index: 999; // make sure the navigation bar is on top of everything
  flex-direction: row;
  background-color: #1e2139;

  @media(min-width: 900px) {
    min-height: 100%;
    min-width: 90px;
    flex-direction: column;
    border-radius: 0 20px 20px 0;
  }

  .branding {
    justify-content: center;
    background-color: #7c5dfa;
    border-radius: 0 20px 20px 0;
    padding: 24px;

    @media(min-width: 900px) {
      width: 100%;
    }
  }

  img {
    width: auto;
    height: 30px;
  }
}

</style>