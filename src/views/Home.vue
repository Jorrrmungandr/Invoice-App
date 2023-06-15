<template>
  <div @click="checkClick" class="home container">
    <!-- Header -->
    <div class="header flex">
      <div class="left flex flex-column">
        <h1>Invoice</h1>
        <p>There are {{ invoiceData.length }} total invoices</p>
      </div>

      <div class="right flex">
        <div @click="toggleFilterMenu" class="filter flex" ref="filter">
          <span>Filter By Status:
            <span class='option' :class='{
              "green-font": filterOption === "Paid",
              "orange-font": filterOption === "Pending",
              "gray-font": filterOption === "Draft",
                  }'>
              {{ filterOption }}
            </span>
          </span>
          <img src="../assets/icon-arrow-down.svg" alt="">
          <ul v-show="filterMenu" class="filter-menu">
            <li @click="filterInvoices">Draft</li>
            <li @click="filterInvoices">Pending</li>
            <li @click="filterInvoices">Paid</li>
            <li @click="filterInvoices">Clear Filter</li>
          </ul>
        </div>

        <div @click="newInvoice" class="new button flex">
          <div></div>
          <div class="img-wrapper flex">
            <img src="../assets/icon-plus.svg" alt="">
          </div>
          <span>New Invoice</span>
        </div>
      </div>
    </div>

    <!-- Invoice -->
    <div v-if="invoiceData.length > 0">
      <Invoice v-for="(invoice, index) in filteredInvoices"
               :invoice="invoice"
               :key="index" />
    </div>

    <div v-else class="empty flex flex-column">
      <img src="../assets/illustration-empty.svg" alt="">
      <h3>There is nothing here</h3>
      <p>
        Create a new invoice by clicking the <strong>New Invoice</strong> button and get started!
      </p>
    </div>

  </div>
</template>

<script>
import { mapMutations, mapState, mapActions } from 'vuex';
import Invoice from "../components/Invoice.vue";

export default {
  name: "Home",
  components: {Invoice},
  data() {
    return {
      filterMenu: false,
      filteredInvoices: null,
      filterOption: 'None',
    }
  },

  created() {
    this.filteredInvoices = this.invoiceData;
  },


  computed: {
    ...mapState(['invoiceData']),

  },

  methods: {
    ...mapMutations(['TOGGLE_INVOICE_MODAL']),
    ...mapActions(["GET_INVOICES"]),

    checkClick(e) {
      if (this.filterMenu === true && e.target !== this.$refs.filter) {
        this.filterMenu = false
      }
    },

    toggleFilterMenu() {
      this.filterMenu = !this.filterMenu;
    },

    newInvoice() {
      this.TOGGLE_INVOICE_MODAL();
    },

    filterInvoices(e) {
      if (e.target.innerText === 'Draft') {
        this.filteredInvoices = this.invoiceData.filter(invoice => invoice.invoiceDraft);
        this.filterOption = 'Draft';
      }
      if (e.target.innerText === 'Pending') {
        this.filteredInvoices = this.invoiceData.filter(invoice => invoice.invoicePending);
        this.filterOption = 'Pending';
      }
      if (e.target.innerText === 'Paid') {
        this.filteredInvoices = this.invoiceData.filter(invoice => invoice.invoicePaid);
        this.filterOption = 'Paid';
      }
      if (e.target.innerText === 'Clear Filter') {
        this.filteredInvoices = this.invoiceData;
        this.filterOption = 'None';
      }
    },

  }
};
</script>

<style lang="scss" scoped>
.home {
  .header {
    margin-bottom: 65px;
    color: white;

    .left,
    .right {
      flex: 1;
    }

    .new {
      justify-content: flex-end;
      align-items: center;
    }

    .filter,
    .new {
      align-items: center;
      cursor: pointer;
      font-size: 14px;
    }

    .filter {
      position: relative;
      margin-right: 30px;

      * {
        pointer-events: none;
      }

      .option {
        margin-left: 5px;
        font-size: 16px;
      }

      .green-font {
        color: green;
      }
      .orange-font {
        color: orange;
      }
      .gray-font {
        color: gray;
      }

      img {
        margin-left: 16px;
        width: 14px;
      }

      .filter-menu {
        width: 120px;
        position: absolute;
        top: 54px;
        list-style: none;
        background-color: #1e2139;
        box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);

        li {
          pointer-events: auto;
          cursor: pointer;
          font-size: 12px;
          padding: 10px 20px;

          &:hover {
            color: #1e2139;
            background-color: #fff;
          }
        }
      }
    }

    .new {
      padding: 8px 10px;
      background-color: #7c5dfa;
      border-radius: 40px;
      transition: all 0.3s ease-in-out;

      &:hover {
        background-color: #9277ff;
      }

      .img-wrapper {
        margin-right: 8px;
        padding: 8px;
        border-radius: 50%;
        justify-content: center;
        align-items: center;
        background-color: white;

        img {
          width: 16px;
        }
      }
    }
  }

  .empty {
    justify-content: center;
    align-items: center;
    text-align: center;
    color: white;

    img {
      margin-bottom: 40px;
    }

    h3 {
      margin-bottom: 20px;
    }

    p {
      max-width: 400px;
      margin: 0 auto;
      color: slategray;

      strong {
        color: #7c5dfa;
      }
    }
  }
}
</style>
