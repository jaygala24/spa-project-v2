# Notes and checklist for deployment

## Notes

### Indexing for MongoDB

#### Update :

The following index scheme seems to be working, as when trying to retrieve type:student (s is small-case, so will match no document),
no index does a collection scan and scans all documents, while with following index, as value 'student' is not present for any documents's type, it is not in index at all, so does not scan any documents.

This can be seen in work by using mongo shell :

- connect shell to ATLAS instance by connection methods
- run db.user.explain(...).find(...)

explain can take optional parameter "verbosity", which, if set to "executionStats", will give the details of scanning performed and execution time etc.

To create index in ATLAS refer to https://docs.atlas.mongodb.com/data-explorer/indexes/

---

refer to https://studio3t.com/knowledge-base/articles/mongodb-index-strategy/ for a more detailed analysis with examples of indexing in MongoDB.

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
