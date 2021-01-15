<template>
  <v-card>
    <v-card-title>{{ title }}</v-card-title>
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
      <slot name="actions"/>
    </v-card-actions>
  </v-card>
</template>

<script>
export default {
  name: "IncomeCard",
  props: {
    title: {
      type: String,
      default: 'Добавление дохода'
    },
    income: {
      type: Object,
      required: true
    }
  },
  data: () => ({
    dateIncomeMenu: false
  })
}
</script>

<style scoped>

</style>
