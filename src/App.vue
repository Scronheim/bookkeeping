<template>
  <v-app>
    <v-app-bar app color="primary" dark>Домашняя бухгалтерия семьи Шарко</v-app-bar>
    <v-main>
      <router-view/>
    </v-main>
  </v-app>
</template>

<script>
export default {
  name: 'App',
  mounted() {
    this.$vuetify.theme.dark = true
    let dates = {
      startDate: this.$moment().startOf('month').format('YYYY-MM-DD'),
      endDate: this.$moment().endOf('month').format('YYYY-MM-DD')
    }
    this.$store.dispatch('getExpenses', dates)
    this.$store.dispatch('getIncomes', dates)
  },
  data: () => ({
    //
  }),
};
</script>
