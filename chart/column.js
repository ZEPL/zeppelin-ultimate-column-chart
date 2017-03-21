export const CommonParameter = {
  'inverted': { valueType: 'boolean', defaultValue: false, description: 'invert x and y axes', widget: 'checkbox', },
  'floatingLegend': { valueType: 'string', defaultValue: 'default', description: 'floating legend', widget: 'option', optionValues: [ 'default', 'top-right', 'top-left', ], },
  'rotateXAxisLabel': { valueType: 'int', defaultValue: 0, description: 'rotate xAxis labels', },
  'rotateYAxisLabel': { valueType: 'int', defaultValue: 0, description: 'rotate yAxis labels', },
  'dataLabel': { valueType: 'boolean', defaultValue: false, description: 'use data labels in column', widget: 'checkbox', },
  'dataLabelRotation': { valueType: 'int', defaultValue: -90, description: 'rotate data labels', },
  'legendLabelFormat': { valueType: 'string', defaultValue: '', description: 'text format of legend (<a href="https://docs.amcharts.com/3/javascriptcharts/AmGraph#legendValueText">doc</a>)', },
  'xAxisPosition': { valueType: 'string', defaultValue: 'bottom', description: 'xAxis position', widget: 'option', optionValues: [ 'bottom', 'top', ], },
  'yAxisPosition': { valueType: 'string', defaultValue: 'left', description: 'yAxis position', widget: 'option', optionValues: [ 'left', 'right', ], },
  'showLegend': { valueType: 'boolean', defaultValue: true, description: 'show legend', widget: 'checkbox', },
  'legendPosition': { valueType: 'string', defaultValue: 'bottom', description: 'position of legend', widget: 'option', optionValues: [ 'bottom', 'top', ], },
  'legendLayout': { valueType: 'string', defaultValue: 'horizontal', description: 'layout of legend', widget: 'option', optionValues: [ 'horizontal', 'vertical', ], },
  'zoomType': { valueType: 'string', defaultValue: 'y', description: 'type of zoom', widget: 'option', optionValues: [ 'y', 'none' ], },
  'subTitle': { valueType: 'string', defaultValue: '', description: 'sub title of chart', },
  'mainTitle': { valueType: 'string', defaultValue: '', description: 'main title of chart', },
  'xAxisUnit': { valueType: 'string', defaultValue: '', description: 'unit of xAxis', },
  'yAxisUnit': { valueType: 'string', defaultValue: '', description: 'unit of yAxis', },
  'xAxisName': { valueType: 'string', defaultValue: '', description: 'name of xAxis', },
  'yAxisName': { valueType: 'string', defaultValue: '', description: 'name of yAxis', },
}

export function createColumnChartDataStructure(rows) {
  return rows.map(r => {
    return { name: r.selector, data: r.value, }
  })
}

export function createColumnChartOption(data, parameter, keyNames) {
  const {
    xAxisName, yAxisName, xAxisUnit, yAxisUnit,
    xAxisPosition, yAxisPosition, legendPosition, legendLayout, rotateXAxisLabel, rotateYAxisLabel,
    zoomType, showLegend, legendLabelFormat, floatingLegend, dataLabel, dataLabelRotation,
    mainTitle, subTitle,
    inverted,
  } = parameter

  const option = {
    chart: { type: 'column' },
    lang: { thousandsSep: ',' },
    title: { text: ' ', },
    xAxis: {
      categories: keyNames, crosshair: true,
      labels: { rotation: rotateXAxisLabel, },
    },
    yAxis: {
      min: 0,
      labels: { rotation: rotateYAxisLabel, },
    },
    labels: {},
    legend: { enabled: showLegend, labelFormat: '{name}', },
    tooltip: {
      headerFormat: `
        <span style="font-size: 10px;">Key: {point.key}</span>
          <table style="margin-top: 3px;">`,
      pointFormat: '<tr><td style="color:{series.color};padding:0">{series.name}: </td>' +
      '<td style="padding:0"><b>{point.y:.1f}</b></td></tr>',
      footerFormat: '</table>',
      shared: true,
      useHTML: true
    },
    series: data,
  }

  if (mainTitle !== '') { option.title.text = mainTitle  }
  if (subTitle !== '') { option.subtitle = { text: subTitle, } }
  if (xAxisName !== '') { option.xAxis.title = { text: xAxisName, } }
  if (yAxisName !== '') { option.yAxis.title = { text: yAxisName, } }
  if (xAxisUnit !== '') { option.xAxis.labels = { format: `{value} ${xAxisUnit}`, } }
  if (yAxisUnit !== '') { option.yAxis.labels = { format: `{value} ${yAxisUnit}`, } }
  if (zoomType !== 'none' ) { option.chart.zoomType = zoomType }
  if (xAxisPosition === 'top') { option.xAxis.opposite = true }
  if (yAxisPosition === 'right') { option.yAxis.opposite = true }
  if (legendPosition === 'top') { option.legend.verticalAlign = 'top' }
  if (legendLayout === 'vertical') { option.legend.layout = legendLayout }
  if (legendLabelFormat !== '') { option.legend.labelFormat = legendLabelFormat }
  if (floatingLegend !== 'default') {
    option.legend.x = -30
    option.legend.y = 25
    option.legend.verticalAlign = 'top'
    option.legend.floating = true
    option.legend.backgroundColor = 'white'
    option.legend.borderColor = '#CCC'
    option.legend.borderWidth = 1
    option.legend.shadow = false

    if (floatingLegend === 'top-right') {
      option.legend.align = 'right'; option.legend.x = -30; option.legend.y = 25
    } else {
      option.legend.align = 'left'; option.legend.x = +50; option.legend.y = 25
    }
  }

  if (dataLabel) {
    option.series.map(r => {
      r.dataLabels = {
        enabled: true,
        rotation: dataLabelRotation,
        color: '#FFFFFF',
        align: 'center',
        format: '{point.y:.1f}', // one decimal
        y: 10, // 10 pixels down from the top
      }
    })
  }

  if (inverted) { option.chart.type = 'bar' }

  return option
}
