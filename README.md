Tables - a js framework to easily build tables from json data

Uses basic function chaining to create a simple table that is sortable and filterable.

Example: 
```javascript
T$('exTable')
    .newTable('#table1') //location param - at div id='table1'
    .addHeaders(['Title', 'Requirement Text', 'Name', 'Legacy Id', 'Path', 'Released Date'])  //Headers matching json object keys
    .addData(json)
    .sortBy('alphabetic', 'Name', 'ascending')
    .addFilter();
    
T$('testTable2')
    .newTable('#table2')
    .addHeaders(['Name', 'Legacy Id', 'Released Date'])
    .addData(json)
    .sortBy('date', 'Released Date', 'ascending')
    .addFilter();
 ```
