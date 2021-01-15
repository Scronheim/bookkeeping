<template>
  <v-card>
    <v-card-title>{{ title }}</v-card-title>
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
                           @click="selectCategory(child)" :style="child.id === expense.category ? 'color: #2196f3 !important': ''">
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
      <slot name="actions"/>
    </v-card-actions>
  </v-card>
</template>

<script>
export default {
  name: "ExpenseCard",
  props: {
    title: {
      type: String,
      default: 'Добавление расхода'
    },
    expense: {
      type: Object,
      required: true
    }
  },
  data: () => ({
    dateMenu: false
  }),
  methods: {
    selectCategory(child) {
      this.$emit('selectCategory', child)
    }
  }
}
</script>

<style scoped>

</style>
