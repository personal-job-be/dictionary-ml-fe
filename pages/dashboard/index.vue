<template>
  <div></div>
</template>

<script>
export default {
  async mounted() {
    const response = await this.$axios.$get(`/corpus_detail`, {
      headers: {
        Authorization: `Bearer keycrX0plGvOmpSPF`,
      },
    })
    console.log(response)
  },
}
</script>

<style lang="scss" scoped></style>
