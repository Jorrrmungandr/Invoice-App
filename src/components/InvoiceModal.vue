<template>
<div @click="checkClick" class="invoice-wrapper flex flex-column" ref="invoiceWrapper">
  <form @submit.prevent="submitForm" class="invoice-content">
    <Loading v-show="loading" />
    <h1 v-if="!edit">New Invoice</h1>
    <h1 v-else>Edit Invoice</h1>

    <!-- Bill From -->
    <div class="bill-from flex flex-column">
      <h4>Bill From</h4>
      <div class="input flex flex-column">
        <label for="billerStreetAddress">Street Address</label>
        <input required id="billerStreetAddress" v-model="billerStreetAddress" />
      </div>
      <div class="location-details flex">
        <div class="input flex flex-column">
          <label for="billerCity">City</label>
          <input required type="text" id="billerCity" v-model="billerCity" />
        </div>
        <div class="input flex flex-column">
          <label for="billerZipCode">Zip Code</label>
          <input required type="text" id="billerZipCode" v-model="billerZipCode" />
        </div>
        <div class="input flex flex-column">
          <label for="billerCountry">Country</label>
          <input required type="text" id="billerCountry" v-model="billerCountry" />
        </div>
      </div>

    </div>

    <!-- Bill To -->
    <div class="bill-to flex flex-column">
      <h4>Bill To</h4>
      <div class="input flex flex-column">
        <label for="clientName">Client's Name</label>
        <input required type="text" id="clientName" v-model="clientName" />
      </div>
      <div class="input flex flex-column">
        <label for="clientEmail">Client's Email</label>
        <input required type="text" id="clientEmail" v-model="clientEmail" />
      </div>
      <div class="input flex flex-column">
        <label for="clientStreetAddress">Street Address</label>
        <input required type="text" id="clientStreetAddress" v-model="clientStreetAddress" />
      </div>
      <div class="location-details flex">
        <div class="input flex flex-column">
          <label for="clientCity">City</label>
          <input required type="text" id="clientCity" v-model="clientCity" />
        </div>
        <div class="input flex flex-column">
          <label for="clientZipCode">Zip Code</label>
          <input required type="text" id="clientZipCode" v-model="clientZipCode" />
        </div>
        <div class="input flex flex-column">
          <label for="clientCountry">Country</label>
          <input required type="text" id="clientCountry" v-model="clientCountry" />
        </div>
      </div>
    </div>

    <!-- Invoice Work Details -->
    <div class="invoice-work flex flex-column">
      <div class="payment flex">
        <div class="input flex flex-column">
          <label for="invoiceDate">Invoice Date</label>
          <input disabled type="text" id="invoiceDate" v-model="invoiceDate" />
        </div>
        <div class="input flex flex-column">
          <label for="paymentDueDate">Payment Due</label>
          <input disabled type="text" id="paymentDueDate" v-model="paymentDueDate" />
        </div>
      </div>
      <div class="input flex flex-column">
        <label for="paymentTerms">Payment Terms</label>
        <select required id="paymentTerms" v-model="paymentTerms">
          <option value="30">Net 30 Days</option>
          <option value="60">Net 60 Days</option>
        </select>
      </div>
      <div class="input flex flex-column">
        <label for="productDescription">Product Description</label>
        <input required type="text" id="productDescription" v-model="productDescription" />
      </div>

      <div class="handle-items">
        <h3>Item List</h3>
        <table class="item-table">
          <tr class="table-heading flex">
            <th class="item-name">Item Name</th>
            <th class="quantity">Quantity</th>
            <th class="price">Price</th>
            <th class="total">Total</th>
          </tr>
          <tr class="table-data flex"
              v-for="item in invoiceItemList"
              :key="item.id">
            <td class="item-name">
              <input type="text" v-model="item.itemName"/>
            </td>
            <td class="quantity">
              <input type="text" v-model="item.quantity"/>
            </td>
            <td class="price">
              <input type="text" v-model="item.price"/>
            </td>
            <td class="total flex">
              <span>${{ item.total = item.quantity * item.price }}</span>
              <img @click="deleteInvoiceItem(item.id)" src="../assets/icon-delete.svg" alt="">
            </td>
          </tr>
        </table>

        <div @click="addInvoiceItem" class="flex button">
          <svg width="11" height="11" xmlns="http://www.w3.org/2000/svg">
            <path d="M6.313 10.023v-3.71h3.71v-2.58h-3.71V.023h-2.58v3.71H.023v2.58h3.71v3.71z" fill="white" fill-rule="nonzero"/>
          </svg>
          Add New Item
        </div>
      </div>
    </div>

    <hr />

    <!-- Save/Discard -->
    <div class="save flex">
      <div class="left">
        <button type="button" @click="discardInvoice" class="red">
          {{ edit ? 'Cancel' : 'Discard' }}
        </button>
      </div>
      <div class="right flex">
        <template v-if="!edit">
          <button @click="saveDraft" type="submit" class="dark-purple">Save Draft</button>
          <button @click="publishInvoice" type="submit" class="purple">Create Invoice</button>
        </template>
        <template v-else>
          <button type="submit" class="purple">Update</button>
        </template>

      </div>
    </div>
  </form>

