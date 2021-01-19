<template type="x-template" id="countries-component">
  <div>
    <b-tabs v-model="activeTab" vertical type="is-boxed">
      <b-tab-item>
        <template #header>
          <b-icon icon="information-outline"></b-icon>
          <span>
            Countries <b-tag rounded> {{ countries.length }} </b-tag>
          </span>
        </template>

        <article class="panel is-shadowless is-info">
          <div class="panel-heading">
            <span class="brand-title">Countries</span>
            <span>
              <button
                class="button is-pulled-right is-small is-success"
                @click="goToAddCountry()"
              >
                New
              </button>
            </span>
          </div>
          <div class="panel-block" style="display: inherit !important">
            <div class="columns">
              <div class="column is-3">
                <b-field>
                  <b-button
                    label="Clear selected"
                    class="is-outlined"
                    type="is-danger"
                    :disabled="!selected_country"
                    @click="selected_country = null"
                  />
                </b-field>
              </div>

              <div class="column is-9" v-if="selected_country">
                <div class="field has-addons is-justify-content-flex-end">
                  <p class="control">
                    <button class="button" @click="goToUpdateCountry()">
                      <span>Edit</span>
                    </button>
                  </p>
                </div>
              </div>
            </div>

            <b-table
              v-if="countries.length"
              :data="countries"
              :columns="columns"
              :selected.sync="selected_country"
              striped
            ></b-table>

            <div v-else class="notification is-light">
              No Countries yet <br />
              <b-button @click="goToAddCountry()"> New </b-button>
            </div>
          </div>
        </article>
      </b-tab-item>
      <b-tab-item>
        <template #header>
          <b-icon icon="source-pull"></b-icon>
          <span> {{ update ? 'Update' : 'Add' }} Country </span>
        </template>
        <!-- form -->
        <b-field label="Name">
          <b-input
            v-model="country_form.name"
            placeholder="Nigeria"
            required
          ></b-input>
        </b-field>

        <b-field label="Short Code">
          <b-input
            v-model="country_form.short_code"
            placeholder="NG"
            required
          ></b-input>
        </b-field>

        <b-field label="Currency Code">
          <b-input
            v-model="country_form.currency_code"
            placeholder="NGN"
            required
          ></b-input>
        </b-field>

        <b-field label="Phonenumber Code">
          <b-input
            v-model="country_form.phonenumber_code"
            placeholder="+234"
            required
          ></b-input>
        </b-field>

        <b-field label="Payment Methods">
          <b-taginput
            v-model="country_form.payment_methods"
            ellipsis
            placeholder="card, ussd"
            aria-close-label="remove payment method"
            required
          ></b-taginput>
        </b-field>

        <b-field label="Local Processing Fee">
          <b-input
            v-model="country_form.fw_processing_fees.local"
            placeholder="1.4"
            required
          ></b-input>
        </b-field>

        <b-field label="International Process Fee">
          <b-input
            v-model="country_form.fw_processing_fees.international"
            placeholder="3.8"
            required
          ></b-input>
        </b-field>

        <b-field label="Dollar Exchange Rate">
          <b-input
            v-model="country_form.dollar_exchange_rate"
            placeholder="380"
            required
          ></b-input>
        </b-field>

        <!-- submit button -->
        <b-button
          :loading="loading"
          class="is-success"
          @click="update ? updateCountry() : addCountry()"
          >{{ update ? 'Update' : 'Add' }}</b-button
        >

        <b-button
          :loading="loading"
          class="is-outlined is-danger"
          @click="cancel()"
          >Cancel</b-button
        >
      </b-tab-item>
    </b-tabs>

    <b-loading
      :is-full-page="true"
      v-model="loading"
      :can-cancel="true"
    ></b-loading>
  </div>
</template>
