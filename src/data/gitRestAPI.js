import baseRestAPI from './baseRestAPI';

const gitAPI = {
  getOrganizations,
  getRepositories
}

function getOrganizations (name) {
  const githubConnection = new baseRestAPI(process.env.VUE_APP_GITHUB_BASE_URL);
  return githubConnection.get(`/search/users?q=type:org+${name} in:name`)
}

function getRepositories (orgName, repoName, minIssues, maxIssues, pageSize, pageNumber) {
  let query = `per_page=${pageSize}&page=${pageNumber}&q=org:${orgName}`;
  if (repoName) {
    query = query + `+${repoName} in:name`
  }
  /* if (minIssues) {
    query = query + `+*-issues > ${minIssues}`
  }
  if (maxIssues) {
    query = query + `+*-issues:<${maxIssues}`
  }*/

  const githubConnection = new baseRestAPI(process.env.VUE_APP_GITHUB_BASE_URL);
  return githubConnection.get(`/search/repositories?${query}`)
}
// what is the diff if you export it by name?
export default gitAPI;