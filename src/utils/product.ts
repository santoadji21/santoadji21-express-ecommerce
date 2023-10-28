import { Request } from 'express'

export function productFilter(req: Request) {
  const filter: { [key: string]: unknown } = {}
  if (req.query.category) {
    filter.category = req.query.category
  }
  if (req.query.brand) {
    filter.brand = req.query.brand
  }
  if (req.query.size) {
    filter.size = { $in: req.query.size }
  }
  if (req.query.color) {
    filter.colors = { $in: req.query.color }
  }
  if (req.query.price) {
    const priceRange = (req.query.price as string).split('-')
    if (priceRange.length === 2) {
      const minPrice = parseInt(priceRange[0])
      const maxPrice = parseInt(priceRange[1])
      filter.price = { $gte: minPrice, $lte: maxPrice }
    }
  }
  if (req.query.name) {
    filter.name = { $regex: req.query.name as string, $options: 'i' }
  }

  return filter
}
