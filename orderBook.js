const reconcileOrder = (array, object) => {
  const existingBook = structuredClone(array)
  const incomingOrder = structuredClone(object)

  const fulfilledArray = []
  const unfulfilledArray = []

  if (existingBook.length === 0) return [incomingOrder]
  if (!incomingOrder) return existingBook

  for (let i = 0; i < existingBook.length; i++) {
    let currentOrder = existingBook[i]

    if (orderMatchingType(currentOrder, incomingOrder) && mismatchedMatchingPrice(currentOrder, incomingOrder)) {
      const mismatchedFulfilledOrder = fulfillOrder(currentOrder, incomingOrder)

      if (mismatchedFulfilledOrder.quantity > 0) fulfilledArray.push(mismatchedFulfilledOrder)
    } else {
      unfulfilledArray.push(currentOrder)
    }
  }

  if (incomingOrder.quantity > 0) fulfilledArray.push(incomingOrder)

  const updatedBook = [...unfulfilledArray, ...fulfilledArray]

  return updatedBook
}

const orderMatchingType = (currentOrder, incomingOrder) => {
  return currentOrder.type !== incomingOrder.type
}

const fulfillOrder = (currentOrder, incomingOrder) => {
  const orderQuantity = getOrderQuantity(currentOrder, incomingOrder)

  currentOrder.quantity -= orderQuantity
  incomingOrder.quantity -= orderQuantity

  return currentOrder
}

const getOrderQuantity = (currentOrder, incomingOrder) => {
  return Math.min(currentOrder.quantity, incomingOrder.quantity)
}

const mismatchedMatchingPrice = (currentOrder, incomingOrder) => {
  if (currentOrder.type === 'buy' && currentOrder.price >= incomingOrder.price) {
    return true
  }
  if (incomingOrder.type === 'buy' && incomingOrder.price >= currentOrder.price) {
    return true
  }

  return false
}


module.exports = reconcileOrder
