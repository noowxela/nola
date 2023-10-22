
import { schemaComposer } from 'graphql-compose';
import { composeWithMongoose } from 'graphql-compose-mongoose';
import { User as UserModel } from './user.js';


const UserTC = composeWithMongoose(UserModel).removeField('password')
const userAccountTC = UserTC.getFieldTC('account')
userAccountTC.getFieldTC('verification').removeField(['token', 'expiresIn'])
userAccountTC.removeField('resetPassword')

schemaComposer.createObjectTC({
  name: 'AccessToken',
  fields: { accessToken: 'String!' }
})

schemaComposer.createEnumTC({
  name: 'Locale',
  values: {
    en: { value: 'en' },
    ge: { value: 'ge' }
  }
})

export { UserTC }
