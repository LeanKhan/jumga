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

        <b-table
          v-if="countries.length"
          :data="countries"
          :columns="columns"
        ></b-table>

        <div v-else class="notification is-light">
          No Countries yet <br />
          <b-button @click="activeTab = 1"> New </b-button>
        </div>
      </b-tab-item>
      <b-tab-item>
        <template #header>
          <b-icon icon="source-pull"></b-icon>
          <span> Add Country </span>
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

        <b-field label="Dollar Exchange Rate">
          <b-input
            v-model="country_form.dollar_exchange_rate"
            placeholder="380"
            required
          ></b-input>
        </b-field>

        <!-- submit button -->
        <b-button :loading="loading" class="is-success" @click="addCountry()"
          >Add</b-button
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
