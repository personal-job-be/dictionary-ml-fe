<script>
/**
 * Footer Component
 */
export default {
  methods: {
    sosmed() {
      window.open('https://api.whatsapp.com/send?phone=+62818763058&text=Hi')
    },
  },
}
</script>

<template>
  <!-- Footer Start -->
  <footer class="footer">
    <div class="container-fluid">
      <div class="row">
        <div class="col-md-7 d-flex justify-content-between">
          <div>
            {{ new Date().getFullYear() }} &copy;
            <span style="cursor: pointer" @click="sosmed">Reza Limena</span>
          </div>
          <a href="https://rezalimena.com" target="_blank"
            >www.rezalimena.com</a
          >
        </div>
        <div class="col-md-5">
          <div class="text-md-right footer-links d-none d-sm-block">
            <span style="cursor: pointer" @click="sosmed">Contact Us</span>
          </div>
        </div>
      </div>
    </div>
  </footer>
  <!-- end Footer -->
</template>
