import { z as e } from "zod";
var a = e.record(e.string(), e.any()).describe(`Record data object. Use nested objects for relationships (e.g., "company": {"id": "{{reference}}"}). Common patterns:
- Person: {"name": {"firstName": "John", "lastName": "Doe"}, "emails": {"primaryEmail": "john@example.com"}, "company": {"id": "{{trigger.object.id}}"}}
- Company: {"name": "Acme Corp", "domainName": {"primaryLinkUrl": "https://acme.com"}}
- Task: {"title": "Follow up", "status": "TODO", "assignee": {"id": "{{user.id}}"}}`);
export {
  a as objectRecordSchema
};

//# sourceMappingURL=object-record-schema.js.map