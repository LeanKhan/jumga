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

        <b-table v-if="sales.length" :data="sales" :columns="columns"></b-table>
        <div v-else class="notification is-light">
          You don't have any Sales yet. <br />
          <!-- <b-button @click="activeTab = 1"> New </b-button> -->
        </div>
      </b-tab-item>
      <b-tab-item>
        <template #header>
          <span> Dispatch Rider </span>
        </template>
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
      </b-tab-item>
    </b-tabs>

    <b-loading
      :is-full-page="true"
      v-model="loading"
      :can-cancel="true"
    ></b-loading>
  </div>
</template>
