<template>
  <div>
    <div v-if="!inProcess">
      <b-card>
        <b-card-body>
          <b-tabs v-model="tabActive" nav-class="nav-tabs nav-bordered">
            <b-tab title="New" active>
              <b-button
                class="btn-rounded drop-shadow btn-gradient"
                @click="getLitigation"
              >
                <i class="fe-plus"></i> New Litigation
              </b-button>
              <b-alert
                :show="dismissCountDown"
                dismissible
                fade
                :variant="variant"
                class="mt-2"
                @dismiss-count-down="countDownChanged"
              >
                {{ errorMessage }}
              </b-alert>
              <b-row class="mt-2">
                <b-col md="12" lg="10" xl="6">
                  <b-row align-v="center">
                    <b-col md="3" class="font-weight-bold font-16">
                      Case No :
                    </b-col>
                    <b-col>
                      <div
                        v-if="litigation !== null"
                        class="ml-2 font-weight-bold text-black"
                      >
                        {{ newLitigation }}
                      </div>
                    </b-col>
                    <b-col md="3">
                      <b-button
                        class="btn-gradient btn-rounded drop-shadow"
                        @click="process"
                      >
                        Start
                      </b-button>
                    </b-col>
                  </b-row>
                </b-col>
              </b-row>
            </b-tab>
            <b-tab title="Litigation List">
              <draft-table
                @draftProcess="draftProcess"
                @finalProcess="finalProcess"
              />
            </b-tab>
          </b-tabs>
        </b-card-body>
      </b-card>
    </div>

    <!-- <b-tabs v-model="tabActive" nav-class="nav-tabs nav-bordered mt-3">
        <b-tab title="New" active> </b-tab>
        <b-tab> </b-tab>
      </b-tabs>
    </div> -->
    <div v-else>
      <!-- corpusResult temporary waiting for API -->
      <pos-tag
        v-if="step === 1"
        :corpus-data="corpusResult"
        :litigation="litigation"
        @nextProcess="nextProcess"
        @backDashboard="backDashboard"
      />
      <chunk
        v-else-if="step === 2"
        :litigation="litigation"
        :corpus-data="corpusResult"
        @backProcess="backProcess"
        @nextProcess="nextProcess"
        @backDashboard="backDashboard"
      />
      <relation
        v-else-if="step === 3"
        :litigation="litigation"
        :corpus-data="corpusResult"
        @backProcess="backProcess"
        @nextProcess="nextProcess"
        @backDashboard="backDashboard"
      />
      <all-table
        v-else-if="step === 4"
        :litigation="litigation"
        :corpus-data="corpusResult"
        :is-final="isFinal"
        @backProcess="backProcess"
        @backDashboard="backDashboard"
      />
    </div>
  </div>
</template>

<script>
import PosTag from '@/components/cyberquote/process/PosTag.vue'
import Chunk from '@/components/cyberquote/process/Chunk.vue'
import Relation from '@/components/cyberquote/process/Relation.vue'
import AllTable from '@/components/cyberquote/table/All-Table.vue'
import DraftTable from '@/components/cyberquote/table/Draft-Table.vue'
export default {
  components: { PosTag, Chunk, Relation, AllTable, DraftTable },
  data() {
    return {
      litigation: null,
      newLitigation: null,
      inProcess: false,
      tabActive: 0,
      step: 0,
      corpusResult: null,
      isFinal: false,
      errorMessage: null,
      dismissSecs: 3,
      dismissCountDown: 0,
    }
  },
  mounted() {
    this.newLitigation = null
  },
  methods: {
    backDashboard() {
      this.inProcess = false
    },
    async getLitigation() {
      try {
        const resLitigation = await this.$axios.$get(`/litigation/new`, {
          headers: {
            Authorization: this.$auth.strategy.token.get(),
          },
        })
        // if (resLitigation.data.length > 0)
        // this.litigation = resLitigation.data.reduce((data) => data)
        this.litigation = resLitigation.data
        this.newLitigation = this.litigation.case_no
        console.log(this.litigation)
      } catch (error) {
        this.dismissCountDown = this.dismissSecs
        this.errorMessage = error.response.data.message
        this.variant = 'danger'
        console.log(error.response.data.message)
      }
    },
    countDownChanged(dismissCountDown) {
      this.dismissCountDown = dismissCountDown
    },
    process() {
      this.newLitigation = null
      this.step = 1
      this.inProcess = true
    },
    draftProcess(record) {
      this.litigation = record
      this.process()
    },
    nextProcess(corpus) {
      this.isFinal = false
      this.step++
      this.corpusResult = corpus
    },
    backProcess(corpus) {
      this.isFinal = false
      this.step--
      this.corpusResult = corpus
    },
    finalProcess(record) {
      this.isFinal = true
      this.litigation = record
      this.step = 4
      this.inProcess = true
    },
  },
}
</script>

<style lang="scss" scoped>
.drop-shadow {
  box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2);
}
</style>
