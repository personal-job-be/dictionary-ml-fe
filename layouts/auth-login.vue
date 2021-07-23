<template>
  <b-row>
    <b-col v-if="$vssWidth > 1000" md="4" xl="4" class="bg-primary left-side">
      <div class="fixed-bottom pl-5 pb-3">
        <b-row>
          <b-col lg="4 pr-5">
            <img src="/logo-white-square.png" alt="" width="30%" />
            <div class="mt-3 text-white">
              CyberQuote Indonesia, PT is a member of CyberQuote Group of
              Singapore which was incorporated in 1996. CyberQuote serve clients
              ranging from State Owned, Private & Foreign Banks; international
              chambers & manufacturers concentrating on international or
              domestic markets. CyberQuote has strong presence on Asia, Asia
              Pacific and European Region
            </div>
          </b-col>
        </b-row>
      </div>
    </b-col>
    <b-col class="main-content">
      <Nuxt />
    </b-col>
  </b-row>
</template>

<script>
import VueScreenSize from 'vue-screen-size'
export default {
  mixins: [VueScreenSize.VueScreenSizeMixin],
  middleware: 'logged-in',
}
</script>

<style lang="scss" scoped>
.left-side {
  height: 100vh;
  z-index: 1;
}
.main-content {
  z-index: 2;
}
html {
  font-family: 'Oxygen';
}
</style>
