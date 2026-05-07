import mongoose from 'mongoose'

const colorPaletteSchema = new mongoose.Schema(
  {
    name: { type: String },
    hex: { type: String },
  },
  { _id: false },
)

const generatedAssetsSchema = new mongoose.Schema(
  {
    originalSelfie: { type: String },
    linkedinBanner: { type: String },
    twitterBanner: { type: String },
    quoteGraphic: { type: String },
    businessCard: { type: String },
    profilePicture: { type: String },
    linkedinBioShort: { type: String },
    linkedinBioMedium: { type: String },
    linkedinBioLong: { type: String },
    twitterBio: { type: String },
    taglines: [{ type: String }],
    elevatorPitch: { type: String },
    colorPalette: [colorPaletteSchema],
  },
  { _id: false },
)

const orderSchema = new mongoose.Schema(
  {
    orderId: {
      type: String,
      unique: true,
      index: true,
      required: true,
    },
    email: { type: String },
    name: { type: String },
    title: { type: String },
    industry: { type: String },
    skills: [{ type: String }],
    oneLiner: { type: String },
    stylePreset: {
      type: String,
      enum: ['founder', 'developer', 'creator', 'corporate', 'minimalist'],
    },
    status: {
      type: String,
      enum: ['pending', 'generating', 'completed', 'failed'],
      default: 'pending',
    },
    paid: { type: Boolean, default: false },
    generatedAssets: {
      type: generatedAssetsSchema,
      default: {},
    },
    errorMessage: { type: String },
  },
  {
    timestamps: true,
  },
)

orderSchema.pre('save', function setUpdatedAt() {
  this.updatedAt = new Date()
})

const Order = mongoose.model('Order', orderSchema)

export default Order
