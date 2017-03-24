import {
  CommonParameter,
  createColumnChartOption,
  getPrecisionFormat,
} from './column'

const p = JSON.parse(JSON.stringify(CommonParameter))
export const DrillDownParameter = p
p.dataLabelRotation.defaultValue = 0
p.rotateXAxisLabel.defaultValue = -45
p.zoomType.defaultValue = 'none'

export function createDrilldownColumnOption(series, drillDownSeries, parameter) {
  const option = createColumnChartOption([], parameter)
  option.series = series
  option.drilldown = { series: drillDownSeries, }
  delete option.xAxis.categories

  const {
    dataLabel, tooltipPrecision,
  } = parameter

  if (dataLabel) { option.series.map(r => { r.dataLabels.align = 'center' }) }

  option.legend.enabled = false
  option.xAxis.type = 'category'

  option.tooltip = {
    headerFormat:`
        <table class="tip">
          <caption style="margin-bottom: 3px;">Key: {point.key}</caption>
          <tbody>`,
    pointFormat: `
        <tr>
          <td style="text-align: right">
            <b>${getPrecisionFormat(tooltipPrecision, 'point.y')}</b>
          </td>
        </tr>`,
    footerFormat: '</table></tbody>',
    shared: true,
    useHTML: true
  }

  return option
}

export function createDrilldownDataStructure(rows) {
  const drillDownSeries = []
  const data = []

  for (let i = 0; i < rows.length; i++) {
    const row = rows[i]
    const selector = row.selector

    const drillDownData = row.drillDown.map(dr => { return [ dr.group, dr.value,] })
    drillDownSeries.push({ name: selector, id: selector, data: drillDownData, })

    const useDrillDown = (row.drillDown && row.drillDown.length > 0)
    data.push({ name: selector, y: row.value, drilldown: (useDrillDown) ? selector : null, })
  }

  const series = []
  series.push({ name: '', colorByPoint: true, data: data, })

  return { series: series, drillDownSeries: drillDownSeries, }
}