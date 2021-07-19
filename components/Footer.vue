<script>
/**
 * Footer Component
 */
export default {}
</script>

<template>
  <!-- Footer Start -->
  <footer class="footer">
    <div class="container-fluid">
      <div class="row">
        <div class="col-md-7 d-flex justify-content-between">
          <div>
            {{ new Date().getFullYear() }} &copy;
            <a href="https://rezalimena.com" target="_blank">Reza Limena</a>
          </div>
          <a href="https://rezalimena.com" target="_blank"
            >www.rezalimena.com</a
          >
        </div>
        <div class="col-md-5">
          <div class="text-md-right footer-links d-none d-sm-block">
            <a href="javascript:void(0);">About Us</a>
            <a href="javascript:void(0);">Help</a>
            <a href="javascript:void(0);">Contact Us</a>
          </div>
        </div>
      </div>
    </div>
  </footer>
  <!-- end Footer -->
</template>
