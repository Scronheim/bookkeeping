<template>
  <v-container>
    <v-row>
      <v-col cols="2">
        <v-btn color="success" @click="addDialog = true">Добавить расход</v-btn>
      </v-col>
      <v-col>
        <v-btn color="success" @click="addDialog = true">Добавить приход</v-btn>
      </v-col>
    </v-row>
    <v-dialog v-model="addDialog" width="60%">
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
          <v-btn color="error" @click="addDialog = false">Закрыть</v-btn>
          <v-btn color="success" @click="addExpense">Сохранить</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-container>
</template>

<script>
// @ is an alias to /src
export default {
  name: 'Home',
  data: () => ({
    addDialog: false,
    dateMenu: false,
    expense: {
      category: null,
      sum: null,
      date: new Date().toJSON().split('T')[0],
      comment: null
    },
  }),
  methods: {
    selectCategory(cat) {
      this.$store.dispatch('clearActiveCategories').then(() => {
        cat.active = !cat.active
        this.expense.category = cat.id
      })
    },
    clearFields() {
      this.expense = {
        category: null,
        sum: null,
        date: new Date().toJSON().split('T')[0],
        comment: null
      }
    },
    addExpense() {
      this.$store.dispatch('addExpense', this.expense).then((response) => {
        if (response.data.success) {
          this.clearFields()
          this.$toast.success('Успешно сохранено')
        }
      })
    }
  }
}
</script>
