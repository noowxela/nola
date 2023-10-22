import { schemaComposer } from 'graphql-compose';

schemaComposer.createObjectTC({
  name: 'Succeed',
  fields: { succeed: 'Boolean!' }
})

schemaComposer.createObjectTC({
  name: 'DashboardSummary',
  fields: {
    todayGuest: 'Int',
    totalGuest: 'Int',
    todayCustomer: 'Int',
    totalCustomer: 'Int'
  }
})
