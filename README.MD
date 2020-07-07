# How to run
To run this software, please make sure that you have node js installed, prefer version > lts 12.x.x. \
Please run the following commands

1. `npm install`

2. `npm run build`

3. `npm run start`

# How to use
If you use any assume role for AWS authentication or using aws-vault, please remember to export environment variables before running `npm run start`. And please choose `environment` option when selecting profile. It will use credentials store in process environment to authenticate and do the job.

Once you see the list of tables on the left, you can click on that table to see the selected table's schema in `SCHEMA` tab.

For querying data, you can click on `QUERY` button to open query editor.

You can either enter the table name in that query or omit it (it will use the selected one as table).

Query editor is a full-fledge editor support by ACE. Please refer to [ACE shortcut keys](https://ace.c9.io/demo/keyboard_shortcuts.html) for more information. Or you can press `F1` for command palette.

Once you're ok with the query, please click on EXECUTE to run the query, the data will be showed in `Data` tab below query.

# How to connect to local dynamodb
Please set `DYNAMODB_ENDPOINT` to your local dynamodb and restart the app, then choose environment to query it against local dynamodb.
