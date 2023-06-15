<template>
  <div>
    <div v-if="!isMobile" class="app flex">
      <navigation />
      <div class="app-content flex flex-column">

        <transition name="modal">
          <Modal v-if="modal"/>
        </transition>

        <transition name="invoice">
          <invoice-modal v-if="invoiceModal"/>
        </transition>

        <div v-if="invoiceLoaded">
          <router-view />
        </div>
        <div v-else>
          <Loading />
        </div>

      </div>
    </div>

    <div v-else class="mobile-msg flex flex-column">
      <h2>Sorry, this app is not supported on mobile devices</h2>
    </div>
  </div>
</template>

<script>
import { mapState, mapActions } from "vuex";
import Navigation from "./components/Navigation.vue";
import InvoiceModal from "./components/InvoiceModal.vue";
import Modal from "./components/Modal.vue";
import Loading from "./components/Loading.vue";

export default {
  name: "App",
  components: {
    Loading,
    Modal,
    InvoiceModal,
    Navigation,
  },

  data() {
    return {
      isMobile: null,
    }
  },

  methods: {
    ...mapActions(["GET_INVOICES"]),

    checkScreen() {
      this.isMobile = window.innerWidth <= 750;
    }
  },

  created() {
    this.GET_INVOICES()
    this.checkScreen() // check on load
    window.addEventListener("resize", this.checkScreen) // every time resized, check isMobile
    // when it comes to resize event, debounce and throttle are very important
    // debounce: wait for a certain amount of time before running a function
    // throttle: run a function every certain amount of time

  },

  computed: {
    ...mapState(['invoiceModal', 'modal', "invoiceLoaded"])
  }
}
</script>

<style lang="scss">
@import url("https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600&display=swap");

* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
  font-family: "Poppins", sans-serif;
}

.app {
  background-color: #141625;
  min-height: 100vh;
  @media(min-width: 750px) {
    flex-direction: row;
  }
  flex-direction: column;

  .app-content {
    padding: 0 20px;
    flex: 1;
    position: relative;
  }
}

.mobile-msg {
  justify-content: center;
  align-items: center;
  padding: 20px;
  color: #fff;
  background-color: #141625;
  min-height: 100vh;
  h2 {
    font-size: 24px;
    margin-bottom: 20px;
  }
}

// Animation
.modal-enter-active,
.modal-leave-active {
  transition: 0.3s ease all;
}

.modal-enter-from,
.modal-leave-to {
  transform: translate(-1600px, -900px);
}


.invoice-enter-active,
.invoice-leave-active {
  transition: 0.8s ease all;
}

.invoice-enter-from,
.invoice-leave-to {
  transform: translateX(-800px);
}

button,
.button {
  cursor: pointer;
  padding: 16px 24px;
  border-radius: 30px;
  border: none;
  font-size: 12px;
  margin-right: 8px;
  color: #fff;
}

.dark-purple {
  background-color: #252945;
}

.red {
  background-color: #ec5757;
}

.purple {
  background-color: #7c5dfa;
}

.green {
  background-color: #33d69f;
}

.orange {
  background-color: #ff8f00;
}

// utility classes

.flex {
  display: flex;
}

.flex-column {
  flex-direction: column;
}

.container {
  width: 100%;
  padding: 40px 10px;
  max-width: 850px;
  margin: 0 auto;

  @media (min-width: 750px) {
    padding-top: 72px;
  }
}

.nav-link {
  text-decoration: none;
  color: initial;
}

// Status Button Styling

.status-button {
  &::before {
    content: "";
    width: 10px;
    height: 10px;
    border-radius: 50%;
    margin-right: 6px;
    margin-left: 6px;
  }

  font-size: 12px;
  margin-right: 30px;
  align-items: center;
  padding: 8px 16px;
  border-radius: 10px;
}

.paid {
  &::before {
    background-color: #33d69f;
  }
  color: #33d69f;
  background-color: rgba(51, 214, 160, 0.1);
}

.pending {
  &::before {
    background-color: #ff8f00;
  }
  color: #ff8f00;
  background-color: rgba(255, 145, 0, 0.1);
}

.draft {
  &::before {
    background-color: #dfe3fa;
  }
  color: #dfe3fa;
  background-color: rgba(223, 227, 250, 0.1);
}
</style>
