import {
  CommonParameter,
  createColumnChartOption,
  getPrecisionFormat,
} from './column'

const p = JSON.parse(JSON.stringify(CommonParameter))
export const PercentParameter = p
p.dataLabelRotation.defaultValue = 0
p.tooltipPercentagePrecision = { valueType: 'string', defaultValue: '.2f', description: 'precision of tooltip format without <code>:</code> (<a href="http://www.highcharts.com/docs/chart-concepts/labels-and-string-formatting">doc</a>)', }

export function createPercentColumnOption(data, parameter, keyNames) {
  const option = createColumnChartOption(data, parameter, keyNames)

  const {
    dataLabel, tooltipPrecision, tooltipPercentagePrecision,
  } = parameter

  if (dataLabel) { option.series.map(r => { r.dataLabels.align = 'center' }) }

  option.yAxis.stackedLabels = {
    enabled: dataLabel,
    style: { fontWeight: 'bold', color: 'gray' }
  }

  option.tooltip = {
    headerFormat:`
        <table class="tip">
          <caption style="margin-bottom: 3px;">Key: {point.key}</caption>
          <tbody>`,
    pointFormat: `
        <tr>
          <th style="color: {series.color}">{series.name}: </th>
          <td style="text-align: right">
            <b>${getPrecisionFormat(tooltipPrecision, 'point.y')}</b>
            (${getPrecisionFormat(tooltipPercentagePrecision, 'point.percentage')} %)
          </td>
        </tr>`,
    footerFormat: '</table></tbody>',
    shared: true,
    useHTML: true
  }

  option.plotOptions = {
    column: {
      stacking: 'percent',
      dataLabels: {
        enabled: dataLabel,
        color: 'white'
      }
    }
  }

  return option
}
