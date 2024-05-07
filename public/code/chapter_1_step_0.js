let queryNotices = `
query notices {
    notices {
      edges {
        node {
          index
          input {
            index
          }
          payload
        }
      }
    }
  }
`

let queryReports = `
query reports {
    reports {
      edges {
        node {
          index
          input {
            index
          }
          payload
        }
      }
    }
  }
`