</div>
</template>

<script>
import db from "../firebase/firebaseInit";
import { mapMutations, mapState, mapActions } from "vuex";
import { uid } from "uid";
import Loading from "./Loading.vue";

export default {
  name: "InvoiceModal",
  components: {Loading},
  data() {
    return {
      // invoice field
      docId: null,
      billerStreetAddress: null,
      billerCity: null,
      billerZipCode: null,
      billerCountry: null,
      clientName: null,
      clientEmail: null,
      clientStreetAddress: null,
      clientCity: null,
      clientZipCode: null,
      clientCountry: null,
      invoiceDateUnix: null,
      invoiceDate: null,
      paymentTerms: null,
      paymentDueDateUnix: null,
      paymentDueDate: null,
      productDescription: null,
      invoicePending: null,
      invoiceDraft: null,
      invoiceItemList: [],
      invoiceTotal: 0,

      // other
      dateOptions: {
        weekday: "short",
        year: "numeric",
        month: "short",
        day: "numeric",
      },

      loading: null,
    }
  },

  created() {
    if (!this.edit) {
      // get current date for invoice date field
      this.invoiceDateUnix = Date.now();
      this.invoiceDate = new Date(this.invoiceDateUnix).toLocaleDateString("en-us", this.dateOptions);
    }
    else {
      const currentInvoice = this.currentInvoice;
      this.docId = currentInvoice.docId;
      this.billerStreetAddress = currentInvoice.billerStreetAddress;
      this.billerCity = currentInvoice.billerCity;
      this.billerZipCode = currentInvoice.billerZipCode;
      this.billerCountry = currentInvoice.billerCountry;
      this.clientName = currentInvoice.clientName;
      this.clientEmail = currentInvoice.clientEmail;
      this.clientStreetAddress = currentInvoice.clientStreetAddress;
      this.clientCity = currentInvoice.clientCity;
      this.clientZipCode = currentInvoice.clientZipCode;
      this.clientCountry = currentInvoice.clientCountry;
      this.invoiceDateUnix = currentInvoice.invoiceDateUnix;
      this.invoiceDate = currentInvoice.invoiceDate;
      this.paymentTerms = currentInvoice.paymentTerms;
      this.paymentDueDateUnix = currentInvoice.paymentDueDateUnix;
      this.paymentDueDate = currentInvoice.paymentDueDate;
      this.productDescription = currentInvoice.productDescription;
      this.invoicePending = currentInvoice.invoicePending;
      this.invoiceDraft = currentInvoice.invoiceDraft;
      this.invoiceItemList = currentInvoice.invoiceItemList;
      this.invoiceTotal = currentInvoice.invoiceTotal;
    }

  },

  computed: {
    ...mapState(['edit', 'currentInvoice']),
  },

  methods: {
    ...mapMutations(["TOGGLE_INVOICE_MODAL", "TOGGLE_MODAL", "TOGGLE_EDIT", ]),
    ...mapActions(['UPDATE_INVOICE', 'GET_INVOICES']),

    checkClick(e) {
      if (e.target === this.$refs.invoiceWrapper) {
        this.TOGGLE_MODAL()
      }

    },

    addInvoiceItem() {
      this.invoiceItemList.push({
        id: uid(),
        itemName: "",
        quantity: "",
        price: "",
        total: 0,
      })
    },

    deleteInvoiceItem(id) {
      this.invoiceItemList = this.invoiceItemList.filter(
          item => item.id !== id
      )
    },

    discardInvoice() {
      this.TOGGLE_INVOICE_MODAL();
      if (this.edit) {
        this.TOGGLE_EDIT()
      }
    },

    publishInvoice() {
      this.invoicePending = true
    },

    saveDraft() {
      this.invoiceDraft = true
    },

    calcInvoiceTotal() {
      this.invoiceTotal = this.invoiceItemList.reduce((sum, item) => {
        return sum + item.total
      }, 0)
    },

    async uploadInvoice() {
      if (this.invoiceItemList.length === 0) {
        alert("Please ensure you have at least one item in your invoice.")
        return
      }

      this.loading = true

      this.calcInvoiceTotal()
      // data model of firebase: collection -> document -> data
      const ref = db.collection("invoices");
      await ref.add({
        invoiceId: uid(6), // 6-character random string
        billerStreetAddress: this.billerStreetAddress,
        billerCity: this.billerCity,
        billerZipCode: this.billerZipCode,
        billerCountry: this.billerCountry,
        clientName: this.clientName,
        clientEmail: this.clientEmail,
        clientStreetAddress: this.clientStreetAddress,
        clientCity: this.clientCity,
        clientZipCode: this.clientZipCode,
        clientCountry: this.clientCountry,
        invoiceDate: this.invoiceDate,
        invoiceDateUnix: this.invoiceDateUnix,
        paymentTerms: this.paymentTerms,
        paymentDueDate: this.paymentDueDate,
        paymentDueDateUnix: this.paymentDueDateUnix,
        productDescription: this.productDescription,
        invoiceItemList: this.invoiceItemList,
        invoiceTotal: this.invoiceTotal,
        invoicePending: this.invoicePending,
        invoiceDraft: this.invoiceDraft,
        invoicePaid: null,
      })

      await this.GET_INVOICES()

      this.loading = false
      this.TOGGLE_INVOICE_MODAL();
    },


    // The logic of update function (both in database and in the state)
    // first update the data of invoice in firestore (database)
    // then delete the invoice in the invoice list (data in the state)
    // finally get the updated invoice from firestore (database -> data in the state)
    async updateInvoice() {
      if (this.invoiceItemList.length === 0) {
        alert("Please ensure you have at least one item in your invoice.")
        return;
      }

      this.loading = true;

      this.calcInvoiceTotal();

      const ref = db.collection("invoices").doc(this.docId);

      await ref.update({
        billerStreetAddress: this.billerStreetAddress,
        billerCity: this.billerCity,
        billerZipCode: this.billerZipCode,
        billerCountry: this.billerCountry,
        clientName: this.clientName,
        clientEmail: this.clientEmail,
        clientStreetAddress: this.clientStreetAddress,
        clientCity: this.clientCity,
        clientZipCode: this.clientZipCode,
        clientCountry: this.clientCountry,
        paymentTerms: this.paymentTerms,
        paymentDueDate: this.paymentDueDate,
        paymentDueDateUnix: this.paymentDueDateUnix,
        productDescription: this.productDescription,
        invoiceItemList: this.invoiceItemList,
        invoiceTotal: this.invoiceTotal,
      });

      const data = {
        docId: this.docId,
        routeId: this.$route.params.id,
      };

      await this.UPDATE_INVOICE(data);

      this.loading = false;
    },

    submitForm() {
      if (!this.edit) {
        this.uploadInvoice()
      }
      else {
        this.updateInvoice()
      }
    },

  },

  watch: {
    paymentTerms() {
      this.paymentDueDateUnix = this.invoiceDateUnix + this.paymentTerms * 24 * 60 * 60 * 1000;
      this.paymentDueDate = new Date(this.paymentDueDateUnix).toLocaleDateString("en-us", this.dateOptions);
    }
  }

}

