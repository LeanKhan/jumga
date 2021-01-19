<template type="x-template" id="office-component">
  <div>
    <b-tabs v-model="activeTab" vertical type="is-boxed">
      <b-tab-item>
        <template #header>
          <b-icon icon="information-outline"></b-icon>
          <span>
            Sales <b-tag rounded> {{ sales.length }} </b-tag>
          </span>
        </template>

        <div class="columns">
          <div class="column is-3">
            <div
              class="card has-text-centered has-text-white has-background-success p-5"
            >
              <h5>Total Sales</h5>
              <span class="has-text-weight-medium">
                {{ country.currency_code }}
                {{ (totalSales * country.dollar_exchange_rate) | currency }}
              </span>
            </div>
          </div>
        </div>

        <b-table v-if="sales.length" :data="sales">
          <b-table-column field="id" label="Id" v-slot="props">
            {{ props.row.transaction.id }}
          </b-table-column>

          <b-table-column field="shop_money" label="Money Made" v-slot="props">
            {{ country.currency_code }}
            {{
              (props.row.transaction.meta.shop_money *
                country.dollar_exchange_rate)
                | currency
            }}
          </b-table-column>

          <b-table-column field="create_at" label="Date" v-slot="props">
            {{
              new Date(props.row.transaction.created_at).toLocaleDateString()
            }}
          </b-table-column>
        </b-table>
        <div v-else class="notification is-light">
          You don't have any Sales yet. <br />
          <!-- <b-button @click="activeTab = 1"> New </b-button> -->
        </div>
      </b-tab-item>
      <b-tab-item>
        <template #header>
          <span> Dispatch Rider </span>
        </template>
        <div class="container">
          <div class="columns">
            <div class="column is-3">
              <div class="card" v-if="shop">
                <div class="card-image">
                  <figure class="image is-4by4">
                    <img
                      src="http://www.radfaces.com/images/avatars/alex-murphy.jpg"
                      alt="Rental Rates and Rental Prices in Phoenix, AZ"
                    />
                  </figure>
                </div>
                <div class="card-content">
                  <h4 class="subheader">
                    {{ shop.dispatch_rider.firstname }}
                    {{ shop.dispatch_rider.lastname }}
                  </h4>
                  <ul>
                    <li>Number: {{ shop.dispatch_rider.phonenumber }}</li>
                  </ul>
                </div>
              </div>
              <div v-else class="notification is-light">
                loading...
                <!-- <b-button @click="activeTab = 1"> New </b-button> -->
              </div>
            </div>
          </div>
        </div>
      </b-tab-item>
      <b-tab-item>
        <template #header>
          <span> Settings </span>
        </template>

        <div class="notification is-light has-text-centered">
          Close Shop (permanently)

          <br />

          <b-button
            :class="{
              'is-loading': loading,
              'is-disabled': loading,
              disabled: loading,
            }"
            class="is-danger"
            @click="deleteShop()"
          >
            DELETE
          </b-button>
        </div>
      </b-tab-item>
    </b-tabs>

    <b-loading
      :is-full-page="true"
      v-model="loading"
      :can-cancel="true"
    ></b-loading>
  </div>
</template>
