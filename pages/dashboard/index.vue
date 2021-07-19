<template>
  <div>
    Lorem ipsum dolor sit amet consectetur adipisicing elit. Neque maxime
    corporis beatae cupiditate doloribus ipsum reprehenderit eaque expedita
    porro quod accusantium quasi a rerum tempore alias nisi, laborum ducimus
    illum. Labore, veniam vitae tempora distinctio harum recusandae culpa nobis
    ipsa temporibus, voluptatibus nihil suscipit perferendis dolorum a, deleniti
    explicabo? Atque quasi autem cum dolores labore expedita aspernatur iure
    maiores distinctio quisquam eum iusto aut magnam, quam ut pariatur soluta
    voluptate excepturi inventore eligendi veniam? Necessitatibus quasi ea
    eligendi nihil quam adipisci rerum, corrupti eaque voluptatibus molestias
    dolor mollitia inventore error quidem quis non harum possimus optio soluta
    suscipit! Repellat, qui.
  </div>
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
