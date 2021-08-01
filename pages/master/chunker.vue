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
    <b-alert
      :show="dismissCountDown"
      dismissible
      fade
      :variant="variant"
      @dismiss-count-down="countDownChanged"
    >
      {{ errorMessage }}
    </b-alert>
    <b-row class="d-flex justify-content-between">
      <b-col sm="6" md="4">
        <b-form-input
          v-model="searchKey"
          placeholder="Search Description"
          @keyup.enter="search"
        ></b-form-input>
      </b-col>
      <b-col sm="4" md="3" lg="2" class="d-flex justify-content-end">
        <b-button
          variant="success"
          class="btn-rounded drop-shadow btn-gradient"
          @click="newPost"
        >
          <i class="fe-plus"></i> New Chunker</b-button
        >
      </b-col>
    </b-row>

    <div class="table-responsive overflow-auto mb-0 mt-2">
      <table class="table table-striped">
        <thead>
          <tr>
            <th>Description</th>
            <th>Abbreviation</th>
            <th>Code</th>
            <th>Color</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody v-if="filterData !== null && !isLoading">
          <tr v-for="(record, index) in filterData" :key="index">
            <td class="text-primary">
              <div v-if="!record.isModified">
                {{ record.description }}
              </div>
              <div v-else>
                <b-form-input
                  v-model="form.desc"
                  :class="{
                    'is-invalid': submitted && $v.form.desc.$error,
                  }"
                ></b-form-input>
                <div
                  v-if="submitted && !$v.form.desc.required"
                  class="text-danger"
                >
                  Description is required.
                </div>
              </div>
            </td>
            <td class="text-primary">
              <div v-if="!record.isModified">
                {{ record.abbreviation }}
              </div>
              <div v-else>
                <b-form-input
                  v-model="form.abbreviation"
                  :class="{
                    'is-invalid': submitted && $v.form.abbreviation.$error,
                  }"
                ></b-form-input>
                <div
                  v-if="submitted && !$v.form.abbreviation.required"
                  class="text-danger"
                >
                  Abbreviation is required.
                </div>
              </div>
            </td>
            <td class="text-primary">
              <div v-if="!record.isModified">
                {{ record.code }}
              </div>
              <div v-else>
                <b-form-input
                  v-model="form.code"
                  :class="{
                    'is-invalid': submitted && $v.form.code.$error,
                  }"
                ></b-form-input>
                <div
                  v-if="submitted && !$v.form.code.required"
                  class="text-danger"
                >
                  Code is required.
                </div>
              </div>
            </td>
            <td class="text-primary">
              <div v-if="!record.isModified">
                <b-badge
                  pill
                  class="font-12"
                  :style="`background-color: ${record.color}`"
                  >{{ record.color }}</b-badge
                >
              </div>
              <div v-else>
                <b-form-input
                  v-model="form.color"
                  type="color"
                  :class="{
                    'is-invalid': submitted && $v.form.color.$error,
                  }"
                ></b-form-input>
                <div
                  v-if="submitted && !$v.form.color.required"
                  class="text-danger"
                >
                  Color is required.
                </div>
              </div>
            </td>
            <td class="text-primary">
              <div
                v-if="!record.isModified"
                class="d-flex justify-content-around"
              >
                <span
                  class="
                    badge badge-success
                    rounded-circle
                    noti-icon-badge
                    p-1
                    drop-shadow
                  "
                  ><i
                    class="fe-edit text-white font-14 hand-cursor"
                    @click="edit(record)"
                  ></i
                ></span>
                <span
                  class="
                    badge badge-danger
                    rounded-circle
                    noti-icon-badge
                    p-1
                    drop-shadow
                  "
                  @click="remove(record)"
                  ><i class="fe-trash-2 text-white font-14 hand-cursor"></i
                ></span>
              </div>
              <div v-else class="d-flex justify-content-around">
                <span
                  class="
                    badge badge-success
                    rounded-circle
                    noti-icon-badge
                    p-1
                    drop-shadow
                  "
                  @click="save(record)"
                  ><i class="fas fa-save text-white font-14 hand-cursor"></i
                ></span>
                <span
                  class="
                    badge badge-danger
                    rounded-circle
                    noti-icon-badge
                    p-1
                    drop-shadow
                  "
                  ><i
                    class="fe-x-circle text-white font-14 hand-cursor"
                    @click="cancel(record)"
                  ></i
                ></span>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
      <b-modal
        id="modal-confirm"
        body-class="p-4"
        hide-header
        hide-footer
        centered
        content-class="bg-white"
        size="sm"
      >
        <confirmation
          :selected-record="selectedPosTag"
          @cancelModal="cancelModal"
          @confirmation="confirmation"
        />
      </b-modal>
      <b-modal
        id="modal-create"
        centered
        body-class="p-4"
        title="Add new Chunker"
        hide-footer
        content-class="bg-white"
        size="sm"
      >
        <add-chunker @cancelNew="cancelNew" />
      </b-modal>
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
  </div>
