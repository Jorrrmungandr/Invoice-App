<template>
  <div v-if="currentInvoice" class="invoice-view container">
      <router-link class="nav-link flex" :to="{ name: 'Home' }">
        <img src="../assets/icon-arrow-left.svg" alt="" /> Go Back
      </router-link>

      <!-- Header -->
      <div class="header flex">
        <div class="left flex">
          <span>Status</span>
          <div
              class="status-button flex"
              :class="{
            paid: currentInvoice.invoicePaid,
            draft: currentInvoice.invoiceDraft,
            pending: currentInvoice.invoicePending,
            }"
          >
            <template v-if="currentInvoice.invoicePaid">Paid</template>
            <template v-else-if="currentInvoice.invoiceDraft">Draft</template>
            <template v-else-if="currentInvoice.invoicePending">Pending</template>
          </div>
        </div>

        <div class="right flex">
          <button @click="toggleEdit()" class="dark-purple">Edit</button>
          <button @click="deleteInvoice(currentInvoice.docId)" class="red">Delete</button>
          <button
              v-if="currentInvoice.invoicePending"
              @click="updateStatusToPaid(currentInvoice.docId)"
              class="green"
          >
            Mark As Paid
          </button>
          <button
              v-if="currentInvoice.invoiceDraft || currentInvoice.invoicePaid"
              @click="updateStatusToPending(currentInvoice.docId)"
              class="orange"
          >
            Mark as Pending
          </button>
        </div>
      </div>

      <!-- Invoice Details -->
      <div class="invoice-details flex flex-column">
        <div class="top flex">
          <div class="left flex flex-column">
            <p><span>#</span>{{ currentInvoice.invoiceId }}</p>
            <p>{{ currentInvoice.productDescription }}</p>
          </div>
          <div class="right flex flex-column">
            <p>{{ currentInvoice.billerStreetAddress }}</p>
            <p>{{ currentInvoice.billerCity }}</p>
            <p>{{ currentInvoice.billerZipCode }}</p>
            <p>{{ currentInvoice.billerCountry }}</p>
          </div>
        </div>
        <div class="middle flex">
          <div class="payment flex flex-column">
            <h4>Invoice Date</h4>
            <p>
              {{ currentInvoice.invoiceDate }}
            </p>
            <h4>Payment Date</h4>
            <p>
              {{ currentInvoice.paymentDueDate }}
            </p>
          </div>
          <div class="bill flex flex-column">
            <h4>Bill To</h4>
            <p>{{ currentInvoice.clientName }}</p>
            <p>{{ currentInvoice.clientStreetAddress }}</p>
            <p>{{ currentInvoice.clientCity }}</p>
            <p>{{ currentInvoice.clientZipCode }}</p>
            <p>{{ currentInvoice.clientCountry }}</p>
          </div>
          <div class="send-to flex flex-column">
            <h4>Sent To</h4>
            <p>{{ currentInvoice.clientEmail }}</p>
          </div>
        </div>
        <div class="bottom flex flex-column">
          <div class="billing-items">
            <div class="heading flex">
              <p>Item Name</p>
              <p>Quantity</p>
              <p>Price</p>
              <p>Total</p>
            </div>
            <div v-for="(item, index) in currentInvoice.invoiceItemList" :key="index" class="item flex">
              <p>{{ item.itemName }}</p>
              <p>{{ item.quantity }}</p>
              <p>{{ item.price }}</p>
              <p>{{ item.total }}</p>
            </div>
          </div>
          <div class="total flex">
            <p>Amount Due</p>
            <p>${{ currentInvoice.invoiceTotal }}</p>
          </div>
        </div>
      </div>
    </div>

</template>


