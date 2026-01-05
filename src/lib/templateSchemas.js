export const ricefSchemas = {
  Report: {
    description: 'Classical or ALV reports with selection screens and output layout.',
    fields: [
      { name: 'projectName', label: 'Project Name', placeholder: 'Bluefield Migration 2026' },
      { name: 'reportTitle', label: 'Report Title', placeholder: 'Open Purchase Orders by Vendor' },
      { name: 'sapVersion', label: 'SAP Version', placeholder: 'SAP S/4HANA 2022' },
      { name: 'dataSources', label: 'Data Sources / Tables', placeholder: 'EKKO, EKPO, LFA1' },
      { name: 'selectionCriteria', label: 'Selection Criteria', placeholder: 'Vendor, Company Code, Plant, PO Status' },
      { name: 'outputLayout', label: 'Output Layout', placeholder: 'ALV grid with subtotals by vendor' },
      { name: 'performanceNotes', label: 'Performance / Security', placeholder: 'Use proper indexing; avoid SELECT *; enforce auth checks' },
      { name: 'testingNotes', label: 'Testing Notes', placeholder: 'Unit tests for selection logic; QA dataset references' },
    ],
  },
  Interface: {
    description: 'Inbound or outbound data interfaces with mapping and error handling.',
    fields: [
      { name: 'projectName', label: 'Project Name', placeholder: 'Intercompany Billing' },
      { name: 'interfaceName', label: 'Interface Name', placeholder: 'Vendor invoice inbound' },
      { name: 'direction', label: 'Direction', placeholder: 'Inbound from middleware to SAP' },
      { name: 'sourceSystem', label: 'Source System', placeholder: 'MuleSoft' },
      { name: 'targetSystem', label: 'Target System', placeholder: 'SAP ECC 6.0' },
      { name: 'mappingDetails', label: 'Mapping Details', placeholder: 'Invoice header, items, taxes, partner roles' },
      { name: 'errorHandling', label: 'Error Handling', placeholder: 'Application log with reprocess flag' },
      { name: 'schedule', label: 'Schedule / Volume', placeholder: 'Hourly, ~5k docs/day' },
    ],
  },
  Conversion: {
    description: 'One-time or iterative data migration objects with cleansing rules.',
    fields: [
      { name: 'projectName', label: 'Project Name', placeholder: 'Finance Migration' },
      { name: 'objectName', label: 'Object Name', placeholder: 'Vendor master conversion' },
      { name: 'legacySource', label: 'Legacy Source', placeholder: 'Oracle EBS' },
      { name: 'targetModule', label: 'Target Module', placeholder: 'MM/SD' },
      { name: 'dataCleansingRules', label: 'Data Cleansing Rules', placeholder: 'Normalize tax codes, strip leading zeros' },
      { name: 'loadApproach', label: 'Load Approach', placeholder: 'LSMW direct input with pre-check report' },
      { name: 'validationPlan', label: 'Validation Plan', placeholder: 'Cross-check totals against legacy totals' },
    ],
  },
  Enhancement: {
    description: 'User exits, BADIs, or enhancements with acceptance criteria.',
    fields: [
      { name: 'projectName', label: 'Project Name', placeholder: 'Order Fulfillment 2.0' },
      { name: 'enhancementType', label: 'Enhancement Type', placeholder: 'BADI Implementation' },
      { name: 'enhancementSpot', label: 'Enhancement Spot / Exit', placeholder: 'BADI_SD_PRICING' },
      { name: 'technicalObject', label: 'Technical Object', placeholder: 'Include customer-specific pricing logic' },
      { name: 'userStory', label: 'User Story / RICEF Brief', placeholder: 'As a pricing analyst, I need tiered discounts by channel' },
      { name: 'acceptanceCriteria', label: 'Acceptance Criteria', placeholder: 'Discount applied for channel X; no change for Y' },
      { name: 'transportInfo', label: 'Transport / Packaging', placeholder: 'Single transport, include test variants' },
    ],
  },
  Form: {
    description: 'Smart Forms, SAPscript, or Adobe Forms with layout guidance.',
    fields: [
      { name: 'projectName', label: 'Project Name', placeholder: 'Invoice Modernization' },
      { name: 'formName', label: 'Form Name', placeholder: 'Customer Invoice (Smart Form)' },
      { name: 'technology', label: 'Technology', placeholder: 'Adobe Form / Smart Form' },
      { name: 'layoutDetails', label: 'Layout Details', placeholder: 'Brand header, tax summary, QR payment link' },
      { name: 'triggers', label: 'Triggers', placeholder: 'Print on billing doc save; preview in VF02' },
      { name: 'translations', label: 'Translations', placeholder: 'EN, DE with date/number localization' },
      { name: 'approvals', label: 'Approvals / Sign-offs', placeholder: 'Finance controller sign-off required' },
    ],
  },
};

export const ricefTypes = Object.keys(ricefSchemas);

export function getSchema(type) {
  return ricefSchemas[type] || ricefSchemas.Report;
}
