export const NONE = 'none'
export const WARNING = 'warning'
export const CRITICAL = 'critical'

export const severity = (value, alert) => (
  Number.isInteger(value)
    ? severityAsInteger(value, alert)
    : severityAsString(value, alert)
)

const severityAsInteger = (value, alert) => {
  const alertSeverityCritical = alert.find(item => item.severity === CRITICAL)
  if (alertSeverityCritical && value >= alertSeverityCritical.value) {
    return CRITICAL
  }

  const alertSeverityWarning = alert.find(item => item.severity === WARNING)
  if (alertSeverityWarning && value >= alertSeverityWarning.value) {
    return WARNING
  }

  return NONE
}

const severityAsString = (value, alert) => {
  const alertItem = alert.find(item => item.value === value)
  return alertItem ? alertItem.severity : NONE
}
