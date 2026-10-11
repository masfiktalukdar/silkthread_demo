// const { ShippingMethodSchema } = require("../../models/index.js");
const { ShippingMethodSchema } = require("../../models/index.js");
const pagination = require("../../utils/pagination.js");
const BaseRepository = require("../base/base.repository.js");

class ShippingMethodRepository extends BaseRepository {
  #model;
  constructor(model) {
    super(model);
    this.#model = model;
  }

  async createShippingMethod(payload, session) {
    const options = session ? { session } : {};
    const newShippingMethod = await this.#model.create([payload], options);
    return Array.isArray(newShippingMethod) ? newShippingMethod[0] : newShippingMethod;
  }

  async updateShippingMethodStatus(id, payload) {
    const statusVal =
      typeof payload === "object" && payload !== null && "status" in payload
        ? payload.status
        : payload;
    return await this.#model.findByIdAndUpdate(
      id,
      { status: statusVal },
      { new: true }
    );
  }

  async updateShippingMethod(id, payload) {
    const updatedShippingMethod = await this.#model.findByIdAndUpdate(
      id,
      payload
    );
    if (!updatedShippingMethod) {
      throw new Error("About Us not found");
    }
    return updatedShippingMethod;
  }

  async getShippingMethodWithPagination(payload) {
    try {
      const shippingMethods = await pagination(
        payload,
        async (limit, offset, sortOrder) => {
          const shippingMethods = await this.#model
            .find({})
            .sort({ createdAt: sortOrder })
            .skip(offset)
            .limit(limit);
          // .populate('')
          // .populate('')
          const totalShippingMethod = await this.#model.countDocuments();

          return { doc: shippingMethods, totalDoc: totalShippingMethod };
        }
      );

      return shippingMethods;
    } catch (error) {
      console.error("Error getting shippingMethods with pagination:", error);
      throw error;
    }
  }
}

module.exports = new ShippingMethodRepository(ShippingMethodSchema);
