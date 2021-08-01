<template>
  <div v-if="displayedData !== null">
    <b-card title="Result Table">
      <b-card-body>
        <table class="table table-striped">
          <thead>
            <tr>
              <th>Pos Tag</th>
              <th>Words</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(data, index) in displayedData" :key="index">
              <td>
                <b-badge pill style="background-color: #f5f5f5"
                  ><span class="text-primary font-12">
                    {{ data.postag }}
                  </span>
                </b-badge>
              </td>
              <td>
                <b-badge
                  v-for="(subData, index1) in data.words"
                  :key="index1"
                  pill
                  class="mr-2"
                  style="background-color: #f5f5f5"
                  ><span class="text-primary font-12">
                    {{ subData.words }}
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
      // console.log(this.dataTable)
      // distinct tag
      const tags = []
      this.dataTable.filter((item) => {
        const i = tags.findIndex((x) => x.postag === item.postag)
        if (i <= -1) {
          tags.push({ postag: item.postag })
        }
        return null
      })
      this.displayedData = []
      tags.forEach((data) => {
        const words = this.dataTable.filter(
          (subData) => subData.postag === data.postag
        )
        this.displayedData.push({
          postag: data.postag,
          words,
        })
      })
      console.log(this.displayedData)
    },
  },
}
</script>

<style lang="scss" scoped></style>