</script>

<style scoped lang="scss">

.invoice-wrapper {
  position: fixed;
  z-index: 1; // make it above the filter button
  top: 0;
  left: 0;
  background-color: transparent;
  width: 100%;
  height: 100vh;
  overflow: scroll;
  &::-webkit-scrollbar {
    display: none;
  }

  @media(min-width: 750px) {
    left: 90px; // navigation sidebar width
  }
}

.invoice-content {
  position: relative;
  padding: 40px 25px;
  max-width: 500px;
  width: 100%;
  color: white;
  background-color: #141625;
  box-shadow: 10px 4px 6px -1px rgba(0, 0, 0, 0.2), 0 2px 4px -1px rgba(0, 0, 0, 0.06);

  h1 {
    font-size: 24px;
    font-weight: 700;
    margin-bottom: 40px;
    color: white;
  }

  h3 {
    margin-bottom: 16px;
    font-size: 18px;
    color: #777f98;
  }

  h4 {
    color: #7c5dfa;
    font-size: 18px;
    margin-bottom: 16px;
  }

  .bill-to,
  .bill-from {
    margin-bottom: 24px;

    .input {
      margin-bottom: 8px;
    }

    .location-details {
      gap: 16px;
      div {
        flex: 1;
      }
    }
  }

  .payment {
    flex:1;
    justify-content: flex-start;
    gap: 16px;
  }

  // item table
  .handle-items {
    .item-table {
      width: 100%;

      .table-heading,
      .table-data {
        gap: 16px;
        font-size: 14px;

        .item-name {
          flex-basis: 40%;
        }

        .quantity {
          flex-basis: 20%;
        }

        .price {
          flex-basis: 20%;
        }

        .total {
          flex-basis: 20%;
          justify-content: space-around;
          align-self: center;
        }
      }

      .table-heading {
        margin-bottom: 16px;

        th {
          text-align: center;
        }
      }

      .table-data {
        margin-bottom: 24px;

        .total{
          position: relative;
          span {
            max-width: 60px;
            overflow: scroll;
          }

          img {
            position: absolute;
            left: 80px;
            top: 2px;
            cursor: pointer;
            color: white;
          }
        }

      }
    }

    .button {
      color: #fff;
      background-color: #252945;
      align-items: center;
      justify-content: center;
      width: 60%;
      margin: 40px auto;
      padding: 12px 8px;
      font-size: 12px;

      svg {
        margin-right: 4px;
      }
    }
  }

  .save {
    margin-top: 30px;
    div {
      flex: 1;
    }

    .right {
      justify-content: flex-end;

      button {
        white-space: nowrap;
      }
    }
  }
}

.input {
  margin-bottom: 12px;
}

label {
  font-size: 14px;
  margin-bottom: 6px;
}

input,
select {
  width: 100%;
  background-color: #1e2139;
  color: #fff;
  border-radius: 4px;
  padding: 10px 6px;
  border: none;

  &:focus {
    outline: none;
    background-color: #282155;
  }

  &:disabled {
    background-color: #101d30;
    color: #777f98;
  }
}

hr {
  border: 0;
  padding-top: 10px;
  color: gray;
  border-top: 1px solid rgba(0,0,0,.1);
  box-shadow: inset 0 3px 3px -3px;
}
</style>