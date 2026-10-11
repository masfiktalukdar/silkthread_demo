import { TChildCategory } from "@/types";
import ChildCategoryCard from "../ChildCategory/ChildCategoryCard/ChildCategoryCard";

interface Props {
  childCategoriesList: TChildCategory;
}

const TopChildCategory: React.FC<Props> = ({ childCategoriesList }) => {
  if (!childCategoriesList || !Array.isArray(childCategoriesList) || childCategoriesList.length === 0) {
    return null;
  }

  return (
    <div className="Container py-2 sm:py-3">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
        {childCategoriesList?.map((childCategory: TChildCategory) => (
          <ChildCategoryCard
            key={childCategory._id}
            childCategory={childCategory}
          />
        ))}
      </div>
    </div>
  );
};

export default TopChildCategory;
