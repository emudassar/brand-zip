import Order from '../models/Order.js'

export const markOrderPaid = async (req, res) => {
  try {
    const { orderId } = req.params
    const order = await Order.findOne({ orderId })

    if (!order) {
      return res.status(404).json({ message: 'Order not found' })
    }

    order.paid = true
    await order.save()

    return res.status(200).json({
      success: true,
      orderId: order.orderId,
    })
  } catch (error) {
    return res.status(500).json({
      message: 'Failed to update payment status',
      error: error.message,
    })
  }
}
