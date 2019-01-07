import {
  CommonParameter,
  createColumnChartOption,
  getPrecisionFormat,
} from './column'

const p = JSON.parse(JSON.stringify(CommonParameter))
export const StackedAndGroupedParameter = p
p.dataLabelRotation.defaultValue = 0

export function createStackedAndGroupedColumnDataStructure(rows) {
  return rows.map(r => {
    return { name: r.selector, data: r.value, stack: r.selector.split(".")[1]}
  })
}

export function createStackedAndGroupedColumnOption(data, parameter, keyNames) {
  const option = createColumnChartOption(data, parameter, keyNames)

  const {
    dataLabel, tooltipPrecision,
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
          <tbody>
            <tr style="margin-bottom: 3px;"><th>TOTAL: </th>
              <td style="text-align:right" ><b>{point.total}</b>
              </td>
            </tr>`,
    pointFormat: `
        <tr>
          <th style="color: {series.color}">{series.name}: </th>
          <td style="text-align: right">${getPrecisionFormat(tooltipPrecision, 'point.y')}</td>
        </tr>`,
    footerFormat: '</table></tbody>',
    shared: true,
    useHTML: true
  }

  option.plotOptions = {
    column: {
      stacking: 'normal',
      dataLabels: {
        enabled: dataLabel,
        color: 'white'
      }
    }
  }

  return option
}

