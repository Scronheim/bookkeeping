<template>
  <v-container>
    <v-row>
      <v-col cols="2">
        <v-menu
            ref="monthMenu"
            v-model="monthExpenseMenu"
            :close-on-content-click="true"
            transition="scale-transition"
            offset-y
            max-width="290px"
            min-width="auto"
        >
          <template v-slot:activator="{ on, attrs }">
            <v-text-field
                v-model="monthExpense"
                label="Выбери месяц"
                prepend-icon="mdi-calendar"
                readonly
                v-bind="attrs"
                v-on="on"
            ></v-text-field>
          </template>
          <v-date-picker
              locale="ru"
              v-model="monthExpense"
              type="month"
              no-title
              scrollable
              @input="changeDate"
          />
        </v-menu>
      </v-col>
    </v-row>
    <v-row>
      <v-col style="padding-top: 30px" :cols="$vuetify.breakpoint.mobile ? '12': '6'">
        <v-card>
          <v-tooltip top>
            <template v-slot:activator="{ on }">
              <v-btn color="success" @click="addExpenseDialog = true" small absolute top right fab v-on="on">
                <v-icon>mdi-plus</v-icon>
              </v-btn>
            </template>
            <span>Добавить расход</span>
          </v-tooltip>
          <v-card-title>Расходы за {{ monthExpense | textDate }}<v-spacer/>
            Остаток на текущий момент: <span :class="monthIncomesSum-monthExpensesSum < 0 ? 'red--text': 'green--text'">{{ monthIncomesSum-monthExpensesSum }}</span>р.
          </v-card-title>
          <v-card-text>
            <v-row>
              <v-col>
                <v-simple-table>
                  <template v-slot:default>
                    <thead>
                    <tr>
                      <th class="text-left">Категория</th>
                      <th class="text-left">Сумма</th>
                    </tr>
                    </thead>
                    <tbody>
                    <tr v-for="(item, index) in $store.getters.expenses.slice(0, 10)" :key="index" :title="item.comment">
                      <td>{{ humanCategory(item.category) }}</td>
                      <td>{{ item.sum }}р.</td>
                    </tr>
                    <tr>
                      <td>Итого:</td>
                      <td><span class="red--text">{{ monthExpensesSum }}</span>р.</td>
                    </tr>
                    </tbody>
                  </template>
                </v-simple-table>
              </v-col>
            </v-row>
          </v-card-text>
        </v-card>
      </v-col>
      <v-col style="padding-top: 30px" :cols="$vuetify.breakpoint.mobile ? '12': '6'">
        <v-card>
          <v-tooltip top>
            <template v-slot:activator="{ on }">
              <v-btn color="success" @click="addIncomeDialog = true" small absolute top right fab v-on="on">
                <v-icon>mdi-plus</v-icon>
              </v-btn>
            </template>
            <span>Добавить доход</span>
          </v-tooltip>
          <v-card-title>Доходы за {{ monthExpense | textDate }}</v-card-title>
          <v-card-text>
            <v-row>
              <v-col>
                <v-simple-table>
                  <template v-slot:default>
                    <thead>
                    <tr>
                      <th class="text-left">Категория</th>
                      <th class="text-left">Сумма</th>
                    </tr>
                    </thead>
                    <tbody>
                    <tr v-for="(item, index) in $store.getters.incomes.slice(0, 10)" :key="index" :title="item.comment">
                      <td>{{ humanIncomeSource(item.source) }}</td>
                      <td>{{ item.sum }}р.</td>
                    </tr>
                    <tr>
                      <td>Итого:</td>
                      <td><span class="green--text">{{ monthIncomesSum }}</span>р.</td>
                    </tr>
                    </tbody>
                  </template>
                </v-simple-table>
              </v-col>
            </v-row>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>

    <v-dialog v-model="addExpenseDialog" width="60%" persistent :fullscreen="$vuetify.breakpoint.mobile">
      <v-card>
        <v-card-title>Добавить расходы</v-card-title>
        <v-card-text>
          <v-row>
            <v-col>
              <v-list>
                <v-list-group v-for="(item, index) in $store.getters.categories" :key="index"
                              :value="false"
                              :prepend-icon="item.icon"
                >
                  <template v-slot:activator>
                    <v-list-item-title>{{ item.title }}</v-list-item-title>
                  </template>

                  <v-list-item style="padding-left: 70px" v-for="(child, idx) in item.items" :key="idx"
                               @click="selectCategory(child)" :style="child.active ? 'color: #2196f3 !important': ''">
                    {{ child.title }}
                  </v-list-item>
                </v-list-group>
              </v-list>
            </v-col>
            <v-col>
              <v-text-field label="Сумма" append-icon="mdi-currency-rub" v-model="expense.sum"/>
            </v-col>
            <v-col>
              <v-menu
                  v-model="dateMenu"
                  :close-on-content-click="false"
                  :nudge-right="40"
                  transition="scale-transition"
                  offset-y
                  min-width="auto"
              >
                <template v-slot:activator="{ on, attrs }">
                  <v-text-field
                      v-model="expense.date"
                      label="Дата"
                      prepend-icon="mdi-calendar"
                      readonly
                      v-bind="attrs"
                      v-on="on"
                  ></v-text-field>
                </template>
                <v-date-picker
                    locale="ru"
                    v-model="expense.date"
                    @input="dateMenu = false"
                ></v-date-picker>
              </v-menu>
            </v-col>
          </v-row>
          <v-row>
            <v-col>
              <v-textarea rows="2" label="Комментарий" v-model="expense.comment"/>
            </v-col>
          </v-row>
        </v-card-text>
        <v-card-actions>
          <v-spacer/>
          <v-btn color="error" @click="addExpenseDialog = false">Закрыть</v-btn>
          <v-btn color="success" @click="addExpense">Сохранить</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <v-dialog v-model="addIncomeDialog" width="60%" persistent :fullscreen="$vuetify.breakpoint.mobile">
      <v-card>
        <v-card-title>Добавить доход</v-card-title>
        <v-card-text>
          <v-row>
            <v-col>
              <v-select label="Источник" :items="$store.getters.incomeSources" item-text="title" item-value="id" v-model="income.source"/>
            </v-col>
            <v-col>
              <v-text-field label="Сумма" append-icon="mdi-currency-rub" v-model="income.sum"/>
            </v-col>
            <v-col>
              <v-menu
                  v-model="dateIncomeMenu"
                  :close-on-content-click="false"
                  :nudge-right="40"
                  transition="scale-transition"
                  offset-y
                  min-width="auto"
              >
                <template v-slot:activator="{ on, attrs }">
                  <v-text-field
                      v-model="income.date"
                      label="Дата"
                      prepend-icon="mdi-calendar"
                      readonly
                      v-bind="attrs"
                      v-on="on"
                  ></v-text-field>
                </template>
                <v-date-picker
                    locale="ru"
                    v-model="income.date"
                    @input="dateIncomeMenu = false"
                ></v-date-picker>
              </v-menu>
            </v-col>
          </v-row>
          <v-row>
            <v-col>
              <v-textarea label="Комментарий" rows="2" v-model="income.comment"/>
            </v-col>
          </v-row>
        </v-card-text>
        <v-card-actions>
          <v-spacer/>
          <v-btn color="error" @click="addIncomeDialog = false">Закрыть</v-btn>
          <v-btn color="success" @click="addIncome">Сохранить</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-container>
