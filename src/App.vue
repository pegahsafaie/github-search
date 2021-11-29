<template>
  <v-app>
    <v-app-bar app color="purple">
      <v-toolbar-title>SEARCH IN GITHUB REPOSITORIES</v-toolbar-title>
    </v-app-bar>
    <v-container fluid>
      <v-row>     
        <v-col cols="5">
          <v-card outlined class="px-4" height="500px">
            <v-card-text>FILTER BAR</v-card-text>
            <v-form v-model="isFormValid">
              <v-autocomplete  v-model="searchFields.orgName" :items="orgs" :search-input.sync="search" label="Organization"></v-autocomplete>
              <div v-if="!state.initForm">
                <v-text-field label="Repository Name" v-model="searchFields.repoName"></v-text-field>
                <v-text-field label="Max Issues's Number" v-model="searchFields.repoIssuesMax" :rules="validationRules.maxRules"></v-text-field>
                <v-text-field label="Min Issues's Number" v-model="searchFields.repoIssuesMin" :rules="validationRules.minRules"></v-text-field>
                <v-btn @click="fetchRepos" :disabled="disabledSubmitButton">FETCH!</v-btn>
              </div>
            </v-form>
          </v-card>
        </v-col>
        <v-col cols="7">
          <v-card outlined height="500px">
            <v-card-text>SEARCH RESULT</v-card-text>
            <v-progress-circular indeterminate color="primary" v-if="state.isLoading" class="ma-auto"></v-progress-circular>
            <div v-show="!emptyResult">
                <v-data-table
                :headers="table.headers"
                :items="table.data"
                :server-items-length="table.pagination.totalCount"
                @pagination="changePage"
                ></v-data-table>
            </div>
            <div v-show="invalidResult">
              <span v-for="error in table.errors" :key="error.code">{{ error }}</span>
            </div>
          </v-card>
        </v-col>
      </v-row>
    </v-container>
  </v-app>
    
</template>

<script>
import gitRestAPI from './data/gitRestAPI';
export default {
  data: () => {
    return {
      searchFields: {
        orgName: null,
        repoName: null,
        repoIssuesMin: 0,
        repoIssuesMax: null,
      },
      orgs: [],
      search: null,
      isFormValid: true,
      table: {
        data: [],
        errors: [],
        pagination: {
          size: 10,
          page: 1,
          totalCount: 0,
        },
        headers: [{ text: 'Repository Name', value: 'name' },
          { text: 'Number of open issues', value: 'open_issues_count' },
          { text: 'Number of stars', value: 'stargazers_count' },
        ],
        isLoading: false,
      }
    }
  },
  mounted: function() {
    this.fetchOrganizations('');
  },
  watch: {
      search(val)  { this.fetchOrganizations(val)},
      'table.pagination': {
        deep: true,
        handler() {
          this.fetchRepos();
        }
      },
      searchFields: { 
        deep: true,
        handler() { this.fetchRepos() } 
      }
  },
  computed: {
    state: function() {
      return {
        initForm: !this.searchFields.orgName,
        isFormValid: this.isFormValid,
        isLoading: this.table.isLoading,
        successResult: this.table.errors.length === 0 
      };
    },
    totalPages: function() { 
      return parseInt(this.table.pagination.totalCount / this.table.pagination.size) + 1; 
    },
    validationRules: function() {
      return {
        maxRules: [
          v => { 
            return !v || !isNaN(v) || 'An integer is required!';
          },
          function(v) {
            return !this.searchFields.repoIssuesMin || v >= parseInt(this.searchFields.repoIssuesMin) || 'Please provide a value bigger than min number of issues'
          }.bind(this)
        ],
        minRules: [
          v => !v || !isNaN(v) || 'An integer is required!',
          function(v) {
            return !this.searchFields.repoIssuesMax || v <= parseInt(this.searchFields.repoIssuesMax) || 'Please provide a value smaller than max number of issues'
          }.bind(this)
        ]}
    },
    // this set of computed properties decide about the state of table result--
    emptyResult: function() {
      return this.state.initForm || !this.state.successResult;
    },
    invalidResult: function() {
      return !this.state.successResult
    },
    notUpdatedResult: function() {
      return !this.state.isFormValid;
    },
    //-------------------------------------------------------------------------
    // this set of computed properties decide about the state of form----------
    disabledSubmitButton: function() {
      return !this.isFormValid;
    }
    //-------------------------------------------------------------------------
  },
  methods: {
     fetchOrganizations(val) {
        gitRestAPI.getOrganizations(val)
        .then(({items}) => {
          this.orgs = items.map(item => item.login) ;
        })
      },
    fetchRepos() {
      this.table.isLoading = true;
      gitRestAPI.getRepositories(
        this.searchFields.orgName, 
        this.searchFields.repoName, 
        this.searchFields.repoIssuesMin, 
        this.searchFields.repoIssuesMax, 
        this.table.pagination.size, 
        this.table.pagination.page
        )
      .then(({items, total_count}) => {
        this.table.pagination.totalCount = total_count;
        this.table.data = items;
        this.table.errors = [];
      }).catch(err => {
        this.table.pagination.totalCount = 0;
        this.table.data = [];
        this.table.errors = [err]; 
      }).finally(() => {
        this.table.isLoading = false;
      })  
    },
    changePage({page, itemsPerPage}) {
      this.table.pagination.page = page;
      this.table.pagination.size = itemsPerPage;
    }
  }
}
</script>

<style>
#app {
  margin-top: 60px;
}
</style>
