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
        <v-card>
          <v-card-title>Категория</v-card-title>
          <v-card-text>
            <v-row>
              <v-col>
                <v-text-field label="Название" v-model="categoryTitle"/>
              </v-col>
              <v-col>
                <v-text-field label="Иконка" placeholder="mdi-xxx" v-model="categoryIcon"/>
              </v-col>
            </v-row>
          </v-card-text>
          <v-card-actions>
            <v-btn color="success" @click="addCategory">Добавить</v-btn>
          </v-card-actions>
        </v-card>
      </v-col>
      <v-col>
        <v-card>
          <v-card-title>Подкатегория</v-card-title>
          <v-card-text>
            <v-row>
              <v-col>
                <v-select label="Категория" :items="$store.getters.categories" item-value="id" item-text="title"
                          v-model="selectedCategory"/>
              </v-col>
              <v-col>
                <v-text-field label="Название" v-model="subCategoryTitle"/>
              </v-col>
            </v-row>
          </v-card-text>
          <v-card-actions>
            <v-btn color="success" @click="addSubCategory">Добавить</v-btn>
          </v-card-actions>
        </v-card>
      </v-col>
    </v-row>
    <v-row>
      <v-col align="center">
        <v-btn color="success" @click="saveCategories">Сохранить в базу</v-btn>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
export default {
  name: 'Categories',
  data: () => ({
    categoryTitle: undefined,
    subCategoryTitle: undefined,
    categoryIcon: undefined,
    subCategoryIcon: undefined,
    selectedCategory: undefined
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
      this.$toast.success(`Категория ${this.categoryTitle} успешно добавлена`)
    },
    addSubCategory() {
      let index = this.$store.getters.categories.findIndex((x) => {
        return x.id === this.selectedCategory
      })
      let id = this.getRandomCategoryId()
      this.$store.dispatch('findSubCategoryId', id).then((response) => {
        if (response) {
          this.$toast.error(`Какой ты неудачливый. Попался рандомный ID (${id}) который уже существует`)
        } else {
          let payload = {
            index: index,
            item: {
              active: false,
              id: id,
              title: this.subCategoryTitle
            }
          }
          this.$store.commit('addSubCategory', payload)
          this.$toast.success(`Подкатегория ${this.subCategoryTitle} успешно добавлена`)
        }
      })
    },
    getRandomCategoryId() {
      return Math.floor(Math.random() * (1000 - 100)) + 100
    },
    saveCategories() {
      this.$store.dispatch('saveCategories').then((response) => {
        if (response.data.results === 1) {
          this.$toast.success('Категории успешно сохранены')
        }
      })
    }
  }
}
</script>
