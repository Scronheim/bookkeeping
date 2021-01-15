<template>
  <v-container>
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
          <v-card-title>Расходы за
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
                <v-btn v-bind="attrs" v-on="on">{{ monthExpense | textDate }}</v-btn>
              </template>
              <v-date-picker
                  locale="ru"
                  v-model="monthExpense"
                  type="month"
                  no-title
                  scrollable
                  @input="refreshData"
              />
            </v-menu>
            <v-spacer/>
            <v-btn link to="/categories">Редактор категорий</v-btn>
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
                      <th class="text-left">Действия</th>
                    </tr>
                    </thead>
                    <tbody>
                    <tr v-for="(item, index) in $store.getters.expenses.slice(0, 10)" :key="index" :title="item.comment">
                      <td>
                        <v-icon color="error">mdi-minus</v-icon>
                        {{ humanCategory(item.category) }}
                      </td>
                      <td>{{ item.sum }}р.</td>
                      <td>
                        <v-btn color="primary" icon @click="editExpense(item)"><v-icon>mdi-pencil</v-icon></v-btn>
                        <v-btn color="error" icon @click="deleteExpense(item)"><v-icon>mdi-close</v-icon></v-btn>
                      </td>
                    </tr>
                    <tr>
                      <td>Итого:</td>
                      <td><span class="red--text">{{ monthExpensesSum }}</span>р.</td>
                      <td>
                        Остаток: <span :class="monthIncomesSum-monthExpensesSum < 0 ? 'red--text': 'green--text'">{{ monthIncomesSum-monthExpensesSum }}</span>р.
                      </td>
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
                      <th class="text-left">Действия</th>
                    </tr>
                    </thead>
                    <tbody>
                    <tr v-for="(item, index) in $store.getters.incomes.slice(0, 10)" :key="index" :title="`${item.comment} (${item.date})`">
                      <td>
                        <v-icon color="success">mdi-plus</v-icon>
                        {{ humanIncomeSource(item.source) }}
                      </td>
                      <td>{{ item.sum }}р.</td>
                      <td>
                        <v-btn color="primary" icon @click="editIncome(item)"><v-icon>mdi-pencil</v-icon></v-btn>
                        <v-btn color="error" icon @click="deleteIncome(item)"><v-icon>mdi-close</v-icon></v-btn>
                      </td>
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
    <v-row>
      <v-col align="center">
        <pie-chart v-if="expenseChartLoaded" :chart-data="expenseChartData" :options="chartOptions"/>
      </v-col>
      <v-col align="center">
        <pie-chart v-if="incomeChartLoaded" :chart-data="incomeChartData" :options="chartOptions"/>
      </v-col>
    </v-row>

    <v-dialog v-model="addExpenseDialog" width="60%" persistent :fullscreen="$vuetify.breakpoint.mobile">
      <expense-card :expense="expense" @selectCategory="selectCategory">
        <template v-slot:actions>
          <v-btn color="error" @click="addExpenseDialog = false">Закрыть</v-btn>
          <v-btn color="success" @click="addExpense">Добавить</v-btn>
        </template>
      </expense-card>
    </v-dialog>

    <v-dialog v-model="editExpenseDialog" width="60%" persistent :fullscreen="$vuetify.breakpoint.mobile">
      <expense-card :expense="expense" @selectCategory="selectCategory" title="Редактирование расхода">
        <template v-slot:actions>
          <v-btn color="error" @click="editExpenseDialog = false">Закрыть</v-btn>
          <v-btn color="success" @click="saveExpense">Сохранить</v-btn>
        </template>
      </expense-card>
    </v-dialog>

    <v-dialog v-model="addIncomeDialog" width="60%" persistent :fullscreen="$vuetify.breakpoint.mobile">
      <income-card :income="income">
        <template v-slot:actions>
          <v-btn color="error" @click="addIncomeDialog = false">Закрыть</v-btn>
          <v-btn color="success" @click="addIncome">Добавить</v-btn>
        </template>
      </income-card>
    </v-dialog>

    <v-dialog v-model="editIncomeDialog" width="60%" persistent :fullscreen="$vuetify.breakpoint.mobile">
      <income-card :income="income" title="Редактирование дохода">
        <template v-slot:actions>
          <v-btn color="error" @click="editIncomeDialog = false">Закрыть</v-btn>
          <v-btn color="success" @click="saveIncome">Сохранить</v-btn>
        </template>
      </income-card>
    </v-dialog>
  </v-container>
</template>

