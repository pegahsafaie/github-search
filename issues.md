1. Filtering based on max/min issues does not work. I could not find the proper query parameter for that.
2. The following bug happens:
  *  Select an organization with more than 10 repositories.
  *  Choose a repo name! just write it somewhere to not forget it.
  *  Go to the second page.
  *  Now enter the selected repo name from page <1> to search for that.
  *  Expected: to move back to page <1> and see the repo name in result table
  *  Actual Result: You stay in page <2> and you dont see the repo name as long as you dont MANUALLY move to page <1>
