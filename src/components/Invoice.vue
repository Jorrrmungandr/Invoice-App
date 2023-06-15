<template>
  <router-link  class="invoice flex"
                :to="{ name: 'Invoice', params: {id: invoice.invoiceId} }">
    <div class="left flex">
      <span class="tracking-number">#{{ invoice.invoiceId }}</span>
      <span class="due-date">{{ invoice.paymentDueDate }}</span>
      <span class="person">{{ invoice.clientName }}</span>
    </div>

    <div class="right flex">
      <span class="price">${{ invoice.invoiceTotal }}</span>

      <template v-if="invoice.invoicePaid">
        <div class="status-button flex paid">
          <span>Paid</span>
        </div>
      </template>
      <template v-else-if="invoice.invoiceDraft">
        <div class="status-button flex draft">
          <span>Draft</span>
        </div>
      </template>
      <template v-else-if="invoice.invoicePending">
        <div class="status-button flex pending">
          <span>Pending</span>
        </div>
      </template>

      <div class="icon">
        <img src="../assets/icon-arrow-right.svg" alt="" />
      </div>
    </div>

  </router-link>
</template>

<script>
export default {
  name: "Invoice",

  props: {
    invoice: Object
  },
}
</script>

<style scoped lang="scss">
.invoice {
  text-decoration: none;
  cursor: pointer;
  gap: 80px;
  border-radius: 20px;
  max-width: 90%;
  padding: 20px 30px;
  margin-bottom: 16px;
  color: white;
  background-color: #1e2139;
  align-items: center;
  font-size: 13px;

  .left {
    flex-basis: 70%;
    align-items: center;
    .tracking-number {
      flex-basis: 30%;
      text-transform: uppercase;
    }
    .due-date {
      flex-basis: 40%;
    }
    .person {
      flex-basis: 30%;
    }
  }

  .right {
    flex-basis: 40%;
    align-items: center;
    gap: 10px;

    .price {
      flex-basis: 40%;
      font-size: 16px;
      font-weight: 600;
    }

    .status-button {
      flex-basis: 60%;
      font-size: 14px;
    }
  }
}

</style>