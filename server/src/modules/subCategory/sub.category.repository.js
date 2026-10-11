// const { SubCategorySchema } = require("../../models/index.js");
const { SubCategorySchema } = require("../../models/index.js");
const pagination = require("../../utils/pagination.js");
const BaseRepository = require("../base/base.repository.js");

class SubCategoryRepository extends BaseRepository {
  #model;
  constructor(model) {
    super(model);
    this.#model = model;
  }

  async createSubCategory(payload, session) {
    const { viewType } = payload;
    if (viewType) {
      const validViewTypes = ["top", "middle", "lowerMiddle", "buttom", "bottom"];
      if (!validViewTypes.includes(viewType)) {
        throw new Error("Invalid viewType provided");
      }
    }
    const newSubCategory = await this.#model.create([payload], { session });
    return newSubCategory;
  }

  async updateSubCategory(id, payload, session) {
    const { viewType } = payload;
    if (viewType) {
      const validViewTypes = ["top", "middle", "lowerMiddle", "buttom", "bottom"];
      if (!validViewTypes.includes(viewType)) {
        throw new Error("Invalid viewType provided");
      }
    }
    const updatedSubCategory = await this.#model.findByIdAndUpdate(
      id,
      payload,
      { new: true, session }
    );

    if (!updatedSubCategory) {
      throw new Error("SubCategory not found");
    }
    return updatedSubCategory;
  }

  async findByViewType(viewType) {
    const viewTypeQueries =
      viewType === "bottom" || viewType === "buttom"
        ? ["bottom", "buttom"]
        : [viewType];
    return await this.#model
      .find({ viewType: { $in: viewTypeQueries }, status: true })
      .sort({ createdAt: 1 });
  }

  async getSubCategoryWithPagination(payload) {
    try {
      const subCategorys = await pagination(
        payload,
        async (limit, offset, sortOrder) => {
          const subCategorys = await this.#model
            .find({})
            .sort({ createdAt: sortOrder })
            .skip(offset)
            .limit(limit)
            .populate('categoryRef')
          // .populate('')
          const totalSubCategory = await this.#model.countDocuments();

          return { doc: subCategorys, totalDoc: totalSubCategory };
        }
      );

      return subCategorys;
    } catch (error) {
      console.error("Error getting subCategorys with pagination:", error);
      throw error;
    }
  }
}

module.exports = new SubCategoryRepository(SubCategorySchema);
