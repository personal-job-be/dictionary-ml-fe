<template>
  <div>
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
          class="btn-rounded drop-shadow"
          @click="newPost"
        >
          <i class="fe-plus"></i> New Relational</b-button
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
            <th>Action</th>
          </tr>
        </thead>
        <tbody v-if="filterData !== null && !isLoading">
          <tr v-for="(record, index) in filterData" :key="index">
            <td class="text-primary">
              <div v-if="!record.isModified">
                {{ record.fields.sub_detail_master_desc }}
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
                {{ record.fields.sub_detail_master_abbreviation }}
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
                {{ record.fields.sub_detail_master_code }}
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
        <tbody v-if="filterData !== null && isLoading">
          <tr>
            <td>
              <b-spinner
                variant="primary"
                style="width: 2.25rem; height: 2.25rem"
                label="Large Spinner"
              ></b-spinner>
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
        title="Add new relational"
        hide-footer
        content-class="bg-white"
        size="sm"
      >
        <add-relational @cancelNew="cancelNew" />
      </b-modal>
    </div>
  </div>
</template>

<script>
import Confirmation from '@/components/alert/Confirmation'
import AddRelational from '@/components/cyberquote/AddRelation'
import { required } from 'vuelidate/lib/validators'
export default {
  components: {
    Confirmation,
    AddRelational,
  },
  data() {
    return {
      filterData: null,
      form: {
        desc: null,
        abbreviation: null,
        code: null,
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
    },
  },
  mounted() {
    const urlFetchData = `/sub_detail?filterByFormula=AND(FIND("RELATIONAL", {corpus_detail}), NOT({isDeleted}))`
    this.fetchData(urlFetchData)
  },
  methods: {
    async fetchData(url) {
      this.isLoading = true
      const resPosTag = await this.$axios.$get(url, {
        headers: {
          Authorization: this.$config.API_KEY,
        },
      })
      this.filterData = resPosTag.records.map((obj) => ({
        ...obj,
        isModified: false,
      }))
      this.totalRows = this.filterData.length
      this.isLoading = false
    },

    edit(record) {
      this.filterData.forEach((element) => {
        element.isModified = false
      })
      record.isModified = !record.isModified
      this.form.desc = record.fields.sub_detail_master_desc
      this.form.abbreviation = record.fields.sub_detail_master_abbreviation
      this.form.code = record.fields.sub_detail_master_code
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
          records: [
            {
              id: record.id,
              fields: {
                sub_detail_master_abbreviation: this.form.abbreviation,
                sub_detail_master_desc: this.form.desc,
                sub_detail_master_code: this.form.code,
              },
            },
          ],
        }
        await this.$axios.$patch(`/sub_detail`, payLoad, {
          headers: {
            Authorization: this.$config.API_KEY,
          },
        })
        let urlFetchData = null
        if (this.searchKey !== null)
          urlFetchData = `/sub_detail?filterByFormula=AND(FIND("RELATIONAL", {corpus_detail}), NOT({isDeleted}), FIND(LOWER("${this.searchKey}"),LOWER({sub_detail_master_desc})))`
        else
          urlFetchData = `/sub_detail?filterByFormula=AND(FIND("RELATIONAL", {corpus_detail}), NOT({isDeleted}))`
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
      const payLoad = {
        records: [
          {
            id: record.id,
            fields: {
              isDeleted: true,
            },
          },
        ],
      }
      await this.$axios.$patch(`/sub_detail`, payLoad, {
        headers: {
          Authorization: this.$config.API_KEY,
        },
      })
      let urlFetchData = null
      if (this.searchKey !== null)
        urlFetchData = `/sub_detail?filterByFormula=AND(FIND("RELATIONAL", {corpus_detail}), NOT({isDeleted}), FIND(LOWER("${this.searchKey}"),LOWER({sub_detail_master_desc})))`
      else
        urlFetchData = `/sub_detail?filterByFormula=AND(FIND("RELATIONAL", {corpus_detail}), NOT({isDeleted}))`
      this.fetchData(urlFetchData)

      this.dismissCountDown = this.dismissSecs
      this.errorMessage = 'Deleted Successfully'
      this.variant = 'success'
    },

    search() {
      let urlFetchData = null
      if (this.searchKey !== null)
        urlFetchData = `/sub_detail?filterByFormula=AND(FIND("RELATIONAL", {corpus_detail}), NOT({isDeleted}), FIND(LOWER("${this.searchKey}"),LOWER({sub_detail_master_desc})))`
      else
        urlFetchData = `/sub_detail?filterByFormula=AND(FIND("RELATIONAL", {corpus_detail}), NOT({isDeleted}))`
      this.fetchData(urlFetchData)
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
