<template>
  <div class="modal flex">
    <div class="modal-content">
      <p>Are you sure you want to exit? Your changes will not be saved.</p>
      <div class="action flex">
        <button @click="cancelModal" class="purple">Cancel</button>
        <button @click="discardInvoice" class="red">Discard</button>
      </div>
    </div>
  </div>
</template>

<script>
import { mapMutations, mapState } from "vuex";

export default {
  name: "Modal",

  computed: {
    ...mapState(['edit'])
  },

  methods: {
    ...mapMutations(['TOGGLE_INVOICE_MODAL', 'TOGGLE_MODAL', 'TOGGLE_EDIT']),

    cancelModal() {
      this.TOGGLE_MODAL()
    },

    discardInvoice() {
      this.TOGGLE_INVOICE_MODAL()
      this.TOGGLE_MODAL()
      if (this.edit) {
        this.TOGGLE_EDIT()
      }
    }
  },
}
</script>

<style scoped lang="scss">
.modal {
  z-index: 100;
  position: fixed;
  justify-content: center;
  align-items: center;
  height: 100vh;
  width: 100vw;

  .modal-content {
    position: relative;
    right: 10%;
    border-radius: 20px;
    padding: 24px 16px;
    max-width: 350px;
    background-color: #252945;
    color: #fff;

    p {
      text-align: center;
    }

    .action {
      justify-content: space-around;
      margin-top: 20px;
    }
  }

}
</style>