import {mongoose} from '../../mongoose.js';

const { Schema } = mongoose

const shopCustomerSchema = new Schema(
  {
    shopId: {
      type: Schema.Types.ObjectId,
      ref: 'Shop',
      default: null
    },
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      default: null
    },
    isCheckedOut: {
      type: Boolean,
      default: false
    },
    archive: {
      type: Date,
      default: null
    }
  },
  {
    timestamps: true
  }
)

const ShopCustomer = mongoose.model('ShopCustomer', shopCustomerSchema)
export { ShopCustomer }