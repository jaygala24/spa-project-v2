# Notes and checklist for deployment

## TODOs
<ul>
    <li>Make sure the websocket connection works, not sure if the path currently set will work or not</li>
    <li>Verify the reasoning given below is correct and actually works ;)</li>
</ul>

## Notes 

### Indexing for MongoDB
 refer to this https://studio3t.com/knowledge-base/articles/mongodb-index-strategy/ for a more detailed analysis with examples of indexing in MongoDB.

 <ul>
 <li>User -> type,sapId

 Then reformat all queries to be in this order
 
 Reason : type will split all entries in tow (student,teacher) and essentially halve the amount of documents needed to scan for the given sapId
 </li>
 <li>
 selectedAnswer -> date,paperId,studentId  

 Then reformat all queries to be in this order  

 Reason : studentId will always be unique, keeping that as first field will create a large index, making time for index scan large. In comparison, there will be fewer entries in index for date (at least in beginning, as more and more papers will be conducted, there will be more date entries in index), then in paperId, then in studentId
 </li>
 </ul>