import {
  CommonParameter,
  createColumnChartOption,
} from './column'

const p = JSON.parse(JSON.stringify(CommonParameter))
export const PercentParameter = p
p.dataLabelRotation.defaultValue = 0

export function createPercentColumnOption(data, parameter, keyNames) {
  const option = createColumnChartOption(data, parameter, keyNames)

  const {
    dataLabel,
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
          <td style="text-align: right"><b>{point.y:.1f}</b> ({point.percentage:.2f}%)</td>
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
