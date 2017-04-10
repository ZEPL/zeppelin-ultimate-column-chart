import Visualization from 'zeppelin-vis'
import AdvancedTransformation from 'zeppelin-tabledata/advanced-transformation'

import Highcharts from 'highcharts/highcharts'
require('highcharts/modules/data')(Highcharts);
require('highcharts/modules/exporting')(Highcharts);

// http://stackoverflow.com/questions/42076332/uncaught-typeerror-e-dodrilldown-is-not-a-function-highcharts
import Drilldown from 'highcharts/modules/drilldown'
if (!Highcharts.Chart.prototype.addSeriesAsDrilldown) { Drilldown(Highcharts) }

import { CommonParameter, createColumnChartDataStructure, createColumnChartOption, } from './chart/column'
import { StackedParameter, createStackedColumnOption, } from './chart/stacked'
import { PercentParameter, createPercentColumnOption, } from './chart/percent'
import { DrillDownParameter, createDrilldownDataStructure, createDrilldownColumnOption, } from './chart/drill-down'

export default class Chart extends Visualization {
  constructor(targetEl, config) {
    super(targetEl, config)

    const spec = {
      charts: {
        'column': {
          transform: { method: 'array', },
          sharedAxis: true,
          axis: {
            'xAxis': { dimension: 'multiple', axisType: 'key', },
            'yAxis': { dimension: 'multiple', axisType: 'aggregator', minAxisCount: 1, },
            'category': { dimension: 'multiple', axisType: 'group', },
          },
          parameter: CommonParameter,
        },

        'stacked': {
          transform: { method: 'array', },
          sharedAxis: true,
          axis: {
            'xAxis': { dimension: 'multiple', axisType: 'key', },
            'yAxis': { dimension: 'multiple', axisType: 'aggregator', minAxisCount: 1, },
            'category': { dimension: 'multiple', axisType: 'group', },
          },
          parameter: StackedParameter,
        },

        'percent': {
          transform: { method: 'array', },
          sharedAxis: true,
          axis: {
            'xAxis': { dimension: 'multiple', axisType: 'key', },
            'yAxis': { dimension: 'multiple', axisType: 'aggregator', minAxisCount: 1, },
            'category': { dimension: 'multiple', axisType: 'group', },
          },
          parameter: PercentParameter,
        },

        'drill-down': {
          transform: { method: 'drill-down', },
          sharedAxis: true,
          axis: {
            'xAxis': { dimension: 'multiple', axisType: 'key', },
            'yAxis': { dimension: 'multiple', axisType: 'aggregator', minAxisCount: 1, },
            'category': { dimension: 'multiple', axisType: 'group', },
          },
          parameter: DrillDownParameter,
        }
      },
    }

    this.transformation = new AdvancedTransformation(config, spec)
  }

  getChartElementId() {
    return this.targetEl[0].id
  }

  getChartElement() {
    return document.getElementById(this.getChartElementId())
  }

  clearChart() {
    if (this.chartInstance) { this.chartInstance.destroy() }
  }

  hideChart() {
    this.clearChart()
    this.getChartElement().innerHTML = `
        <div style="margin-top: 60px; text-align: center; font-weight: 100">
            <span style="font-size:30px;">
                Please set axes in
            </span>
            <span style="font-size: 30px; font-style:italic;">
                Settings
            </span>
        </div>`
  }

  showError(error) {
    this.clearChart()
    this.getChartElement().innerHTML = `
        <div style="margin-top: 60px; text-align: center; font-weight: 300">
            <span style="font-size:30px; color: #e4573c;">
                ${error.message} 
            </span>
        </div>`
  }

  drawColumnChart(parameter, column, transformer) {
    if (column.aggregator.length === 0) {
      this.hideChart()
      return /** have nothing to display, if aggregator is not specified at all */
    }

    const { rows, keyNames, selectors, } = transformer()

    const data = createColumnChartDataStructure(rows)
    const chartOption = createColumnChartOption(data, parameter, keyNames, selectors)

    this.chartInstance = Highcharts.chart(this.getChartElementId(), chartOption)
  }

  drawStackedChart(parameter, column, transformer) {
    if (column.aggregator.length === 0) {
      this.hideChart()
      return /** have nothing to display, if aggregator is not specified at all */
    }

    const { rows, keyNames, selectors, } = transformer()

    const data = createColumnChartDataStructure(rows)
    const chartOption = createStackedColumnOption(data, parameter, keyNames, selectors)

    this.chartInstance = Highcharts.chart(this.getChartElementId(), chartOption)
  }

  drawPercentChart(parameter, column, transformer) {
    if (column.aggregator.length === 0) {
      this.hideChart()
      return /** have nothing to display, if aggregator is not specified at all */
    }

    const { rows, keyNames, selectors, } = transformer()

    const data = createColumnChartDataStructure(rows)
    const chartOption = createPercentColumnOption(data, parameter, keyNames, selectors)

    this.chartInstance = Highcharts.chart(this.getChartElementId(), chartOption)
  }

  drawDrilldownChat(parameter, column, transformer) {
    if (column.aggregator.length === 0) {
      this.hideChart()
      return /** have nothing to display, if aggregator is not specified at all */
    }

    const { rows, keyNames, selectors, } = transformer()

    const { series, drillDownSeries, } = createDrilldownDataStructure(rows)
    const chartOption = createDrilldownColumnOption(series, drillDownSeries, parameter, keyNames, selectors)

    this.chartInstance = Highcharts.chart(this.getChartElementId(), chartOption)
  }

  render(data) {
    const {
      chartChanged, parameterChanged,
      chart, parameter, column, transformer,
    } = data

    if (!chartChanged && !parameterChanged) { return }

    try {
      if (chart === 'column') {
        this.drawColumnChart(parameter, column, transformer)
      } else if (chart === 'stacked') {
        this.drawStackedChart(parameter, column, transformer)
      } else if (chart === 'percent') {
        this.drawPercentChart(parameter, column, transformer)
      } else if (chart === 'drill-down') {
        this.drawDrilldownChat(parameter, column, transformer)
      }
    } catch (error) {
      console.error(error)
      this.showError(error)
    }
  }

  getTransformation() {
    return this.transformation
  }
}


