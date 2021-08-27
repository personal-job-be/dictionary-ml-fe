<template>
  <div v-if="displayedData !== null" class="table-responsive">
    <!-- <b-card title="Result Table">
      <b-card-body> -->
    <table class="table table-striped">
      <thead>
        <tr>
          <th>Chunk</th>
          <th>Words</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(data, index) in displayedData" :key="index">
          <td v-if="data.chunk !== null">
            <b-badge pill :style="`background-color: ${data.color}`"
              ><span class="text-primary font-12">
                {{ data.abbreviation }}
              </span>
            </b-badge>
          </td>
          <td>
            <b-badge
              v-for="(subData, index1) in data.words"
              :key="index1"
              pill
              class="mr-2"
              :style="`background-color: ${data.color}`"
              ><span class="text-primary font-12">
                {{ subData }}
              </span>
              <!-- <i class="fe-trash-2 font-weight-bold font-12 p-1 text-primary" /> -->
            </b-badge>
          </td>
        </tr>
      </tbody>
    </table>
    <!-- </b-card-body>
    </b-card> -->
  </div>
</template>

<script>
export default {
  props: {
    dataTable: {
      type: Array,
      default: null,
    },
  },
  data() {
    return {
      displayedData: this.dataTable,
    }
  },
  mounted() {
    this.syncData()
  },
  methods: {
    syncData1() {
      // distinct tag
      const chunks = []
      this.dataTable.filter((item) => {
        if (item.chunker !== null) {
          const i = chunks.findIndex((x) => x.chunk === item.chunker)
          if (i <= -1) {
            chunks.push({ chunk: item.chunker, color: item.chunker_color })
          }
        }
        return null
      })
      this.displayedData = []
      chunks.forEach((data) => {
        const words = this.dataTable.filter(
          (subData) =>
            subData.chunker !== null && subData.chunker === data.chunk
        )
        const idGroup = []
        words.filter((item) => {
          const i = idGroup.findIndex((x) => x === item.chunk_group)
          if (i <= -1) {
            idGroup.push(item.chunk_group)
          }
          return null
        })

        const groupWord = []
        idGroup.forEach((idChunkGroup) => {
          groupWord.push(
            words
              .filter((word) => word.chunk_group === idChunkGroup)
              .map((word) => word.words)
              .join(' ')
          )
        })
        this.displayedData.push({
          chunk: data.chunk,
          color: data.color,
          words: groupWord,
        })
      })
    },
    async syncData() {
      const resChunks = await this.$axios.$get(`/master/chunker/all`, {
        headers: {
          Authorization: this.$auth.strategy.token.get(),
        },
      })
      let abbreviations = resChunks.data.reduce((unique, o) => {
        if (!unique.some((obj) => obj.abbreviation === o.abbreviation)) {
          unique.push(o)
        }
        return unique
      }, [])

      abbreviations = abbreviations.map((obj) => ({ ...obj, words: [] }))

      const distinctGroup = []
      this.dataTable.filter((item) => {
        if (item.chunk_group !== null) {
          const i = distinctGroup.findIndex(
            (x) => x.chunk_group === item.chunk_group
          )
          if (i <= -1) {
            distinctGroup.push(item)
          }
        }
        return null
      })
      distinctGroup.forEach((group) => {
        const words = this.dataTable.filter(
          (data) => data.chunk_group === group.chunk_group
        )
        const abbWords = resChunks.data
          .filter((chunk) => chunk.code === words[0].chunker)
          .reduce((data) => data)
        const posAbb = abbreviations
          .map((abb) => abb.abbreviation)
          .indexOf(abbWords.abbreviation)
        abbreviations[posAbb].words.push(
          words.map((word) => word.words).join(' ')
        )
      })
      this.displayedData = abbreviations.filter((data) => data.words.length > 0)
      console.log('aa', this.displayedData)
      // FINISH
      // const chunks = []
      // this.dataTable.filter((item) => {
      //   console.log('ck', item)
      //   if (item.chunker !== null) {
      //     const i = chunks.findIndex(
      //       (x) =>
      //         x.abbreviation === item.abbreviation &&
      //         item.abbreviation !== undefined
      //     )
      //     if (i <= -1) {
      //       chunks.push({
      //         abbreviation: item.abbreviation,
      //         color: item.chunker_color,
      //       })
      //     }
      //   }
      //   return null
      // })
      // console.log('chunks', chunks)
      // this.displayedData = []
      // chunks.forEach((data) => {
      //   const words = this.dataTable.filter(
      //     (subData) =>
      //       subData.abbreviation !== null &&
      //       subData.abbreviation === data.abbreviation
      //   )
      //   const idGroup = []
      //   words.filter((item) => {
      //     const i = idGroup.findIndex((x) => x === item.chunk_group)
      //     if (i <= -1) {
      //       idGroup.push(item.chunk_group)
      //     }
      //     return null
      //   })
      //   const groupWord = []
      //   idGroup.forEach((idChunkGroup) => {
      //     groupWord.push(
      //       words
      //         .filter((word) => word.chunk_group === idChunkGroup)
      //         .map((word) => word.words)
      //         .join(' ')
      //     )
      //   })
      //   this.displayedData.push({
      //     chunk: data.abbreviation,
      //     color: data.color,
      //     words: groupWord,
      //   })
      // })
      // console.log('displayed', this.displayedData)
    },
  },
}
</script>

<style lang="scss" scoped></style>
