<template>
  <div v-if="displayedData !== null">
    <b-card title="Result Table">
      <b-card-body>
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
                    {{ data.chunk }}
                  </span>
                </b-badge>
              </td>
              <td v-if="data.chunk !== null">
                <b-badge
                  v-for="(subData, index1) in data.words"
                  :key="index1"
                  pill
                  class="mr-2"
                  :style="`background-color: ${data.color}`"
                  ><span class="text-primary font-12">
                    {{ subData }}
                  </span>
                </b-badge>
              </td>
            </tr>
          </tbody>
        </table>
      </b-card-body>
    </b-card>
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
    syncData() {
      console.log(this.dataTable)
      // distinct tag
      const chunks = []
      this.dataTable.filter((item) => {
        if (item.chunk !== null) {
          const i = chunks.findIndex((x) => x.chunk === item.chunk.code)
          if (i <= -1) {
            chunks.push({ chunk: item.chunk.code, color: item.chunk.color })
          }
        }
        return null
      })
      this.displayedData = []
      chunks.forEach((data) => {
        const words = this.dataTable.filter(
          (subData) =>
            subData.chunk !== null && subData.chunk.code === data.chunk
        )
        const idGroup = []
        words.filter((item) => {
          const i = idGroup.findIndex((x) => x === item.idChunkGroup)
          if (i <= -1) {
            idGroup.push(item.idChunkGroup)
          }
          return null
        })

        const groupWord = []
        idGroup.forEach((idChunkGroup) => {
          groupWord.push(
            words
              .filter((word) => word.idChunkGroup === idChunkGroup)
              .map((word) => word.words)
              .join(' ')
          )
        })
        console.log(groupWord)
        this.displayedData.push({
          chunk: data.chunk,
          color: data.color,
          words: groupWord,
        })
      })
      // console.log(this.displayedData)
    },
  },
}
</script>

<style lang="scss" scoped></style>