</template>

<script>
import Confirmation from '@/components/alert/Confirmation'
import AddChunker from '@/components/cyberquote/AddChunker'
import { required } from 'vuelidate/lib/validators'
import Loading from 'vue-loading-overlay'
import 'vue-loading-overlay/dist/vue-loading.css'
export default {
  components: {
    Confirmation,
    AddChunker,
    Loading,
  },
  data() {
    return {
      filterData: null,
      form: {
        desc: null,
        abbreviation: null,
        code: null,
        color: null,
      },
      selectedPosTag: null,

      // alert
      errorMessage: null,
      dismissSecs: 3,
      dismissCountDown: 0,
      variant: null,

      isLoading: false,
      searchKey: null,
      submitted: false,
      currentPage: 1,
      totalData: null,
      perPage: null,
    }
  },
  validations: {
    form: {
      desc: {
        required,
      },
      abbreviation: {
        required,
      },
      code: {
        required,
      },
      color: {
        required,
      },
    },
  },
  mounted() {
    const urlFetchData = `/master/chunker?page=1`
    this.fetchData(urlFetchData)
  },
  methods: {
    async handleClick() {
      let urlFetchData = null
      if (this.searchKey === null) {
        urlFetchData = `/master/chunker?page=${this.currentPage}`
      } else {
        urlFetchData = `/master/chunker?page=${this.currentPage}&search=${this.searchKey}`
      }
      await this.fetchData(urlFetchData)
    },

    async fetchData(url) {
      this.isLoading = true
      const resChunker = await this.$axios.$get(url, {
        headers: {
          Authorization: this.$auth.strategy.token.get(),
        },
      })
      this.filterData = resChunker.data.map((obj) => ({
        ...obj,
        isModified: false,
      }))
      this.totalData = resChunker.pagination.total
      this.perPage = resChunker.pagination.perPage
      console.log(this.filterData)
      this.isLoading = false
    },

    edit(record) {
      this.filterData.forEach((element) => {
        element.isModified = false
      })
      record.isModified = !record.isModified
      this.form.desc = record.description
      this.form.abbreviation = record.abbreviation
      this.form.code = record.code
      this.form.color = record.color
    },

    cancel(record) {
      record.isModified = !record.isModified
    },

    async save(record) {
      this.submitted = true
      this.$v.$touch()
      if (this.$v.$invalid) {
        console.log(this.$v)
      } else {
        const payLoad = {
          abbreviation: this.form.abbreviation,
          description: this.form.desc,
          code: this.form.code,
          color: this.form.color,
        }
        await this.$axios.$put(`/master/chunker/${record.id}`, payLoad, {
          headers: {
            Authorization: this.$auth.strategy.token.get(),
          },
        })
        let urlFetchData = null
        if (this.searchKey !== null)
          urlFetchData = `/master/chunker?page=${this.currentPage}&search=${this.searchKey}`
        else urlFetchData = `/master/chunker?page=${this.currentPage}`
        this.fetchData(urlFetchData)
        this.dismissCountDown = this.dismissSecs
        this.errorMessage = 'Updated Successfully'
        this.variant = 'success'
      }
    },

    countDownChanged(dismissCountDown) {
      this.dismissCountDown = dismissCountDown
    },

    remove(record) {
      this.selectedPosTag = record
      this.$root.$emit('bv::show::modal', 'modal-confirm')
    },

    cancelModal() {
      this.$root.$emit('bv::hide::modal', 'modal-confirm')
    },

    async confirmation(record) {
      this.$root.$emit('bv::hide::modal', 'modal-confirm')
      this.isLoading = true

      await this.$axios.$delete(`/master/chunker/${record.id}`, {
        headers: {
          Authorization: this.$auth.strategy.token.get(),
        },
      })
      let urlFetchData = null
      if (this.searchKey !== null)
        urlFetchData = `/master/chunker?page=${this.currentPage}&search=${this.searchKey}`
      else urlFetchData = `/master/chunker?page=${this.currentPage}`
      this.fetchData(urlFetchData)

      this.dismissCountDown = this.dismissSecs
      this.errorMessage = 'Deleted Successfully'
      this.variant = 'success'
    },

    search() {
      this.currentPage = 1
      this.handleClick()
    },

    newPost() {
      this.$root.$emit('bv::show::modal', 'modal-create')
    },

    cancelNew(message) {
      if (message === 'cancel')
        this.$root.$emit('bv::hide::modal', 'modal-create')
      else {
        this.dismissCountDown = this.dismissSecs
        this.errorMessage = 'Inserted Successfully'
        this.variant = 'success'
        this.$root.$emit('bv::hide::modal', 'modal-create')
        this.search()
      }
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
.overflow-auto::-webkit-scrollbar {
  display: none;
}
.hand-cursor {
  cursor: pointer;
}
.drop-shadow {
  box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2);
}
</style>
