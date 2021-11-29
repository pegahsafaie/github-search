# github-search
a client-only UI that lets the user browse repositories on GitHub.

## About

### Frameworks and Tools
Javascript, Vue2, Vue CLI, Vuetify

### Composition

- An required input to choose a GitHub organization, with autocompletion.
- An optional text input to filter repository names.
- A pair of optional numeric input to filter repository by the minimum/maximum
  number of open issues. Both fields are optional but the minimum must be
  lower than the maximum.
- A paginated table showing data from the repository:
  - Name
  - Number of open issues
  - Number of stars

### Behavior

- An organization must be chosen before the remaining of the form is displayed.
- Changing the organization should still preserve the repository filters.
- As long as the entire form is valid, tweaking repository filters should result
  in an automatic re-fetch of the repository list.
- Refuse to update if the form has invalid content until it becomes valid.
- Don't use a submit button for the filters (since the update is automatic),
  but _do_ provide a way to retry explicitly if the fetch fails.
- Loading states should be presented.

## Project setup
```
npm install
```

### Compiles and hot-reloads for development
```
npm run serve
```

### Compiles and minifies for production
```
npm run build
```

### Lints and fixes files
```
npm run lint
```

### Customize configuration
See [Configuration Reference](https://cli.vuejs.org/config/).
