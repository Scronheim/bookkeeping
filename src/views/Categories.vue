<template>
  <v-container>
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

            <v-list-item style="padding-left: 70px" v-for="(child, idx) in item.items" :key="idx">
              {{ child.title }}
            </v-list-item>
          </v-list-group>
        </v-list>
      </v-col>
      <v-col>
        <v-menu
            v-model="categoryMenu"
            :close-on-content-click="false"
            :nudge-right="40"
            transition="scale-transition"
            offset-y
            min-width="auto"
        >
          <template v-slot:activator="{ on, attrs }">
            <v-btn v-on="on" v-bind="attrs">Добавить категорию</v-btn>
          </template>
          <v-card>
            <v-card-title>Категория</v-card-title>
            <v-card-text>
              <v-row>
                <v-col>
                  <v-text-field label="Название" v-model="categoryTitle"/>
                </v-col>
                <v-col>
                  <v-text-field label="Иконка" v-model="categoryIcon"/>
                </v-col>
              </v-row>
            </v-card-text>
            <v-card-actions>
              <v-btn color="success" @click="addCategory">Добавить</v-btn>
            </v-card-actions>
          </v-card>
        </v-menu>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
export default {
  name: 'Categories',
  data: () => ({
    categoryMenu: false,
    categoryTitle: undefined,
    categoryIcon: undefined
  }),
  methods: {
    addCategory() {
      let payload = {
        icon: this.categoryIcon,
        id: this.$store.getters.categories[this.$store.getters.categories.length-1].id+1,
        title: this.categoryTitle,
        items: []
      }
      this.$store.commit('addCategory', payload)
      this.categoryMenu = false
    }
  }
}
</script>