<script>
// @ is an alias to /src
import PieChart from '@/components/PieChart'
import ExpenseCard from '@/components/ExpenseCard'
import IncomeCard from '@/components/IncomeCard'
const COLORS = ['#D81B60', '#8E24AA', '#EF5350', '#5E35B1', '#3949AB', '#1E88E5', '#00897B', '#43A047',
  '#C0CA33', '#FDD835']
export default {
  name: 'Home',
  components: { PieChart, ExpenseCard, IncomeCard },
  mounted() {
    this.refreshData()
  },
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
    editExpenseDialog: false,
    addIncomeDialog: false,
    editIncomeDialog: false,
    monthExpense: new Date().toISOString().substr(0, 7),
    monthExpenseMenu: false,
    dateMenu: false,
    expenseChartLoaded: false,
    incomeChartLoaded: false,
    expenseChartData: {
      labels: [],
      datasets: [
        {
          backgroundColor: COLORS,
          data: []
        }
      ]
    },
    incomeChartData: {
      labels: [],
      datasets: [
        {
          backgroundColor: COLORS,
          data: []
        }
      ]
    },
    chartOptions: {responsive: false},
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
    prepareCharts() {
      this.prepareExpenseChart()
      this.prepareIncomesChart()
    },
    prepareExpenseChart() {
      let ids = []
      let temp
      let sum
      let values = []
      this.$store.getters.expenses.forEach((x) => {
        ids.push(x.category)
      })
      ids = this.$_.uniq(ids)
      this.expenseChartData.labels = []
      ids.forEach((x) => {
        this.expenseChartData.labels.push(this.humanCategory(x))
      })
      ids.forEach((id) => {
        sum = 0
        temp = this.$store.getters.expenses.filter((x) => {
          return x.category === id
        })
        temp.forEach((x) => {
          sum+=x.sum
        })
        values.push(sum)
      })
      this.expenseChartData.datasets[0].data = values
      this.expenseChartLoaded = true
    },
    prepareIncomesChart() {
      let ids = []
      let temp
      let sum
      let values = []
      this.$store.getters.incomes.forEach((x) => {
        ids.push(x.source)
      })
      ids = this.$_.uniq(ids)
      this.incomeChartData.labels = []
      ids.forEach((x) => {
        this.incomeChartData.labels.push(this.humanIncomeSource(x))
      })
      ids.forEach((id) => {
        sum = 0
        temp = this.$store.getters.incomes.filter((x) => {
          return x.source === id
        })
        temp.forEach((x) => {
          sum+=x.sum
        })
        values.push(sum)
      })
      this.incomeChartData.datasets[0].data = values
      this.incomeChartLoaded = true
    },
    refreshData() {
      let payload = {
        startDate: this.$moment(this.monthExpense, 'YYYY-MM').startOf('month').format('YYYY-MM-DD'),
        endDate: this.$moment(this.monthExpense, 'YYYY-MM').endOf('month').format('YYYY-MM-DD')
      }
      this.incomeChartLoaded = false
      this.expenseChartLoaded = false
      Promise.all([this.$store.dispatch('getExpenses', payload), this.$store.dispatch('getIncomes', payload)]).then(() => {
        this.prepareCharts()
      })
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
        this.refreshData()
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
        this.refreshData()
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
    },
    editExpense(expense) {
      this.expense = this.$_.cloneDeep(expense)
      this.editExpenseDialog = true
    },
    editIncome(income) {
      this.income = this.$_.cloneDeep(income)
      this.editIncomeDialog = true
    },
    saveExpense() {
      this.$store.dispatch('saveExpense', this.expense).then((response) => {
        if (response.data.success) {
          this.$toast.success('Успешно сохранено')
        } else {
          this.$toast.error('Что то пошло не так')
        }
        this.editExpenseDialog = false
        this.refreshData()
      })
    },
    saveIncome() {
      this.$store.dispatch('saveIncome', this.income).then((response) => {
        if (response.data.success) {
          this.$toast.success('Успешно сохранено')
        } else {
          this.$toast.error('Что то пошло не так')
        }
        this.editIncomeDialog = false
        this.refreshData()
      })
    },
    deleteExpense(item) {
      if (confirm(`Вы действительно хотите удалить расход на сумму ${item.sum}р?`)) {
        this.$store.dispatch('deleteExpense', item.id).then(() => {
          this.refreshData()
        })
      }
    },
    deleteIncome(item) {
      if (confirm(`Вы действительно хотите удалить доход на сумму ${item.sum}р?`)) {
        this.$store.dispatch('deleteIncome', item.id).then(() => {
          this.refreshData()
        })
      }
    }
  }
}
</script>
