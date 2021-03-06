'use strict'

const SonarBase = require('./sonar-base')
const {
  negativeMetricColorScale,
  getLabel,
  documentation,
  keywords,
  patternBase,
  queryParamSchema,
} = require('./sonar-helpers')

module.exports = class SonarTechDebt extends SonarBase {
  static get category() {
    return 'analysis'
  }

  static get route() {
    return {
      base: 'sonar',
      pattern: `${patternBase}/:metric(tech_debt|sqale_debt_ratio)`,
      queryParamSchema,
    }
  }

  static get examples() {
    return [
      {
        title: 'Sonar Tech Debt',
        namedParams: {
          protocol: 'http',
          host: 'sonar.petalslink.com',
          component: 'org.ow2.petals:petals-se-ase',
          metric: 'tech_debt',
        },
        queryParams: {
          sonarVersion: '4.2',
        },
        staticPreview: this.render({
          debt: 1,
          metric: 'tech_debt',
        }),
        keywords,
        documentation,
      },
    ]
  }

  static get defaultBadgeData() {
    return { label: 'tech debt' }
  }

  static render({ debt, metric }) {
    return {
      label: getLabel({ metric }),
      message: `${debt}%`,
      color: negativeMetricColorScale(debt),
    }
  }

  async handle({ protocol, host, component, metric }, { sonarVersion }) {
    const json = await this.fetch({
      sonarVersion,
      protocol,
      host,
      component,
      // Special condition for backwards compatibility.
      metricName: 'sqale_debt_ratio',
    })
    const { metricValue: debt } = this.transform({ json, sonarVersion })
    return this.constructor.render({ debt, metric })
  }
}
