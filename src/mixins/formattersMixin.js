export default {
  methods: {
    amountFormatter(row, column, cellValue) {
      cellValue += ''
      if (!cellValue.includes('.')) cellValue += '.'
      return cellValue
        .replace(/(\d)(?=(\d{3})+\.)/g, function ($0, $1) {
          return $1 + ','
        })
        .replace(/\.$/, '')
    }
  }
}
