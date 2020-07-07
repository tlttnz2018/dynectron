* Import aws with DYNAMODB_ENDPOINT for local
* DONE. Add list of profiles
* DONE Add list of tables from regions
* DONE Choose a database, query 1000 records from table using partitionid > 0, sort key > 0
* DONE Add grid: Using ag-grid-community version
* DONE Allow to click on row to see whole record in JSON.
* DONE Layout and create side bar: Using material ui
* DONE Add JSON editor to edit query on the fly
* DONE Add Execute button to run query in JSON editor
* DONE Move to redux and put listeners into one place
* SKIP JSON validation still has trouble, need to toggle query editor to show error
* DONE Allow to go next page
* DONE Support table search
* DONE Support to use AWS credentials from process.env
* SKIP Allow to assume role in configuration. Can use environment for that.
* DONE Add scan operation
* DONE When query for count, clicking more will query more :D
* DONE Fix continuous query for select count
* DONE Fix click more forever (when lastEvaluatedKey is null of the more operation was considered as the beginning)
* DONE Fix disable more button when have no more record
* DONE Adding filter condition
* DONE Allow to query using index
* FIXED More button need to feed in query in both case to compare. (Skip changing running query if next)
* FIXED Remove next to last condition not work. (Sort multi criteria)
* DONE Fields suggestion functionality
* DONE Remove exists or should remove value when using exists/not_exists.
    * SKIP Also checking filter condition on using exists/not exists operator.
* DONE Checking whether more button is work correctly for both simple and code?
* DONE Status when no data found
* DONE Add/remove simple query conditions still has errors. (Issue with id in rendering)
* DONE Show total rows/scanned rows
* DONE Test all operatos work as expected.
* SKIP Support null/notnull query condition in Simple (not found example anywhere)
* DONE Add check mark on columns popup menu to see column show/hide status
* DONE Add loading status messages for list of tables, table schema and data/loading more.
* DONE Filter columns menu after two more loads doesn't work (found root cause, need fix)
* DONE Allow copy JSON from react-json-viewer to clipboard.
* FIXED Data popup shows wrong data because using get row index which is row visible index, not real row data.
* DONE Allow to select/deselect all columns in grid
* DONE Allow to filter using fulltext search in JSON object value on column filter
* DONE May need more tests on simple/code with more button combinations
* DONE Make key columns first
* How streamline between remote table and local table
* Standardized components and themes in storybook: https://storybook.js.org/docs/guides/guide-react/
    * Trying to understand theme structure of Material UI
    * Check color palette to customize it better. https://material.io/design/color/the-color-system.html#color-theme-creation
* Use ec2.describeRegions to get available regions
* Store favourites query
* How do I test business cases in the most lightweight way?
* Close button for data dialog
* Change theme of react-json-view to not orange
* Open/close sidebar or query data caused re-render profile select box.
* Allow to query in new tab.
  * Dynamic tab
  * Allow to close tabs
* When click on table, error is showing but grid is not disappear
* Support multiple queries on multiple profiles
* Right click on cell and allow to add to simple query <field> = <value>: Filter with ...
* Export selected rows as JSON/CSV
