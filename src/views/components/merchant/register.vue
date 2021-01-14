<template type="x-template" id="register-form-component">
  <div>
    <b-steps :value="step" :has-navigation="false" type="is-success">
      <b-step-item :step="1" label="Register">
        <!-- <p class="subheader body has-text-centered">Create your Account first</p> -->
        <form method="POST" action="/signup?returnTo=/register?step=1">
          <div class="field">
            <div class="control">
              <label class="label has-text-left" for="firstname"
                >Firstname</label
              >

              <input
                class="input"
                name="firstname"
                placeholder="firstname"
                required
              />
            </div>
          </div>

          <div class="field">
            <div class="control">
              <label class="label has-text-left" for="lastname">Lastname</label>

              <input
                class="input"
                name="lastname"
                type="text"
                placeholder="lastname"
                required
              />
            </div>
          </div>

          <div class="field">
            <div class="control">
              <label class="label has-text-left" for="phonenumber"
                >Phonenumber</label
              >

              <input
                class="input"
                name="phonenumber"
                type="text"
                placeholder="phonenumber"
              />
            </div>
          </div>

          <div class="field">
            <div class="control">
              <label class="label has-text-left" for="phonenumber">Email</label>

              <input
                class="input"
                name="email"
                type="email"
                placeholder="email"
                required
              />
            </div>
          </div>

          <div class="field">
            <div class="control">
              <label class="label has-text-left" for="password">Password</label>

              <input
                class="input"
                name="password"
                type="password"
                placeholder="password"
                required
              />
            </div>
          </div>

          <div class="field">
            <div class="control">
              <label class="label has-text-left" for="confirmPassword"
                >Confirm Password</label
              >

              <input
                class="input"
                name="confirmPassword"
                type="password"
                placeholder="confirm password"
              />
            </div>
          </div>
          <button class="button is-block is-primary is-fullwidth is-medium">
            Create Account
          </button>
          <br />
          <small
            >Already have an account?
            <a class="has-text-primary" href="/signin?returnTo=/register?step=1"
              >Sign in then Setup Shop</a
            ></small
          >
        </form>
      </b-step-item>
      <b-step-item :step="2" label="Setup">
        <form method="POST" action="/shops/new?returnTo=/register?step=2">
          <div class="field">
            <div class="control">
              <label class="label has-text-left" for="shopName"
                >Shop Name</label
              >

              <input
                class="input"
                name="shopName"
                placeholder="My Shop"
                required
              />
            </div>
          </div>

          <div class="field">
            <div class="control">
              <label class="label has-text-left" for="description"
                >Description</label
              >

              <textarea
                class="textarea is-warning"
                name="description"
                type="text"
                placeholder="We sell all things :)"
                rows="3"
                required
              ></textarea>
              <!-- NOT CLOSING THIS textarea caused major problems. The Javascript on the page wasn't loadigg...
              I was very confused :/ - 1 AM Jan 11, 2021 -->
            </div>
          </div>

          <div class="field">
            <div class="control">
              <label class="label has-text-left" for="category"
                >Shop Category</label
              >

              <div class="select is-block">
                <select name="category" style="width: 100%">
                  <option v-for="(c, i) in categories" :key="i" :value="c.slug">
                    {{ c.name }}
                  </option>
                </select>
              </div>
            </div>
          </div>

          <div class="field">
            <div class="control">
              <label class="label has-text-left" for="country">Country</label>

              <div class="select is-block">
                <select name="country" style="width: 100%">
                  <option
                    v-for="(c, i) in countries"
                    :key="i"
                    :value="c.short_code"
                  >
                    {{ c.name }}
                  </option>
                </select>
              </div>
            </div>
          </div>

          <button
            class="button is-block is-warning jumga-yellow is-fullwidth is-medium"
          >
            Create Shop and Pay $20*
          </button>
          <p class="has-text-grey"><small>*Shop opening fee</small></p>
          <br />
          <small>
            <button
              type="submit"
              formaction="/shops/new?skipPayment=true"
              class="button is-light is-small"
            >
              Pay fee later (at your own risk :)
            </button></small
          >
        </form>
      </b-step-item>
      <b-step-item :step="3" label="Add Account">
        <form
          method="POST"
          action="/shops/dashboard/add-account?returnTo=/shops/dashboard"
        >
          <div class="field">
            <div class="control">
              <label class="label has-text-left" for="account_number"
                >Account Number</label
              >

              <input
                class="input"
                name="account_number"
                type="text"
                placeholder="account number"
                required
              />
            </div>
          </div>

          <div class="field">
            <div class="control">
              <label class="label has-text-left" for="account_name"
                >Account Name</label
              >

              <input
                class="input"
                name="account_name"
                type="text"
                placeholder="account name"
                required
              />
            </div>
          </div>

          <div class="field">
            <div class="control">
              <label class="label has-text-left" for="business_email"
                >Business Email</label
              >

              <input
                class="input"
                name="business_email"
                type="text"
                placeholder="business_email"
                required
              />
            </div>
          </div>

          <div class="field">
            <div class="control">
              <label class="label has-text-left" for="bank">Bank</label>

              <input
                class="input"
                name="bank"
                type="text"
                value="044"
                placeholder="bank"
                required
              />
            </div>
          </div>

          <!-- <div class="field">
            <div class="control">
              <label class="label has-text-left" for="country">Country</label>

              <input
                class="input"
                name="country"
                type="text"
                value="NG"
                placeholder="country"
                required
              />
            </div>
          </div>

          <div class="field">
            <div class="control">
              <label class="label has-text-left" for="currency">Currency</label>

              <input
                class="input"
                name="currency"
                type="text"
                placeholder="currency"
                value="NGN"
                required
              />
            </div>
          </div> -->

          <button class="button is-block is-success is-fullwidth is-medium">
            Add Account
          </button>
          <br />
          <a
            href="/shops/dashboard"
            class="button is-block is-success is-fullwidth is-medium"
          >
            Skip this bull
          </a>
          <!-- <small
              >Not registered yet?
              <a class="has-text-primary" href="/signup">Sign up</a></small
            > -->
        </form>
      </b-step-item>
    </b-steps>
  </div>
</template>
