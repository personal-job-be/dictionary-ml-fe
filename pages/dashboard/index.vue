<template>
  <div>
    <div v-if="!inProcess">
      <b-tabs v-model="tabActive" nav-class="nav-tabs nav-bordered mt-3">
        <b-tab title="New" active>
          <b-button
            class="btn-rounded drop-shadow btn-gradient"
            @click="getLitigation"
          >
            <i class="fe-plus"></i> New Litigation
          </b-button>
          <b-row class="mt-4">
            <b-col md="12" lg="10" xl="6">
              <b-row align-v="center">
                <b-col md="2" class="font-weight-bold font-16">
                  Case No :
                </b-col>
                <b-col>
                  <div
                    v-if="litigation !== null"
                    class="ml-2 font-weight-bold text-black"
                  >
                    {{ litigation.case_no }}
                  </div>
                </b-col>
                <b-col md="3">
                  <b-button
                    variant="success"
                    class="btn-rounded drop-shadow"
                    @click="process"
                  >
                    Work on it
                  </b-button>
                </b-col>
              </b-row>
            </b-col>
          </b-row>
        </b-tab>
        <b-tab title="Draft">
          <h1>Draft Litigation</h1>
        </b-tab>
      </b-tabs>
    </div>
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
        :corpus-data="corpusResult"
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
export default {
  components: { PosTag, Chunk, Relation, AllTable },
  data() {
    return {
      litigation: null,
      inProcess: false,
      tabActive: 0,
      step: 0,
      corpusResult: null,
    }
  },
  async mounted() {},
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
        console.log(this.litigation)
      } catch (error) {}
    },
    process() {
      this.step = 1
      this.inProcess = true
    },
    nextProcess(corpus) {
      this.step++
      this.corpusResult = corpus
    },
    backProcess(corpus) {
      this.step--
      this.corpusResult = corpus
    },
  },
}
</script>

<style lang="scss" scoped>
.drop-shadow {
  box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2);
}
</style>
