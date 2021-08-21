<template>
  <div>
    <loading
      :active="isLoading"
      :can-cancel="false"
      :is-full-page="true"
      loader="bars"
      color="#5b315f"
      :opacity="0"
      :width="64"
      :height="64"
    />
    <!-- <b-card title="Litigation List">
      <b-card-body> -->
    <div class="table-responsive overflow-auto mb-0 mt-2">
      <table class="table table-striped">
        <thead>
          <tr>
            <th>Id</th>
            <th>Case No</th>
            <th>Status</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody v-if="isFetched">
          <tr v-for="(litigation, index) in litigations" :key="index">
            <td class="text-primary">
              {{ litigation.litigation_id }}
            </td>
            <td class="text-primary">
              {{ litigation.case_no }}
            </td>
            <td class="text-primary">
              <b-badge
                :class="[
                  litigation.status === 'draft'
                    ? 'pending text-warning'
                    : 'approved text-success',
                  'pl-2 pr-2 font-14',
                ]"
                pill
                >{{ litigation.status }}</b-badge
              >
            </td>
            <td width="150px">
              <button
                v-if="litigation.status === 'draft'"
                class="
                  btn btn-gradient btn-block
                  font-16
                  btn-rounded
                  text-white
                "
                @click="draftProcess(litigation)"
              >
                Start
              </button>
              <b-button
                v-if="litigation.status === 'final'"
                variant="outline-primary"
                pill
                class="mr-2 drop-shadow"
                @click="finalProcess(litigation)"
              >
                Edit
              </b-button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
    <div class="d-flex justify-content-end">
      <b-pagination
        v-model="currentPage"
        class="pagination-rounded mt-3"
        :total-rows="totalData"
        :per-page="perPage"
        aria-controls="my-table"
        @input="handleClick()"
      ></b-pagination>
    </div>
    <!-- </b-card-body>
    </b-card> -->
  </div>
</template>

<script>
import Loading from 'vue-loading-overlay'
export default {
  components: {
    Loading,
  },
  data() {
    return {
      litigations: null,
      isLoading: false,
      isFetched: false,
      currentPage: 1,
      totalData: null,
      perPage: null,
    }
  },
  async mounted() {
    this.isLoading = true
    this.isFetched = false
    await this.fetchData(`/litigation?page=${this.currentPage}`)
    this.isLoading = false
    this.isFetched = true
  },
  methods: {
    async handleClick() {
      const urlFetchData = `/litigation?page=${this.currentPage}`
      await this.fetchData(urlFetchData)
    },
    async fetchData(url) {
      try {
        const resLitigation = await this.$axios.$get(url, {
          headers: {
            Authorization: this.$auth.strategy.token.get(),
          },
        })

        this.litigations = resLitigation.data
        this.totalData = resLitigation.pagination.total
        this.perPage = resLitigation.pagination.perPage
        console.log(resLitigation)
      } catch (error) {
        console.log(error.response.data)
      }
    },
    draftProcess(record) {
      this.$emit('draftProcess', record)
    },
    finalProcess(record) {
      this.$emit('finalProcess', record)
    },
  },
}
</script>

<style lang="scss" scoped>
.table-responsive {
  height: 400px;
  overflow: scroll;
}
thead tr:nth-child(1) th {
  background: white;
  position: sticky;
  top: 0;
  z-index: 1;
}
tr {
  cursor: pointer;
  background: white;
}
td {
  vertical-align: middle;
}
.overflow-auto::-webkit-scrollbar {
  display: none;
}
.hand-cursor {
  cursor: pointer;
}
.pending {
  background: rgba(255, 172, 50, 0.2);
}
.approved {
  background: rgba(1, 181, 116, 0.1);
}
</style>
