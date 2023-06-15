import { createStore } from 'vuex'
import db from "../firebase/firebaseInit"

export default createStore({
  state: {
    invoiceData: [],
    invoiceModal: null,
    modal: null,
    invoiceLoaded: null,
    currentInvoice: null,
    edit: null,
  },
  mutations: {
    TOGGLE_INVOICE_MODAL(state) {
      state.invoiceModal = !state.invoiceModal
    },

    TOGGLE_MODAL(state) {
      state.modal = !state.modal
    },

    SET_INVOICE_DATA(state, payload) {
      state.invoiceData.push(payload)
    },

    INVOICES_LOADED(state) {
      state.invoiceLoaded = true
    },

    SET_CURRENT_INVOICE(state, payload) {
      state.currentInvoice = state.invoiceData.filter(invoice => invoice.invoiceId === payload)[0]
    },

    TOGGLE_EDIT(state) {
      state.edit = !state.edit
    },

    DELETE_INVOICE(state, payload) {
      state.invoiceData = state.invoiceData.filter(invoice => invoice.docId !== payload)
    },

    UPDATE_TO_PAID(state, payload) {
      state.invoiceData.forEach(
          invoice => {
            if (invoice.docId === payload) {
              invoice.invoicePending = false
              invoice.invoicePaid = true
            }
          }
      )
    },

    UPDATE_TO_PENDING(state, payload) {
      state.invoiceData.forEach(
          invoice => {
            if (invoice.docId === payload) {
              invoice.invoicePending = true
              invoice.invoicePaid = false
              invoice.invoiceDraft = false
            }
          }
      )
    },
  },

  actions: {
    async GET_INVOICES({commit, state}) {
      const ref = db.collection('invoices')
      const docs = await ref.get()
      docs.forEach(doc => {
        if (!state.invoiceData.some(invoice => invoice.docId === doc.id)) {
          const data = {
            docId: doc.id,
            invoiceId: doc.data().invoiceId,
            billerStreetAddress: doc.data().billerStreetAddress,
            billerCity: doc.data().billerCity,
            billerZipCode: doc.data().billerZipCode,
            billerCountry: doc.data().billerCountry,
            clientName: doc.data().clientName,
            clientEmail: doc.data().clientEmail,
            clientStreetAddress: doc.data().clientStreetAddress,
            clientCity: doc.data().clientCity,
            clientZipCode: doc.data().clientZipCode,
            clientCountry: doc.data().clientCountry,
            invoiceDateUnix: doc.data().invoiceDateUnix,
            invoiceDate: doc.data().invoiceDate,
            paymentTerms: doc.data().paymentTerms,
            paymentDueDateUnix: doc.data().paymentDueDateUnix,
            paymentDueDate: doc.data().paymentDueDate,
            productDescription: doc.data().productDescription,
            invoiceItemList: doc.data().invoiceItemList,
            invoiceTotal: doc.data().invoiceTotal,
            invoicePending: doc.data().invoicePending,
            invoiceDraft: doc.data().invoiceDraft,
            invoicePaid: doc.data().invoicePaid,
          }
          commit("SET_INVOICE_DATA", data);
        }
      })
      commit("INVOICES_LOADED")
    },

    async UPDATE_INVOICE({commit, dispatch}, {docId, routeId}){
      commit('DELETE_INVOICE', docId)
      await dispatch('GET_INVOICES')
      commit('TOGGLE_INVOICE_MODAL')
      debugger
      commit('TOGGLE_EDIT')
      commit('SET_CURRENT_INVOICE', routeId)

    },

    async DELETE_INVOICE({commit}, docId) {
      const ref = db.collection('invoices').doc(docId)
      await ref.delete()
      commit('DELETE_INVOICE', docId) // don't forget sync the state with database
    },

    async UPDATE_TO_PAID({commit}, docId) {
      const ref = db.collection('invoices').doc(docId)
      await ref.update({
        invoicePending: false,
        invoicePaid: true
      })
      commit('UPDATE_TO_PAID', docId)
    },

    async UPDATE_TO_PENDING({commit}, docId) {
      const ref = db.collection('invoices').doc(docId)
      await ref.update({
        invoicePending: true,
        invoicePaid: false,
        invoiceDraft: false,
      })
      commit('UPDATE_TO_PENDING', docId)
    },
  },
  modules: {
  }
})
