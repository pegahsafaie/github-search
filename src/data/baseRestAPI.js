const restAPI = function(baseURL) {
  this.baseURL = baseURL;
  this.fetch = async (searchUrl) => {
    try {
      return fetch(`${this.baseURL}${searchUrl}`);
    } catch (expection) {
      throw new Error('A network error happened. You might have problem with your connection');
    }
  }
  this.handleHTTPError = (response) => {
    if(!response.ok) {
      switch(response.status.toString()) {
        case "401":
          throw new Error ('You are not authenticated');
        case "403":
          throw new Error ('You don\'t have enough permission for this request');
        case "500":
          throw new Error ('Internal Server Error. Please try later');
         case "400":
          throw new Error ('The request cannot be fulfilled due to bad syntax. Please contact the support');
        default:
          throw new Error ('Something went wrong. Please contact the support');
      }
    }
    return response;
  }
  this.get = async (searchUrl) => {
    return this.fetch(searchUrl)
      .then(this.handleHTTPError)
      .then(response => response.json())
  }
}
export default restAPI;