<script>
import { mapState, mapMutations, mapActions } from 'vuex';
export default {
  name: "InvoiceView",

  data() {
    return {

    }
  },

  computed: {
    ...mapState(['currentInvoice']),

  },

  created() {
    this.getCurrentInvoice();
  },

  methods: {
    ...mapMutations(['SET_CURRENT_INVOICE', 'TOGGLE_EDIT', 'TOGGLE_INVOICE_MODAL']),
    ...mapActions(['DELETE_INVOICE', 'UPDATE_TO_PAID', 'UPDATE_TO_PENDING']),

    getCurrentInvoice() {
      this.SET_CURRENT_INVOICE(this.$route.params.id);
    },

    toggleEdit() {
      this.TOGGLE_EDIT()
      this.TOGGLE_INVOICE_MODAL()
    },

    async deleteInvoice(docId) {
      await this.DELETE_INVOICE(docId)
      this.$router.push({ name: 'Home' })
    },

    updateStatusToPaid(docId) {
      this.UPDATE_TO_PAID(docId)
    },

    updateStatusToPending(docId) {
      this.UPDATE_TO_PENDING(docId)
    }
  },

}

</script>

<style scoped lang="scss">
.invoice-view-enter-active,
.invoice-view-leave-active {
  transition: 0.5s ease all;
}

.invoice-view-enter-from,
.invoice-view-leave-to {
  transform: translate(-1000px, -900px);
}

.invoice-view {
  .nav-link {
    margin-bottom: 32px;
    align-items: center;
    color: #fff;
    font-size: 14px;
    img {
      margin-right: 16px;
      width: 9px;
    }
  }

  .header,
  .invoice-details {
    background-color: #1e2139;
    border-radius: 20px;
  }

  .header {
    align-items: center;
    padding: 24px 32px;
    font-size: 14px;

    .left {
      align-items: center;

      span {
        color: #dfe3fa;
        margin-right: 16px;
      }
    }

    .right {
      flex: 1;
      justify-content: flex-end;

      button {
        color: #fff;
      }
    }
  }

  .invoice-details {
    padding: 48px;
    margin-top: 24px;

    .top {
      div {
        color: #dfe3fa;
        flex: 1;
      }

      .left {
        font-size: 14px;
        p:first-child {
          font-size: 24px;
          text-transform: uppercase;
          color: #fff;
          margin-bottom: 8px;
        }

        p:nth-child(2) {
          font-size: 16px;
        }

        span {
          color: #888eb0;
        }
      }

      .right {
        font-size: 14px;
        align-items: flex-end;
      }
    }

    .middle {
      margin-top: 50px;
      color: #dfe3fa;
      gap: 16px;

      h4 {
        color: slategray;
        font-size: 14px;
        font-weight: 400;
        margin-bottom: 12px;
      }

      p {
        font-size: 16px;
      }

      .bill,
      .payment {
        flex: 1;
      }

      .payment {
        h4:nth-child(3) {
          margin-top: 32px;
        }

        p {
          font-weight: 600;
        }
      }

      .bill {
        p:nth-child(2) {
          font-size: 16px;
        }
        p:nth-child(3) {
          margin-top: auto;
        }

        p {
          font-size: 13px;
        }
      }

      .send-to {
        flex: 2;
      }
    }

    .bottom {
      margin-top: 50px;

      .billing-items {
        padding: 32px;
        border-radius: 20px 20px 0 0;
        background-color: #252945;

        .heading {
          color: #dfe3fa;
          font-size: 14px;
          margin-bottom: 32px;

          p:first-child {
            flex: 3;
            text-align: left;
          }

          p {
            flex: 1;
            text-align: right;
          }
        }

        .item {
          margin-bottom: 32px;
          font-size: 13px;
          color: #fff;

          &:last-child {
            margin-bottom: 0;
          }

          p:first-child {
            flex: 3;
            text-align: left;
          }

          p {
            flex: 1;
            text-align: right;
          }
        }
      }

      .total {
        color: #fff;
        padding: 32px;
        background-color: rgba(12, 14, 22, 0.7);
        align-items: center;
        border-radius: 0 0 20px 20px;

        p {
          flex: 1;
          font-size: 14px;
        }

        p:nth-child(2) {
          font-size: 28px;
          text-align: right;
        }
      }
    }
  }
}
</style>