</template>

<script>
// @ is an alias to /src
export default {
  name: 'Home',
  computed: {
    monthExpensesSum() {
      let sum = 0
      this.$store.getters.expenses.forEach((item) => {
        sum+=item.sum
      })
      return sum
    },
    monthIncomesSum() {
      let sum = 0
      this.$store.getters.incomes.forEach((item) => {
        sum+=item.sum
      })
      return sum
    }
  },
  data: () => ({
    addExpenseDialog: false,
    addIncomeDialog: false,
    monthExpense: new Date().toISOString().substr(0, 7),
    monthExpenseMenu: false,
    dateMenu: false,
    dateIncomeMenu: false,
    expense: {
      category: null,
      sum: null,
      date: new Date().toJSON().split('T')[0],
      comment: null
    },
    income: {
      source: null,
      sum: null,
      date: new Date().toJSON().split('T')[0],
      comment: null
    }
  }),
  methods: {
    changeDate() {
      let payload = {
        startDate: this.$moment(this.monthExpense, 'YYYY-MM').startOf('month').format('YYYY-MM-DD'),
        endDate: this.$moment(this.monthExpense, 'YYYY-MM').endOf('month').format('YYYY-MM-DD')
      }
      this.$store.dispatch('getExpenses', payload)
      this.$store.dispatch('getIncomes', payload)
    },
    selectCategory(cat) {
      this.$store.dispatch('clearActiveCategories').then(() => {
        cat.active = !cat.active
        this.expense.category = cat.id
      })
    },
    clearExpenseFields() {
      this.expense = {
        category: null,
        sum: null,
        date: new Date().toJSON().split('T')[0],
        comment: null
      }
    },
    clearIncomeFields() {
      this.income = {
        source: null,
        sum: null,
        date: new Date().toJSON().split('T')[0],
        comment: null
      }
    },
    addExpense() {
      this.$store.dispatch('addExpense', this.expense).then((response) => {
        if (response.data.success) {
          this.clearExpenseFields()
          this.$toast.success('Успешно сохранено')
        } else {
          this.$toast.error('Что то пошло не так')
        }
      }).finally(() => {
        this.$store.dispatch('getExpenses')
      })
    },
    addIncome() {
      this.$store.dispatch('addIncome', this.income).then((response) => {
        if (response.data.success) {
          this.clearIncomeFields()
          this.$toast.success('Успешно сохранено')
        } else {
          this.$toast.error('Что то пошло не так')
        }
      }).finally(() => {
        this.$store.dispatch('getIncomes')
      })
    },
    humanCategory(id) {
      let category
      this.$store.getters.categories.forEach((item) => {
        item.items.forEach((child) => {
          if (child.id === id) {
            category = `${item.title} - ${child.title}`
          }
        })
      })
      return category
    },
    humanIncomeSource(id) {
      return this.$store.getters.incomeSources.find((item) => {
        return item.id === id
      }).title
    }
  }
}
</script>
